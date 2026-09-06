#!/bin/bash

static_files="
index.html
robots.txt
favicon.ico
assets/
css/
pages/
script/
zased/
"

site_dir="site/"

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
	for file in $static_files; do
		notify "copying ${file} to ${site_dir}"
		cp --recursive --update --preserve --force "$file" "$site_dir"
	done
}

call_script() {
	depth=$((depth + 1))
	. "$1"
	depth=$((depth - 1))
}

notify "Generating Badges Page..."

badges80="assets/img/badges/80x15/"
badges150="assets/img/badges/150x20/"
badges88="assets/img/badges/88x31/"
stamps="assets/img/badges/stamps/"

badges_file=$site_dir"/pages/badges.html"

# make folder and file if doesn't exist
if [ ! -d "$site_dir" ]; then
    notify "creating $badges_file" "info"
    mkdir -p "$site_dir" && touch "$badges_file"
fi

# always clear file
true > $badges_file

add_images() {
    path=$1
    id=$2
    echo "<div id=\"$id\" class=\"badge-box\">" >> $badges_file
    for badge in "$path"*; do
        echo "<img src=\"/$path${badge##*/}\" alt=\"${badge##*/}\" onmouseover=\"tooltip(this, '${badge##*/}')\" loading=\"lazy\">" >> $badges_file
    done
    echo '</div>' >> $badges_file
    echo '<hr>' >> $badges_file
}

add_images $badges80 "smol"
add_images $badges150 "skinny"
add_images $badges88 "normal"
add_images $stamps "stamps"
copy_static_files

notify "Build Complete" "success"
