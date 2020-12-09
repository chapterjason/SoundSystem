#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Prepare server"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/server" || exit
yarn
popd || exit

mkdir -p "$SCRIPT_DIRECTORY/server/public"

###################################
###################################
echo "Build scripts"
###################################
###################################
# shellcheck source=./scripts/build.sh
"$SCRIPT_DIRECTORY/scripts/build.sh"

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

mkdir -p "$SCRIPT_DIRECTORY/server/public/scripts"
mv "$SCRIPT_DIRECTORY/scripts/dist/scripts.zip" "$SCRIPT_DIRECTORY/server/public/scripts"

###################################
###################################
echo "Build ui"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/ui" || exit
yarn
yarn run build:prod
popd || exit

mkdir -p "$SCRIPT_DIRECTORY/server/public/build"
mv "$SCRIPT_DIRECTORY/ui/dist"/* "$SCRIPT_DIRECTORY/server/public/build"

###################################
###################################
echo "Build client"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/client" || exit
yarn
yarn run build:prod
popd || exit

mkdir -p "$SCRIPT_DIRECTORY/server/public/client"
mv "$SCRIPT_DIRECTORY/client/dist"/* "$SCRIPT_DIRECTORY/server/public/client"

