#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Build ui"
###################################
###################################
rm -rf "$SCRIPT_DIRECTORY/server/public/build"
mkdir -p "$SCRIPT_DIRECTORY/server/public/build"
mv "$SCRIPT_DIRECTORY/ui/dist"/* "$SCRIPT_DIRECTORY/server/public/build"
