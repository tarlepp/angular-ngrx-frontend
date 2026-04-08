#!/bin/bash

################################################################################
# GitHub Actions Update Checker
#
# This script checks all pinned GitHub Actions in this repository for available
# updates and displays the new SHA for each outdated action.
#
# Usage:
#   ./scripts/check-action-updates.sh
#   ./scripts/check-action-updates.sh --current-pins-md
#
# Requirements:
#   - git (for git ls-remote)
#
# Security Note:
#   This script helps identify updates but does NOT automatically apply them.
#   Always review changelog and test updates before merging.
#
################################################################################

# Don't exit on error - handle errors gracefully
set +e

# Command overrides
GIT_BIN="${GIT_BIN:-git}"
TIMEOUT_BIN="${TIMEOUT_BIN:-timeout}"
WORKFLOW_DIR="${WORKFLOW_DIR:-.github/workflows}"

MODE="check"
case "${1:-}" in
    "" ) ;;
    --current-pins-md ) MODE="current-pins-md" ;;
    * )
        printf 'Usage: %s [--current-pins-md]\n' "$0" >&2
        exit 64
        ;;
esac

# Colors for output
if [ -n "${NO_COLOR:-}" ]; then
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
else
    RED=$'\033[0;31m'
    GREEN=$'\033[0;32m'
    YELLOW=$'\033[1;33m'
    BLUE=$'\033[0;34m'
    NC=$'\033[0m' # No Color
fi

# Tracked GitHub Actions are discovered dynamically from workflow files.
declare -A ACTIONS=()
declare -A ACTION_SOURCES=()
declare -A ACTION_REFS=()

# Track statistics
TOTAL=0
CURRENT=0
OUTDATED=0
DISCOVERY_WARNINGS=0

print_separator() {
    printf '%s=================================================================================%s\n' "$BLUE" "$NC"
}

