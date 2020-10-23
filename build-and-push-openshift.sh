#!/bin/sh
set -eux
# Before running the script, make sure you login to oc usign the token from dashboard and pass NPM token
if [ $# -eq 0 ]
  then
    exit "No auth supplied"
fi

REGISTRY_EXTERNAL="https://registry.pro-eu-west-1.openshift.com"
IMAGE_EXTERNAL="registry.pro-eu-west-1.openshift.com/verifiedid-pro/demo"
TAG=latest
NPM_TOKEN="$1"



docker build -t ${IMAGE_EXTERNAL}:${TAG} \
  --label "GIT_COMMIT=$(git rev-parse HEAD)" \
  --build-arg NPM_TOKEN=${NPM_TOKEN} .
docker login ${REGISTRY_EXTERNAL} -u $(oc whoami) -p $(oc whoami -t)
docker push ${IMAGE_EXTERNAL}:${TAG}