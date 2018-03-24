#!/bin/bash

sass scss/style.scss css/style.css
sass scss/layout.scss css/layout.css
sass scss/vector-picker.scss css/vector-picker.css
npx babel babel/index.babel --out-file js/index.js
npx babel babel/layout.babel --out-file js/layout.js
npx babel babel/vector-picker.babel --out-file js/vector-picker.js
haml index.haml tmp.html
haml app.haml app.html
haml layout.haml layout.tmp.html
haml vector-picker.haml vector-picker.tmp.html
awk '/###marker###/ { system ( "cat app.html" ) } !/###marker###/ { print; }' tmp.html > index.html
awk '/###marker###/ { system ( "cat layout.tmp.html" ) } !/###marker###/ { print; }' tmp.html > layout.html
awk '/###marker###/ { system ( "cat vector-picker.tmp.html" ) } !/###marker###/ { print; }' tmp.html > vector-picker.html