print_centered_banner() {
    local text="$1"
    local width=81
    local pad=$(( (width - ${#text}) / 2 ))

    print_separator
    printf '%s%*s%s%s\n' "$BLUE" "$pad" '' "$text" "$NC"
    print_separator
    printf '\n'
}

discover_actions() {
    local workflow line uses_ref version repo existing_version ref comment_version existing_ref
    local line_number discovered_version

    if [ ! -d "$WORKFLOW_DIR" ]; then
        printf '%s⚠️  Workflow directory not found: %s%s\n' "$YELLOW" "$WORKFLOW_DIR" "$NC" >&2
        return
    fi

    for workflow in "$WORKFLOW_DIR"/*.yml; do
        [ -f "$workflow" ] || continue

        line_number=0
        while IFS= read -r line; do
            line_number=$((line_number + 1))

            case "$line" in
                *uses:*) ;;
                *) continue ;;
            esac

            uses_ref=$(printf '%s\n' "$line" | sed -n 's/.*uses:[[:space:]]*\([^[:space:]#][^[:space:]#]*\).*/\1/p')
            comment_version=$(printf '%s\n' "$line" | sed -n 's/.*#[[:space:]]*\([^[:space:]]\+\).*/\1/p')

            [ -n "$uses_ref" ] || continue

            case "$uses_ref" in
                ./*|../*|*/.github/workflows/* )
                    continue
                    ;;
            esac

            repo="${uses_ref%@*}"
            repo=$(printf '%s\n' "$repo" | cut -d/ -f1-2)
            ref="${uses_ref#*@}"

            case "$repo" in
                */*) ;;
                *) continue ;;
            esac

            discovered_version=''
            if [ -n "$comment_version" ]; then
                discovered_version="$comment_version"
            elif printf '%s\n' "$ref" | grep -Eq '^v?[0-9]+(\.|$)'; then
                discovered_version="$ref"
            fi

            if ! printf '%s\n' "$ref" | grep -Eq '^[0-9a-f]{40}$'; then
                printf '%s⚠️  Unpinned action reference at %s:%s -> %s%s\n' "$YELLOW" "$workflow" "$line_number" "$uses_ref" "$NC" >&2
                DISCOVERY_WARNINGS=$((DISCOVERY_WARNINGS + 1))
            fi

            if [ -z "$discovered_version" ]; then
                printf '%s⚠️  Cannot determine version for %s at %s:%s (add '\''# vX.Y.Z'\'' comment)%s\n' "$YELLOW" "$repo" "$workflow" "$line_number" "$NC" >&2
                DISCOVERY_WARNINGS=$((DISCOVERY_WARNINGS + 1))
                continue
            fi

            version="$discovered_version"

            existing_version="${ACTIONS[$repo]}"

            if [ -n "$existing_version" ] && [ "$existing_version" != "$version" ]; then
                printf '%s⚠️  Conflicting pinned versions detected for %s: %s (%s) vs %s (%s:%s)%s\n' "$YELLOW" "$repo" "$existing_version" "${ACTION_SOURCES[$repo]}" "$version" "$workflow" "$line_number" "$NC" >&2
                DISCOVERY_WARNINGS=$((DISCOVERY_WARNINGS + 1))
                continue
            fi

            existing_ref="${ACTION_REFS[$repo]}"
            if [ -n "$existing_ref" ] && [ "$existing_ref" != "$ref" ]; then
                printf '%s⚠️  Conflicting pinned refs detected for %s: %s (%s) vs %s (%s:%s)%s\n' "$YELLOW" "$repo" "$existing_ref" "${ACTION_SOURCES[$repo]}" "$ref" "$workflow" "$line_number" "$NC" >&2
                DISCOVERY_WARNINGS=$((DISCOVERY_WARNINGS + 1))
                continue
            fi

            ACTIONS["$repo"]="$version"
            ACTION_SOURCES["$repo"]="$workflow:$line_number"
            ACTION_REFS["$repo"]="$ref"
        done < "$workflow"
    done
}

print_current_pins_markdown() {
    local action version ref ref_display source

    printf '| Action | Version | Ref | Source |\n'
    printf '|--------|---------|-----|--------|\n'

    while IFS= read -r action; do
        [ -n "$action" ] || continue
        version="${ACTIONS[$action]}"
        ref="${ACTION_REFS[$action]}"
        source="${ACTION_SOURCES[$action]}"

        if printf '%s\n' "$ref" | grep -Eq '^[0-9a-f]{40}$'; then
            ref_display="\`${ref:0:8}\`"
        else
            ref_display="\`$ref\`"
        fi

        printf '| %s | %s | %s | `%s` |\n' "$action" "$version" "$ref_display" "$source"
    done < <(printf '%s\n' "${!ACTIONS[@]}" | sort)
}

get_latest_compatible_release() {
    local action="$1"
    local current_version="$2"
    local tags major latest

    tags=$($TIMEOUT_BIN 10 $GIT_BIN ls-remote --tags --refs "https://github.com/$action.git" 2>/dev/null | awk '{print $2}' | sed 's#refs/tags/##')

    if [ -z "$tags" ]; then
        printf '\n'
        return
    fi

    major=$(printf '%s\n' "$current_version" | sed -E 's/^v?([0-9]+).*/\1/')

    latest=$(printf '%s\n' "$tags" | grep -E "^v?${major}(\.|$)" | sort -V | tail -n 1)

    if [ -z "$latest" ]; then
        latest=$(printf '%s\n' "$tags" | sort -V | tail -n 1)
    fi

    printf '%s\n' "$latest"
}

if [ "$MODE" = "check" ]; then
    print_centered_banner "GitHub Actions Update Checker"
fi

discover_actions

if [ "$DISCOVERY_WARNINGS" -gt 0 ] && [ "$MODE" = "check" ]; then
    printf '%s⚠️  Discovery warnings found: %s%s\n' "$YELLOW" "$DISCOVERY_WARNINGS" "$NC"
    printf '\n'
    printf '%sContinuing with version checks so all findings are shown in this run.%s\n' "$YELLOW" "$NC"
    printf '\n'
fi

if [ ${#ACTIONS[@]} -eq 0 ]; then
    printf '%s⚠️  No pinned GitHub Actions discovered from %s%s\n' "$YELLOW" "$WORKFLOW_DIR" "$NC"
    if [ "$DISCOVERY_WARNINGS" -gt 0 ]; then
        exit 2
    fi
    exit 0
fi

if [ "$MODE" = "current-pins-md" ]; then
    print_current_pins_markdown
    if [ "$DISCOVERY_WARNINGS" -gt 0 ]; then
        exit 2
    fi
    exit 0
fi

printf 'Checking %s GitHub Actions for updates...\n' "${#ACTIONS[@]}"
printf '\n'

# Check each action
for action in "${!ACTIONS[@]}"; do
    current_version="${ACTIONS[$action]}"
    ((TOTAL++))

    # Get latest compatible release version within the same major line.
    # This avoids false positives from alternate release streams like
    # github/codeql-action's codeql-bundle tags.
    latest=$(get_latest_compatible_release "$action" "$current_version")

    if [ -z "$latest" ] || [ "$latest" = "null" ]; then
        printf '%s⚠️  %s%s\n' "$YELLOW" "$action" "$NC"
        printf '   Current: %s\n' "$current_version"
        printf '   Latest:  (unable to fetch)\n'
        printf '\n'
        continue
    fi

    # Normalize versions for comparison (strip leading 'v' if present)
    latest_normalized="${latest#v}"
    current_normalized="${current_version#v}"

    # Get full SHA for the version with timeout
    sha=$($TIMEOUT_BIN 10 $GIT_BIN ls-remote --tags "https://github.com/$action.git" "refs/tags/$latest" 2>/dev/null | awk '{print $1}')

    if [ -z "$sha" ]; then
        printf '%s⚠️  %s%s\n' "$YELLOW" "$action" "$NC"
        printf '   Current: %s\n' "$current_version"
        printf '   Latest:  %s\n' "$latest"
        printf '   SHA:     (unable to fetch)\n'
        printf '\n'
        continue
    fi

    # Compare versions (using normalized versions)
    if [ "$latest_normalized" = "$current_normalized" ]; then
        printf '%s✓ %s%s\n' "$GREEN" "$action" "$NC"
        printf '   Version: %s (up-to-date)\n' "$current_version"
        ((CURRENT++))
    else
        printf '%s⚠️  UPDATE AVAILABLE: %s%s\n' "$RED" "$action" "$NC"
        printf '   Current: %s\n' "$current_version"
        printf '   Latest:  %s\n' "$latest"
        printf '   SHA:     %s\n' "$sha"
        printf '   Short:   %s\n' "${sha:0:8}"
        ((OUTDATED++))
    fi
    printf '\n'
done

# Summary
print_centered_banner "Summary"
printf 'Total actions checked:   %s\n' "$TOTAL"
printf 'Discovery warnings:      %s%s%s\n' "$YELLOW" "$DISCOVERY_WARNINGS" "$NC"
printf 'Up-to-date:              %s%s%s\n' "$GREEN" "$CURRENT" "$NC"
printf 'Updates available:       %s%s%s\n' "$RED" "$OUTDATED" "$NC"
printf '\n'

if [ $OUTDATED -gt 0 ]; then
    printf '%sTo update actions:%s\n' "$YELLOW" "$NC"
    printf '1. Review the new versions and their changelogs\n'
    printf '2. Follow the update process in doc/ACTIONS_UPDATE.md\n'
    printf '3. Test changes in a feature branch\n'
    printf '4. Create a PR and verify CI passes\n'
    printf '\n'
fi

if [ "$DISCOVERY_WARNINGS" -gt 0 ]; then
    printf '%sDiscovery checks failed. Fix workflow pinning/version consistency first.%s\n' "$RED" "$NC"
    printf '\n'
    exit 2
fi

if [ $OUTDATED -gt 0 ]; then
    exit 1
fi

printf '%sAll actions are up-to-date!%s\n' "$GREEN" "$NC"
printf '\n'
exit 0
