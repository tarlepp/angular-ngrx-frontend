#!/bin/bash

################################################################################
# Docker multi-platform image helper
#
# Helper commands for maintaining multi-platform Docker base image pins and for
# building images for other platforms. See doc/DOCKER_MULTI_PLATFORM.md.
#
# Usage:
#   ./scripts/docker-images.sh <command>
#
# Commands:
#   digest      Show multi-platform index digest and pin reference for image
#   verify      Verify that Dockerfile base images are multi-platform
#   updates     Check newer semver versions of Dockerfile base images
#   platforms   Show platforms that the current buildx builder supports
#   setup-qemu  Install QEMU emulators for cross-platform builds
#   build       Build image for a single platform and load it locally
#   push        Build multi-platform image and push it to a registry
#
# Inputs are read from environment variables. When a value is missing and the
# script is run in an interactive terminal, the value is asked from the user.
#
#   IMAGE       Image reference, e.g. `node:26.10.0-trixie` (digest)
#   PLATFORM    Single target platform, e.g. `linux/arm64` (build)
#   PLATFORMS   Comma separated architectures for setup-qemu, platforms for push
#   DOCKERFILE  Dockerfile path, e.g. `Dockerfile` (build, push)
#   TARGET      Build stage, defaults to the last stage (build, push)
#   TAG         Image tag to create (build, push)
#   BUILDER     buildx builder name for multi-platform builds (push)
#
# Requirements:
#   - docker with buildx plugin (host machine)
#   - jq (digest, verify and updates commands)
#   - curl (updates command)
#
################################################################################

set -euo pipefail

if [ -n "${NO_COLOR:-}" ]; then
    RED=''
    GREEN=''
    YELLOW=''
    BOLD=''
    NC=''
else
    RED=$'\033[0;31m'
    GREEN=$'\033[0;32m'
    YELLOW=$'\033[1;33m'
    BOLD=$'\033[1m'
    NC=$'\033[0m'
fi

shopt -s globstar nullglob

PINNED_DOCKERFILES=(Dockerfile docker/**/Dockerfile docker/**/Dockerfile.*)
declare -ga VERIFY_DOCKERFILES=()
PLATFORM_PATTERN='^linux/[a-z0-9]+(/v[0-9]+)?$'
RETRY_ATTEMPTS=3

# Temporary state shared with subshells (rate limit hint and status)
STATE_DIR="$(mktemp -d)"
trap 'rm -rf "$STATE_DIR"' EXIT

usage() {
    cat << EOF
Docker multi-platform image helper, see doc/DOCKER_MULTI_PLATFORM.md

Usage:
  $0 <command>

Commands:
  digest      Show multi-platform index digest and pin reference for image
  verify      Verify that Dockerfile base images are multi-platform
  updates     Check newer semver versions of Dockerfile base images
  platforms   Show platforms that the current buildx builder supports
  setup-qemu  Install QEMU emulators for cross-platform builds
  build       Build image for a single platform and load it locally
  push        Build multi-platform image and push it to a registry

Inputs are read from environment variables. When a value is missing and the
script is run in an interactive terminal, the value is asked from the user.

  IMAGE       Image reference, e.g. node:26.10.0-trixie (tag or digest)
  PLATFORM    Single target platform, e.g. linux/arm64 (build)
  PLATFORMS   Comma separated architectures for setup-qemu, platforms for push
  DOCKERFILE  Dockerfile path, e.g. Dockerfile (build, push)
  TARGET      Build stage, defaults to the last stage (build, push)
  TAG         Image tag to create (build, push)
  BUILDER     buildx builder name for multi-platform builds (push)

Make targets:
  make docker-image-digest
  make docker-image-verify-pins
  make docker-image-updates
  make docker-builder-platforms
  make docker-setup-qemu PLATFORMS=arm64,amd64
  make docker-build-platform PLATFORM=linux/arm64
  make docker-build-multi-platform PLATFORMS=linux/amd64,linux/arm64 TAG=registry/image:tag
EOF
}

error() {
    printf '%sERROR:%s %s\n' "$RED" "$NC" "$1" >&2
}

info() {
    printf '%s[%s]%s %s\n' "$GREEN" "$1" "$NC" "$2"
}

warning() {
    printf '%s[%s]%s %s\n' "$YELLOW" "$1" "$NC" "$2"
}

# Read value from environment variable or ask it from the user.
# Usage: ask <variable name> <question> [default value]
ask() {
    local name="$1"
    local question="$2"
    local default="${3:-}"
    local value="${!name:-}"

    if [ -z "$value" ]; then
        if [ ! -t 0 ]; then
            if [ -n "$default" ]; then
                value="$default"
            else
                error "${name} is required (e.g. make <target> ${name}=...)"
                exit 64
            fi
        else
            if [ -n "$default" ]; then
                read -r -p "${question} [${default}]: " value
            else
                read -r -p "${question}: " value
            fi

            value="${value:-$default}"
        fi
    fi

    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"

    if [ -z "$value" ]; then
        error "${name} cannot be empty"
        exit 64
    fi

    printf -v "$name" '%s' "$value"
}

confirm() {
    local answer

    if [ ! -t 0 ]; then
        error "Confirmation required, run this command in an interactive terminal"
        exit 64
    fi

    read -r -p "${YELLOW}$1 [y/N]${NC} " answer

    [ "$answer" = "y" ] || [ "$answer" = "Y" ]
}

validate_platforms() {
    local platform
    local list

    if [ -z "$1" ]; then
        error "At least one platform is required"
        exit 64
    fi

    IFS=',' read -r -a list <<< "$1"

    for platform in "${list[@]}"; do
        if ! [[ "$platform" =~ $PLATFORM_PATTERN ]]; then
            error "Invalid platform '${platform}', expected format like 'linux/arm64'"
            exit 64
        fi
    done
}

