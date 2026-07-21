#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

configured="$(node -p "require('./package.json').packageManager.replace('yarn@','')")"
active="$(yarn --version)"
latest="$(get_latest_stable_yarn_version)"

printf "\033[32mYarn Upgrade Check (dry-run):\033[39m\n"
echo "Configured version: $configured"
echo "Active version: $active"
echo "Latest stable version: $latest"

if is_unknown_version "$latest"; then
  echo "Result: unable to determine latest stable version"
  echo "Try again later or run with explicit version:"
  echo "  make yarn-upgrade VERSION=X.Y.Z"
elif [ "$configured" = "$latest" ] && [ "$active" = "$latest" ]; then
  echo "Result: up to date (no changes needed)"
else
  echo "Result: upgrade available"
  echo "Would update:"
  echo "  - package.json (packageManager)"
  echo "  - .yarnrc.yml (yarnPath)"
  echo "  - .yarn/releases/yarn-$latest.cjs"
  echo "Run:"
  echo "  make yarn-upgrade VERSION=$latest"
fi
