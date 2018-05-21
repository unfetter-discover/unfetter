#!/bin/bash

echo 'Generating root certificate'

openssl genrsa -out ./output/rootCA.key 4096
