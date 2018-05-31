#!/bin/bash
if [ -z "$1" ]
  then
    echo "Need single argument - client name"
	exit 1
fi

echo ============= Create a client cert =============
./create_client.sh ca_client $1
