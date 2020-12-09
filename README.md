
# SoundSystem

## Prerequisites

Install docker:
```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker pi
```

Install required packages:

```
sudo apt install -y --no-install-recommends git docker-compose
```

## Install

Clone the code:
```
git clone https://github.com/chapterjason/SoundSystem.git
```

Change settings in files:

- `docker-compose.prod.yaml`
- `server/.env`

Start:

```
docker-compose -f docker-compose.prod.yaml up -d
```

## Update

```
git pull --rebase
docker-compose up --build --force-recreate --no-deps scripts
docker-compose up --build --force-recreate --no-deps client
docker-compose up --build --force-recreate --no-deps ui
docker-compose up --build --force-recreate --no-deps server
```
