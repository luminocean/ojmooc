#!/bin/bash
touch ./haproxy.pid
haproxy -f ./config/haproxy.cfg -p ./haproxy.pid -sf $(cat ./haproxy.pid)
rm ./haproxy.pid