// oaGLSLNoise with tests
const {
  angular,
  $
} = window;
angular
  .module("oaGLSLNoise", ["oaWebglHelpers"])
  .controller(
    "NoiseTestCtrl", [
      "$scope",
      "oaWebglHelpers",
      "oaWebglCanvas",
      "oaWebglProgram",
      "oaWebglShaderSource",
      function($scope, oaWebglHelpers, oaWebglCanvas, oaWebglProgram, oaWebglShaderSource) {
        var name = "sine-noise";
        var $canvas1 = $("#sine-noise");
        var options = {
          width: 512,
          height: 512
        };
        var Canvas1 = new oaWebglCanvas(name, $canvas1[0], options);
        var vertexSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`;
          })()
        );
        vertexSource.printShader();
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
void main() {
  gl_FragColor = vec4(vec3(rand(floor(gl_FragCoord.xy / u_resolution))), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        var attributes = {
          position: {
            name: "a_position"
          }
        };
        var uniforms = {
          seed: {
            name: "u_seed"
          },
          resolution: {
            name: 'u_resolution',
            value: 1
          }
        };
        var buffers = {
          positions: {
            name: "positions",
            data: [-1, -1,
              1, -1, -1, 1,
              1, 1,
            ],
            datatype: oaWebglHelpers.FLOAT32,
            target: "ARRAY_BUFFER",
            usage: "STATIC_DRAW",
            attribute: "position",
            numComponents: 2,
            type: "FLOAT",
            normalize: false,
            stride: 0,
            offset: 0
          },
          indices: {
            name: "indices",
            data: [
              0, 1, 2,
              2, 1, 3
            ],
            datatype: oaWebglHelpers.UINT16,
            target: "ELEMENT_ARRAY_BUFFER",
            usage: "STATIC_DRAW"
          }
        };
        var textures = {};
        var executor = function(gl) {
          console.log('executing');
          gl.clearColor(0, 0, 0, 1);
          gl.enable(gl.DEPTH_TEST);
          gl.clearDepth(-1.0);
          gl.depthFunc(gl.GEQUAL);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          this.pushAttribute(gl, "position");
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIndices);
          gl.useProgram(this.program);
          gl.uniform4fv(this.uSeed, new Float32Array([12.9898, 78.233, 35256.1646873, 43758.5453123]));
          gl.uniform1f(this.uResolution, this.uResolutionSpec.value);
          const offset = 0;
          const vertexCount = 3 * 2;
          //gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
          gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);
          console.log('executed');
        };
        var program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas1.registerProgram("main", program);
        Canvas1.draw();
        name = "sine-gradient-noise";
        var $canvas2 = $("#sine-gradient-noise");
        var Canvas2 = new oaWebglCanvas(name, $canvas2[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}
void main() {
  vec2 grad = randGrad(floor(gl_FragCoord.xy / u_resolution));
  gl_FragColor = vec4(grad * 0.5 + vec2(0.5), length(grad), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas2.registerProgram("main", program);
        Canvas2.draw();
        name = "perlin-sine-noise";
        var $canvas3 = $("#perlin-sine-noise");
        var Canvas3 = new oaWebglCanvas(name, $canvas3[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
float mix3(float x, float y, float a) {
  float a3 = a * a * (3.0 - 2.0 * a);
  return mix(x, y, a3);
}
float mix5(float x, float y, float a) {
  float a5 = a * a * a * (6.0 * a * a - 15.0 * a + 10.0);
  return mix(x, y, a5);
}
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution;
  vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  float sw = rand(l), se = rand(vec2(u.x, l.y));
  float nw = rand(vec2(l.x, u.y)), ne = rand(u);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  gl_FragColor = vec4(vec3(mix5(s, n, f.y)), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas3.registerProgram("main", program);
        uniforms.resolution.value = 16;
        Canvas3.draw();
        name = "perlin-sine-gradient-noise";
        var $canvas4 = $("#perlin-sine-gradient-noise");
        var Canvas4 = new oaWebglCanvas(name, $canvas4[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}
float mix3(float x, float y, float a) {
  float a3 = a * a * (3.0 - 2.0 * a);
  return mix(x, y, a3);
}
float mix5(float x, float y, float a) {
  float a5 = a * a * a * (6.0 * a * a - 15.0 * a + 10.0);
  return mix(x, y, a5);
}
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution;
  vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  vec2 vse = vec2(u.x, l.y), vnw = vec2(l.x, u.y);
  float sw = dot(randGrad(l), p - l), se = dot(randGrad(vse), p - vse);
  float nw = dot(randGrad(vnw), p - vnw), ne = dot(randGrad(u), p - u);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  gl_FragColor = vec4(vec3(mix5(s, n, f.y) * 0.5 + 0.5), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas4.registerProgram("main", program);
        Canvas4.draw();
        name = "simplices";
        var $canvas5 = $("#simplices");
        var Canvas5 = new oaWebglCanvas(name, $canvas5[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform float u_fseed;
uniform vec2 u_vseed;
uniform float u_resolution;
void main() {
  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
  vec2 op = gl_FragCoord.xy / u_resolution;
  vec2 ip = it * op;
  vec2 il = floor(ip);
  vec2 f = fract(ip);
  vec2 ol = t * il;
  vec2 oc;
  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);
  if(f.x + f.y < 1.0)
    oc = ol + vec2(0.5, sqrt(1.0 / 12.0));
  else
    oc = ol + vec2(1.0, sqrt(1.0 / 3.0));
  gl_FragColor = vec4(vec3(sqrt(0.5) - length(op - oc)), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas5.registerProgram("main", program);
        Canvas5.draw();
        name = "simplex-sine-noise";
        var $canvas6 = $("#simplex-sine-noise");
        var Canvas6 = new oaWebglCanvas(name, $canvas6[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
void main() {
  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
  vec2 op = gl_FragCoord.xy / u_resolution;
  vec2 ip = it * op;
  vec2 il = floor(ip);
  vec2 f = fract(ip);
  vec2 ol = t * il;
  vec2 oc, oc1, oc2, oc3;
  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);
  oc2 = ol + vec2(1.0, 0.0);
  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));
  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;
  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;
  if(f.x + f.y < 1.0) {
    oc1 = ol;
    x13 = -0.5;
    y13 = -sqrt(3.0 / 4.0);
  }
  else {
    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));
    x13 = 1.0;
    y13 = 0.0;
  }
  x13 = oc1.x - oc3.x;
  y13 = oc1.y - oc3.y;
  vec3 r = vec3(rand(oc1), rand(oc2), rand(oc3));
  //r = vec3(0.0, 0.0, 1.0);
  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
  //vec3 w = 1.0 / d;
  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
  w.z = 1.0 - w.x - w.y;
  vec3 w3 = w * w * (3.0 - 2.0 * w);
  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
  vec3 rv = r * w5;
  gl_FragColor = vec4(vec3((rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z)), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas6.registerProgram("main", program);
        uniforms.resolution.value = 16;
        Canvas6.draw();
        name = "simplex-sine-gradient-noise";
        var $canvas7 = $("#simplex-sine-gradient-noise");
        var Canvas7 = new oaWebglCanvas(name, $canvas7[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}
float noise(vec2 op) {
  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
  vec2 ip = it * op;
  vec2 il = floor(ip);
  vec2 f = fract(ip);
  vec2 ol = t * il;
  vec2 oc, oc1, oc2, oc3;
  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);
  oc2 = ol + vec2(1.0, 0.0);
  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));
  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;
  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;
  if(f.x + f.y < 1.0) {
    oc1 = ol;
    x13 = -0.5;
    y13 = -sqrt(3.0 / 4.0);
  }
  else {
    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));
    x13 = 1.0;
    y13 = 0.0;
  }
  x13 = oc1.x - oc3.x;
  y13 = oc1.y - oc3.y;
  vec3 r = vec3(dot(randGrad(oc1), op - oc1), dot(randGrad(oc2), op - oc2), dot(randGrad(oc3), op - oc3));
  //r = vec3(0.0, 0.0, 1.0);
  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
  //vec3 w = 1.0 / d;
  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
  w.z = 1.0 - w.x - w.y;
  vec3 w3 = w * w * (3.0 - 2.0 * w);
  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
  vec3 rv = r * w5;
  return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);
}
void main() {
  vec2 op = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(vec3(noise(op) * 0.5 + 0.5), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas7.registerProgram("main", program);
        Canvas7.draw();
        name = "wood";
        var $canvas8 = $("#wood");
        var Canvas8 = new oaWebglCanvas(name, $canvas8[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}
float noise(vec2 op) {
  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
  vec2 ip = it * op;
  vec2 il = floor(ip);
  vec2 f = fract(ip);
  vec2 ol = t * il;
  vec2 oc, oc1, oc2, oc3;
  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);
  oc2 = ol + vec2(1.0, 0.0);
  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));
  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;
  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;
  if(f.x + f.y < 1.0) {
    oc1 = ol;
    x13 = -0.5;
    y13 = -sqrt(3.0 / 4.0);
  }
  else {
    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));
    x13 = 1.0;
    y13 = 0.0;
  }
  x13 = oc1.x - oc3.x;
  y13 = oc1.y - oc3.y;
  vec3 r = vec3(dot(randGrad(oc1), op - oc1), dot(randGrad(oc2), op - oc2), dot(randGrad(oc3), op - oc3));
  //r = vec3(0.0, 0.0, 1.0);
  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
  //vec3 w = 1.0 / d;
  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
  w.z = 1.0 - w.x - w.y;
  vec3 w3 = w * w * (3.0 - 2.0 * w);
  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
  vec3 rv = r * w5;
  return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);
}
mat2 rot2(float a) {
  return mat2(cos(a), sin(a), -sin(a), cos(a));
}
float lines(vec2 p, float f, float o, float a, float s, vec2 l) {
  return smoothstep(l.x, l.y, a * sin(f * p.x + o) + s);
}
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution + vec2(256.0, 0.0);
  vec2 wp = p.yx * vec2(2.0, 1.0);
  float n = noise(p * vec2(0.25, pow(2.0, -6.0)));
  mat2 r = rot2((n + 1.0) * 0.01);
  gl_FragColor = vec4(vec3(lines(vec2(0.0, 0.0), 3.14 / 2.0, 0.2 + n * 64.0, 0.5, 0.5, vec2(0.0, 0.9))), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas8.registerProgram("main", program);
        Canvas8.draw();
        name = "splatter";
        var $canvas9 = $("#splatter");
        var Canvas9 = new oaWebglCanvas(name, $canvas9[0], options);
        var fragmentSource = new oaWebglShaderSource(
          (() => {
            return `precision mediump float;
uniform vec4 u_seed;
uniform float u_resolution;
float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}
float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}
vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}
float noise(vec2 op) {
  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
  vec2 ip = it * op;
  vec2 il = floor(ip);
  vec2 f = fract(ip);
  vec2 ol = t * il;
  vec2 oc, oc1, oc2, oc3;
  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);
  oc2 = ol + vec2(1.0, 0.0);
  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));
  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;
  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;
  if(f.x + f.y < 1.0) {
    oc1 = ol;
    x13 = -0.5;
    y13 = -sqrt(3.0 / 4.0);
  }
  else {
    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));
    x13 = 1.0;
    y13 = 0.0;
  }
  x13 = oc1.x - oc3.x;
  y13 = oc1.y - oc3.y;
  vec3 r = vec3(dot(randGrad(oc1), op - oc1), dot(randGrad(oc2), op - oc2), dot(randGrad(oc3), op - oc3));
  //r = vec3(0.0, 0.0, 1.0);
  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
  //vec3 w = 1.0 / d;
  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
  w.z = 1.0 - w.x - w.y;
  vec3 w3 = w * w * (3.0 - 2.0 * w);
  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
  vec3 rv = r * w5;
  return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);
}
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution;
  float s1 = noise(p / 4.0) * 0.5 + 0.5;
  //vec2 sp = p + s1;
  float s2 = (1.0 - s1) * 0.7 + (noise(p) * 0.5 + 0.5) * 0.3;
  float g1 = smoothstep(0.18, 0.2, s1 * s1);
  float g2 = smoothstep(0.14, 0.16, s2 * s2);
  float g3 = smoothstep(0.18, 0.25, s2 * s2);
  float g4 = 1.0 + g3 - g2;
  gl_FragColor = vec4(vec3(s1 * s1), 1.0);
  gl_FragColor = vec4(vec3(s2 * s2), 1.0);
  gl_FragColor = vec4(vec3(g2 * g2), 1.0);
  gl_FragColor = vec4(vec3(g3 * g3), 1.0);
  gl_FragColor = vec4(g1 * vec3(g4 * g4), 1.0);
}`;
          })()
        );
        fragmentSource.printShader();
        program = new oaWebglProgram({
          vertexSource,
          fragmentSource,
          attributes,
          uniforms,
          buffers,
          textures,
          executor
        });
        Canvas9.registerProgram("main", program);
        uniforms.resolution.value = 32;
        Canvas9.draw();
      }
    ]
  );
