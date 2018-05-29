#!/bin/bash

if [ -z "${1+x}" ]; then
	echo "Please provide a user or device name"
	exit 1
fi

echo 'Signing key for: ' $1

openssl x509 -req -in $1.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out $1.crt -days 500 -sha256
