#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Build client"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/client" || exit
yarn run build:prod
popd || exit

mkdir -p "$SCRIPT_DIRECTORY/server/public/client"
mv "$SCRIPT_DIRECTORY/client/dist/client.js" "$SCRIPT_DIRECTORY/server/public/client"

