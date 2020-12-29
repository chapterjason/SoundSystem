#!/usr/bin/env bash

git add -A
git stash
git pull --rebase
git stash pop
