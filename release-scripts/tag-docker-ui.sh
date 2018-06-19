#!/bin/bash

containers=(unfetter-discover-gateway)
for container in ${containers[@]};
do
  echo "Tagging $container to version $1"
  docker tag $container unfetter/$container:$1
done