require_docker() {
    if ! command -v docker > /dev/null 2>&1; then
        error "docker command not found, run this command on the host machine"
        exit 69
    fi

    if ! docker buildx version > /dev/null 2>&1; then
        error "docker buildx plugin is not available"
        exit 69
    fi

}

require_jq() {
    if ! command -v jq > /dev/null 2>&1; then
        error "jq command not found, install it first"
        exit 69
    fi
}

# Wait before next retry. Shows countdown progress on interactive terminals.
# Usage: retry_wait <attempt> <reason>
retry_wait() {
    local delay=$(($1 * 10)) remaining prefix

    prefix="$(printf '  %sRETRY%s %s/%s %s' "$YELLOW" "$NC" "$1" "$((RETRY_ATTEMPTS - 1))" "$2")"

    if [ -t 2 ]; then
        for ((remaining = delay; remaining > 0; remaining--)); do
            printf '\r\033[K%s, retrying in %ss (Ctrl+C to abort)' "$prefix" "$remaining" >&2
            sleep 1
        done

        printf '\r\033[K%s, retrying now\n' "$prefix" >&2
    else
        printf '%s, retrying in %ss\n' "$prefix" "$delay" >&2
        sleep "$delay"
    fi
}

# Print `username:secret` stored by `docker login` for registry, if any.
# Supports credHelpers, credsStore and inline auths of the Docker config.
# Usage: registry_credentials <registry>
registry_credentials() {
    local config="${DOCKER_CONFIG:-$HOME/.docker}/config.json" server="$1" helper auth

    [ "$server" = "docker.io" ] && server="https://index.docker.io/v1/"
    [ -f "$config" ] || return 0

    helper="$(jq -r --arg s "$server" '.credHelpers[$s] // .credsStore // empty' "$config" 2> /dev/null || true)"

    if [ -n "$helper" ]; then
        command -v "docker-credential-${helper}" > /dev/null 2>&1 || return 0

        printf '%s' "$server" | "docker-credential-${helper}" get 2> /dev/null \
            | jq -r 'select(.Username and .Secret and .Username != "<token>") | .Username + ":" + .Secret' 2> /dev/null \
            || true

        return 0
    fi

    auth="$(jq -r --arg s "$server" '.auths[$s].auth // empty' "$config" 2> /dev/null || true)"

    if [ -n "$auth" ]; then
        base64 -d <<< "$auth" 2> /dev/null || true
    fi
}

# Show `docker login` hint once when registry rate limit is reached.
# Usage: rate_limit_hint <registry>
rate_limit_hint() {
    local login="docker login"

    [ -e "${STATE_DIR}/rate-limit-hint" ] && return 0
    : > "${STATE_DIR}/rate-limit-hint"

    [ "$1" = "docker.io" ] || login="docker login $1"

    if [ -n "$(registry_credentials "$1")" ]; then
        warning "RATE LIMIT" "Pull rate limit of $1 reached for the logged in account" >&2
    else
        warning "RATE LIMIT" "Anonymous pull rate limit of $1 reached" >&2
        warning "RATE LIMIT" "Press Ctrl+C, run '${login}' and run this command again to get a higher limit" >&2
    fi
}

# Remember that retries for registry requests are exhausted, so that later
# requests of the same kind fail fast instead of waiting again.
# Usage: mark_rate_limited <tags-|manifests-><registry>
mark_rate_limited() {
    : > "${STATE_DIR}/rate-limited-$1"
}

is_rate_limited() {
    [ -e "${STATE_DIR}/rate-limited-$1" ]
}

# Fetch raw manifest (index or single manifest) with a single registry request.
# Retries transient registry errors (rate limit, timeouts, server errors).
# Prints manifest on success, or registry error on failure.
raw_manifest() {
    local attempt output reason registry

    parse_image_ref "$1"
    registry="$REF_REGISTRY"

    for ((attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++)); do
        if output="$(docker buildx imagetools inspect --raw "$1" 2>&1)"; then
            printf '%s' "$output"
            return 0
        fi

        if grep -qiE '429|toomanyrequests' <<< "$output"; then
            rate_limit_hint "$registry"
            reason="Registry rate limit reached"
        elif grep -qiE 'timeout|EOF|50[0-9] ' <<< "$output"; then
            reason="Registry request failed"
        else
            break
        fi

        [ "$attempt" -lt "$RETRY_ATTEMPTS" ] || break

        retry_wait "$attempt" "$reason"
    done

    printf '%s\n' "$output"
    return 1
}

github_escape_data() {
    local value="$1"

    value="${value//%/%25}"
    value="${value//$'\r'/%0D}"
    value="${value//$'\n'/%0A}"

    printf '%s' "$value"
}

github_escape_property() {
    local value

    value="$(github_escape_data "$1")"
    value="${value//:/%3A}"
    value="${value//,/%2C}"

    printf '%s' "$value"
}

# Emit GitHub Actions annotation, shown inline in pull request diffs.
# Usage: github_annotation <error|warning> <file> <line or empty> <title> <message>
github_annotation() {
    local properties

    [ "${GITHUB_ACTIONS:-}" = "true" ] || return 0

    properties="file=$(github_escape_property "$2")"
    [ -n "$3" ] && properties+=",line=$3"
    properties+=",title=$(github_escape_property "$4")"

    printf '::%s %s::%s\n' "$1" "$properties" "$(github_escape_data "$5")"
}

# Append markdown to GitHub Actions job summary.
github_summary() {
    [ -n "${GITHUB_STEP_SUMMARY:-}" ] || return 0

    printf '%s\n' "$@" >> "$GITHUB_STEP_SUMMARY"
}

