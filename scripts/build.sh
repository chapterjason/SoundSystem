#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Rebuild scripts..."

# Delete old file
if test -f "$SCRIPT_DIRECTORY/dist/scripts.zip"; then
  rm "$SCRIPT_DIRECTORY/dist/scripts.zip"
fi

mkdir -p "$SCRIPT_DIRECTORY/dist"

# Zip new file
pushd "$SCRIPT_DIRECTORY" || exit;
mv src scripts
zip -r ./dist/scripts.zip ./scripts/*
mv scripts src
popd || exit;
