#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

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


