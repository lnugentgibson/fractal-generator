touch util.es6
#npx babel util.es6 --out-file util.js
touch validator.es6
#npx babel validator.es6 --out-file validator.js
touch blender-input.es6
#npx babel blender-input.es6 --out-file blender-input.js
touch linear-algebra.es6
#npx babel linear-algebra.es6 --out-file linear-algebra.js
touch sylvester.es6
#npx babel sylvester.es6 --out-file sylvester.js
touch webgl-helpers.es6
#npx babel webgl-helpers.es6 --out-file webgl-helpers.js
touch mesh.es6
#npx babel mesh.es6 --out-file mesh.js
touch gl-noise.es6
#npx babel gl-noise.es6 --out-file gl-noise.js
touch blender-view.es6
#npx babel blender-view.es6 --out-file blender-view.js
touch vector-picker.es6
#npx babel vector-picker.es6 --out-file vector-picker.js
touch fractal-generator.es6
#npx babel fractal-generator.es6 --out-file fractal-generator.js
touch blender-input.templates.haml
#haml blender-input.templates.haml blender-input.templates.html
touch blender-view.templates.haml
#haml blender-view.templates.haml blender-view.templates.html
touch vector-picker.templates.haml
#haml vector-picker.templates.haml vector-picker.templates.html
touch fractal-generator.templates.haml
#haml fractal-generator.templates.haml fractal-generator.templates.html
touch util.check.es6
#npx babel util.check.es6 --out-file util.check.js
touch validator.check.es6
#npx babel validator.check.es6 --out-file validator.check.js
touch blender-input.check.es6
#npx babel blender-input.check.es6 --out-file blender-input.check.js
touch linear-algebra.check.es6
#npx babel linear-algebra.check.es6 --out-file linear-algebra.check.js
touch sylvester.check.es6
#npx babel sylvester.check.es6 --out-file sylvester.check.js
touch webgl-helpers.check.es6
#npx babel webgl-helpers.check.es6 --out-file webgl-helpers.check.js
touch mesh.check.es6
#npx babel mesh.check.es6 --out-file mesh.check.js
touch gl-noise.check.es6
#npx babel gl-noise.check.es6 --out-file gl-noise.check.js
touch blender-view.check.es6
#npx babel blender-view.check.es6 --out-file blender-view.check.js
touch vector-picker.check.es6
#npx babel vector-picker.check.es6 --out-file vector-picker.check.js
touch fractal-generator.check.es6
#npx babel fractal-generator.check.es6 --out-file fractal-generator.check.js
touch util.check.scss
#npx sass util.check.scss util.check.css
touch validator.check.scss
#npx sass validator.check.scss validator.check.css
touch blender-input.check.scss
#npx sass blender-input.check.scss blender-input.check.css
touch linear-algebra.check.scss
#npx sass linear-algebra.check.scss linear-algebra.check.css
touch sylvester.check.scss
#npx sass sylvester.check.scss sylvester.check.css
touch webgl-helpers.check.scss
#npx sass webgl-helpers.check.scss webgl-helpers.check.css
touch mesh.check.scss
#npx sass mesh.check.scss mesh.check.css
touch gl-noise.check.scss
#npx sass gl-noise.check.scss gl-noise.check.css
touch blender-view.check.scss
#npx sass blender-view.check.scss blender-view.check.css
touch vector-picker.check.scss
#npx sass vector-picker.check.scss vector-picker.check.css
touch fractal-generator.check.scss
#npx sass fractal-generator.check.scss fractal-generator.check.css
touch util.check.haml
touch util.check.app.haml
#haml util.check.app.haml util.check.app.html
#haml util.check.haml util.check.tmp.html
#awk '/###marker###/ { system ( "cat util.check.app.html" ) } !/###marker###/ { print; }' util.check.tmp.html > util.check.html
touch validator.check.haml
touch validator.check.app.haml
#haml validator.check.app.haml validator.check.app.html
#haml validator.check.haml validator.check.tmp.html
#awk '/###marker###/ { system ( "cat validator.check.app.html" ) } !/###marker###/ { print; }' validator.check.tmp.html > validator.check.html
touch blender-input.check.haml
touch blender-input.check.app.haml
#haml blender-input.check.app.haml blender-input.check.app.html
#haml blender-input.check.haml blender-input.check.tmp.html
#awk '/###marker###/ { system ( "cat blender-input.check.app.html" ) } !/###marker###/ { print; }' blender-input.check.tmp.html > blender-input.check.html
touch linear-algebra.check.haml
touch linear-algebra.check.app.haml
#haml linear-algebra.check.app.haml linear-algebra.check.app.html
#haml linear-algebra.check.haml linear-algebra.check.tmp.html
#awk '/###marker###/ { system ( "cat linear-algebra.check.app.html" ) } !/###marker###/ { print; }' linear-algebra.check.tmp.html > linear-algebra.check.html
touch sylvester.check.haml
touch sylvester.check.app.haml
#haml sylvester.check.app.haml sylvester.check.app.html
#haml sylvester.check.haml sylvester.check.tmp.html
#awk '/###marker###/ { system ( "cat sylvester.check.app.html" ) } !/###marker###/ { print; }' sylvester.check.tmp.html > sylvester.check.html
touch webgl-helpers.check.haml
touch webgl-helpers.check.app.haml
#haml webgl-helpers.check.app.haml webgl-helpers.check.app.html
#haml webgl-helpers.check.haml webgl-helpers.check.tmp.html
#awk '/###marker###/ { system ( "cat webgl-helpers.check.app.html" ) } !/###marker###/ { print; }' webgl-helpers.check.tmp.html > webgl-helpers.check.html
touch mesh.check.haml
touch mesh.check.app.haml
#haml mesh.check.app.haml mesh.check.app.html
#haml mesh.check.haml mesh.check.tmp.html
#awk '/###marker###/ { system ( "cat mesh.check.app.html" ) } !/###marker###/ { print; }' mesh.check.tmp.html > mesh.check.html
touch gl-noise.check.haml
touch gl-noise.check.app.haml
#haml gl-noise.check.app.haml gl-noise.check.app.html
#haml gl-noise.check.haml gl-noise.check.tmp.html
#awk '/###marker###/ { system ( "cat gl-noise.check.app.html" ) } !/###marker###/ { print; }' gl-noise.check.tmp.html > gl-noise.check.html
touch blender-view.check.haml
touch blender-view.check.app.haml
#haml blender-view.check.app.haml blender-view.check.app.html
#haml blender-view.check.haml blender-view.check.tmp.html
#awk '/###marker###/ { system ( "cat blender-view.check.app.html" ) } !/###marker###/ { print; }' blender-view.check.tmp.html > blender-view.check.html
touch vector-picker.check.haml
touch vector-picker.check.app.haml
#haml vector-picker.check.app.haml vector-picker.check.app.html
#haml vector-picker.check.haml vector-picker.check.tmp.html
#awk '/###marker###/ { system ( "cat vector-picker.check.app.html" ) } !/###marker###/ { print; }' vector-picker.check.tmp.html > vector-picker.check.html
touch fractal-generator.check.haml
touch fractal-generator.check.app.haml
#haml fractal-generator.check.app.haml fractal-generator.check.app.html
#haml fractal-generator.check.haml fractal-generator.check.tmp.html
#awk '/###marker###/ { system ( "cat fractal-generator.check.app.html" ) } !/###marker###/ { print; }' fractal-generator.check.tmp.html > fractal-generator.check.html
touch util.demo.es6
#npx babel util.demo.es6 --out-file util.demo.js
touch validator.demo.es6
#npx babel validator.demo.es6 --out-file validator.demo.js
touch blender-input.demo.es6
#npx babel blender-input.demo.es6 --out-file blender-input.demo.js
touch linear-algebra.demo.es6
#npx babel linear-algebra.demo.es6 --out-file linear-algebra.demo.js
touch sylvester.demo.es6
#npx babel sylvester.demo.es6 --out-file sylvester.demo.js
touch webgl-helpers.demo.es6
#npx babel webgl-helpers.demo.es6 --out-file webgl-helpers.demo.js
touch mesh.demo.es6
#npx babel mesh.demo.es6 --out-file mesh.demo.js
touch gl-noise.demo.es6
#npx babel gl-noise.demo.es6 --out-file gl-noise.demo.js
touch blender-view.demo.es6
#npx babel blender-view.demo.es6 --out-file blender-view.demo.js
touch vector-picker.demo.es6
#npx babel vector-picker.demo.es6 --out-file vector-picker.demo.js
touch fractal-generator.demo.es6
#npx babel fractal-generator.demo.es6 --out-file fractal-generator.demo.js
touch util.demo.scss
#npx sass util.demo.scss util.demo.css
touch validator.demo.scss
#npx sass validator.demo.scss validator.demo.css
touch blender-input.demo.scss
#npx sass blender-input.demo.scss blender-input.demo.css
touch linear-algebra.demo.scss
#npx sass linear-algebra.demo.scss linear-algebra.demo.css
touch sylvester.demo.scss
#npx sass sylvester.demo.scss sylvester.demo.css
touch webgl-helpers.demo.scss
#npx sass webgl-helpers.demo.scss webgl-helpers.demo.css
touch mesh.demo.scss
#npx sass mesh.demo.scss mesh.demo.css
touch gl-noise.demo.scss
#npx sass gl-noise.demo.scss gl-noise.demo.css
touch blender-view.demo.scss
#npx sass blender-view.demo.scss blender-view.demo.css
touch vector-picker.demo.scss
#npx sass vector-picker.demo.scss vector-picker.demo.css
touch fractal-generator.demo.scss
#npx sass fractal-generator.demo.scss fractal-generator.demo.css
touch util.demo.haml
touch util.demo.app.haml
#haml util.demo.app.haml util.demo.app.html
#haml util.demo.haml util.demo.tmp.html
#awk '/###marker###/ { system ( "cat util.demo.app.html" ) } !/###marker###/ { print; }' util.demo.tmp.html > util.demo.html
touch validator.demo.haml
touch validator.demo.app.haml
#haml validator.demo.app.haml validator.demo.app.html
#haml validator.demo.haml validator.demo.tmp.html
#awk '/###marker###/ { system ( "cat validator.demo.app.html" ) } !/###marker###/ { print; }' validator.demo.tmp.html > validator.demo.html
touch blender-input.demo.haml
touch blender-input.demo.app.haml
#haml blender-input.demo.app.haml blender-input.demo.app.html
#haml blender-input.demo.haml blender-input.demo.tmp.html
#awk '/###marker###/ { system ( "cat blender-input.demo.app.html" ) } !/###marker###/ { print; }' blender-input.demo.tmp.html > blender-input.demo.html
touch linear-algebra.demo.haml
touch linear-algebra.demo.app.haml
#haml linear-algebra.demo.app.haml linear-algebra.demo.app.html
#haml linear-algebra.demo.haml linear-algebra.demo.tmp.html
#awk '/###marker###/ { system ( "cat linear-algebra.demo.app.html" ) } !/###marker###/ { print; }' linear-algebra.demo.tmp.html > linear-algebra.demo.html
touch sylvester.demo.haml
touch sylvester.demo.app.haml
#haml sylvester.demo.app.haml sylvester.demo.app.html
#haml sylvester.demo.haml sylvester.demo.tmp.html
#awk '/###marker###/ { system ( "cat sylvester.demo.app.html" ) } !/###marker###/ { print; }' sylvester.demo.tmp.html > sylvester.demo.html
touch webgl-helpers.demo.haml
touch webgl-helpers.demo.app.haml
#haml webgl-helpers.demo.app.haml webgl-helpers.demo.app.html
#haml webgl-helpers.demo.haml webgl-helpers.demo.tmp.html
#awk '/###marker###/ { system ( "cat webgl-helpers.demo.app.html" ) } !/###marker###/ { print; }' webgl-helpers.demo.tmp.html > webgl-helpers.demo.html
touch mesh.demo.haml
touch mesh.demo.app.haml
#haml mesh.demo.app.haml mesh.demo.app.html
#haml mesh.demo.haml mesh.demo.tmp.html
#awk '/###marker###/ { system ( "cat mesh.demo.app.html" ) } !/###marker###/ { print; }' mesh.demo.tmp.html > mesh.demo.html
touch gl-noise.demo.haml
touch gl-noise.demo.app.haml
#haml gl-noise.demo.app.haml gl-noise.demo.app.html
#haml gl-noise.demo.haml gl-noise.demo.tmp.html
#awk '/###marker###/ { system ( "cat gl-noise.demo.app.html" ) } !/###marker###/ { print; }' gl-noise.demo.tmp.html > gl-noise.demo.html
touch blender-view.demo.haml
touch blender-view.demo.app.haml
#haml blender-view.demo.app.haml blender-view.demo.app.html
#haml blender-view.demo.haml blender-view.demo.tmp.html
#awk '/###marker###/ { system ( "cat blender-view.demo.app.html" ) } !/###marker###/ { print; }' blender-view.demo.tmp.html > blender-view.demo.html
touch vector-picker.demo.haml
touch vector-picker.demo.app.haml
#haml vector-picker.demo.app.haml vector-picker.demo.app.html
#haml vector-picker.demo.haml vector-picker.demo.tmp.html
#awk '/###marker###/ { system ( "cat vector-picker.demo.app.html" ) } !/###marker###/ { print; }' vector-picker.demo.tmp.html > vector-picker.demo.html
touch fractal-generator.demo.haml
touch fractal-generator.demo.app.haml
#haml fractal-generator.demo.app.haml fractal-generator.demo.app.html
#haml fractal-generator.demo.haml fractal-generator.demo.tmp.html
#awk '/###marker###/ { system ( "cat fractal-generator.demo.app.html" ) } !/###marker###/ { print; }' fractal-generator.demo.tmp.html > fractal-generator.demo.html
touch blender-input.scss
#npx sass blender-input.scss blender-input.css
touch blender-view.scss
#npx sass blender-view.scss blender-view.css
touch vector-picker.scss
#npx sass vector-picker.scss vector-picker.css
touch fractal-generator.scss
#npx sass fractal-generator.scss fractal-generator.css
touch blender-input.haml
touch blender-input.app.haml
#haml blender-input.app.haml blender-input.app.html
#haml blender-input.haml blender-input.tmp.html
#awk '/###marker###/ { system ( "cat blender-input.app.html" ) } !/###marker###/ { print; }' blender-input.tmp.html > blender-input.html
touch blender-view.haml
touch blender-view.app.haml
#haml blender-view.app.haml blender-view.app.html
#haml blender-view.haml blender-view.tmp.html
#awk '/###marker###/ { system ( "cat blender-view.app.html" ) } !/###marker###/ { print; }' blender-view.tmp.html > blender-view.html
touch vector-picker.haml
touch vector-picker.app.haml
#haml vector-picker.app.haml vector-picker.app.html
#haml vector-picker.haml vector-picker.tmp.html
#awk '/###marker###/ { system ( "cat vector-picker.app.html" ) } !/###marker###/ { print; }' vector-picker.tmp.html > vector-picker.html
touch fractal-generator.haml
touch fractal-generator.app.haml
#haml fractal-generator.app.haml fractal-generator.app.html
#haml fractal-generator.haml fractal-generator.tmp.html
#awk '/###marker###/ { system ( "cat fractal-generator.app.html" ) } !/###marker###/ { print; }' fractal-generator.tmp.html > fractal-generator.html
