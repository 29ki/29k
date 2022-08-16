#!/bin/sh
GIT_COMMIT_SHORT=$(git rev-parse --short=8 HEAD)
echo "Current git hash:" $GIT_COMMIT_SHORT
export GIT_COMMIT_SHORT