#!/bin/bash

sass scss/style.scss css/style.css
sass scss/layout.scss css/layout.css
sass scss/vector-picker.scss css/vector-picker.css
npx babel babel/index.babel --out-file js/index.js
npx babel babel/layout.babel --out-file js/layout.js
npx babel babel/vector-picker.babel --out-file js/vector-picker.js
haml index.haml index.tmp.html
haml layout.haml layout.tmp.html
haml vector-picker.haml vector-picker.tmp.html
haml app.haml app.html
haml layout.app.haml layout.app.html
haml vector-picker.app.haml vector-picker.app.html
awk '/###marker###/ { system ( "cat app.html" ) } !/###marker###/ { print; }' index.tmp.html > index.html
awk '/###marker###/ { system ( "cat layout.app.html" ) } !/###marker###/ { print; }' layout.tmp.html > layout.html
awk '/###marker###/ { system ( "cat vector-picker.app.html" ) } !/###marker###/ { print; }' vector-picker.tmp.html > vector-picker.html
