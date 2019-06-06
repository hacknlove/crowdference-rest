#!/bin/bash

VERSION=$(node -pe "require('./package.json').version")
NAME=$(node -pe "require('./package.json').name")

docker build --tag hacknlove/$NAME:$VERSION ./

docker push hacknlove/$NAME:$VERSION
docker tag hacknlove/$NAME:$VERSION hacknlove/$NAME:latest
docker push hacknlove/$NAME:latest
