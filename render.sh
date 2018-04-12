haml oa-blender-input.app.haml oa-blender-input.app.html
haml oa-blender-input.templates.haml oa-blender-input.templates.html
npx sass oa-blender-input.scss oa-blender-input.css
npx babel oa-util.es6 --out-file oa-util.js
npx babel oa-validator.es6 --out-file oa-validator.js
npx babel oa-blender-input.es6 --out-file oa-blender-input.js
haml oa-blender-input.haml oa-blender-input.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-input.app.html" ) } !/###body###/ { print; }' oa-blender-input.tmp1.html > oa-blender-input.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-input.templates.html" ) } !/###temp###/ { print; }' oa-blender-input.tmp2.html > oa-blender-input.html
rm oa-blender-input.tmp1.html oa-blender-input.tmp2.html
haml oa-blender-view.app.haml oa-blender-view.app.html
haml oa-blender-view.templates.haml oa-blender-view.templates.html
npx sass oa-blender-view.scss oa-blender-view.css
npx babel oa-linear-algebra.es6 --out-file oa-linear-algebra.js
npx babel oa-sylvester.es6 --out-file oa-sylvester.js
npx babel oa-webgl-helpers.es6 --out-file oa-webgl-helpers.js
npx babel oa-blender-view.es6 --out-file oa-blender-view.js
haml oa-blender-view.haml oa-blender-view.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-view.app.html" ) } !/###body###/ { print; }' oa-blender-view.tmp1.html > oa-blender-view.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-view.templates.html" ) } !/###temp###/ { print; }' oa-blender-view.tmp2.html > oa-blender-view.html
rm oa-blender-view.tmp1.html oa-blender-view.tmp2.html
haml oa-vector-picker.app.haml oa-vector-picker.app.html
haml oa-vector-picker.templates.haml oa-vector-picker.templates.html
npx sass oa-vector-picker.scss oa-vector-picker.css
npx babel oa-vector-picker.es6 --out-file oa-vector-picker.js
haml oa-vector-picker.haml oa-vector-picker.tmp1.html
awk '/###body###/ { system ( "cat oa-vector-picker.app.html" ) } !/###body###/ { print; }' oa-vector-picker.tmp1.html > oa-vector-picker.tmp2.html
awk '/###temp###/ { system ( "cat oa-vector-picker.templates.html" ) } !/###temp###/ { print; }' oa-vector-picker.tmp2.html > oa-vector-picker.html
rm oa-vector-picker.tmp1.html oa-vector-picker.tmp2.html
haml oa-fractal-generator.app.haml oa-fractal-generator.app.html
haml oa-fractal-generator.templates.haml oa-fractal-generator.templates.html
npx sass oa-fractal-generator.scss oa-fractal-generator.css
npx babel oa-fractal-generator.es6 --out-file oa-fractal-generator.js
haml oa-fractal-generator.haml oa-fractal-generator.tmp1.html
awk '/###body###/ { system ( "cat oa-fractal-generator.app.html" ) } !/###body###/ { print; }' oa-fractal-generator.tmp1.html > oa-fractal-generator.tmp2.html
awk '/###temp###/ { system ( "cat oa-fractal-generator.templates.html" ) } !/###temp###/ { print; }' oa-fractal-generator.tmp2.html > oa-fractal-generator.html
rm oa-fractal-generator.tmp1.html oa-fractal-generator.tmp2.html
haml oa-util.check.app.haml oa-util.check.app.html
npx sass oa-util.check.scss oa-util.check.css
npx babel oa-util.check.es6 --out-file oa-util.check.js
haml oa-util.check.haml oa-util.check.tmp.html
awk '/###body###/ { system ( "cat oa-util.check.app.html" ) } !/###body###/ { print; }' oa-util.check.tmp.html > oa-util.check.html
rm oa-util.check.tmp.html
haml oa-validator.check.app.haml oa-validator.check.app.html
npx sass oa-validator.check.scss oa-validator.check.css
npx babel oa-validator.check.es6 --out-file oa-validator.check.js
haml oa-validator.check.haml oa-validator.check.tmp.html
awk '/###body###/ { system ( "cat oa-validator.check.app.html" ) } !/###body###/ { print; }' oa-validator.check.tmp.html > oa-validator.check.html
rm oa-validator.check.tmp.html
haml oa-math.check.app.haml oa-math.check.app.html
npx sass oa-math.check.scss oa-math.check.css
npx babel oa-math.check.es6 --out-file oa-math.check.js
npx babel oa-math.es6 --out-file oa-math.js
haml oa-math.check.haml oa-math.check.tmp.html
awk '/###body###/ { system ( "cat oa-math.check.app.html" ) } !/###body###/ { print; }' oa-math.check.tmp.html > oa-math.check.html
rm oa-math.check.tmp.html
haml oa-linear-algebra.check.app.haml oa-linear-algebra.check.app.html
npx sass oa-linear-algebra.check.scss oa-linear-algebra.check.css
npx babel oa-linear-algebra.check.es6 --out-file oa-linear-algebra.check.js
haml oa-linear-algebra.check.haml oa-linear-algebra.check.tmp.html
awk '/###body###/ { system ( "cat oa-linear-algebra.check.app.html" ) } !/###body###/ { print; }' oa-linear-algebra.check.tmp.html > oa-linear-algebra.check.html
rm oa-linear-algebra.check.tmp.html
haml oa-sylvester.check.app.haml oa-sylvester.check.app.html
npx sass oa-sylvester.check.scss oa-sylvester.check.css
npx babel oa-sylvester.check.es6 --out-file oa-sylvester.check.js
haml oa-sylvester.check.haml oa-sylvester.check.tmp.html
awk '/###body###/ { system ( "cat oa-sylvester.check.app.html" ) } !/###body###/ { print; }' oa-sylvester.check.tmp.html > oa-sylvester.check.html
rm oa-sylvester.check.tmp.html
haml oa-webgl-helpers.check.app.haml oa-webgl-helpers.check.app.html
npx sass oa-webgl-helpers.check.scss oa-webgl-helpers.check.css
npx babel oa-webgl-helpers.check.es6 --out-file oa-webgl-helpers.check.js
haml oa-webgl-helpers.check.haml oa-webgl-helpers.check.tmp.html
awk '/###body###/ { system ( "cat oa-webgl-helpers.check.app.html" ) } !/###body###/ { print; }' oa-webgl-helpers.check.tmp.html > oa-webgl-helpers.check.html
rm oa-webgl-helpers.check.tmp.html
haml oa-mesh.check.app.haml oa-mesh.check.app.html
npx sass oa-mesh.check.scss oa-mesh.check.css
npx babel oa-mesh.check.es6 --out-file oa-mesh.check.js
npx babel oa-mesh.es6 --out-file oa-mesh.js
haml oa-mesh.check.haml oa-mesh.check.tmp.html
awk '/###body###/ { system ( "cat oa-mesh.check.app.html" ) } !/###body###/ { print; }' oa-mesh.check.tmp.html > oa-mesh.check.html
rm oa-mesh.check.tmp.html
haml oa-gl-noise.check.app.haml oa-gl-noise.check.app.html
npx sass oa-gl-noise.check.scss oa-gl-noise.check.css
npx babel oa-gl-noise.check.es6 --out-file oa-gl-noise.check.js
npx babel oa-gl-noise.es6 --out-file oa-gl-noise.js
haml oa-gl-noise.check.haml oa-gl-noise.check.tmp.html
awk '/###body###/ { system ( "cat oa-gl-noise.check.app.html" ) } !/###body###/ { print; }' oa-gl-noise.check.tmp.html > oa-gl-noise.check.html
rm oa-gl-noise.check.tmp.html
haml oa-blender-input.check.app.haml oa-blender-input.check.app.html
npx sass oa-blender-input.check.scss oa-blender-input.check.css
npx babel oa-blender-input.check.es6 --out-file oa-blender-input.check.js
haml oa-blender-input.check.haml oa-blender-input.check.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-input.check.app.html" ) } !/###body###/ { print; }' oa-blender-input.check.tmp1.html > oa-blender-input.check.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-input.templates.html" ) } !/###temp###/ { print; }' oa-blender-input.check.tmp2.html > oa-blender-input.check.html
rm oa-blender-input.check.tmp1.html oa-blender-input.check.tmp2.html
haml oa-blender-view.check.app.haml oa-blender-view.check.app.html
npx sass oa-blender-view.check.scss oa-blender-view.check.css
npx babel oa-blender-view.check.es6 --out-file oa-blender-view.check.js
haml oa-blender-view.check.haml oa-blender-view.check.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-view.check.app.html" ) } !/###body###/ { print; }' oa-blender-view.check.tmp1.html > oa-blender-view.check.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-view.templates.html" ) } !/###temp###/ { print; }' oa-blender-view.check.tmp2.html > oa-blender-view.check.html
rm oa-blender-view.check.tmp1.html oa-blender-view.check.tmp2.html
haml oa-vector-picker.check.app.haml oa-vector-picker.check.app.html
npx sass oa-vector-picker.check.scss oa-vector-picker.check.css
npx babel oa-vector-picker.check.es6 --out-file oa-vector-picker.check.js
haml oa-vector-picker.check.haml oa-vector-picker.check.tmp1.html
awk '/###body###/ { system ( "cat oa-vector-picker.check.app.html" ) } !/###body###/ { print; }' oa-vector-picker.check.tmp1.html > oa-vector-picker.check.tmp2.html
awk '/###temp###/ { system ( "cat oa-vector-picker.templates.html" ) } !/###temp###/ { print; }' oa-vector-picker.check.tmp2.html > oa-vector-picker.check.html
rm oa-vector-picker.check.tmp1.html oa-vector-picker.check.tmp2.html
haml oa-fractal-generator.check.app.haml oa-fractal-generator.check.app.html
npx sass oa-fractal-generator.check.scss oa-fractal-generator.check.css
npx babel oa-fractal-generator.check.es6 --out-file oa-fractal-generator.check.js
haml oa-fractal-generator.check.haml oa-fractal-generator.check.tmp1.html
awk '/###body###/ { system ( "cat oa-fractal-generator.check.app.html" ) } !/###body###/ { print; }' oa-fractal-generator.check.tmp1.html > oa-fractal-generator.check.tmp2.html
awk '/###temp###/ { system ( "cat oa-fractal-generator.templates.html" ) } !/###temp###/ { print; }' oa-fractal-generator.check.tmp2.html > oa-fractal-generator.check.html
rm oa-fractal-generator.check.tmp1.html oa-fractal-generator.check.tmp2.html
haml oa-util.demo.app.haml oa-util.demo.app.html
npx sass oa-util.demo.scss oa-util.demo.css
npx babel oa-util.demo.es6 --out-file oa-util.demo.js
haml oa-util.demo.haml oa-util.demo.tmp.html
awk '/###body###/ { system ( "cat oa-util.demo.app.html" ) } !/###body###/ { print; }' oa-util.demo.tmp.html > oa-util.demo.html
rm oa-util.demo.tmp.html
haml oa-validator.demo.app.haml oa-validator.demo.app.html
npx sass oa-validator.demo.scss oa-validator.demo.css
npx babel oa-validator.demo.es6 --out-file oa-validator.demo.js
haml oa-validator.demo.haml oa-validator.demo.tmp.html
awk '/###body###/ { system ( "cat oa-validator.demo.app.html" ) } !/###body###/ { print; }' oa-validator.demo.tmp.html > oa-validator.demo.html
rm oa-validator.demo.tmp.html
haml oa-math.demo.app.haml oa-math.demo.app.html
npx sass oa-math.demo.scss oa-math.demo.css
npx babel oa-math.demo.es6 --out-file oa-math.demo.js
haml oa-math.demo.haml oa-math.demo.tmp.html
awk '/###body###/ { system ( "cat oa-math.demo.app.html" ) } !/###body###/ { print; }' oa-math.demo.tmp.html > oa-math.demo.html
rm oa-math.demo.tmp.html
haml oa-linear-algebra.demo.app.haml oa-linear-algebra.demo.app.html
npx sass oa-linear-algebra.demo.scss oa-linear-algebra.demo.css
npx babel oa-linear-algebra.demo.es6 --out-file oa-linear-algebra.demo.js
haml oa-linear-algebra.demo.haml oa-linear-algebra.demo.tmp.html
awk '/###body###/ { system ( "cat oa-linear-algebra.demo.app.html" ) } !/###body###/ { print; }' oa-linear-algebra.demo.tmp.html > oa-linear-algebra.demo.html
rm oa-linear-algebra.demo.tmp.html
haml oa-sylvester.demo.app.haml oa-sylvester.demo.app.html
npx sass oa-sylvester.demo.scss oa-sylvester.demo.css
npx babel oa-sylvester.demo.es6 --out-file oa-sylvester.demo.js
haml oa-sylvester.demo.haml oa-sylvester.demo.tmp.html
awk '/###body###/ { system ( "cat oa-sylvester.demo.app.html" ) } !/###body###/ { print; }' oa-sylvester.demo.tmp.html > oa-sylvester.demo.html
rm oa-sylvester.demo.tmp.html
haml oa-webgl-helpers.demo.app.haml oa-webgl-helpers.demo.app.html
npx sass oa-webgl-helpers.demo.scss oa-webgl-helpers.demo.css
npx babel oa-webgl-helpers.demo.es6 --out-file oa-webgl-helpers.demo.js
haml oa-webgl-helpers.demo.haml oa-webgl-helpers.demo.tmp.html
awk '/###body###/ { system ( "cat oa-webgl-helpers.demo.app.html" ) } !/###body###/ { print; }' oa-webgl-helpers.demo.tmp.html > oa-webgl-helpers.demo.html
rm oa-webgl-helpers.demo.tmp.html
haml oa-mesh.demo.app.haml oa-mesh.demo.app.html
npx sass oa-mesh.demo.scss oa-mesh.demo.css
npx babel oa-mesh.demo.es6 --out-file oa-mesh.demo.js
haml oa-mesh.demo.haml oa-mesh.demo.tmp.html
awk '/###body###/ { system ( "cat oa-mesh.demo.app.html" ) } !/###body###/ { print; }' oa-mesh.demo.tmp.html > oa-mesh.demo.html
rm oa-mesh.demo.tmp.html
haml oa-gl-noise.demo.app.haml oa-gl-noise.demo.app.html
npx sass oa-gl-noise.demo.scss oa-gl-noise.demo.css
npx babel oa-gl-noise.demo.es6 --out-file oa-gl-noise.demo.js
haml oa-gl-noise.demo.haml oa-gl-noise.demo.tmp.html
awk '/###body###/ { system ( "cat oa-gl-noise.demo.app.html" ) } !/###body###/ { print; }' oa-gl-noise.demo.tmp.html > oa-gl-noise.demo.html
rm oa-gl-noise.demo.tmp.html
haml oa-blender-input.demo.app.haml oa-blender-input.demo.app.html
npx sass oa-blender-input.demo.scss oa-blender-input.demo.css
npx babel oa-blender-input.demo.es6 --out-file oa-blender-input.demo.js
haml oa-blender-input.demo.haml oa-blender-input.demo.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-input.demo.app.html" ) } !/###body###/ { print; }' oa-blender-input.demo.tmp1.html > oa-blender-input.demo.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-input.templates.html" ) } !/###temp###/ { print; }' oa-blender-input.demo.tmp2.html > oa-blender-input.demo.html
rm oa-blender-input.demo.tmp1.html oa-blender-input.demo.tmp2.html
haml oa-blender-view.demo.app.haml oa-blender-view.demo.app.html
npx sass oa-blender-view.demo.scss oa-blender-view.demo.css
npx babel oa-blender-view.demo.es6 --out-file oa-blender-view.demo.js
haml oa-blender-view.demo.haml oa-blender-view.demo.tmp1.html
awk '/###body###/ { system ( "cat oa-blender-view.demo.app.html" ) } !/###body###/ { print; }' oa-blender-view.demo.tmp1.html > oa-blender-view.demo.tmp2.html
awk '/###temp###/ { system ( "cat oa-blender-view.templates.html" ) } !/###temp###/ { print; }' oa-blender-view.demo.tmp2.html > oa-blender-view.demo.html
rm oa-blender-view.demo.tmp1.html oa-blender-view.demo.tmp2.html
haml oa-vector-picker.demo.app.haml oa-vector-picker.demo.app.html
npx sass oa-vector-picker.demo.scss oa-vector-picker.demo.css
npx babel oa-vector-picker.demo.es6 --out-file oa-vector-picker.demo.js
haml oa-vector-picker.demo.haml oa-vector-picker.demo.tmp1.html
awk '/###body###/ { system ( "cat oa-vector-picker.demo.app.html" ) } !/###body###/ { print; }' oa-vector-picker.demo.tmp1.html > oa-vector-picker.demo.tmp2.html
awk '/###temp###/ { system ( "cat oa-vector-picker.templates.html" ) } !/###temp###/ { print; }' oa-vector-picker.demo.tmp2.html > oa-vector-picker.demo.html
rm oa-vector-picker.demo.tmp1.html oa-vector-picker.demo.tmp2.html
haml oa-fractal-generator.demo.app.haml oa-fractal-generator.demo.app.html
npx sass oa-fractal-generator.demo.scss oa-fractal-generator.demo.css
npx babel oa-fractal-generator.demo.es6 --out-file oa-fractal-generator.demo.js
haml oa-fractal-generator.demo.haml oa-fractal-generator.demo.tmp1.html
awk '/###body###/ { system ( "cat oa-fractal-generator.demo.app.html" ) } !/###body###/ { print; }' oa-fractal-generator.demo.tmp1.html > oa-fractal-generator.demo.tmp2.html
awk '/###temp###/ { system ( "cat oa-fractal-generator.templates.html" ) } !/###temp###/ { print; }' oa-fractal-generator.demo.tmp2.html > oa-fractal-generator.demo.html
rm oa-fractal-generator.demo.tmp1.html oa-fractal-generator.demo.tmp2.html
