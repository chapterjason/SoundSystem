#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/../.configuration"

###################################
###################################
echo "Prepare client directory"
###################################
###################################
mkdir -p /home/pi/client

###################################
###################################
echo "Client environment file"
###################################
###################################
cat <<EOF > /home/pi/client/.env
HOST=$MAIN_SERVER_ADDRESS
PORT=$MAIN_SERVER_PORT
SERVICE_PORT=$SERVICE_PORT
EOF


