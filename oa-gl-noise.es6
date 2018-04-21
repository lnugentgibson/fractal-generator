// oaGLSLNoise with tests
const {
  angular
} = window;
angular
  .module('oaGLSLNoise', ['oaWebglHelpers'])
  .service('oaNoiseShaderFunctions', [
    'oaWebglShaderSnippet',
    'oaWebglFunctionSnippet',
    'oaWebglSnippet',
    function(oaWebglShaderSnippet, oaWebglFunctionSnippet, oaWebglSnippet) {
      // standardVertexShader
      {
        var standardVertexShader = new oaWebglShaderSnippet('standardVertexShader');
        standardVertexShader.variables.add('a_position', 'attribute', 'vec4');
        standardVertexShader.variables.apply();
        standardVertexShader.mainSnippet = new oaWebglSnippet('body', 'gl_Position = a_position;');
      }

      // randScalarFunction
      {
        var randScalarFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
        randScalarFunction.parameters.add('f', 'float');
        randScalarFunction.parameters.apply();
        randScalarFunction.bodySnippet = new oaWebglSnippet('body', 'return fract(sin(f + u_seed.z) * u_seed.w);');
      }

      // randScalarSeededFunction
      {
        var randScalarSeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
        randScalarSeededFunction.parameters.add('f', 'float');
        randScalarSeededFunction.parameters.add('s', 'vec4');
        randScalarSeededFunction.parameters.apply();
        randScalarSeededFunction.bodySnippet = new oaWebglSnippet('body', 'return fract(sin(f + s.z) * s.w);');
      }

      // randVectorFunction
      {
        var randVectorFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
        randVectorFunction.parameters.add('v', 'vec2');
        randVectorFunction.parameters.apply();
        randVectorFunction.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, u_seed.xy));');
      }

      // randVectorSeededFunction
      {
        var randVectorSeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
        randVectorSeededFunction.parameters.add('v', 'vec2');
        randVectorSeededFunction.parameters.add('s', 'vec4');
        randVectorSeededFunction.parameters.apply();
        randVectorSeededFunction.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, s.xy), s);');
      }

      // randGradFunction
      {
        var randGradFunction = new oaWebglFunctionSnippet('randGrad', 'vec2', 'snippet');
        randGradFunction.parameters.add('v', 'vec2');
        randGradFunction.parameters.apply();
        randGradFunction.bodySnippet = new oaWebglSnippet('body', `float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
return vec2(cos(a), sin(a));`);
      }

      // randGradSeededFunction
      {
        var randGradSeededFunction = new oaWebglFunctionSnippet('randGrad', 'vec2', 'snippet');
        randGradSeededFunction.parameters.add('v', 'vec2');
        randGradSeededFunction.parameters.add('s', 'vec4');
        randGradSeededFunction.parameters.apply();
        randGradSeededFunction.bodySnippet = new oaWebglSnippet('body', `float a = 2.0 * 3.14159265358 * rand(dot(v, s.xy), s);
return vec2(cos(a), sin(a));`);
      }

      // mix3Function
      {
        var mix3Function = new oaWebglFunctionSnippet('mix3', 'float', 'snippet');
        mix3Function.parameters.addMultiple([{
            paramname: 'x',
            datatype: 'float'
          },
          {
            paramname: 'y',
            datatype: 'float'
          },
          {
            paramname: 'a',
            datatype: 'float'
          }
        ]);
        mix3Function.parameters.apply();
        mix3Function.bodySnippet = new oaWebglSnippet('body', `float a3 = a * a * (3.0 - 2.0 * a);
return mix(x, y, a3);`);
      }

      // mix5Function
      {
        var mix5Function = new oaWebglFunctionSnippet('mix5', 'float', 'snippet');
        mix5Function.parameters.addMultiple([{
            paramname: 'x',
            datatype: 'float'
          },
          {
            paramname: 'y',
            datatype: 'float'
          },
          {
            paramname: 'a',
            datatype: 'float'
          }
        ]);
        mix5Function.parameters.apply();
        mix5Function.bodySnippet = new oaWebglSnippet('body', `float a5 = a * a * a * (6.0 * a * a - 15.0 * a + 10.0);
return mix(x, y, a5);`);
      }

      // perlinNoiseFunction
      {
        var perlinNoiseFunction = new oaWebglFunctionSnippet('perlin', 'float', 'snippet');
        perlinNoiseFunction.parameters.add('p', 'vec2');
        perlinNoiseFunction.parameters.apply();
        perlinNoiseFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
vec2 u = ceil(p);
vec2 f = fract(p);
float sw = rand(l), se = rand(vec2(u.x, l.y));
float nw = rand(vec2(l.x, u.y)), ne = rand(u);
float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
return mix5(s, n, f.y);`);
      }

      // perlinGradientNoiseFunction
      {
        var perlinGradientNoiseFunction = new oaWebglFunctionSnippet('perlinGradient', 'float', 'snippet');
        perlinGradientNoiseFunction.parameters.add('p', 'vec2');
        perlinGradientNoiseFunction.parameters.apply();
        perlinGradientNoiseFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
vec2 u = ceil(p);
vec2 f = fract(p);
vec2 vse = vec2(u.x, l.y), vnw = vec2(l.x, u.y);
float sw = dot(randGrad(l), p - l), se = dot(randGrad(vse), p - vse);
float nw = dot(randGrad(vnw), p - vnw), ne = dot(randGrad(u), p - u);
float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
return mix5(s, n, f.y) * 0.5 + 0.5;`);
      }

      // simplexNoiseFunction
      {
        var simplexNoiseFunction = new oaWebglFunctionSnippet('simplex', 'float', 'snippet');
        simplexNoiseFunction.parameters.add('p', 'vec2');
        simplexNoiseFunction.parameters.apply();
        simplexNoiseFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
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
return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);`);
      }

      // simplexGradientNoiseFunction
      {
        var simplexGradientNoiseFunction = new oaWebglFunctionSnippet('simplexGradient', 'float', 'snippet');
        simplexGradientNoiseFunction.parameters.add('p', 'vec2');
        simplexGradientNoiseFunction.parameters.apply();
        simplexGradientNoiseFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
vec2 ip = it * p;
vec2 il = floor(ip);
vec2 f = fract(ip);
vec2 l = t * il;
vec2 c, c1, c2, c3;
c = l + vec2(0.75, sqrt(3.0) / 4.0);
c2 = l + vec2(1.0, 0.0);
c3 = l + vec2(0.5, sqrt(3.0 / 4.0));
//float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
float y23 = c2.y - c3.y, x32 = c3.x - c2.x, x13, y13;
float x03 = p.x - c3.x, y03 = p.y - c3.y;
if(f.x + f.y < 1.0) {
  c1 = l;
  x13 = -0.5;
  y13 = -sqrt(3.0 / 4.0);
}
else {
  c1 = l + vec2(1.5, sqrt(3.0 / 4.0));
  x13 = 1.0;
  y13 = 0.0;
}
x13 = c1.x - c3.x;
y13 = c1.y - c3.y;
vec3 r = vec3(dot(randGrad(c1), p - c1), dot(randGrad(c2), p - c2), dot(randGrad(c3), p - c3));
//r = vec3(0.0, 0.0, 1.0);
//vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
//vec3 w = 1.0 / d;
vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
w.z = 1.0 - w.x - w.y;
vec3 w3 = w * w * (3.0 - 2.0 * w);
vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
vec3 rv = r * w5;
return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z) * 0.5 + 0.5;`);
      }

      // simplexGradientNoiseSeededFunction
      {
        var simplexGradientNoiseSeededFunction = new oaWebglFunctionSnippet('simplexGradient', 'float', 'snippet');
        simplexGradientNoiseSeededFunction.parameters.add('p', 'vec2');
        simplexGradientNoiseSeededFunction.parameters.add('s', 'vec4');
        simplexGradientNoiseSeededFunction.parameters.apply();
        simplexGradientNoiseSeededFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));
