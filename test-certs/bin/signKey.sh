#!/bin/bash

if [ -z "${1+x}" ]; then
	echo "Please provide a user or device name"
	exit 1
fi

echo 'Signing key for: ' $1

openssl x509 -req -in ./output/$1.csr -CA ./output/rootCA.pem -CAkey ./output/rootCA.key -CAcreateserial -out ./output/$1.pem -days 500 -sha256
