#!/bin/bash

docker run -it -p 9080:9080 -w /opt/app -v ${PWD}/maven-repo:/root/.m2 -v ${PWD}:/opt/app adoptopenjdk/maven-openjdk8-openj9:latest /bin/bash
