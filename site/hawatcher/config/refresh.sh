config_file=$1

input=$(cat "-")
echo $input

cat "$config_file" \
	| sed '/server.*/d' \
	| sed '/^backend.*/a  %#%    a b\n c' \
	| sed 's/%#%//g'	
