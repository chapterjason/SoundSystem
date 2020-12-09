#!/bin/bash
cd /home/pi/SoundSystem/server || exit;
exec node ./node_modules/.bin/ts-node src/main.ts;
