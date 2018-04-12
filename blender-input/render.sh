sass blender-input/style.scss blender-input/style.css
npx babel blender-input/script.babel --out-file blender-input/script.js
haml blender-input/index.haml blender-input/index.tmp.html
haml blender-input/app.haml blender-input/app.html
awk '/###marker###/ { system ( "cat blender-input/app.html" ) } !/###marker###/ { print; }' blender-input/index.tmp.html > blender-input/index.html