#!/bin/bash
set -e

#
# This is default entrypoint for local development of this Angular application.
# Within this we need to do following steps to build application correctly:
#   1) Make sure that all dependencies are up-to-date
#   2) Execute specified command, eg. with `make start` command this will be
#      `sh -c 'make start-yarn'`
#
# Environment variables:
#   APP_YARN_IMMUTABLE=1  Run `yarn install --immutable` to enforce strict lockfile
#                     consistency (default: 0, runs `yarn install`).
#                     Set automatically by `make start-immutable`.
#

# Step 1
if [ "${APP_YARN_IMMUTABLE:-0}" = "1" ]; then
  yarn install --immutable
else
  yarn install
fi

# Execute
exec "$@"
