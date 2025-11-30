#!/bin/bash

# To run this script in WSL, use this: chmod +x update-tags.sh && ./update-tags.sh

NEW_TAG="0.0.4"

# Find and replace all occurrences of sarahstrawberries/secretarai-api and sarahstrawberries/secretarai-web tags
find . -type f \( -name "*.yaml" -o -name "*.yml" -o -name "Dockerfile" \) \
  -exec sed -i -E "s|(sarahstrawberries/secretarai-api):[0-9]+\.[0-9]+\.[0-9]+|\1:${NEW_TAG}|g" {} \; \
  -exec sed -i -E "s|(sarahstrawberries/secretarai-web):[0-9]+\.[0-9]+\.[0-9]+|\1:${NEW_TAG}|g" {} \;

echo "Updated all image tags to ${NEW_TAG}"
