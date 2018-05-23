#!/bin/bash
if [ -z "$1" ]
  then
    echo "Need single argument - ca name (e.g. ca)"
	exit 1
fi
export CA_NAME=$1
export CERT=server

echo generating private key for server
openssl genrsa -out $CERT-key.pem 4096

echo generating a signing request
openssl req -new -sha256 -config $CERT.cnf -key $CERT-key.pem -out $CERT-csr.pem

echo signing the request
openssl x509 -req -extfile $CERT.cnf -days 999 -passin "pass:password" -in $CERT-csr.pem -CA $CA_NAME-crt.pem -CAkey $CA_NAME-key.pem -CAcreateserial -out $CERT-crt.pem

echo verify
openssl verify -CAfile $CA_NAME-crt.pem $CERT-crt.pem

