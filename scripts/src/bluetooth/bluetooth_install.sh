#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./bluetooth_dependencies.sh
sudo "$SCRIPT_DIRECTORY/bluetooth_dependencies.sh"

# shellcheck source=./bluetooth_users.sh
sudo "$SCRIPT_DIRECTORY/bluetooth_users.sh"

# shellcheck source=./bluetooth_services.sh
sudo "$SCRIPT_DIRECTORY/bluetooth_services.sh"

# shellcheck source=./bluetooth_configure.sh
sudo "$SCRIPT_DIRECTORY/bluetooth_configure.sh"
