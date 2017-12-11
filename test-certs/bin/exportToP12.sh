#!/bin/bash

if [ -z "${1+x}" ]; then
	echo "Please provide a user or device name"
	exit 1
fi

key=$1.key
cert=$1.crt
p12=$1.p12
openssl pkcs12 -export -out $p12 -inkey $key -in $cert
