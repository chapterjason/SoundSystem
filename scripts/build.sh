#!/usr/bin/env sh

echo "Rebuild scripts..."

# Zip new file
zip -r ./scripts.zip ./scripts/*

# Ensure dist exist
mkdir -p ./dist

# Delete old file
rm ./dist/scripts.zip

# Move script into dist
mv ./scripts.zip ./dist
