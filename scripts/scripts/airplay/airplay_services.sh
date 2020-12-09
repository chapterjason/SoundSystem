#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck disable=SC1090
. "$SCRIPT_DIRECTORY/../.configuration"

systemctl stop shairport-playback

###################################
###################################
# Create airplay service
###################################
###################################
cat <<EOF > /etc/systemd/system/shairport-playback.service
[Unit]
Description=Shairport Playback
After=syslog.service

[Service]
ExecStartPre=/bin/sleep 3
ExecStart=/usr/local/bin/shairport-sync --output=alsa --name=$HOSTNAME
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=Shairport-Playback
User=shairport-sync

[Install]
WantedBy=multi-user.target
EOF

###################################
###################################
# Reload systemctl daemon
###################################
###################################
systemctl daemon-reload

systemctl start shairport-playback

systemctl stop shairport-playback
