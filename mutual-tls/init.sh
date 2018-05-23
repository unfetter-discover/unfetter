#!/bin/bash

echo ============= Create a CA for the server cert =============
./create_ca.sh ca_server

echo ============= Create a server cert =============
./create_server.sh ca_server

echo ============= Create a CA for the client cert =============
./create_ca.sh ca_client

echo ============= Create a client cert =============
./create_client.sh ca_client testclient

cp server-key.pem ../certs
cp server-crt.pem ../certs
cp ca_client-crt.pem ../certs
cp ca_client-crt.srl ../certs