dockerfile_from_lines() {
    awk '
        function queue_heredocs(line, rest, token, strip_tabs) {
            rest = line
            while (match(rest, /<<-?[[:space:]]*["\047]?[[:alnum:]_]+["\047]?/)) {
                token = substr(rest, RSTART, RLENGTH)
                strip_tabs = token ~ /^<<-/
                sub(/^<<-?[[:space:]]*/, "", token)
                gsub(/["\047]/, "", token)
                heredoc[++heredoc_count] = token
                heredoc_strip_tabs[heredoc_count] = strip_tabs
                rest = substr(rest, RSTART + RLENGTH)
            }
        }

        {
            if (heredoc_count > 0) {
                terminator = $0
                if (heredoc_strip_tabs[1]) {
                    sub(/^\t+/, "", terminator)
                }

                if (terminator == heredoc[1]) {
                    for (i = 1; i < heredoc_count; i++) {
                        heredoc[i] = heredoc[i + 1]
                        heredoc_strip_tabs[i] = heredoc_strip_tabs[i + 1]
                    }
                    delete heredoc[heredoc_count]
                    delete heredoc_strip_tabs[heredoc_count]
                    heredoc_count--
                }
                next
            }

            if (tolower($1) == "from") {
                print NR ":" $0
            }

            queue_heredocs($0)
        }
    ' "$1"
}

media_type() {
    jq -r 'if .manifests then (.mediaType // "application/vnd.oci.image.index.v1+json") else (.mediaType // "application/vnd.oci.image.manifest.v1+json") end' <<< "$1"
}

image_platforms() {
    jq -r '[.manifests[]?.platform
        | select(. != null and .os != "unknown")
        | .os + "/" + .architecture + (if .variant then "/" + .variant else "" end)]
        | join(" ")' <<< "$1"
}

is_index() {
    case "$1" in
        *index*|*manifest.list*) return 0 ;;
        *) return 1 ;;
    esac
}

image_repository() {
    local name="${1%@*}"
    local last_component="${name##*/}"

    if [[ "$last_component" == *:* ]]; then
        name="${name%:*}"
    fi

    printf '%s' "$name"
}

command_digest() {
    local raw type digest platforms name repository file line_number line word ref found=0
    local -a words

    ask IMAGE "Image name and tag (e.g. node:26.12.0-trixie)"

    info "OK" "Inspecting ${IMAGE}"

    if ! raw="$(raw_manifest "$IMAGE")"; then
        error "Could not inspect ${IMAGE}: $(tail -n 1 <<< "$raw")"
        exit 1
    fi

    type="$(media_type "$raw")"
    platforms="$(image_platforms "$raw")"
    digest="$(docker buildx imagetools inspect "$IMAGE" --format '{{.Manifest.Digest}}')"
    name="${IMAGE%@*}"

    printf '\n'
    printf 'Media type: %s\n' "$type"
    printf 'Digest:     %s\n' "$digest"
    printf 'Platforms:  %s\n' "${platforms:-single platform image}"
    printf '\n'

    if ! is_index "$type"; then
        warning "WARNING" "This is a single platform manifest, not a multi-platform index."
        warning "WARNING" "Do not use this digest if the image must work on multiple platforms."
        exit 1
    fi

    printf 'Pin reference:\n\n    FROM %s@%s\n\n' "$name" "$digest"

    repository="$(image_repository "$name")"

    for file in "${PINNED_DOCKERFILES[@]}"; do
        [ -f "$file" ] || continue

        while IFS=: read -r line_number line; do
            read -r -a words <<< "$line"

            ref=""
            for word in "${words[@]:1}"; do
                [[ "$word" == --* ]] && continue
                ref="$word"
                break
            done

            if [ "$(image_repository "$ref")" = "$repository" ]; then
                printf '%s:%s:%s\n' "$file" "$line_number" "$line"
                found=1
            fi
        done < <(dockerfile_from_lines "$file")
    done

    if [ "$found" -eq 1 ]; then
        printf '\n'
        info "INFO" "Lines above use the same image, update those to the new pin reference"
    fi
}

