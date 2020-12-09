#!/bin/bash

if [[ $(/usr/bin/id -u) -eq 0 ]]; then
    echo "Do not run this script as root, but as a user with sudo permission"
    exit
fi

###################################
###################################
echo "Add nodejs and yarn sources"
###################################
###################################
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

###################################
###################################
echo "Update sources and install database, nodejs and yarn"
###################################
###################################
sudo apt-get update
sudo apt install -y --no-install-recommends mariadb-server nodejs yarn supervisor zip libcap2-bin

###################################
###################################
echo "Fix supervisor permission"
###################################
###################################
sed -i 's/chmod=0700/chmod=0766/' /etc/supervisor/supervisord.conf

###################################
###################################
echo "Allow node to use ports below 1024"
###################################
sudo setcap cap_net_bind_service=+ep /usr/bin/node
