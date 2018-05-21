#!/bin/bash

set -e

if [ -z "${1+x}" ]; then
	clientName=client
else
    clientName=$1
fi

rm output/*

./bin/genRoot.sh
./bin/selfSignRoot.sh
./bin/genPrivateKey.sh $clientName
./bin/requestSignKey.sh $clientName
./bin/signKey.sh $clientName

# Artifact from key signing -- Not an ideal solution
rm .srl

./bin/exportToP12.sh $clientName

cp ./output/rootCA.pem ../certs
cp ./output/rootCA.key ../certs
cp ./output/client.pem ../certs
