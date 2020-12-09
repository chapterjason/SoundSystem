#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Gather information"
###################################
###################################
read -p "Hostname?: " HOSTNAME
echo $HOSTNAME

read -p "Main server address?: " MAIN_SERVER_ADDRESS
echo $MAIN_SERVER_ADDRESS

read -p "Main server port?: " MAIN_SERVER_PORT
echo $MAIN_SERVER_PORT

read -p "Service port?: " SERVICE_PORT
echo $SERVICE_PORT

###################################
###################################
echo "Write configuration"
###################################
###################################
cat <<EOF > "$SCRIPT_DIRECTORY/.configuration"
HOSTNAME=$HOSTNAME
MAIN_SERVER_ADDRESS=$MAIN_SERVER_ADDRESS
MAIN_SERVER_PORT=$MAIN_SERVER_PORT
SERVICE_PORT=$SERVICE_PORT
EOF
