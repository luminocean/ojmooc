#!/bin/bash
template_config_file=$1
config_file=$2

input=$(cat "-")

config_content=$(cat "$template_config_file" \
	| sed '/    server.*/d' \
	| sed "/^backend.*/a\\${input}" \
	| sed '/^$/d') \
	&& echo -n "$config_content" > "$config_file"