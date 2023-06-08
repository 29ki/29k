#!/bin/sh
IP_ADDRESS=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | grep -m1 "")
echo "IP_ADDRESS=$IP_ADDRESS"
export IP_ADDRESS
