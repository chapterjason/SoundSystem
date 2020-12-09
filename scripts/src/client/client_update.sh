#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/../.configuration"

sudo supervisorctl stop client
wget --no-cache --no-cookies -O /home/pi/client/client.js "http://$MAIN_SERVER_ADDRESS:$MAIN_SERVER_PORT/client/client.js"
sudo supervisorctl start client
