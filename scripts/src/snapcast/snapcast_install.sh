#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./snapcast_dependencies.sh
sudo "$SCRIPT_DIRECTORY/snapcast_dependencies.sh"

# shellcheck source=./snapcast_configure.sh
sudo "$SCRIPT_DIRECTORY/snapcast_configure.sh"
