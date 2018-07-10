#!/bin/bash

containers=(unfetter-discover-gateway)
for container in ${containers[@]};
do
  echo "Pushing $container:$1"
  docker push unfetter/$container:$1
done
