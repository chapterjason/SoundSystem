#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
# Create bthelper service
# Make Bluetooth discoverable after initialisation
###################################
###################################
systemctl stop bthelper@hci0
mkdir -p /etc/systemd/system/bthelper@.service.d
cat <<EOF > /etc/systemd/system/bthelper@.service.d/override.conf
[Service]
Type=oneshot
ExecStartPost=/usr/bin/bluetoothctl discoverable on
ExecStartPost=/bin/hciconfig %I piscan
ExecStartPost=/bin/hciconfig %I sspmode 1
EOF

###################################
###################################
# Create bt-agent service
###################################
###################################
systemctl stop bt-agent
cat <<EOF > /etc/systemd/system/bt-agent.service
[Unit]
Description=Bluetooth Agent
Requires=bluetooth.service
After=bluetooth.service

[Service]
ExecStart=/usr/bin/bt-agent --capability=NoInputNoOutput
RestartSec=5
Restart=always
KillSignal=SIGUSR1

[Install]
WantedBy=multi-user.target
EOF

###################################
###################################
# Create bluealsa service
###################################
###################################
systemctl stop bluealsa
mkdir -p /etc/systemd/system/bluealsa.service.d
cat <<EOF > /etc/systemd/system/bluealsa.service.d/override.conf
[Service]
ExecStart=
ExecStart=/usr/bin/bluealsa -i hci0 -p a2dp-sink
RestartSec=5
Restart=always
EOF

###################################
###################################
# Bluemusic playback service
###################################
###################################
systemctl stop bluemusic-playback
cat <<EOF > /etc/systemd/system/bluemusic-playback.service
[Unit]
Description=Bluemusic Playback
After=bluealsa.service syslog.service
Requires=bluealsa.service

[Service]
ExecStartPre=/bin/sleep 3
ExecStart=/usr/bin/bluealsa-aplay --profile-a2dp 00:00:00:00:00:00
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=Bluemusic-Playback
User=bluemusic

[Install]
WantedBy=multi-user.target
EOF

###################################
###################################
# Bluetooth playback service
###################################
###################################
systemctl stop bluetooth-playback
cat <<EOF > /etc/systemd/system/bluetooth-playback.service
[Unit]
Description=Bluetooth Playback
After=bluealsa.service syslog.service
Requires=bluealsa.service

[Service]
ExecStartPre=/bin/sleep 3
ExecStart=/usr/bin/bluealsa-aplay --profile-a2dp 00:00:00:00:00:00
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=Bluetooth-Playback
User=pi

[Install]
WantedBy=multi-user.target
EOF

###################################
###################################
# Reload systemctl daemon
###################################
###################################
systemctl daemon-reload

systemctl disable bluetooth
systemctl disable bthelper@hci0
systemctl disable bt-agent
systemctl disable bluealsa
systemctl disable bluemusic-playback
systemctl disable bluetooth-playback

systemctl start bluetooth
systemctl start bthelper@hci0
systemctl start bt-agent
systemctl start bluealsa
systemctl start bluemusic-playback
systemctl start bluetooth-playback

systemctl stop bluetooth-playback
systemctl stop bluemusic-playback
systemctl stop bluealsa
systemctl stop bt-agent
systemctl stop bthelper@hci0
systemctl stop bluetooth
