#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Configure shairport"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/shairport-sync" || exit
autoreconf -i -f
./configure --sysconfdir=/etc --with-stdout --with-pipe --with-alsa --with-avahi --with-ssl=openssl --with-metadata --with-soxr --with-systemd
make
popd || exit
