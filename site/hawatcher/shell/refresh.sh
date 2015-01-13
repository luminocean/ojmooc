#!/bin/bash
config_file=$1

input=$(cat "-")

config_content=$(cat "$config_file" \
	| sed '/    server.*/d' \
	| sed "/^backend.*/a\\${input}" \
	| sed '/^$/d') \
	&& echo -n "$config_content" > "$config_file"