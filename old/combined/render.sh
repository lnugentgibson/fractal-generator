sass combined/style.scss combined/style.css
npx babel combined/script.babel --out-file combined/script.js
haml combined/index.haml combined/index.tmp.html
haml combined/app.haml combined/app.html
awk '/###marker###/ { system ( "cat combined/app.html" ) } !/###marker###/ { print; }' combined/index.tmp.html > combined/index.html