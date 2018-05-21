#!/bin/bash

if [ -z "${1+x}" ]; then
	echo "Please provide a user or device name"
	exit 1
fi

echo 'Generating signing request for: ' $1

openssl req -new -key ./output/$1.key -out ./output/$1.csr
