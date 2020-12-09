#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
echo "Install dependencies"
###################################
###################################
chmod 665 /etc/snapserver.conf
chmod 665 /etc/default/snapclient
chown pi:pi /etc/snapserver.conf
chown pi:pi /etc/default/snapclient
