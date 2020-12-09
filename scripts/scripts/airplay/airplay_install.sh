#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./airplay_dependencies.sh
"$SCRIPT_DIRECTORY/airplay_dependencies.sh"

# shellcheck source=./airplay_configure.sh
"$SCRIPT_DIRECTORY/airplay_configure.sh"

# Install
pushd "$SCRIPT_DIRECTORY/shairport-sync" || exit
sudo make install
popd || exit

# shellcheck source=./airplay_users.sh
sudo "$SCRIPT_DIRECTORY/airplay_users.sh"

# shellcheck source=./airplay_services.sh
sudo "$SCRIPT_DIRECTORY/airplay_services.sh"
