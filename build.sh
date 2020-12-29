#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Install dependencies"
###################################
###################################
yarn

###################################
###################################
echo "Prepare server"
###################################
###################################
mkdir -p "$SCRIPT_DIRECTORY/server/public"

# shellcheck source=./build_shared.sh
"$SCRIPT_DIRECTORY/build_shared.sh"

# shellcheck source=./build_scripts.sh
"$SCRIPT_DIRECTORY/build_scripts.sh"

# shellcheck source=./build_client.sh
"$SCRIPT_DIRECTORY/build_client.sh"

# shellcheck source=./build_ui.sh
"$SCRIPT_DIRECTORY/build_ui.sh"
