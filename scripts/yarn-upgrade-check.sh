#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

configured="$(node -p "require('./package.json').packageManager.replace('yarn@','')")"
active="$(yarn --version)"
latest="$(get_latest_stable_yarn_version)"

yarn_heading 'Yarn upgrade check (dry-run)'
yarn_versions "$configured" "$active" "$latest"
yarn_message "$YARN_BLUE" 'INFO' 'Read-only check; no files will be changed.'

if is_unknown_version "$latest"; then
  yarn_message "$YARN_YELLOW" 'WARN' 'Unable to determine latest stable version.'
  echo "Try again later or run with explicit version:"
  echo "  make yarn-upgrade VERSION=X.Y.Z"
elif [ "$configured" = "$latest" ] && [ "$active" = "$latest" ]; then
  yarn_message "$YARN_GREEN" 'OK' 'Yarn is up to date; no changes needed.'
else
  yarn_message "$YARN_YELLOW" 'UPDATE' 'Yarn version pins or active version differ from latest stable.'
  echo "Would update:"
  echo "  - package.json (packageManager)"
  echo "  - .yarnrc.yml (yarnPath)"
  echo "  - .yarn/releases/yarn-$latest.cjs"
  printf '\n  Run: %smake yarn-upgrade VERSION=%s%s\n' "$YARN_BOLD" "$latest" "$YARN_RESET"
  yarn_vcs_reminder "$latest"
fi
