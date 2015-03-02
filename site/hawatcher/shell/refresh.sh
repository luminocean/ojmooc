#!/bin/bash
template_config_file=$1
config_file=$2
port=$3

input=$(cat "-")

config_content=$(cat "$template_config_file" \
	| sed '/    server.*/d' \
	| sed "/^backend.*/a\\${input}" \
	| sed "s/bind \*:.*/bind \*:${port}/" \
	| sed '/^$/d') \
	&& echo -n "$config_content" > "$config_file"