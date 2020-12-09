#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./client_configure.sh
"$SCRIPT_DIRECTORY/client_configure.sh"

# shellcheck source=./client_dependencies.sh
sudo "$SCRIPT_DIRECTORY/client_dependencies.sh"

# shellcheck source=./client_services.sh
sudo "$SCRIPT_DIRECTORY/client_services.sh"
