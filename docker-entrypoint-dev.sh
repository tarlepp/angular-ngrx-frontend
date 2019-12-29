#!/bin/bash
set -e

#
# This is default entrypoint for local development of this Angular application. Within this we need to do following
# steps to build application correctly:
#   1) Make sure that all dependencies are up-to-date
#   2) Ensure that _all_ files have "correct" permissions
#
# Note that all the chmod stuff is for users who are using docker-compose within Linux environment. More info in link
# below:
#   https://jtreminio.com/blog/running-docker-containers-as-current-host-user/
#

# Step 1
yarn install

# Step 2
chmod -R o+s+w /app

exec "$@"
