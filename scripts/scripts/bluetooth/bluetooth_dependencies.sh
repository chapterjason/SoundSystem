#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
echo "Install dependencies to play from bluetooth"
###################################
###################################

apt install -y --no-install-recommends alsa-base alsa-utils bluealsa bluez-tools

###################################
###################################
echo "Fix bluetooth service"
###################################
###################################
sed -i 's/ExecStart=.*/ExecStart=\/usr\/lib\/bluetooth\/bluetoothd --compat --noplugin=sap -E/g' /lib/systemd/system/bluetooth.service
