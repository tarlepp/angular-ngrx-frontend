#!/usr/bin/env bash
# Usage: ./scripts/update-yarn.sh 4.15.0

set -euo pipefail

source "$(dirname "$0")/yarn-lib.sh"

target_version="${1:-}"

if [ -z "$target_version" ]; then
  yarn_message "$YARN_RED" 'ERROR' 'Version not specified.' >&2
  printf 'Usage: %s <VERSION>\nExample: %s 4.15.0\n' "$0" "$0" >&2
  exit 1
fi

if ! [[ "$target_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
  yarn_message "$YARN_RED" 'ERROR' "Invalid version format: $target_version. Expected X.Y.Z (e.g., 4.15.0)." >&2
  exit 1
fi

exec "$(dirname "$0")/yarn-upgrade.sh" "$target_version"
