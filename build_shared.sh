#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###################################
###################################
echo "Build common"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/common" || exit
yarn run build
popd || exit

###################################
###################################
echo "Build network"
###################################
###################################
pushd "$SCRIPT_DIRECTORY/network" || exit
yarn run build
popd || exit
