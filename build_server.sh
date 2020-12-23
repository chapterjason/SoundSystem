#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Build server"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/server" || exit
yarn
popd || exit

mkdir -p "$SCRIPT_DIRECTORY/server/public"
