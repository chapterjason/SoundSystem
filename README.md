
# SoundSystem

## Prerequisites

1. Docker

```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker pi
```

## Install

Clone the code:
```
git clone git@github.com:chapterjason/SoundSystem.git
```

Change settings in files:

- `docker-compose.prod.yaml`
- `server/.env`

Start:

```
docker-compose docker-compose.prod.yml up -d
```

## Update

```
git pull --rebase
docker-compose up --build --force-recreate --no-deps scripts
docker-compose up --build --force-recreate --no-deps client
docker-compose up --build --force-recreate --no-deps ui
docker-compose up --build --force-recreate --no-deps server
```
