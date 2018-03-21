#!/bin/bash

sass scss/style.scss css/style.css
npx babel babel/index.babel --out-file js/index.js
haml app.haml app.html && haml index.haml tmp.html
awk '/###marker###/ { system ( "cat app.html" ) } !/###marker###/ { print; }' tmp.html > index.html