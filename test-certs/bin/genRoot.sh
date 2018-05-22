#!/bin/bash

echo 'Generating root certificate'

openssl genrsa -out rootCA.key 4096
