#!/bin/bash
cd /home/pi/SoundSystem/server || exit;
exec node -r ts-node/register/transpile-only src/main.ts;
