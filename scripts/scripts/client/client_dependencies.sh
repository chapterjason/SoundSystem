#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/../.configuration"

###################################
###################################
echo "Install dependencies"
###################################
###################################
apt install -y --no-install-recommends supervisor

###################################
###################################
echo "Install nodejs"
###################################
###################################
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y nodejs

###################################
###################################
echo "Fix supervisor cof to be usable for the pi user"
###################################
###################################
sed -i 's/chmod=0700/chmod=0766/' /etc/supervisor/supervisord.conf

###################################
###################################
echo "Install the client"
###################################
###################################
wget -O /home/pi/client/client.js "http://$MAIN_SERVER_ADDRESS:$MAIN_SERVER_PORT/client/client.js"

###################################
###################################
echo "Set permissions"
###################################
###################################
chown -R pi:pi /home/pi/client
