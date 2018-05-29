#!/bin/bash

if [ -z "$1" ];
  then
    echo 'No client specified, using testclient'
    CLIENT=testclient
  else
    CLIENT=$1
fi

curl -ks https://localhost:8443/taxii \
    -H 'accept: application/vnd.oasis.taxii+json; version=2.0' \
    -H 'content-type: application/vnd.oasis.taxii+json; charset=utf-8; version=2.0' \
    --cert $CLIENT-crt.pem \
    --key $CLIENT-key.pem
