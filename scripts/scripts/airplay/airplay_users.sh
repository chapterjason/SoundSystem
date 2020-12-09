#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
# Create shairport group, user and add to audio group
###################################
###################################
getent group shairport-sync &>/dev/null || sudo groupadd -r shairport-sync >/dev/null
getent passwd shairport-sync &> /dev/null || sudo useradd -r -M -g shairport-sync -s /usr/bin/nologin -G audio shairport-sync >/dev/null
