#!/bin/bash
i=0

while [ $i -lt 20 ]
do
	#echo 1
	docker run -i --rm=true ojrunner-img echo 1
	i=$(($i+1))
done
