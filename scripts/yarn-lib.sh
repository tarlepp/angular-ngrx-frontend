#!/usr/bin/env bash

# Shared helper functions for Yarn version scripts.

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