# Verify base images of a single Dockerfile and print result per `FROM` line.
# Usage: verify_dockerfile <file>
# Returns: 0 = all OK, 1 = problems found, 2 = OK with warnings
verify_dockerfile() {
    local file="$1"
    local -A stages=()
    local line_number line word ref raw type platforms is_stage status=0 found=0 warnings=0 unpinned
    local -a words

    printf '%s%s%s\n' "$BOLD" "$file" "$NC"

    if [ ! -f "$file" ]; then
        printf '  %sFAIL%s  File not found\n\n' "$RED" "$NC"
        github_annotation error "$file" "" "Dockerfile not found" "${file} is listed for base image verification but does not exist"
        IMAGE_ROWS+=("| \`${file}\` | - | - | :x: File not found |")
        return 1
    fi

    while IFS=: read -r line_number line; do
        read -r -a words <<< "$line"

        # Skip `FROM` flags like `--platform=...` to get the image reference
        ref=""
        for word in "${words[@]:1}"; do
            [[ "$word" == --* ]] && continue
            ref="$word"
            break
        done

        is_stage=0
        [ -n "${stages[${ref,,}]:-}" ] && is_stage=1

        if [ "${#words[@]}" -ge 4 ] && [ "${words[-2],,}" = "as" ]; then
            stages["${words[-1],,}"]=1
        fi

        # Reference to an earlier build stage, not a registry image
        [ "$is_stage" -eq 1 ] && continue

        found=1
        printf '  line %s: %s\n' "$line_number" "$ref"

        unpinned=0
        if ! [[ "$ref" =~ @sha256:[a-f0-9]{64}$ ]]; then
            unpinned=1
        fi

        if [ -z "${MANIFEST_CACHE[$ref]+set}" ]; then
            if ! raw="$(raw_manifest "$ref")"; then
                printf '  %sFAIL%s  Could not inspect image: %s\n' "$RED" "$NC" "$(tail -n 1 <<< "$raw")"
                github_annotation error "$file" "$line_number" "Base image could not be inspected" "${ref}: $(tail -n 1 <<< "$raw")"
                IMAGE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :x: Could not inspect image |")
                status=1
                continue
            fi

            MANIFEST_CACHE[$ref]="$raw"
        fi

        raw="${MANIFEST_CACHE[$ref]}"
        type="$(media_type "$raw")"
        platforms="$(image_platforms "$raw")"

        if is_index "$type"; then
            if [ "$unpinned" -eq 1 ]; then
                printf '  %sWARN%s  Multi-platform: %s (not pinned with digest)\n' "$YELLOW" "$NC" "$platforms"
                github_annotation warning "$file" "$line_number" "Base image not pinned" "${ref} is multi-platform but is not pinned with a digest. Use: make docker-image-digest IMAGE=${ref}"
                IMAGE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :warning: Multi-platform, not pinned |")
                warnings=$((warnings + 1))
            else
                printf '  %sOK%s    Multi-platform: %s\n' "$GREEN" "$NC" "$platforms"
                IMAGE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :white_check_mark: ${platforms} |")
            fi
        else
            printf '  %sFAIL%s  Single platform manifest; use a multi-platform index\n' "$RED" "$NC"
            github_annotation error "$file" "$line_number" "Single platform base image" "${ref} points to a single platform manifest. Use a multi-platform index digest from: make docker-image-digest IMAGE=${ref%@*}"
            IMAGE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :x: Single platform image |")
            status=1
        fi
    done < <(dockerfile_from_lines "$file")

    if [ "$found" -eq 0 ]; then
        printf '  %sFAIL%s  No FROM instruction found\n' "$RED" "$NC"
        github_annotation error "$file" "" "No FROM instruction" "${file} does not contain any FROM instruction"
        status=1
    fi

    printf '\n'

    if [ "$status" -eq 0 ] && [ "$warnings" -gt 0 ]; then
        return 2
    fi

    return "$status"
}

doc_link() {
    local path="doc/DOCKER_MULTI_PLATFORM.md"

    if [ -n "${GITHUB_SERVER_URL:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ] && [ -n "${GITHUB_SHA:-}" ]; then
        printf '[%s](%s/%s/blob/%s/%s)' "$path" "$GITHUB_SERVER_URL" "$GITHUB_REPOSITORY" "$GITHUB_SHA" "$path"
    else
        printf '`%s`' "$path"
    fi
}

# Write verification result to GitHub Actions job summary.
# Uses `plain` results of the caller (command_verify).
# Usage: write_verify_summary <failures> <warnings>
write_verify_summary() {
    local failures="$1"
    local warnings="$2"
    local file

    [ -n "${GITHUB_STEP_SUMMARY:-}" ] || return 0

    github_summary "## Docker base image pins" ""

    if [ "$failures" -gt 0 ]; then
        github_summary ":x: **${failures} check(s) failed.** See $(doc_link) how to fix those." ""
    elif [ "$warnings" -gt 0 ]; then
        github_summary ":warning: All base images are multi-platform, ${warnings} Dockerfile(s) with unpinned tags." ""
    else
        github_summary ":white_check_mark: All base images are multi-platform." ""
    fi

    github_summary "| Multi-platform base images | Result |" "|---|---|"

    for file in "${VERIFY_DOCKERFILES[@]}"; do
        github_summary "| \`${file}\` | ${plain[$file]} |"
    done

    github_summary "" "<details><summary>Base images</summary>" "" "| File | Line | Image | Result |" "|---|---|---|---|"
    github_summary "${IMAGE_ROWS[@]}"
    github_summary "" "</details>"
}

command_verify() {
    local file width=0 failures=0 warnings=0 result
    local -A results=()
    declare -gA MANIFEST_CACHE=()
    declare -ga IMAGE_ROWS=()
    local -A plain=()

    VERIFY_DOCKERFILES=(Dockerfile docker/**/Dockerfile docker/**/Dockerfile.*)

    if [ "${#VERIFY_DOCKERFILES[@]}" -eq 0 ]; then
        error "No Dockerfiles found"
        exit 1
    fi

    info "OK" "Verifying base images of ${#VERIFY_DOCKERFILES[@]} Dockerfiles"
    printf '\n'

    for file in "${VERIFY_DOCKERFILES[@]}"; do
        [ "${#file}" -gt "$width" ] && width="${#file}"

        result=0
        verify_dockerfile "$file" || result=$?

        case "$result" in
            0)
                results[$file]="${GREEN}OK${NC}"
                plain[$file]=":white_check_mark: OK"
                ;;
            2)
                results[$file]="${YELLOW}OK (with warnings)${NC}"
                plain[$file]=":warning: OK (with warnings)"
                warnings=$((warnings + 1))
                ;;
            *)
                results[$file]="${RED}FAIL${NC}"
                plain[$file]=":x: FAIL"
                failures=$((failures + 1))
                ;;
        esac
    done

    printf '%sSummary%s\n' "$BOLD" "$NC"
    printf '  Multi-platform base images:\n'

    for file in "${VERIFY_DOCKERFILES[@]}"; do
        printf '    %-*s  %s\n' "$width" "$file" "${results[$file]}"
    done

    printf '\n'

    write_verify_summary "$failures" "$warnings"

    if [ "$failures" -gt 0 ]; then
        error "${failures} check(s) failed, see doc/DOCKER_MULTI_PLATFORM.md"
        exit 1
    fi

    if [ "$warnings" -gt 0 ]; then
        warning "OK" "All Dockerfiles use multi-platform base images, ${warnings} with unpinned tags"
        return 0
    fi

    info "OK" "All Dockerfiles use multi-platform base images"
}