vec2 ip = it * p;
vec2 il = floor(ip);
vec2 f = fract(ip);
vec2 l = t * il;
vec2 c, c1, c2, c3;
c = l + vec2(0.75, sqrt(3.0) / 4.0);
c2 = l + vec2(1.0, 0.0);
c3 = l + vec2(0.5, sqrt(3.0 / 4.0));
//float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;
float y23 = c2.y - c3.y, x32 = c3.x - c2.x, x13, y13;
float x03 = p.x - c3.x, y03 = p.y - c3.y;
if(f.x + f.y < 1.0) {
  c1 = l;
  x13 = -0.5;
  y13 = -sqrt(3.0 / 4.0);
}
else {
  c1 = l + vec2(1.5, sqrt(3.0 / 4.0));
  x13 = 1.0;
  y13 = 0.0;
}
x13 = c1.x - c3.x;
y13 = c1.y - c3.y;
vec3 r = vec3(dot(randGrad(c1, s), p - c1), dot(randGrad(c2, s), p - c2), dot(randGrad(c3, s), p - c3));
//r = vec3(0.0, 0.0, 1.0);
//vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));
//vec3 w = 1.0 / d;
vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);
w.z = 1.0 - w.x - w.y;
vec3 w3 = w * w * (3.0 - 2.0 * w);
vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);
vec3 rv = r * w5;
return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z) * 0.5 + 0.5;`);
      }

      var grayscaleSnippet = () => {
        var snippet = new oaWebglSnippet('grayscale');
        snippet.source = 'vec4(vec3(${S("value", "null")}), ${P("alpha")})';
        snippet.addParameter('v', 'alpha', {
          type: 'float',
          nullValue: 1.0
        });
        return snippet;
      };

      return {
        standardVertexShader,
        randScalarFunction,
        randScalarSeededFunction,
        randVectorFunction,
        randVectorSeededFunction,
        randGradFunction,
        randGradSeededFunction,
        mix3Function,
        mix5Function,
        perlinNoiseFunction,
        perlinGradientNoiseFunction,
        simplexNoiseFunction,
        simplexGradientNoiseFunction,
        simplexGradientNoiseSeededFunction,
        grayscaleSnippet
      };
    }
  ]);
