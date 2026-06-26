#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

configured="$(node -p "require('./package.json').packageManager")"
active="$(yarn --version)"
latest_stable="$(get_latest_stable_yarn_version)"

printf "\033[32mYarn Version Information:\033[39m\n"
echo "Configured version: $configured"
echo "Active version: $active"
echo "Latest stable version: $latest_stable"

if is_unknown_version "$latest_stable"; then
  echo "Update available: unknown (could not determine latest stable)"
elif [ "$active" = "$latest_stable" ]; then
  echo "Update available: no"
else
  echo "Update available: yes"
  echo "Suggested command: make yarn-upgrade VERSION=$latest_stable"
fi

echo ""
printf "\033[32m.yarnrc.yml yarnPath:\033[39m\n"
grep "yarnPath:" .yarnrc.yml || echo "Not set"

echo ""
printf "\033[32mAvailable Yarn releases in .yarn/releases/:\033[39m\n"
ls -1 .yarn/releases/ 2>/dev/null | sort || echo "No releases found"

