#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

git add -A
git stash
git pull --rebase
git stash pop

"$SCRIPT_DIRECTORY/build_scripts.sh"

