#!/bin/bash
if [ -z "$1" ]
  then
    echo "Need single argument - cert name (e.g. self)"
	exit 1
fi
export CERT=$1

echo create temporary config file
sed "s/replace_me/$CERT/g" client-template.cnf > $CERT.cnf

echo create self signed cert
openssl req -x509 -days 365 -config $CERT.cnf -newkey rsa:4096 -keyout $CERT-key.pem  -out $CERT-crt.pem -nodes

echo remove temporary config file
rm $CERT.cnf

echo verify
openssl verify -CAfile $CERT-crt.pem $CERT-crt.pem

echo 'create pfx file for windows browser'
openssl pkcs12 -export -out $CERT.pfx -inkey $CERT-key.pem -in $CERT-crt.pem -passout "pass:"

