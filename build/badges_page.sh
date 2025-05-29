#!/bin/bash

notify "Generating Badges Page..."

badges80="assets/img/badges/80x15/"
badges150="assets/img/badges/150x20/"
badges88="assets/img/badges/88x31/"
stamps="assets/img/badges/stamps/"

site_dir="site/pages/"

outfile=$site_dir"badges.html"

# make folder and file if doesn't exist
if [ ! -d "$site_dir" ]; then
    notify "creating $outfile" "info"
    mkdir -p "$site_dir" && touch "$outfile"
fi

# always clear file
true > $outfile

add_images() {
    path=$1
    id=$2
    echo "<div id=\"$id\" class=\"badge-box\">" >> $outfile
    for badge in "$path"*; do
        echo "<img src=\"/$path${badge##*/}\" alt=\"${badge##*/}\" onmouseover=\"tooltip(this, '${badge##*/}')\" loading=\"lazy\">" >> $outfile
    done
    echo '</div>' >> $outfile
    echo '<hr/>' >> $outfile
}

add_images $badges80 "smol"
add_images $badges150 "skinny"
add_images $badges88 "normal"
add_images $stamps "stamps"
