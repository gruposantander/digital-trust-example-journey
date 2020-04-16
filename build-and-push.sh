#!/bin/sh
set -eux

if [ $# -eq 0 ]
  then
    exit "No auth supplied"
fi

REGISTRY_EXTERNAL="https://docker.pkg.github.com"
IMAGE_EXTERNAL="docker.pkg.github.com/gruposantander/digital-trust-example-journey/demo"
TAG=latest
NPM_TOKEN="$1"

docker build -t ${IMAGE_EXTERNAL}:${TAG} \
  --label "GIT_COMMIT=$(git rev-parse HEAD)" \
  --build-arg NPM_TOKEN=${NPM_TOKEN} .

docker push ${IMAGE_EXTERNAL}