require_curl() {
    if ! command -v curl > /dev/null 2>&1; then
        error "curl command not found, install it first"
        exit 69
    fi
}

# Split image reference into registry, repository and tag.
# Usage: parse_image_ref <reference>
# Sets: REF_REGISTRY, REF_REPOSITORY, REF_TAG
parse_image_ref() {
    local name first

    name="$(image_repository "$1")"
    REF_TAG="${1%@*}"
    REF_TAG="${REF_TAG#"$name"}"
    REF_TAG="${REF_TAG#:}"

    first="${name%%/*}"

    if [ "$first" != "$name" ] && { [[ "$first" == *.* ]] || [[ "$first" == *:* ]] || [ "$first" = "localhost" ]; }; then
        REF_REGISTRY="$first"
        REF_REPOSITORY="${name#*/}"
    else
        REF_REGISTRY="docker.io"
        REF_REPOSITORY="$name"
        [[ "$REF_REPOSITORY" == */* ]] || REF_REPOSITORY="library/${REF_REPOSITORY}"
    fi
}

registry_host() {
    if [ "$1" = "docker.io" ]; then
        printf 'registry-1.docker.io'
    else
        printf '%s' "$1"
    fi
}

# Request pull token for repository and store it in TOKEN_CACHE. Uses
# credentials from `docker login` when available, otherwise anonymous access.
# Must not be called in a subshell, otherwise the cached token is lost.
# Usage: registry_token <registry> <repository>
registry_token() {
    local key="$1/$2" challenge realm service token="" credentials
    local -a args

    [ -n "${TOKEN_CACHE[$key]+set}" ] && return 0

    challenge="$(curl -s -o /dev/null -D - "https://$(registry_host "$1")/v2/" \
        | tr -d '\r' | grep -i '^www-authenticate:' || true)"

    if [[ "$challenge" == *realm=* ]]; then
        realm="$(sed -n 's/.*realm="\([^"]*\)".*/\1/p' <<< "$challenge")"
        service="$(sed -n 's/.*service="\([^"]*\)".*/\1/p' <<< "$challenge")"

        args=(-fsG "$realm" --data-urlencode "scope=repository:$2:pull")
        [ -n "$service" ] && args+=(--data-urlencode "service=${service}")

        credentials="$(registry_credentials "$1")"

        if [ -n "$credentials" ]; then
            # Pass credentials via stdin config, so those are not visible in process list
            credentials="${credentials//\\/\\\\}"
            credentials="${credentials//\"/\\\"}"

            token="$(printf 'user = "%s"\n' "$credentials" | curl -K - "${args[@]}" \
                | jq -r '.token // .access_token // empty')" || token=""
        fi

        if [ -z "$token" ]; then
            token="$(curl "${args[@]}" | jq -r '.token // .access_token // empty')" || return 1
        fi
    fi

    TOKEN_CACHE[$key]="$token"
}

# Print curl authorization arguments for repository, one per line.
# Usage: registry_auth_args <registry> <repository>
registry_auth_args() {
    local token="${TOKEN_CACHE[$1/$2]:-}"

    [ -n "$token" ] && printf -- '-H\nAuthorization: Bearer %s\n' "$token"

    return 0
}

# Print rate limit details from registry response headers, e.g. ` (100 per 1h)`.
# Usage: rate_limit_details <headers>
rate_limit_details() {
    local limit window

    read -r limit window < <(grep -i -m 1 '^ratelimit-limit:' <<< "$1" \
        | sed -n 's/^[^:]*: *\([0-9]*\);w=\([0-9]*\).*/\1 \2/p') || true

    [ -n "${limit:-}" ] && [ -n "${window:-}" ] || return 0

    if [ $((window % 3600)) -eq 0 ]; then
        printf ' (%s per %sh)' "$limit" "$((window / 3600))"
    else
        printf ' (%s per %ss)' "$limit" "$window"
    fi
}

# Check registry response status for retry. Sets RETRY_REASON and RETRY_STATUS.
# Usage: retryable_status <registry> <http status> <headers>
# Returns: 0 = retryable error, 1 = other error
retryable_status() {
    case "$2" in
        429)
            rate_limit_hint "$1"
            RETRY_REASON="Registry rate limit reached$(rate_limit_details "$3")"
            RETRY_STATUS=3
            ;;
        000|5[0-9][0-9])
            RETRY_REASON="Registry request failed (HTTP $2)"
            RETRY_STATUS=1
            ;;
        *)
            return 1
            ;;
    esac
}

# List all tags of a repository using the registry v2 API. Follows `Link`
# header pagination. Call registry_token first.
# Usage: registry_tags <registry> <repository>
# Returns: 0 = OK, 1 = request failed, 3 = registry rate limit reached
registry_tags() {
    local host url headers body status next attempt
    local -a auth=()

    is_rate_limited "tags-$1" && return 3

    host="$(registry_host "$1")"
    mapfile -t auth < <(registry_auth_args "$1" "$2")

    url="https://${host}/v2/$2/tags/list?n=10000"
    headers="$(mktemp -p "$STATE_DIR")"
    body="$(mktemp -p "$STATE_DIR")"

    while [ -n "$url" ]; do
        for ((attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++)); do
            status="$(curl -s -D "$headers" -o "$body" -w '%{http_code}' "${auth[@]}" "$url")" || status="000"

            [ "$status" = "200" ] && break

            retryable_status "$1" "$status" "$(tr -d '\r' < "$headers")" || return 1

            if [ "$attempt" -eq "$RETRY_ATTEMPTS" ]; then
                [ "$RETRY_STATUS" -eq 3 ] && mark_rate_limited "tags-$1"
                return "$RETRY_STATUS"
            fi

            retry_wait "$attempt" "$RETRY_REASON"
        done

        jq -r '.tags[]?' "$body" || return 1

        next="$(tr -d '\r' < "$headers" | sed -n 's/^[Ll]ink: *<\([^>]*\)>; *rel="next".*/\1/p')"

        if [ -z "$next" ]; then
            url=""
        elif [[ "$next" == http* ]]; then
            url="$next"
        else
            url="https://${host}${next}"
        fi
    done
}

# Resolve manifest media type and digest with a registry HEAD request. HEAD
# requests do not count towards the Docker Hub pull rate limit, unlike the GET
# requests made by `docker buildx imagetools inspect`.
# Usage: manifest_head <reference>
# Sets: HEAD_TYPE, HEAD_DIGEST
# Returns: 0 = OK, 1 = request failed, 3 = registry rate limit reached
manifest_head() {
    local headers status attempt
    local -a auth=()

    HEAD_TYPE=""
    HEAD_DIGEST=""

    parse_image_ref "$1"
    is_rate_limited "manifests-$REF_REGISTRY" && return 3
    registry_token "$REF_REGISTRY" "$REF_REPOSITORY" || return 1
    mapfile -t auth < <(registry_auth_args "$REF_REGISTRY" "$REF_REPOSITORY")

    for ((attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++)); do
        headers="$(curl -s -I "${auth[@]}" \
            -H 'Accept: application/vnd.oci.image.index.v1+json' \
            -H 'Accept: application/vnd.docker.distribution.manifest.list.v2+json' \
            -H 'Accept: application/vnd.oci.image.manifest.v1+json' \
            -H 'Accept: application/vnd.docker.distribution.manifest.v2+json' \
            "https://$(registry_host "$REF_REGISTRY")/v2/${REF_REPOSITORY}/manifests/${REF_TAG}" \
            | tr -d '\r')" || headers=""

        status="$(sed -n '1s/^HTTP\/[0-9.]* \([0-9]*\).*/\1/p' <<< "$headers")"

        if [ "$status" = "200" ]; then
            HEAD_TYPE="$(sed -n 's/^[Cc]ontent-[Tt]ype: *\([^;]*\).*/\1/p' <<< "$headers")"
            HEAD_DIGEST="$(sed -n 's/^[Dd]ocker-[Cc]ontent-[Dd]igest: *//p' <<< "$headers")"
            [ -n "$HEAD_DIGEST" ] && return 0
            return 1
        fi

        retryable_status "$REF_REGISTRY" "${status:-000}" "$headers" || return 1

        if [ "$attempt" -eq "$RETRY_ATTEMPTS" ]; then
            [ "$RETRY_STATUS" -eq 3 ] && mark_rate_limited "manifests-$REF_REGISTRY"
            return "$RETRY_STATUS"
        fi

        retry_wait "$attempt" "$RETRY_REASON"
    done

    return 1
}

