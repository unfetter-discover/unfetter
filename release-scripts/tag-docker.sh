#!/bin/bash

containers=(unfetter-ctf-ingest unfetter-discover-api unfetter-pattern-handler unfetter-discover-processor unfetter-api-explorer unfetter-ui unfetter-socket-server)
for container in ${containers[@]};
do
  echo "Tagging $container to version $1"
  docker tag $container unfetter/$container:$1
done
