#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Rebuild scripts..."

# Zip new file
zip -r "$SCRIPT_DIRECTORY/scripts.zip" "$SCRIPT_DIRECTORY/src"

# Ensure dist exist
mkdir -p "$SCRIPT_DIRECTORY/dist"

# Delete old file
if test -f "$SCRIPT_DIRECTORY/dist/scripts.zip"; then
  rm "$SCRIPT_DIRECTORY/dist/scripts.zip"
fi

# Move script into dist
mv "$SCRIPT_DIRECTORY/scripts.zip" "$SCRIPT_DIRECTORY/dist"
