#!/usr/bin/env bash

git add -A
git stash
git pull --rebase
git stash pop

yarn

supervisorctl stop server
supervisorctl clear all
supervisorctl start server
