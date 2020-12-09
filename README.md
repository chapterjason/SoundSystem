
# SoundSystem


## Install

```
cd ~
sudo apt update && sudo apt install -y --no-install-recommends zip
rm -rf SoundSystem
git clone https://github.com/chapterjason/SoundSystem.git
cd SoundSystem
```

Run `./install.sh`, for further information take a look into the file.

### Prerequisites

Create the database and user with a password:
Get into mysql console with: `sudo mysql`

```mysql
CREATE DATABASE soundsystem;
CREATE USER soundsystem@localhost IDENTIFIED BY 'password-here';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON soundsystem.* TO soundsystem@localhost;
```

### Build

Change settings in the file: `~/SoundSystem/server/.env`
Build with `./build.sh`

### Supervisor

Install the supervisor service with `./services.sh`

### Update

```
git add -A
git stash
git pull --rebase
git stash pop
./build.sh
supervisorctl stop server
supervisorctl start server
```

## Add client

```
wget http://SERVER:PORT/scripts/scripts.zip
unzip scripts.zip
./scripts/install.sh
```


### Reconfigure

```
./scripts/configure.sh
./scripts/client/client_configure.sh
./scripts/client/client_update.sh
```

### Update

```
./scripts/client/client_update.sh
```

