#!/bin/bash
echo ============= Create a CA for the server cert =============
./create_ca.sh ca_server

echo ============= Create a server cert =============
./create_server.sh ca_server

echo ============= Create a CA for the server cert =============
./create_ca.sh ca_client

echo ============= Create a server cert =============
./create_client.sh ca_client snort
