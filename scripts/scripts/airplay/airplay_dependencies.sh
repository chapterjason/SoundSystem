#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
# Install dependencies to play from airplay
###################################
###################################
sudo apt install -y --no-install-recommends build-essential git autoconf automake libtool libdaemon-dev libasound2-dev libpopt-dev libconfig-dev avahi-daemon libavahi-client-dev libssl-dev libpolarssl-dev libsoxr-dev

###################################
###################################
# Remove shairport-sync directory and download again
###################################
###################################
rm -rf "$SCRIPT_DIRECTORY/shairport-sync"
git clone https://github.com/mikebrady/shairport-sync.git "$SCRIPT_DIRECTORY/shairport-sync"
