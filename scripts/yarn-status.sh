#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

configured="$(node -p "require('./package.json').packageManager")"
active="$(yarn --version)"
latest_stable="$(get_latest_stable_yarn_version)"

yarn_heading 'Yarn version information'
yarn_versions "$configured" "$active" "$latest_stable"

if is_unknown_version "$latest_stable"; then
  yarn_message "$YARN_YELLOW" 'WARN' 'Update availability unknown: could not determine latest stable.'
elif [ "$active" = "$latest_stable" ]; then
  yarn_message "$YARN_GREEN" 'OK' 'Active Yarn is up to date.'
else
  yarn_message "$YARN_YELLOW" 'UPDATE' 'A different stable Yarn version is available.'
  printf '  Run: %smake yarn-upgrade VERSION=%s%s\n' "$YARN_BOLD" "$latest_stable" "$YARN_RESET"
  yarn_vcs_reminder "$latest_stable"
fi

yarn_heading 'Project Yarn pin (.yarnrc.yml)'
grep "yarnPath:" .yarnrc.yml || echo "Not set"

yarn_heading 'Local Yarn releases (.yarn/releases/)'
ls -1 .yarn/releases/ 2>/dev/null | sort || echo "No releases found"
