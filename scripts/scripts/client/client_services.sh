#!/bin/bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "You need to run this script as root"
    exit
fi

###################################
###################################
# Create supervisor client service
###################################
###################################
supervisorctl stop client
cat <<EOF > /etc/supervisor/conf.d/client.conf
[program:client]
directory=/home/pi/client
command=bash /home/pi/scripts/client/service.sh
priority=10
autostart=true
autorestart=true
startsecs=4
startretries=99999999
exitcodes=0
stopsignal=QUIT
stopwaitsecs=4
user=pi
log_stdout=true
log_stderr=true
logfile_maxbytes=5MB
logfile_backups=2
EOF

###################################
###################################
# Reload supervisor
###################################
###################################
supervisorctl clear all
supervisorctl reread
supervisorctl reload
supervisorctl update all

supervisorctl start client
