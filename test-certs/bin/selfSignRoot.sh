#!/bin/bash

echo 'Self signing root certificate'

openssl req -x509 -new -nodes -key ./output/rootCA.key -sha256 -days 1024 -out ./output/rootCA.pem
