#!/usr/bin/env bash

SCRIPT_DIRECTORY="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Rebuild scripts..."

# Zip new file
zip -r "$SCRIPT_DIRECTORY/scripts.zip" "$SCRIPT_DIRECTORY/scripts/*"

# Ensure dist exist
mkdir -p "$SCRIPT_DIRECTORY/dist"

# Delete old file
rm "$SCRIPT_DIRECTORY/dist/scripts.zip"

# Move script into dist
mv "$SCRIPT_DIRECTORY/scripts.zip "$SCRIPT_DIRECTORY/dist"
