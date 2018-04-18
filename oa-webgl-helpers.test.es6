//var sinon = require('sinon');
var chai = require('chai');
const { assert } = chai;
const {
  inject,
  ngModule
} = require('./test-helpers');

// Loads the module we want to test
require('./oa-webgl-helpers');

describe('oaWebglHelpers module', function() {
  beforeEach(ngModule('oaWebglHelpers'));
  describe('oaWebglHelpers service', function() {
    var $oaWebglHelpers;

    beforeEach(inject(oaWebglHelpers => {
      $oaWebglHelpers = oaWebglHelpers;
    }));

    describe('FLOAT32 property', () => {
      it('should be defined', () => {
        assert.isDefined($oaWebglHelpers.FLOAT32, 'oaWebglHelpers.FLOAT32 not defined:\n' + JSON.stringify(Object.keys($oaWebglHelpers), null, 2));
      });

      it('should be different from UINT16', () => {
        assert.notEqual($oaWebglHelpers.FLOAT32, $oaWebglHelpers.UINT16, 'oaWebglHelpers.FLOAT32 and oaWebglHelpers.UINT16 should not be equal');
      });
    });

    describe('UINT16 property', () => {
      it('should be defined', () => {
        assert.isDefined($oaWebglHelpers.UINT16, 'oaWebglHelpers.UINT16 not defined:\n' + JSON.stringify(Object.keys($oaWebglHelpers), null, 2));
      });

      it('should be different from FLOAT32', () => {
        assert.notEqual($oaWebglHelpers.FLOAT32, $oaWebglHelpers.UINT16, 'oaWebglHelpers.FLOAT32 and oaWebglHelpers.UINT16 should not be equal');
      });
    });
  });
  describe('oaWebglShaderSnippet factory', function() {
    var $oaWebglShaderSnippet;

    beforeEach(inject(oaWebglShaderSnippet => {
      $oaWebglShaderSnippet = oaWebglShaderSnippet;
    }));

    var sss = [
      // simple substitution
      {
        name: 'simple substitution',
        source: 'param1 = "${param1}"',
        parameters: {
          param1: 'Val1'
        },
        generated: 'param1 = "Val1"'
      },
      // array substitution
      {
        name: 'array substitution',
        source: `1: "\${array:param1}"
2: "\${a:param2:-}"
3: "\${arr:param3::<>}"
4: "\${a:param4:::!}"`,
        parameters: {
          param1: [0, 1, 2, 3, 4],
          param2: ['ng', 'webgl', 'helpers'],
          param3: [],
          param4: [null, '^', null]
        },
        generated: `1: "01234"
2: "ng-webgl-helpers"
3: "<>"
4: "!^!"`
      },
      // missing parameter substitution
      {
        name: 'missing parameter substitution',
        source: `param1 = "\${param1:v1}"
param2 = "\${paramB:v2}"`,
        parameters: {
          param1: 'Val1'
        },
        generated: `param1 = "Val1"
param2 = "v2"`
      },
      // single substitution in vertex shader
      {
        name: 'single substitution in vertex shader',
        source: `precision \${precision:mediump} float;
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`,
        parameters: {
          precision: 'mediump'
        },
        generated: `precision mediump float;
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`
      },
      // single substitution in vertex shader with line numbers
      {
        name: 'single substitution in vertex shader with line numbers',
        source: `precision \${precision} float;
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`,
        parameters: {
          precision: 'mediump',
          lineNumbers: true,
          lineNumberWidth: 2
        },
        generated: `01: precision mediump float;
02: attribute vec4 a_position;
03: void main() {
04:   gl_Position = a_position;
05: }`
      },
      // single substitution in vertex shader with indentation
      {
        name: 'single substitution in vertex shader with indentation',
        source: `void main() {
  gl_Position = a_position;
}`,
        parameters: {
          indent: 1,
          indentationStr: '  '
        },
        generated: `  void main() {
    gl_Position = a_position;
  }`
      },
      // shader template
      {
        name: 'shader template I',
        source: `precision \${precision:mediump} float;
\${a:attributes:\n}
void main() {
  gl_Position = vec4(0.0);
}`,
        parameters: {
          precision: 'highp',
          indent: 0,
          indentationStr: '  '
        },
        generated: `precision highp float;

void main() {
  gl_Position = vec4(0.0);
}`
      },
      // shader template 2
      {
        name: 'shader template II',
        source: `precision \${precision:mediump} float;
\${a:attributes:\n}
void main() {
  gl_Position = a_position;
}`,
        parameters: {
          precision: 'highp',
          attributes: ['attribute vec4 a_position;'],
          indent: 0,
          indentationStr: '  '
        },
        generated: `precision highp float;
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}`
      },
      // shader template 3
      {
        name: 'shader template III',
        source: `precision \${precision:mediump} float;
\${a:uniforms:\n}
\${a:attributes:\n}
\${a:varying:\n}
\${a:declarations:\n}
void main() {
\${body}
}
\${a:definitions:\n}`,
        parameters: {
          precision: 'highp',
          uniforms: [
            'uniform vec4 u_seed;',
            'uniform float u_resolution;'
          ],
          declarations: [
            'float rand(float f);',
            'float rand(vec2 v);',
            'vec2 randGrad(vec2 v);',
            'float noise(vec2 op);'
          ],
          definitions: [
            `float rand(float f) {
  return fract(sin(f + u_seed.z) * u_seed.w);
}`,
            `float rand(vec2 v) {
  return rand(dot(v, u_seed.xy));
}`,
            `vec2 randGrad(vec2 v) {
  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));
  return vec2(cos(a), sin(a));
}`,
            `float noise(vec2 op) {
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
}`
          ],
          body: `  vec2 p = gl_FragCoord.xy / u_resolution;
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
  gl_FragColor = vec4(g1 * vec3(g4 * g4), 1.0);`,
          indent: 0,
          indentationStr: '  '
        },
        generated: `precision highp float;
uniform vec4 u_seed;
uniform float u_resolution;


float rand(float f);
float rand(vec2 v);
vec2 randGrad(vec2 v);
float noise(vec2 op);
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
}
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
}`
      }
    ];
    describe('A', function() {
      sss.forEach(function(snippetSource, i) {
        describe(`parameter set #${i + 1}: ${snippetSource.name}`, function() {
          var source, parameters, params, generated;
          var snippet;

          beforeEach(() => {
            source = snippetSource.source;
            parameters = snippetSource.parameters;
            params = snippetSource.params;
            generated = snippetSource.generated;
            snippet = new $oaWebglShaderSnippet();
            snippet.source = source;
            Object.keys(parameters).forEach(k => {
              snippet.setParameter(k, parameters[k]);
            });
          });

          it('should generate correct string', function() {
            assert.equal(snippet.generate(params), generated);
          });
        });
      });
    });

    var i = sss.length;
    describe('B', function() {
      var vertexShaderSnippet;
      var vertexShaderInnerSnippet;

      beforeEach(() => {
        vertexShaderSnippet = new $oaWebglShaderSnippet();
        vertexShaderSnippet.source = `precision \${precision:mediump} float;
\${a:uniforms:\n}
\${a:attributes:\n}
\${a:varying:\n}
\${a:definitions:\n}
void main() {
\${s:body:gl_Position = vec4(0.0);}
}
\${a:declarations:\n}`;
      });

      describe(`parameter set #${i + 1}: snippet value`, function() {
        var generated;

        beforeEach(() => {
          vertexShaderInnerSnippet = new $oaWebglShaderSnippet();
          vertexShaderInnerSnippet.source = 'gl_Position = a_position;';
          vertexShaderSnippet.setParameter('attributes', ['attribute vec4 a_position;']);
          vertexShaderSnippet.setParameter('body', vertexShaderInnerSnippet);
          vertexShaderSnippet.setSnippetParameter('body', 'indent', 1);
          generated = `precision mediump float;

attribute vec4 a_position;


void main() {
  gl_Position = a_position;
}
`;
        });

        it('should generate correct string', function() {
          assert.equal(vertexShaderSnippet.generate(), generated);
        });
      });
    });
  });
});
