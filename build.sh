#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./build_common.sh
"$SCRIPT_DIRECTORY/build_common.sh"

# shellcheck source=./build_server.sh
"$SCRIPT_DIRECTORY/build_server.sh"

# shellcheck source=./build_scripts.sh
"$SCRIPT_DIRECTORY/build_scripts.sh"

# shellcheck source=./build_ui.sh
"$SCRIPT_DIRECTORY/build_ui.sh"

# shellcheck source=./build_client.sh
"$SCRIPT_DIRECTORY/build_client.sh"

