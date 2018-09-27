#!/bin/sh

cat ./docker-hub.pass.txt | docker login --username $USER --password-stdin
