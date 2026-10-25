#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

target_version="${1:-}"

yarn_heading 'Yarn upgrade'

if [ -z "$target_version" ]; then
  target_version="$(get_latest_stable_yarn_version)"

  if is_unknown_version "$target_version"; then
    yarn_message "$YARN_RED" 'ERROR' 'VERSION not specified and latest stable could not be determined.' >&2
    exit 1
  fi

  yarn_message "$YARN_BLUE" 'INFO' "VERSION not specified; using latest stable: $target_version"
fi

yarn_message "$YARN_BLUE" 'TARGET' "Yarn $target_version"

yarn_message "$YARN_BLUE" '1/3' 'Updating package.json version pin...'
npm pkg set packageManager="yarn@$target_version"
yarn_message "$YARN_BLUE" '2/3' 'Updating yarnPath and downloading the repository Yarn binary...'
yarn set version "$target_version"
yarn_message "$YARN_BLUE" '3/3' 'Preparing and activating Yarn with Corepack...'
corepack prepare "yarn@$target_version" --activate

active="$(yarn --version)"
if [ "$active" != "$target_version" ]; then
  yarn_message "$YARN_RED" 'ERROR' "Expected active Yarn $target_version, got $active." >&2
  exit 1
fi

yarn_message "$YARN_GREEN" 'OK' "Yarn $active is configured and active."
yarn_vcs_reminder "$target_version"
