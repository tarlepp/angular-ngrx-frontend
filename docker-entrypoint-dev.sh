#!/bin/bash
set -e

#
# This is default entrypoint for local development of this Angular application.
# Within this we need to do following steps to build application correctly:
#   1) Make sure that all dependencies are up-to-date
#   2) Execute specified command, eg. with `make start` command this will be
#      `sh -c 'make start-yarn'`
#

# Step 1
yarn install

# Execute
exec "$@"
