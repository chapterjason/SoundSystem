#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
# Create user for the bluemusic-playback service
###################################
###################################
getent group bluemusic &>/dev/null || sudo groupadd -r bluemusic >/dev/null
getent passwd bluemusic &> /dev/null || sudo useradd -r -g bluemusic -G audio bluemusic >/dev/null
mkdir -p /home/bluemusic
chown -R bluemusic:bluemusic /home/bluemusic
