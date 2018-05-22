#!/bin/bash

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
./bin/exportToP12.sh $clientName

mv *.pem *.key *.crt *.srl *.p12 *.csr output

cp ./output/rootCA.pem ../certs
cp ./output/rootCA.key ../certs
cp ./output/client.crt ../certs
