#!/bin/bash

# This script is used to build the images that are pushed to Docker Hub
# Requirements:
# - `unfetter-ui` project in ../unfetter-ui directory
# - nodejs
# - docker-compose

if ! command -v node &>/dev/null; then
    echo "This script requires nodejs";
    exit 1;
fi

if ! command -v docker-compose &>/dev/null; then
    echo "This script requires docker-compose";
    exit 1;
fi

if [ -d '../unfetter-ui' ]; then

    # Build UI
    cd ../unfetter-ui;
    npm install;
    npm run build:dev;

    if [ ! -d 'dist' ]; then
        echo "unfetter-ui did not build correctly";
        exit 1;
    fi

    # Run docker compose
    cd ../unfetter;
    if [[ "$(uname -s)" == "Darwin" ]]; then
        docker-compose -f docker-compose.build-docker-hub.yml build;
    else
        sudo docker-compose -f docker-compose.build-docker-hub.yml build;
    fi
else
    echo "This script requires the unfetter-ui to be present as a sibling directory to unfetter.";
fi
