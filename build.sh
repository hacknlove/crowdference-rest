#!/bin/bash

VERSION=$(node -pe "require('./package.json').version")
NAME=$(node -pe "require('./package.json').name")

docker build --tag hacknlove/$NAME:$VERSION ./

docker push hacknlove/$NAME:$VERSION
