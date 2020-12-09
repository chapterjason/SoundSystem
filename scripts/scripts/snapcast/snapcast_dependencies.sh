#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
# Install dependencies
###################################
###################################
apt-get install -y --no-install-recommends libavahi-client3 libflac8 libogg0 libopus0 libsoxr0 libvorbis0a libvorbisenc2

###################################
###################################
# Download and install snapcast files
###################################
###################################
mkdir -p "$SCRIPT_DIRECTORY/snapcast"
pushd "$SCRIPT_DIRECTORY/snapcast" || exit
wget https://github.com/badaix/snapcast/releases/download/v0.22.0/snapserver_0.22.0-1_armhf.deb
wget https://github.com/badaix/snapcast/releases/download/v0.22.0/snapclient_0.22.0-1_armhf.deb

dpkg -i snapserver_0.22.0-1_armhf.deb
dpkg -i snapclient_0.22.0-1_armhf.deb
popd || exit

###################################
###################################
# Stop and disable autostart services
###################################
###################################
systemctl stop snapserver
systemctl stop snapclient

systemctl disable snapclient
systemctl disable snapserver
