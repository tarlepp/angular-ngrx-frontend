#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

target_version="${1:-}"

if [ -z "$target_version" ]; then
  target_version="$(get_latest_stable_yarn_version)"

  if is_unknown_version "$target_version"; then
    printf "\033[31mERROR: VERSION not specified and latest stable could not be determined\033[39m\n"
    exit 1
  fi

  printf "\033[33mVERSION not specified, using latest stable: %s\033[39m\n" "$target_version"
fi

printf "\033[32mUpgrading Yarn to version %s\033[39m\n" "$target_version"

npm pkg set packageManager="yarn@$target_version"
yarn set version "$target_version"
corepack prepare "yarn@$target_version" --activate

printf "\033[32mYarn upgraded to version %s\033[39m\n" "$target_version"
yarn --version

printf "\033[32mUpdating yarn.lock file...\033[39m\n"
yarn install

