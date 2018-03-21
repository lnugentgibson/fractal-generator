#!/bin/bash

sass scss/style.scss css/style.css
haml app.haml app.html && haml index.haml tmp.html
awk '/###marker###/ { system ( "cat app.html" ) } !/###marker###/ { print; }' tmp.html > index.html