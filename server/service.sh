#!/bin/bash
cd /home/pi/SoundSystem/server || exit;
exec node dist/main.js;
