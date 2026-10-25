#!/usr/bin/env bash

# Shared helper functions for Yarn version scripts.

YARN_BOLD=$'\033[1m'
YARN_BLUE=$'\033[1;34m'
YARN_GREEN=$'\033[1;32m'
YARN_YELLOW=$'\033[1;33m'
YARN_RED=$'\033[1;31m'
YARN_RESET=$'\033[0m'

if [ -n "${NO_COLOR:-}" ]; then
  YARN_BOLD='' YARN_BLUE='' YARN_GREEN='' YARN_YELLOW='' YARN_RED='' YARN_RESET=''
fi

yarn_heading() {
  printf '\n%s=== %s ===%s\n\n' "$YARN_BLUE" "$1" "$YARN_RESET"
}

yarn_message() {
  local color="$1" label="$2" message="$3"
  printf '%s[%s]%s %s\n' "$color" "$label" "$YARN_RESET" "$message"
}

yarn_versions() {
  printf '  %-23s %s%s%s\n' \
    'Configured version:' "$YARN_BOLD" "$1" "$YARN_RESET" \
    'Active version:' "$YARN_BOLD" "$2" "$YARN_RESET" \
    'Latest stable version:' "$YARN_BOLD" "$3" "$YARN_RESET"
  printf '\n'
}

yarn_vcs_reminder() {
  local version="$1"
  yarn_heading 'Required VCS step'
  yarn_message "$YARN_YELLOW" 'ACTION REQUIRED' 'Add the new Yarn binary to version control along with both version pins.'
  printf '  Do not commit only package.json and .yarnrc.yml; the release binary must be tracked too.\n\n'
  printf '  %sgit add package.json .yarnrc.yml .yarn/releases/yarn-%s.cjs%s\n' "$YARN_BOLD" "$version" "$YARN_RESET"
  printf '  Review and commit these files together (including any removed old release).\n\n'
}

get_latest_stable_yarn_version() {
  local latest_tag
  latest_tag="$(curl -fsSL https://api.github.com/repos/yarnpkg/berry/releases/latest 2>/dev/null | python3 -c "import json,sys;print(json.load(sys.stdin).get('tag_name','unknown'))" 2>/dev/null || echo "unknown")"

  printf '%s' "$latest_tag" | sed 's|^@yarnpkg/cli/||'
}

is_unknown_version() {
  local version="$1"

  if [ -z "$version" ] || [ "$version" = "unknown" ]; then
    return 0
  fi

  return 1
}
