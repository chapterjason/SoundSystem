#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=./configure.sh
. "$SCRIPT_DIRECTORY/configure.sh"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/.configuration"

###################################
###################################
# Disable wifi sleep
###################################
###################################
sudo /sbin/iw wlan0 set power_save off

###################################
###################################
# Updates
###################################
###################################
sudo apt-get update && sudo apt-get upgrade -y

###################################
###################################
# Set hostname and expand fs
###################################
###################################
sudo raspi-config nonint do_hostname "$HOSTNAME"
sudo raspi-config nonint do_expand_rootfs

###################################
###################################
# Install airplay
###################################
###################################
# shellcheck source=./airplay/airplay_install.sh
"$SCRIPT_DIRECTORY/airplay/airplay_install.sh"

###################################
###################################
# Install bluetooth
###################################
###################################
# shellcheck source=./bluetooth/bluetooth_install.sh
"$SCRIPT_DIRECTORY/bluetooth/bluetooth_install.sh"

###################################
###################################
# Install snapcast
###################################
###################################
# shellcheck source=./snapcast/snapcast_install.sh
"$SCRIPT_DIRECTORY/snapcast/snapcast_install.sh"

###################################
###################################
# Install client
###################################
###################################
# shellcheck source=./client/client_install.sh
"$SCRIPT_DIRECTORY/client/client_install.sh"
