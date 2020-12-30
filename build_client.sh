#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Build client"
###################################
###################################
mkdir -p "$SCRIPT_DIRECTORY/server/public/client"
cp "$SCRIPT_DIRECTORY/client/dist/client.js" "$SCRIPT_DIRECTORY/server/public/client"

