#!/bin/bash

containers=(unfetter-ctf-ingest unfetter-discover-api unfetter-pattern-handler unfetter-discover-processor unfetter-api-explorer unfetter-ui unfetter-socket-server)
for container in ${containers[@]};
do
  echo "Pushing $container:$1"
  docker push unfetter/$container:$1
done