# Print available update for image reference.
# Usage: print_update <type> <version> <reference>
# Sets: UPDATE_PIN to pin reference, or to reference with problem description
print_update() {
    local digest result=0 problem=""

    if [ -z "${DIGEST_CACHE[$3]+set}" ]; then
        manifest_head "$3" || result=$?

        if [ "$result" -ne 0 ]; then
            :
        elif ! is_index "$HEAD_TYPE"; then
            result=2
        fi

        DIGEST_CACHE[$3]="${result}:${HEAD_DIGEST}"
    fi

    result="${DIGEST_CACHE[$3]%%:*}"
    digest="${DIGEST_CACHE[$3]#*:}"

    case "$result" in
        0) ;;
        2) problem="single platform image, no index digest" ;;
        3) problem="registry rate limit reached, digest not resolved"; RATE_LIMITED=1 ;;
        *) problem="could not resolve digest" ;;
    esac

    if [ -z "$problem" ]; then
        UPDATE_PIN="${3}@${digest}"
        printf '  %sUPDATE%s %-5s %s\n' "$YELLOW" "$NC" "$1" "$2"
        printf '         FROM %s\n' "$UPDATE_PIN"
    else
        UPDATE_PIN="${3} (${problem})"
        printf '  %sUPDATE%s %-5s %s %s(%s)%s\n' "$YELLOW" "$NC" "$1" "$2" "$RED" "$problem" "$NC"
    fi
}

