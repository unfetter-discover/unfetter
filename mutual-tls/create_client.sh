#!/bin/bash
if [ -z "$2" ]
  then
    echo "Need two arguments - 1. ca name, 2. new cert name"
	exit 1
fi
export CA_NAME=$1
export CERT=$2

echo create client cert
openssl genrsa -out $CERT-key.pem 4096

echo create temporary config file
sed "s/replace_me/$CERT/g" client-template.cnf > $CERT.cnf

echo create certificate signing request
openssl req -new -sha256 -config $CERT.cnf -key $CERT-key.pem -out $CERT-csr.pem

echo sign the new cert
openssl x509 -req -extfile $CERT.cnf -days 999 -passin "pass:password" -in $CERT-csr.pem -CA $CA_NAME-crt.pem -CAkey $CA_NAME-key.pem -CAcreateserial -out $CERT-crt.pem

echo remove temporary config file
rm $CERT.cnf

echo verify
openssl verify -CAfile $CA_NAME-crt.pem $CERT-crt.pem

echo 'create pfx file for windows browser'
openssl pkcs12 -export -out $CERT.pfx -inkey $CERT-key.pem -in $CERT-crt.pem -passout "pass:"

