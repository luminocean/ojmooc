#!/bin/bash

program_path=$1
break_line=$2

gdb --interpreter=mi "$program_path"