# Check semver updates of external base images in a single Dockerfile.
# Usage: check_dockerfile_updates <file>
check_dockerfile_updates() {
    local file="$1"
    local -A stages=()
    local line_number line word ref is_stage name prefix version suffix major minor key tags tags_status problem
    local latest_patch latest_minor latest_major candidate type
    local -a pins
    local semver='^(v?)([0-9]+)\.([0-9]+)\.([0-9]+)(-[A-Za-z0-9._-]+)?$'
    local -a words versions

    printf '%s%s%s\n' "$BOLD" "$file" "$NC"

    while IFS=: read -r line_number line; do
        read -r -a words <<< "$line"

        ref=""
        for word in "${words[@]:1}"; do
            [[ "$word" == --* ]] && continue
            ref="$word"
            break
        done

        is_stage=0
        [ -n "${stages[${ref,,}]:-}" ] && is_stage=1

        if [ "${#words[@]}" -ge 4 ] && [ "${words[-2],,}" = "as" ]; then
            stages["${words[-1],,}"]=1
        fi

        [ "$is_stage" -eq 1 ] && continue

        printf '  line %s: %s\n' "$line_number" "$ref"

        parse_image_ref "$ref"
        name="$(image_repository "$ref")"

        if ! [[ "$REF_TAG" =~ $semver ]]; then
            printf '  %sSKIP%s   Tag "%s" is not a semver version (X.Y.Z[-suffix])\n' "$YELLOW" "$NC" "${REF_TAG:-<none>}"
            continue
        fi

        prefix="${BASH_REMATCH[1]}"
        major="${BASH_REMATCH[2]}"
        minor="${BASH_REMATCH[3]}"
        version="${major}.${minor}.${BASH_REMATCH[4]}"
        suffix="${BASH_REMATCH[5]}"

        key="${REF_REGISTRY}/${REF_REPOSITORY}"

        if [ -z "${TAGS_CACHE[$key]+set}" ]; then
            tags_status=0

            if registry_token "$REF_REGISTRY" "$REF_REPOSITORY"; then
                tags="$(registry_tags "$REF_REGISTRY" "$REF_REPOSITORY")" || tags_status=$?
            else
                tags_status=1
            fi

            if [ "$tags_status" -ne 0 ]; then
                if [ "$tags_status" -eq 3 ]; then
                    problem="Could not list tags of ${key}, registry rate limit reached"
                    RATE_LIMITED=1
                else
                    problem="Could not list tags of ${key}"
                fi

                printf '  %sFAIL%s   %s\n' "$RED" "$NC" "$problem"
                github_annotation error "$file" "$line_number" "Base image update check failed" "${ref}: ${problem}"
                UPDATE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :x: ${problem} |")
                FAILED=$((FAILED + 1))
                continue
            fi

            TAGS_CACHE[$key]="$tags"
        fi

        # Versions with the same prefix and suffix, e.g. `X.Y.Z-trixie`
        mapfile -t versions < <(
            while IFS= read -r candidate; do
                if [[ "$candidate" =~ $semver ]] \
                    && [ "${BASH_REMATCH[1]}" = "$prefix" ] \
                    && [ "${BASH_REMATCH[5]}" = "$suffix" ]; then
                    printf '%s.%s.%s\n' "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}" "${BASH_REMATCH[4]}"
                fi
            done <<< "${TAGS_CACHE[$key]}" | sort -uV
        )

        latest_patch=""
        latest_minor=""
        latest_major=""

        for candidate in "${versions[@]}"; do
            [ "$candidate" = "$version" ] && continue
            [ "$(printf '%s\n%s\n' "$version" "$candidate" | sort -V | tail -n 1)" = "$candidate" ] || continue

            latest_major="$candidate"
            [ "${candidate%%.*}" = "$major" ] && latest_minor="$candidate"
            [[ "$candidate" == "${major}.${minor}."* ]] && latest_patch="$candidate"
        done

        [ "$latest_minor" = "$latest_patch" ] && latest_minor=""
        [ "$latest_major" = "$latest_patch" ] || [ "$latest_major" = "$latest_minor" ] && latest_major=""

        if [ -z "${latest_patch}${latest_minor}${latest_major}" ]; then
            printf '  %sOK%s     Up to date (%s)\n' "$GREEN" "$NC" "$version"
            UPDATE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :white_check_mark: Up to date |")
            continue
        fi

        UPDATES=$((UPDATES + 1))
        pins=()

        for type in patch minor major; do
            case "$type" in
                patch) candidate="$latest_patch" ;;
                minor) candidate="$latest_minor" ;;
                major) candidate="$latest_major" ;;
            esac

            [ -n "$candidate" ] || continue

            print_update "$type" "$candidate" "${name}:${prefix}${candidate}${suffix}"
            pins+=("${type} ${candidate}: FROM ${UPDATE_PIN}")
            UPDATE_ROWS+=("| \`${file}\` | ${line_number} | \`${ref}\` | :x: ${type} ${candidate}: \`FROM ${UPDATE_PIN}\` |")
        done

        github_annotation error "$file" "$line_number" "Base image update available" \
            "${ref} has newer versions:"$'\n'"$(printf '%s\n' "${pins[@]}")"
    done < <(dockerfile_from_lines "$file")

    printf '\n'
}

# Write update check result to GitHub Actions job summary.
# Usage: write_updates_summary
write_updates_summary() {
    [ -n "${GITHUB_STEP_SUMMARY:-}" ] || return 0

    github_summary "## Docker base image updates" ""

    if [ "$FAILED" -gt 0 ]; then
        github_summary ":x: **Could not check ${FAILED} base image(s).**" ""
    fi

    if [ "$UPDATES" -gt 0 ]; then
        github_summary ":x: **${UPDATES} base image(s) have newer versions.** Update \`FROM\` lines with the pin references below, see $(doc_link)." ""
    elif [ "$FAILED" -eq 0 ]; then
        github_summary ":white_check_mark: All base images are up to date." ""
    fi

    [ "${#UPDATE_ROWS[@]}" -gt 0 ] || return 0

    github_summary "| File | Line | Image | Result |" "|---|---|---|---|"
    github_summary "${UPDATE_ROWS[@]}"
}

command_updates() {
    local file
    local -a files
    declare -ga UPDATE_ROWS=()
    declare -g UPDATE_PIN=""
    declare -gA TAGS_CACHE=()
    declare -gA DIGEST_CACHE=()
    declare -gA TOKEN_CACHE=()
    declare -g UPDATES=0
    declare -g FAILED=0
    declare -g RATE_LIMITED=0

    files=(Dockerfile docker/**/Dockerfile docker/**/Dockerfile.*)

    if [ "${#files[@]}" -eq 0 ]; then
        error "No Dockerfiles found"
        exit 1
    fi

    info "OK" "Checking base image updates of ${#files[@]} Dockerfiles"
    printf '\n'

    for file in "${files[@]}"; do
        check_dockerfile_updates "$file"
    done

    if [ "$RATE_LIMITED" -eq 1 ]; then
        warning "WARNING" "Registry pull rate limit reached, some digests are not resolved, see the RATE LIMIT hint above"
    fi

    write_updates_summary

    if [ "$FAILED" -gt 0 ]; then
        error "Could not check ${FAILED} base image(s)"
    fi

    if [ "$UPDATES" -gt 0 ]; then
        error "${UPDATES} base image(s) have newer versions, update FROM lines with the pin references above"
    fi

    if [ "$FAILED" -gt 0 ] || [ "$UPDATES" -gt 0 ]; then
        exit 1
    fi

    info "OK" "All base images are up to date"
}

