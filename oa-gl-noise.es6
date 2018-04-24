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

      // random functions
      {
        // rand11Function
        {
          var rand11Function = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand11Function.parameters.add('f', 'float');
          rand11Function.parameters.apply();
          rand11Function.bodySnippet = new oaWebglSnippet('body', 'return fract(sin(f * u_sineseed[0].x + u_sineseed[0].y) * u_sineseed[0].z + u_sineseed[0].w);');
        }
  
        // rand11SeededFunction
        {
          var rand11SeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand11SeededFunction.parameters.add('f', 'float');
          rand11SeededFunction.parameters.add('s', 'vec4');
          rand11SeededFunction.parameters.apply();
          rand11SeededFunction.bodySnippet = new oaWebglSnippet('body', 'return fract(sin(f * s.x + s.y) * s.z + s.w);');
        }
  
        // rand12Function
        {
          var rand12Function = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand12Function.parameters.add('v', 'vec2');
          rand12Function.parameters.apply();
          rand12Function.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, u_dotseed[0].xy));');
        }
  
        // rand12SeededFunction
        {
          var rand12SeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand12SeededFunction.parameters.add('v', 'vec2');
          rand12SeededFunction.parameters.add('d', 'mat4');
          rand12SeededFunction.parameters.add('s', 'vec4');
          rand12SeededFunction.parameters.apply();
          rand12SeededFunction.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, d[0].xy), s);');
        }
  
        // rand13Function
        {
          var rand13Function = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand13Function.parameters.add('v', 'vec3');
          rand13Function.parameters.apply();
          rand13Function.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, u_dotseed[0].xyz));');
        }
  
        // rand13SeededFunction
        {
          var rand13SeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand13SeededFunction.parameters.add('v', 'vec3');
          rand13SeededFunction.parameters.add('d', 'mat4');
          rand13SeededFunction.parameters.add('s', 'vec4');
          rand13SeededFunction.parameters.apply();
          rand13SeededFunction.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, d[0].xyz), s);');
        }
  
        // rand14Function
        {
          var rand14Function = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand14Function.parameters.add('v', 'vec4');
          rand14Function.parameters.apply();
          rand14Function.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, u_dotseed[0]));');
        }
  
        // rand14SeededFunction
        {
          var rand14SeededFunction = new oaWebglFunctionSnippet('rand', 'float', 'snippet');
          rand14SeededFunction.parameters.add('v', 'vec4');
          rand14SeededFunction.parameters.add('d', 'mat4');
          rand14SeededFunction.parameters.add('s', 'vec4');
          rand14SeededFunction.parameters.apply();
          rand14SeededFunction.bodySnippet = new oaWebglSnippet('body', 'return rand(dot(v, d[0]), s);');
        }
  
        // rand22Function
        {
          var rand22Function = new oaWebglFunctionSnippet('rand2', 'vec2', 'snippet');
          rand22Function.parameters.add('v', 'vec2');
          rand22Function.parameters.apply();
          rand22Function.bodySnippet = new oaWebglSnippet('body', `return vec2(rand(dot(v, u_dotseed[0].xy)), rand(dot(v, u_dotseed[1].xy)));`);
        }
  
        // rand22SeededFunction
        {
          var rand22SeededFunction = new oaWebglFunctionSnippet('rand2', 'vec2', 'snippet');
          rand22SeededFunction.parameters.add('v', 'vec2');
          rand22SeededFunction.parameters.add('d', 'mat4');
          rand22SeededFunction.parameters.add('s', 'vec4');
          rand22SeededFunction.parameters.apply();
          rand22SeededFunction.bodySnippet = new oaWebglSnippet('body', `return vec2(rand(dot(v, d[0].xy), s), rand(dot(v, d[1].xy), s));`);
        }
  
        // rand22RotFunction
        {
          var rand22RotFunction = new oaWebglFunctionSnippet('rand2Rot', 'vec2', 'snippet');
          rand22RotFunction.parameters.add('v', 'vec2');
          rand22RotFunction.parameters.apply();
          rand22RotFunction.bodySnippet = new oaWebglSnippet('body', `float a = 2.0 * 3.14159265358 * rand(dot(v, u_dotseed[0].xy));
  return vec2(cos(a), sin(a));`);
        }
  
        // rand22RotSeededFunction
        {
          var rand22RotSeededFunction = new oaWebglFunctionSnippet('rand2Rot', 'vec2', 'snippet');
          rand22RotSeededFunction.parameters.add('v', 'vec2');
          rand22RotSeededFunction.parameters.add('d', 'mat4');
          rand22RotSeededFunction.parameters.add('s', 'vec4');
          rand22RotSeededFunction.parameters.apply();
          rand22RotSeededFunction.bodySnippet = new oaWebglSnippet('body', `float a = 2.0 * 3.14159265358 * rand(dot(v, d[0].xy), s);
  return vec2(cos(a), sin(a));`);
        }
  
        // rand22UnitFunction
        {
          var rand22UnitFunction = new oaWebglFunctionSnippet('rand2Unit', 'vec2', 'snippet');
          rand22UnitFunction.parameters.add('v', 'vec2');
          rand22UnitFunction.parameters.apply();
          rand22UnitFunction.bodySnippet = new oaWebglSnippet('body', `vec2 r = rand2(v);
  if(length(r) < 0.00001)
    return r = rand2(v.yx);
  return r / length(v);`);
        }
  
        // rand22UnitSeededFunction
        {
          var rand22UnitSeededFunction = new oaWebglFunctionSnippet('rand2Unit', 'vec2', 'snippet');
          rand22UnitSeededFunction.parameters.add('v', 'vec2');
          rand22UnitSeededFunction.parameters.add('d', 'mat4');
          rand22UnitSeededFunction.parameters.add('s', 'mat4');
          rand22UnitSeededFunction.parameters.apply();
          rand22UnitSeededFunction.bodySnippet = new oaWebglSnippet('body', `vec2 r = rand2(v, d, s[0]);
  if(length(r) < 0.00001)
    return r = rand2(v, d, s[1]);
  if(length(r) < 0.00001)
    return r = rand2(v, d, s[2]);
  if(length(r) < 0.00001)
    return r = rand2(v, d, s[3]);
  return r / length(v);`);
        }
  
        // rand33Function
        {
          var rand33Function = new oaWebglFunctionSnippet('rand3', 'vec3', 'snippet');
          rand33Function.parameters.add('v', 'vec3');
          rand33Function.parameters.apply();
          rand33Function.bodySnippet = new oaWebglSnippet('body', `return vec3(rand(dot(v, d[0].xyz)), rand(dot(v, d[1].xyz)), rand(dot(v, d[2].xyz)));`);
        }
  
        // rand33SeededFunction
        {
          var rand33SeededFunction = new oaWebglFunctionSnippet('rand3', 'vec3', 'snippet');
          rand33SeededFunction.parameters.add('v', 'vec3');
          rand33SeededFunction.parameters.add('d', 'mat4');
          rand33SeededFunction.parameters.add('s', 'vec4');
          rand33SeededFunction.parameters.apply();
          rand33SeededFunction.bodySnippet = new oaWebglSnippet('body', `return vec2(rand(dot(v, d[0].xyz), s), rand(dot(v, d[1].xyz), s), rand(dot(v, d[2].xyz), s));`);
        }
  
        // rand33RotFunction
        {
          var rand33RotFunction = new oaWebglFunctionSnippet('rand3Rot', 'vec3', 'snippet');
          rand33RotFunction.parameters.add('v', 'vec3');
          rand33RotFunction.parameters.apply();
          rand33RotFunction.bodySnippet = new oaWebglSnippet('body', `float x = 2.0 * 3.14159265358 * rand(dot(v, dotseed[0].xyz));
  float y = 2.0 * 3.14159265358 * rand(dot(v, dotseed[1].xyz));
  float z = 2.0 * 3.14159265358 * rand(dot(v, dotseed[2].xyz));
  return mat3(
    1.0, 0.0, 0.0,
    0.0, cos(x), -sin(x),
    0.0, sin(x), cos(x)
  ) * mat3(
    cos(y), 0.0, sin(y),
    0.0, 1.0, 0.0,
    -sin(y), 0.0, cos(y)
  ) * mat3(
    cos(z), -sin(z), 0.0,
    sin(z), cos(z), 0.0,
    0.0, 0.0, 1.0
  ) * vec3(1.0, 0.0, 0.0);`);
        }
  
        // rand33RotSeededFunction
        {
          var rand33RotSeededFunction = new oaWebglFunctionSnippet('rand3Rot', 'vec3', 'snippet');
          rand33RotSeededFunction.parameters.add('v', 'vec3');
          rand33RotSeededFunction.parameters.add('d', 'mat4');
          rand33RotSeededFunction.parameters.add('s', 'vec4');
          rand33RotSeededFunction.parameters.apply();
          rand33RotSeededFunction.bodySnippet = new oaWebglSnippet('body', `float x = 2.0 * 3.14159265358 * rand(dot(v, d[0].xyz), s);
  float y = 2.0 * 3.14159265358 * rand(dot(v, d[1].xyz), s);
  float z = 2.0 * 3.14159265358 * rand(dot(v, d[2].xyz), s);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, cos(x), -sin(x),
    0.0, sin(x), cos(x)
  ) * mat3(
    cos(y), 0.0, sin(y),
    0.0, 1.0, 0.0,
    -sin(y), 0.0, cos(y)
  ) * mat3(
    cos(z), -sin(z), 0.0,
    sin(z), cos(z), 0.0,
    0.0, 0.0, 1.0
  ) * vec3(1.0, 0.0, 0.0);`);
        }
  
        // rand33UnitFunction
        {
          var rand33UnitFunction = new oaWebglFunctionSnippet('rand3Unit', 'vec3', 'snippet');
          rand33UnitFunction.parameters.add('v', 'vec3');
          rand33UnitFunction.parameters.apply();
          rand33UnitFunction.bodySnippet = new oaWebglSnippet('body', `vec2 r = rand3(v);
  if(length(r) < 0.00001)
    return r = rand3(v.yzx);
  if(length(r) < 0.00001)
    return r = rand3(v.zxy);
  if(length(r) < 0.00001)
    return r = rand3(v.zyx);
  if(length(r) < 0.00001)
    return r = rand3(v.yxz);
  if(length(r) < 0.00001)
    return r = rand3(v.xzy);
  return r / length(v);`);
        }
  
        // rand33UnitSeededFunction
        {
          var rand33UnitSeededFunction = new oaWebglFunctionSnippet('rand3Unit', 'vec3', 'snippet');
          rand33UnitSeededFunction.parameters.add('v', 'vec3');
          rand33UnitSeededFunction.parameters.add('d', 'mat4');
          rand33UnitSeededFunction.parameters.add('s', 'mat4');
          rand33UnitSeededFunction.parameters.apply();
          rand33UnitSeededFunction.bodySnippet = new oaWebglSnippet('body', `vec2 r = rand3(v, d, s[0]);
  if(length(r) < 0.00001)
    return r = rand3(v, d, s[1]);
  if(length(r) < 0.00001)
    return r = rand3(v, d, s[2]);
  if(length(r) < 0.00001)
    return r = rand3(v, d, s[3]);
  return r / length(v);`);
        }
  
        // rand44Function
        {
          var rand44Function = new oaWebglFunctionSnippet('rand4', 'vec4', 'snippet');
          rand44Function.parameters.add('v', 'vec4');
          rand44Function.parameters.apply();
          rand44Function.bodySnippet = new oaWebglSnippet('body', `return vec2(rand(dot(v, d[0])), rand(dot(v, d[1])), rand(dot(v, d[2])), rand(dot(v, d[3])));`);
        }
  
        // rand44SeededFunction
        {
          var rand44SeededFunction = new oaWebglFunctionSnippet('rand4', 'vec4', 'snippet');
          rand44SeededFunction.parameters.add('v', 'vec4');
          rand44SeededFunction.parameters.add('d', 'mat4');
          rand44SeededFunction.parameters.add('s', 'vec4');
          rand44SeededFunction.parameters.apply();
          rand44SeededFunction.bodySnippet = new oaWebglSnippet('body', `return vec2(rand(dot(v, d[0]), s), rand(dot(v, d[1]), s), rand(dot(v, d[2]), s), rand(dot(v, d[3]), s));`);
        }
  
        // rand44RotFunction
        {
          var rand44RotFunction = new oaWebglFunctionSnippet('rand4Rot', 'vec4', 'snippet');
          rand44RotFunction.parameters.add('v', 'vec4');
          rand44RotFunction.parameters.apply();
          rand44RotFunction.bodySnippet = new oaWebglSnippet('body', `float x = 2.0 * 3.14159265358 * rand(dot(v, dotseed[0]));
  float y = 2.0 * 3.14159265358 * rand(dot(v, dotseed[1]));
  float z = 2.0 * 3.14159265358 * rand(dot(v, dotseed[2]));
  float w = 2.0 * 3.14159265358 * rand(dot(v, dotseed[3]));
  return mat3(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(x), -sin(x), 0.0,
    0.0, sin(x), cos(x) 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * mat3(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, cos(y), -sin(y),
    0.0, 0.0, sin(y), cos(y)
  ) * mat3(
    cos(z), 0.0, 0.0, sin(z),
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    -sin(z), 0.0, 0.0, cos(z)
  ) * mat3(
    cos(w), -sin(w), 0.0, 0.0,
    sin(w), cos(w), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * vec3(1.0, 0.0, 0.0);`);
        }
  
        // rand44RotSeededFunction
        {
          var rand44RotSeededFunction = new oaWebglFunctionSnippet('rand4Rot', 'vec4', 'snippet');
          rand44RotSeededFunction.parameters.add('v', 'vec4');
          rand44RotSeededFunction.parameters.add('d', 'mat4');
          rand44RotSeededFunction.parameters.add('s', 'vec4');
          rand44RotSeededFunction.parameters.apply();
          rand44RotSeededFunction.bodySnippet = new oaWebglSnippet('body', `float x = 2.0 * 3.14159265358 * rand(dot(v, d[0]), s);
  float y = 2.0 * 3.14159265358 * rand(dot(v, d[1]), s);
  float z = 2.0 * 3.14159265358 * rand(dot(v, d[2]), s);
  float w = 2.0 * 3.14159265358 * rand(dot(v, d[3]), s);
  return mat3mat3(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(x), -sin(x), 0.0,
    0.0, sin(x), cos(x) 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * mat3(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, cos(y), -sin(y),
    0.0, 0.0, sin(y), cos(y)
  ) * mat3(
    cos(z), 0.0, 0.0, sin(z),
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    -sin(z), 0.0, 0.0, cos(z)
  ) * mat3(
    cos(w), -sin(w), 0.0, 0.0,
    sin(w), cos(w), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * vec3(1.0, 0.0, 0.0);`);
        }
  
        // rand44UnitFunction
        {
          var rand44UnitFunction = new oaWebglFunctionSnippet('rand4Unit', 'vec4', 'snippet');
          rand44UnitFunction.parameters.add('v', 'vec4');
          rand44UnitFunction.parameters.apply();
          rand44UnitFunction.bodySnippet = new oaWebglSnippet('body', `vec4 r = rand4(v);
  if(length(r) < 0.00001)
    return r = rand4(v.yzwx);
  if(length(r) < 0.00001)
    return r = rand4(v.zwxy);
  if(length(r) < 0.00001)
    return r = rand4(v.wxyz);
  return r / length(v);`);
        }
  
        // rand44UnitSeededFunction
        {
          var rand44UnitSeededFunction = new oaWebglFunctionSnippet('rand4Unit', 'vec4', 'snippet');
          rand44UnitSeededFunction.parameters.add('v', 'vec4');
          rand44UnitSeededFunction.parameters.add('d', 'mat4');
          rand44UnitSeededFunction.parameters.add('s', 'mat4');
          rand44UnitSeededFunction.parameters.apply();
          rand44UnitSeededFunction.bodySnippet = new oaWebglSnippet('body', `vec2 r = rand4(v, d, s[0]);
  if(length(r) < 0.00001)
    return r = rand4(v, d, s[1]);
  if(length(r) < 0.00001)
    return r = rand4(v, d, s[2]);
  if(length(r) < 0.00001)
    return r = rand4(v, d, s[3]);
  return r / length(v);`);
        }
      }

      // mix functions
      {
        // mix1Function
        {
          var mix1Function = new oaWebglFunctionSnippet('mix1', 'float', 'snippet');
          mix1Function.parameters.addMultiple([{
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
          mix1Function.parameters.apply();
          mix1Function.bodySnippet = new oaWebglSnippet('body', 'return (1.0 - a) * x + a * y;');
        }
  
        // curve3Function
        {
          var curve3Function = new oaWebglFunctionSnippet('curve3', 'float', 'snippet');
          curve3Function.parameters.add('a', 'float');
          curve3Function.parameters.apply();
          curve3Function.bodySnippet = new oaWebglSnippet('body', 'return a * a * (3.0 - 2.0 * a);');
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
          mix3Function.bodySnippet = new oaWebglSnippet('body', 'return mix1(x, y, curve3(a));');
        }
  
        // curve3Function
        {
          var curve5Function = new oaWebglFunctionSnippet('curve5', 'float', 'snippet');
          curve5Function.parameters.add('a', 'float');
          curve5Function.parameters.apply();
          curve5Function.bodySnippet = new oaWebglSnippet('body', 'return a * a * a * (a * (6.0 * a - 15.0) + 10.0);');
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
          mix5Function.bodySnippet = new oaWebglSnippet('body', 'return mix1(x, y, curve5(a));');
        }
      }

      // noise functions
      {
        
        // perlin2NoiseFunction
        {
          var perlin2NoiseFunction = new oaWebglFunctionSnippet('perlin', 'float', 'snippet');
          perlin2NoiseFunction.parameters.add('p', 'vec2');
          perlin2NoiseFunction.parameters.apply();
          perlin2NoiseFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  float sw = rand(l), se = rand(vec2(u.x, l.y));
  float nw = rand(vec2(l.x, u.y)), ne = rand(u);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  return mix5(s, n, f.y);`);
        }
  
        // perlin2NoiseSeededFunction
        {
          var perlin2NoiseSeededFunction = new oaWebglFunctionSnippet('perlin', 'float', 'snippet');
          perlin2NoiseSeededFunction.parameters.add('p', 'vec2');
          perlin2NoiseSeededFunction.parameters.add('ds', 'mat4');
          perlin2NoiseSeededFunction.parameters.add('ss', 'vec4');
          perlin2NoiseSeededFunction.parameters.apply();
          perlin2NoiseSeededFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  float sw = rand(l, ds, ss), se = rand(vec2(u.x, l.y), ds, ss);
  float nw = rand(vec2(l.x, u.y), ds, ss), ne = rand(u, ds, ss);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  return mix5(s, n, f.y);`);
        }
  
        // fractalPerlin2NoiseFunction
        {
          var fractalPerlin2NoiseFunction = new oaWebglFunctionSnippet('fperlin', 'float', 'snippet');
          fractalPerlin2NoiseFunction.parameters.addMultiple([{
              paramname: 'p',
              datatype: 'vec2'
            },
            {
              paramname: 'r',
              datatype: 'float'
            },
            {
              paramname: 's',
              datatype: 'float'
            },
            {
              paramname: 'l',
              datatype: 'float'
            },
            {
              paramname: 'ds',
              datatype: 'mat4'
            },
            {
              paramname: 'ss',
              datatype: 'vec4'
            }
          ]);
          fractalPerlin2NoiseFunction.parameters.apply();
          fractalPerlin2NoiseFunction.bodySnippet = new oaWebglSnippet('body', `float value = 0.0;
  vec4 c = ss;
  for(int i = 0; i < 7; i++) {
      c.xy = rand2(c.xy, ds, ss) * 32109.8765432 + 12345.6789012;
      value += (perlin(p / r, ds, c) * 2.0 - 1.0) / s;
      s = s * l;
      r = r / l;
  }
  return value * 0.5 + 0.5;`);
        }
  
        // perlin2GradientNoiseFunction
        {
          var perlin2GradientNoiseFunction = new oaWebglFunctionSnippet('perlinGradient', 'float', 'snippet');
          perlin2GradientNoiseFunction.parameters.add('p', 'vec2');
          perlin2GradientNoiseFunction.parameters.apply();
          perlin2GradientNoiseFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  vec2 vse = vec2(u.x, l.y), vnw = vec2(l.x, u.y);
  float sw = dot(rand2Rot(l), p - l), se = dot(rand2Rot(vse), p - vse);
  float nw = dot(rand2Rot(vnw), p - vnw), ne = dot(rand2Rot(u), p - u);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  return mix5(s, n, f.y);`);
        }
  
        // perlin2GradientNoiseSeededFunction
        {
          var perlin2GradientNoiseSeededFunction = new oaWebglFunctionSnippet('perlinGradient', 'float', 'snippet');
          perlin2GradientNoiseSeededFunction.parameters.add('p', 'vec2');
          perlin2GradientNoiseSeededFunction.parameters.add('ds', 'mat4');
          perlin2GradientNoiseSeededFunction.parameters.add('ss', 'vec4');
          perlin2GradientNoiseSeededFunction.parameters.apply();
          perlin2GradientNoiseSeededFunction.bodySnippet = new oaWebglSnippet('body', `vec2 l = floor(p);
  vec2 u = ceil(p);
  vec2 f = fract(p);
  vec2 vse = vec2(u.x, l.y), vnw = vec2(l.x, u.y);
  float sw = dot(rand2Rot(l, ds, ss), p - l), se = dot(rand2Rot(vse, ds, ss), p - vse);
  float nw = dot(rand2Rot(vnw, ds, ss), p - vnw), ne = dot(rand2Rot(u, ds, ss), p - u);
  float n = mix5(nw, ne, f.x), s = mix5(sw, se, f.x);
  return mix5(s, n, f.y);`);
        }
  
        // fractalPerlin2GradientNoiseFunction
        {
          var fractalPerlin2GradientNoiseFunction = new oaWebglFunctionSnippet('fperlinGradient', 'float', 'snippet');
          fractalPerlin2GradientNoiseFunction.parameters.addMultiple([{
              paramname: 'p',
              datatype: 'vec2'
            },
            {
              paramname: 'r',
              datatype: 'float'
            },
            {
              paramname: 's',
              datatype: 'float'
            },
            {
              paramname: 'l',
              datatype: 'float'
            },
            {
              paramname: 'ds',
              datatype: 'mat4'
            },
            {
              paramname: 'ss',
              datatype: 'vec4'
            }
          ]);
          fractalPerlin2GradientNoiseFunction.parameters.apply();
          fractalPerlin2GradientNoiseFunction.bodySnippet = new oaWebglSnippet('body', `float value = 0.0;
  vec4 c = ss;
  for(int i = 0; i < 7; i++) {
      c.xy = rand2(c.xy, ds, ss) * 32109.8765432 + 12345.6789012;
      value += perlinGradient(p / r, ds, c) / s;
      s = s * l;
      r = r / l;
  }
  return value * 0.5 + 0.5;`);
        }
  
        // simplex2NoiseFunction
        {
          var simplex2NoiseFunction = new oaWebglFunctionSnippet('simplex', 'float', 'snippet');
          simplex2NoiseFunction.parameters.add('p', 'vec2');
          simplex2NoiseFunction.parameters.apply();
          simplex2NoiseFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
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
  
        // simplex2NoiseSeededFunction
        {
          var simplex2NoiseSeededFunction = new oaWebglFunctionSnippet('simplex', 'float', 'snippet');
          simplex2NoiseSeededFunction.parameters.add('p', 'vec2');
          simplex2NoiseSeededFunction.parameters.add('ds', 'mat4');
          simplex2NoiseSeededFunction.parameters.add('ss', 'vec4');
          simplex2NoiseSeededFunction.parameters.apply();
          simplex2NoiseSeededFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
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
  vec3 r = vec3(rand(oc1, ds, ss), rand(oc2, ds, ss), rand(oc3, ds, ss));
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
  
        // simplex2GradientNoiseFunction
        {
          var simplex2GradientNoiseFunction = new oaWebglFunctionSnippet('simplexGradient', 'float', 'snippet');
          simplex2GradientNoiseFunction.parameters.add('p', 'vec2');
          simplex2GradientNoiseFunction.parameters.apply();
          simplex2GradientNoiseFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
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
  vec3 r = vec3(dot(rand2Rot(c1), p - c1), dot(rand2Rot(c2), p - c2), dot(rand2Rot(c3), p - c3));
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
  
        // simplex2GradientNoiseSeededFunction
        {
          var simplex2GradientNoiseSeededFunction = new oaWebglFunctionSnippet('simplexGradient', 'float', 'snippet');
          simplex2GradientNoiseSeededFunction.parameters.add('p', 'vec2');
          simplex2GradientNoiseSeededFunction.parameters.add('ds', 'mat4');
          simplex2GradientNoiseSeededFunction.parameters.add('ss', 'vec4');
          simplex2GradientNoiseSeededFunction.parameters.apply();
          simplex2GradientNoiseSeededFunction.bodySnippet = new oaWebglSnippet('body', `mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));
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
  vec3 r = vec3(dot(rand2Rot(c1, ds, ss), p - c1), dot(rand2Rot(c2, ds, ss), p - c2), dot(rand2Rot(c3, ds, ss), p - c3));
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
      }

      // ridgeFunction
      {
        var ridgeFunction = new oaWebglFunctionSnippet('ridge', 'float', 'snippet');
        ridgeFunction.parameters.add('h', 'float');
        ridgeFunction.parameters.add('offset', 'float');
        ridgeFunction.parameters.apply();
        ridgeFunction.bodySnippet = new oaWebglSnippet('body', `h = abs(h);
h = offset - h;
h = h * h;
return h;`);
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
      var direction2Snippet = () => {
        var snippet = new oaWebglSnippet('direction2');
        snippet.source = 'vec4(${S("dir", "null")} * 0.5 + 0.5, ${P("blue")}, ${P("alpha")})';
        snippet.addParameter('v', 'alpha', {
          type: 'float',
          nullValue: 1.0
        });
        snippet.addParameter('v', 'blue', {
          type: 'float',
          nullValue: 0.5
        });
        return snippet;
      };
      var direction3Snippet = () => {
        var snippet = new oaWebglSnippet('direction2');
        snippet.source = 'vec4(${S("dir", "null")} * 0.5 + 0.5, ${P("alpha")})';
        snippet.addParameter('v', 'alpha', {
          type: 'float',
          nullValue: 1.0
        });
        return snippet;
      };

      // noise fragments
      {
        // sineNoiseFragmentShader
        {
          var sineNoiseFragment = new oaWebglShaderSnippet('sineNoiseFragment');
          sineNoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          sineNoiseFragment.variables.apply();
          sineNoiseFragment.addFunctions([
            rand11Function,
            rand12Function
          ]);
          var grayscale = grayscaleSnippet();
          grayscale.addSnippet('value', new oaWebglSnippet('sinenoise', 'rand(floor(gl_FragCoord.xy / u_resolution))'));
          grayscale.setParameter('alpha', '1.0');
          var sineNoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          sineNoiseFragmentBody.source = 'gl_FragColor = ${S("grayscale", "null")};';
          sineNoiseFragmentBody.addSnippet('grayscale', grayscale);
          sineNoiseFragment.mainSnippet = sineNoiseFragmentBody;
        }
        
        // sineRotNoiseFragmentShader
        {
          var sine2RotNoiseFragment = new oaWebglShaderSnippet('sineNoiseFragment');
          sine2RotNoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          sine2RotNoiseFragment.variables.apply();
          sine2RotNoiseFragment.addFunctions([
            rand11Function,
            rand22RotFunction
          ]);
          var direction = direction2Snippet();
          direction.addSnippet('dir', new oaWebglSnippet('sinenoise', 'rand2Rot(floor(gl_FragCoord.xy / u_resolution))'));
          direction.setParameter('blue', '1.0');
          direction.setParameter('alpha', '1.0');
          var sine2RotNoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          sine2RotNoiseFragmentBody.source = 'gl_FragColor = ${S("direction", "null")};';
          sine2RotNoiseFragmentBody.addSnippet('direction', direction);
          sine2RotNoiseFragment.mainSnippet = sine2RotNoiseFragmentBody;
        }
  
        // perlin2NoiseFragmentShader
        {
          var perlin2NoiseFragment = new oaWebglShaderSnippet('perlinNoiseFragment');
          perlin2NoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          perlin2NoiseFragment.variables.apply();
          perlin2NoiseFragment.addFunctions([
            rand11Function,
            rand12Function,
            mix1Function,
            curve5Function,
            mix5Function,
            perlin2NoiseFunction
          ]);
          grayscale = grayscaleSnippet();
          grayscale.addSnippet('value', new oaWebglSnippet('perlinnoise', 'perlin(gl_FragCoord.xy / u_resolution)'));
          grayscale.setParameter('alpha', '1.0');
          var perlin2NoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          perlin2NoiseFragmentBody.source = 'gl_FragColor = ${S("grayscale", "null")};';
          perlin2NoiseFragmentBody.addSnippet('grayscale', grayscale);
          perlin2NoiseFragment.mainSnippet = perlin2NoiseFragmentBody;
        }
  
        // fractalPerlin2NoiseFragmentShader
        {
          var fractalPerlin2NoiseFragment = new oaWebglShaderSnippet('fractalPerlinNoiseFragment');
          fractalPerlin2NoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          fractalPerlin2NoiseFragment.variables.apply();
          fractalPerlin2NoiseFragment.addFunctions([
            rand11SeededFunction,
            rand12SeededFunction,
            rand22SeededFunction,
            mix1Function,
            curve5Function,
            mix5Function,
            perlin2NoiseSeededFunction,
            fractalPerlin2NoiseFunction
          ]);
          grayscale = grayscaleSnippet();
          grayscale.addSnippet('value', new oaWebglSnippet('fractalperlinnoise', 'fperlin(gl_FragCoord.xy, u_resolution, 1.0, 2.0, u_dotseed, u_sineseed[0])'));
          grayscale.setParameter('alpha', '1.0');
          var fractalPerlin2NoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          fractalPerlin2NoiseFragmentBody.source = 'gl_FragColor = ${S("grayscale", "null")};';
          fractalPerlin2NoiseFragmentBody.addSnippet('grayscale', grayscale);
          fractalPerlin2NoiseFragment.mainSnippet = fractalPerlin2NoiseFragmentBody;
        }
  
        // perlin2GradientNoiseFragmentShader
        {
          var perlin2GradientNoiseFragment = new oaWebglShaderSnippet('perlinNoiseFragment');
          perlin2GradientNoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          perlin2GradientNoiseFragment.variables.apply();
          perlin2GradientNoiseFragment.addFunctions([
            rand11Function,
            rand22RotFunction,
            mix1Function,
            curve5Function,
            mix5Function,
            perlin2GradientNoiseFunction
          ]);
          grayscale = grayscaleSnippet();
          grayscale.addSnippet('value', new oaWebglSnippet('perlinnoise', 'perlinGradient(gl_FragCoord.xy / u_resolution) * 0.5 + 0.5'));
          grayscale.setParameter('alpha', '1.0');
          var perlin2GradientNoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          perlin2GradientNoiseFragmentBody.source = 'gl_FragColor = ${S("grayscale", "null")};';
          perlin2GradientNoiseFragmentBody.addSnippet('grayscale', grayscale);
          perlin2GradientNoiseFragment.mainSnippet = perlin2GradientNoiseFragmentBody;
        }
  
        // fractalPerlin2GradientNoiseFragmentShader
        {
          var fractalPerlin2GradientNoiseFragment = new oaWebglShaderSnippet('fractalPerlinNoiseFragment');
          fractalPerlin2GradientNoiseFragment.variables.addMultiple([{
              varname: 'u_sineseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_dotseed',
              datatype: 'mat4',
              vartype: 'uniform'
            },
            {
              varname: 'u_resolution',
              datatype: 'float',
              vartype: 'uniform'
            }
          ]);
          fractalPerlin2GradientNoiseFragment.variables.apply();
          fractalPerlin2GradientNoiseFragment.addFunctions([
            rand11SeededFunction,
            rand22RotSeededFunction,
            rand22SeededFunction,
            mix1Function,
            curve5Function,
            mix5Function,
            perlin2GradientNoiseSeededFunction,
            fractalPerlin2GradientNoiseFunction
          ]);
          grayscale = grayscaleSnippet();
          grayscale.addSnippet('value', new oaWebglSnippet('fractalperlinnoise', 'fperlinGradient(gl_FragCoord.xy, u_resolution, 1.0, 2.0, u_dotseed, u_sineseed[0])'));
          grayscale.setParameter('alpha', '1.0');
          var fractalPerlin2GradientNoiseFragmentBody = new oaWebglSnippet('sineNoiseFragmentBody');
          fractalPerlin2GradientNoiseFragmentBody.source = 'gl_FragColor = ${S("grayscale", "null")};';
          fractalPerlin2GradientNoiseFragmentBody.addSnippet('grayscale', grayscale);
          fractalPerlin2GradientNoiseFragment.mainSnippet = fractalPerlin2GradientNoiseFragmentBody;
        }
      }

      return {
        snippets: {
          grayscaleSnippet,
          direction2Snippet,
          direction3Snippet
        },
        functions: {
          rand11Function,
          rand11SeededFunction,
          rand12Function,
          rand12SeededFunction,
          rand13Function,
          rand13SeededFunction,
          rand14Function,
          rand14SeededFunction,
          rand22Function,
          rand22SeededFunction,
          rand22RotFunction,
          rand22RotSeededFunction,
          rand22UnitFunction,
          rand22UnitSeededFunction,
          rand33Function,
          rand33SeededFunction,
          rand33RotFunction,
          rand33RotSeededFunction,
          rand33UnitFunction,
          rand33UnitSeededFunction,
          rand44Function,
          rand44SeededFunction,
          rand44RotFunction,
          rand44RotSeededFunction,
          rand44UnitFunction,
          rand44UnitSeededFunction,
          mix1Function,
          curve3Function,
          mix3Function,
          curve5Function,
          mix5Function,
          perlin2NoiseFunction,
          perlin2NoiseSeededFunction,
          perlin2GradientNoiseFunction,
          perlin2GradientNoiseSeededFunction,
          simplex2NoiseFunction,
          simplex2NoiseSeededFunction,
          simplex2GradientNoiseFunction,
          simplex2GradientNoiseSeededFunction,
          fractalPerlin2NoiseFunction,
          fractalPerlin2GradientNoiseFunction,
          ridgeFunction,
          all: [
            rand11Function,
            rand11SeededFunction,
            rand12Function,
            rand12SeededFunction,
            rand13Function,
            rand13SeededFunction,
            rand14Function,
            rand14SeededFunction,
            rand22Function,
            rand22SeededFunction,
            rand22RotFunction,
            rand22RotSeededFunction,
            rand22UnitFunction,
            rand22UnitSeededFunction,
            rand33Function,
            rand33SeededFunction,
            rand33RotFunction,
            rand33RotSeededFunction,
            rand33UnitFunction,
            rand33UnitSeededFunction,
            rand44Function,
            rand44SeededFunction,
            rand44RotFunction,
            rand44RotSeededFunction,
            rand44UnitFunction,
            rand44UnitSeededFunction,
            mix1Function,
            curve3Function,
            mix3Function,
            curve5Function,
            mix5Function,
            perlin2NoiseFunction,
            perlin2NoiseSeededFunction,
            perlin2GradientNoiseFunction,
            perlin2GradientNoiseSeededFunction,
            simplex2NoiseFunction,
            simplex2NoiseSeededFunction,
            simplex2GradientNoiseFunction,
            simplex2GradientNoiseSeededFunction,
            fractalPerlin2NoiseFunction,
            fractalPerlin2GradientNoiseFunction,
            ridgeFunction
          ]
        },
        shaders: {
          vertex: {
            standardVertexShader
          },
          fragment: {
            sineNoiseFragment,
            sine2RotNoiseFragment,
            perlin2NoiseFragment,
            fractalPerlin2NoiseFragment,
            perlin2GradientNoiseFragment,
            fractalPerlin2GradientNoiseFragment
          }
        }
      };
    }
  ]);
