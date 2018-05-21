#!/bin/bash

if [ -z "${1+x}" ]; then
	echo "Please provide a user or device name"
	exit 1
fi

echo 'Generating private key for: ' $1

openssl genrsa -out ./output/$1.key 2048