command_platforms() {
    docker buildx inspect --bootstrap | awk '/^(Name|Driver|Platforms):/ && !seen[$1]++'
}

command_setup_qemu() {
    ask PLATFORMS "Emulators to install (comma separated, e.g. arm64,amd64 or all)" "arm64,amd64"

    if ! [[ "$PLATFORMS" =~ ^[a-z0-9,]+$ ]]; then
        error "Invalid emulator list '${PLATFORMS}'"
        exit 64
    fi

    warning "CAUTION" "This runs a privileged container (tonistiigi/binfmt) that registers QEMU emulators on the host."

    if ! confirm "Install QEMU emulators '${PLATFORMS}'?"; then
        info "SKIP" "Nothing installed"
        return 0
    fi

    docker run --privileged --rm tonistiigi/binfmt --install "$PLATFORMS"
}

build_args() {
    if [ -n "${TARGET:-}" ]; then
        printf -- '--target\n%s\n' "$TARGET"
    fi

    if grep -qE '^ARG HOST_UID' "$1"; then
        printf -- '--build-arg\nHOST_UID=%s\n--build-arg\nHOST_GID=%s\n' "$(id -u)" "$(id -g)"
    fi
}

ask_dockerfile() {
    ask DOCKERFILE "Dockerfile" "Dockerfile"

    if [ ! -f "$DOCKERFILE" ]; then
        error "Dockerfile '${DOCKERFILE}' not found"
        exit 66
    fi

    local from_lines line_number line final_stage=""
    local -a words stage_names=()

    from_lines="$(dockerfile_from_lines "$DOCKERFILE")"
    while IFS=: read -r line_number line; do
        read -r -a words <<< "$line"

        if [ "${#words[@]}" -ge 4 ] && [ "${words[-2],,}" = "as" ]; then
            stage_names+=("${words[-1]}")
            final_stage="${words[-1]}"
        else
            final_stage=""
        fi
    done <<< "$from_lines"

    if [ -n "$final_stage" ]; then
        ask TARGET "Build target ($(printf '%s\n' "${stage_names[@]}" | paste -sd, -))" "$final_stage"
    fi

    if [ -n "${TARGET:-}" ] && ! printf '%s\n' "${stage_names[@]}" | grep -Fxq -- "$TARGET"; then
        error "Build target '${TARGET}' not found in '${DOCKERFILE}'"
        exit 64
    fi
}

command_build() {
    local args=()

    ask PLATFORM "Target platform (e.g. linux/amd64, linux/arm64)" "linux/arm64"

    if [[ "$PLATFORM" == *,* ]]; then
        error "Only one platform is supported, use 'make docker-build-multi-platform' for multiple"
        exit 64
    fi

    validate_platforms "$PLATFORM"
    ask_dockerfile
    ask TAG "Image tag" "angular-ngrx-frontend:$(printf '%s' "$PLATFORM" | cut -d/ -f2- | tr '/' '-')"

    mapfile -t args < <(build_args "$DOCKERFILE")

    info "OK" "Building ${TAG} from ${DOCKERFILE}${TARGET:+ (target ${TARGET})} for ${PLATFORM}"

    docker buildx build \
        --platform "$PLATFORM" \
        --file "$DOCKERFILE" \
        --tag "$TAG" \
        "${args[@]}" \
        --load \
        "$(dirname "$DOCKERFILE")"
}

command_push() {
    local args=()

    ask PLATFORMS "Target platforms (comma separated)" "linux/amd64,linux/arm64"
    validate_platforms "$PLATFORMS"
    ask_dockerfile
    ask TAG "Image tag including registry (e.g. registry.example.com/angular-ngrx-frontend:latest)"
    ask BUILDER "buildx builder name" "multi-platform"

    if ! confirm "Build ${DOCKERFILE} for ${PLATFORMS} and push it as ${TAG}?"; then
        info "SKIP" "Nothing built"
        return 0
    fi

    if ! docker buildx inspect "$BUILDER" > /dev/null 2>&1; then
        info "OK" "Creating buildx builder '${BUILDER}' (docker-container driver)"
        docker buildx create --name "$BUILDER" --driver docker-container > /dev/null
    fi

    mapfile -t args < <(build_args "$DOCKERFILE")

    docker buildx build \
        --builder "$BUILDER" \
        --platform "$PLATFORMS" \
        --file "$DOCKERFILE" \
        --tag "$TAG" \
        "${args[@]}" \
        --push \
        "$(dirname "$DOCKERFILE")"
}

case "${1:-}" in
    digest ) require_docker; require_jq; command_digest ;;
    verify ) require_docker; require_jq; command_verify ;;
    updates ) require_docker; require_jq; require_curl; command_updates ;;
    platforms ) require_docker; command_platforms ;;
    setup-qemu ) require_docker; command_setup_qemu ;;
    build ) require_docker; command_build ;;
    push ) require_docker; command_push ;;
    ""|-h|--help|help ) usage ;;
    * )
        error "Unknown command '${1}'"
        printf '\n' >&2
        usage >&2
        exit 64
        ;;
esac
