#!/usr/bin/env nu

use std repeat

def make-logger [
  depth: int = 0,
  min_level: string = "info"
] {
  let levels = {
    error: 50
    warn: 40
    success: 35
    info: 30
    debug: 20
    trace: 10
  }

  let colors = {
    error: (ansi red)
    warn: (ansi yellow)
    success: (ansi green)
    info: (ansi cyan)
    debug: (ansi purple)
    trace: (ansi white)
  }
  let max_level_len = (
      $colors
      | columns
      | each { str length }
      | math max
      )

  let min_value = ($levels | get $min_level)

  let log = {|msg: string, level: string = "info"|
    let value = ($levels | get $level)
    if $value < $min_value {
      return
    }

    let indent = ("┊ " | repeat ($depth) | str join)
    let timestamp = (date now | format date "%H:%M:%S%.3f")
    let color = ($colors | get $level)

    let timestamp = $"(ansi grey)[($timestamp)](ansi reset)"
    let level_indicator = $"($color)[($level | str upcase)](ansi reset)"
    let pad = ("" | fill --width ($max_level_len - ($level | str length)))
    let indent = $"(ansi grey)($indent)(ansi reset)"
    let message = $"($color)($msg)(ansi reset)"

    print $"($timestamp) ($level_indicator)($pad) ($indent)($message)"
  }

  $log
}

def with-task [label: string, block: closure] {
  let depth = ($env.TASK_DEPTH? | default 0)
  let level = ($env.LOG_LEVEL? | default "info")
  let log = (make-logger $depth $level)

  do $log $"▶ ($label)" "info"

  with-env {
    TASK_DEPTH: ($depth + 1)
  } {
    do $block
  }

  do $log $"✔ ($label)" "success"
}

let site_dir  = ("site" | path join "")
let pages_dir = ($site_dir | path join "pages")
let badges_outfile = ($pages_dir | path join "badges.html")

let badge_dirs = {
  smol:    ("assets" | path join "img" "badges" "80x15")
  skinny: ("assets" | path join "img" "badges" "150x20")
  normal: ("assets" | path join "img" "badges" "88x31")
  stamps: ("assets" | path join "img" "badges" "stamps")
}

def generate-badges-page [] {
  let depth = ($env.TASK_DEPTH? | default 0)
  let level = ($env.LOG_LEVEL? | default "info")
  let log = (make-logger $depth $level)

  do $log "Generating badges page…" "debug"

  if not ($pages_dir | path exists) {
    mkdir $pages_dir
  }

  "" | save --force $badges_outfile

  def add-images [path: string, id: string] {
    $"<div id=\"($id)\" class=\"badge-box\">" | save --append $badges_outfile

    ls $path
    | where type == file
    | sort-by name
    | each {|badge|
      let name = ($badge.name | path basename)
      let src = ($path | path join $name)
      ($"<img src=\"/($src)\" alt=\"($name)\" onmouseover=\"tooltip\(this, '($name)'\)\" loading=\"lazy\">")
      | save --append $badges_outfile
    }

    "</div>" | save --append $badges_outfile
    "<hr/>"  | save --append $badges_outfile
  }

  for key in ($badge_dirs | columns) {
    add-images ($badge_dirs | get $key) $key
  }
}

let static_files = [
  "index.html"
  "robots.txt"
  "favicon.ico"
  "assets"
  "css"
  "pages"
  "script"
  "zased"
]

def copy-static-files [] {
  let depth = ($env.TASK_DEPTH? | default 0)
  let level = ($env.LOG_LEVEL? | default "info")
  let log = (make-logger $depth $level)

  do $log "Copying static files…" "debug"

  if not ($site_dir | path exists) {
    mkdir $site_dir
  }

  for item in $static_files {
    do $log $"copying ($item)" "trace"
    cp --recursive --update $item $site_dir
  }
}

with-task "Build" {
  with-task "Generate badges page" {
    generate-badges-page
  }

  with-task "Copy static files" {
    copy-static-files
  }
}
