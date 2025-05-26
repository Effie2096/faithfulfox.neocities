#!/bin/bash

static_files="
index.html
robots.txt
assets/
css/
pages/
script/
zased/
"

Color_Off="\033[0m"
declare -A colors=(
	["Black"]="\033[0;30m"
	["Red"]="\033[0;31m"
	["Green"]="\033[0;32m"
	["Yellow"]="\033[0;33m"
	["Blue"]="\033[0;34m"
	["Purple"]="\033[0;35m"
	["Cyan"]="\033[0;36m"
	["White"]="\033[0;37m"
)

declare -A log_levels=(
	["error"]="${colors[Red]}"
	["warn"]="${colors[Yellow]}"
	["success"]="${colors[Green]}"
	["info"]="${colors[Cyan]}"
	["debug"]="${colors[Purple]}"
	["trace"]="${colors[White]}"
)

notify() {
	msg=$1
	level=$2
	if [ -z "$2" ]; then
		level="trace"
	fi

	printf "%b%s%b %*s%b%s%b" "${colors[Black]}" "[$(date +%H:%M:%S.%3N)]" "${Color_Off}" "$((depth*3))" "" "${log_levels[$level]}" "$msg" "$Color_Off\n"
}

copy_static_files() {
	site_folder="site/"
	for file in $static_files; do
		notify "copying ${file} to ${site_folder}"
		cp --recursive --update --preserve --force "$file" "$site_folder"
	done
}

call_script() {
	depth=$((depth + 1))
	. "$1"
	depth=$((depth - 1))
}

call_script ./build/badges_page.sh
copy_static_files

notify "Build Complete" "success"
