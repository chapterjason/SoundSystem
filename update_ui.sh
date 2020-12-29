#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

git add -A
git stash
git pull --rebase
git stash pop

yarn

. "$SCRIPT_DIRECTORY/build_ui.sh"

supervisorctl stop server
supervisorctl start server
