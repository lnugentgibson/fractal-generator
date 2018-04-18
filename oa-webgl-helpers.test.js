'use strict';

//var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var _require = require('./test-helpers'),
    inject = _require.inject,
    ngModule = _require.ngModule;

// Loads the module we want to test


require('./oa-webgl-helpers');

describe('oaWebglHelpers module', function () {
  beforeEach(ngModule('oaWebglHelpers'));
  describe('oaWebglHelpers service', function () {
    var $oaWebglHelpers;

    beforeEach(inject(function (oaWebglHelpers) {
      $oaWebglHelpers = oaWebglHelpers;
    }));

    describe('FLOAT32 property', function () {
      it('should be defined', function () {
        assert.isDefined($oaWebglHelpers.FLOAT32, 'oaWebglHelpers.FLOAT32 not defined:\n' + JSON.stringify(Object.keys($oaWebglHelpers), null, 2));
      });

      it('should be different from UINT16', function () {
        assert.notEqual($oaWebglHelpers.FLOAT32, $oaWebglHelpers.UINT16, 'oaWebglHelpers.FLOAT32 and oaWebglHelpers.UINT16 should not be equal');
      });
    });

    describe('UINT16 property', function () {
      it('should be defined', function () {
        assert.isDefined($oaWebglHelpers.UINT16, 'oaWebglHelpers.UINT16 not defined:\n' + JSON.stringify(Object.keys($oaWebglHelpers), null, 2));
      });

      it('should be different from FLOAT32', function () {
        assert.notEqual($oaWebglHelpers.FLOAT32, $oaWebglHelpers.UINT16, 'oaWebglHelpers.FLOAT32 and oaWebglHelpers.UINT16 should not be equal');
      });
    });
  });
  describe('oaWebglShaderSnippet factory', function () {
    var $oaWebglShaderSnippet;

    beforeEach(inject(function (oaWebglShaderSnippet) {
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
      source: '1: "${array:param1}"\n2: "${a:param2:-}"\n3: "${arr:param3::<>}"\n4: "${a:param4:::!}"',
      parameters: {
        param1: [0, 1, 2, 3, 4],
        param2: ['ng', 'webgl', 'helpers'],
        param3: [],
        param4: [null, '^', null]
      },
      generated: '1: "01234"\n2: "ng-webgl-helpers"\n3: "<>"\n4: "!^!"'
    },
    // missing parameter substitution
    {
      name: 'missing parameter substitution',
      source: 'param1 = "${param1:v1}"\nparam2 = "${paramB:v2}"',
      parameters: {
        param1: 'Val1'
      },
      generated: 'param1 = "Val1"\nparam2 = "v2"'
    },
    // single substitution in vertex shader
    {
      name: 'single substitution in vertex shader',
      source: 'precision ${precision:mediump} float;\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}',
      parameters: {
        precision: 'mediump'
      },
      generated: 'precision mediump float;\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}'
    },
    // single substitution in vertex shader with line numbers
    {
      name: 'single substitution in vertex shader with line numbers',
      source: 'precision ${precision} float;\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}',
      parameters: {
        precision: 'mediump',
        lineNumbers: true,
        lineNumberWidth: 2
      },
      generated: '01: precision mediump float;\n02: attribute vec4 a_position;\n03: void main() {\n04:   gl_Position = a_position;\n05: }'
    },
    // single substitution in vertex shader with indentation
    {
      name: 'single substitution in vertex shader with indentation',
      source: 'void main() {\n  gl_Position = a_position;\n}',
      parameters: {
        indent: 1,
        indentationStr: '  '
      },
      generated: '  void main() {\n    gl_Position = a_position;\n  }'
    },
    // shader template
    {
      name: 'shader template I',
      source: 'precision ${precision:mediump} float;\n${a:attributes:\n}\nvoid main() {\n  gl_Position = vec4(0.0);\n}',
      parameters: {
        precision: 'highp',
        indent: 0,
        indentationStr: '  '
      },
      generated: 'precision highp float;\n\nvoid main() {\n  gl_Position = vec4(0.0);\n}'
    },
    // shader template 2
    {
      name: 'shader template II',
      source: 'precision ${precision:mediump} float;\n${a:attributes:\n}\nvoid main() {\n  gl_Position = a_position;\n}',
      parameters: {
        precision: 'highp',
        attributes: ['attribute vec4 a_position;'],
        indent: 0,
        indentationStr: '  '
      },
      generated: 'precision highp float;\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}'
    },
    // shader template 3
    {
      name: 'shader template III',
      source: 'precision ${precision:mediump} float;\n${a:uniforms:\n}\n${a:attributes:\n}\n${a:varying:\n}\n${a:declarations:\n}\nvoid main() {\n${body}\n}\n${a:definitions:\n}',
      parameters: {
        precision: 'highp',
        uniforms: ['uniform vec4 u_seed;', 'uniform float u_resolution;'],
        declarations: ['float rand(float f);', 'float rand(vec2 v);', 'vec2 randGrad(vec2 v);', 'float noise(vec2 op);'],
        definitions: ['float rand(float f) {\n  return fract(sin(f + u_seed.z) * u_seed.w);\n}', 'float rand(vec2 v) {\n  return rand(dot(v, u_seed.xy));\n}', 'vec2 randGrad(vec2 v) {\n  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));\n  return vec2(cos(a), sin(a));\n}', 'float noise(vec2 op) {\n  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));\n  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));\n  vec2 ip = it * op;\n  vec2 il = floor(ip);\n  vec2 f = fract(ip);\n  vec2 ol = t * il;\n  vec2 oc, oc1, oc2, oc3;\n  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);\n  oc2 = ol + vec2(1.0, 0.0);\n  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));\n  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;\n  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;\n  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;\n  if(f.x + f.y < 1.0) {\n    oc1 = ol;\n    x13 = -0.5;\n    y13 = -sqrt(3.0 / 4.0);\n  }\n  else {\n    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));\n    x13 = 1.0;\n    y13 = 0.0;\n  }\n  x13 = oc1.x - oc3.x;\n  y13 = oc1.y - oc3.y;\n  vec3 r = vec3(dot(randGrad(oc1), op - oc1), dot(randGrad(oc2), op - oc2), dot(randGrad(oc3), op - oc3));\n  //r = vec3(0.0, 0.0, 1.0);\n  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));\n  //vec3 w = 1.0 / d;\n  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);\n  w.z = 1.0 - w.x - w.y;\n  vec3 w3 = w * w * (3.0 - 2.0 * w);\n  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);\n  vec3 rv = r * w5;\n  return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);\n}'],
        body: '  vec2 p = gl_FragCoord.xy / u_resolution;\n  float s1 = noise(p / 4.0) * 0.5 + 0.5;\n  //vec2 sp = p + s1;\n  float s2 = (1.0 - s1) * 0.7 + (noise(p) * 0.5 + 0.5) * 0.3;\n  float g1 = smoothstep(0.18, 0.2, s1 * s1);\n  float g2 = smoothstep(0.14, 0.16, s2 * s2);\n  float g3 = smoothstep(0.18, 0.25, s2 * s2);\n  float g4 = 1.0 + g3 - g2;\n  gl_FragColor = vec4(vec3(s1 * s1), 1.0);\n  gl_FragColor = vec4(vec3(s2 * s2), 1.0);\n  gl_FragColor = vec4(vec3(g2 * g2), 1.0);\n  gl_FragColor = vec4(vec3(g3 * g3), 1.0);\n  gl_FragColor = vec4(g1 * vec3(g4 * g4), 1.0);',
        indent: 0,
        indentationStr: '  '
      },
      generated: 'precision highp float;\nuniform vec4 u_seed;\nuniform float u_resolution;\n\n\nfloat rand(float f);\nfloat rand(vec2 v);\nvec2 randGrad(vec2 v);\nfloat noise(vec2 op);\nvoid main() {\n  vec2 p = gl_FragCoord.xy / u_resolution;\n  float s1 = noise(p / 4.0) * 0.5 + 0.5;\n  //vec2 sp = p + s1;\n  float s2 = (1.0 - s1) * 0.7 + (noise(p) * 0.5 + 0.5) * 0.3;\n  float g1 = smoothstep(0.18, 0.2, s1 * s1);\n  float g2 = smoothstep(0.14, 0.16, s2 * s2);\n  float g3 = smoothstep(0.18, 0.25, s2 * s2);\n  float g4 = 1.0 + g3 - g2;\n  gl_FragColor = vec4(vec3(s1 * s1), 1.0);\n  gl_FragColor = vec4(vec3(s2 * s2), 1.0);\n  gl_FragColor = vec4(vec3(g2 * g2), 1.0);\n  gl_FragColor = vec4(vec3(g3 * g3), 1.0);\n  gl_FragColor = vec4(g1 * vec3(g4 * g4), 1.0);\n}\nfloat rand(float f) {\n  return fract(sin(f + u_seed.z) * u_seed.w);\n}\nfloat rand(vec2 v) {\n  return rand(dot(v, u_seed.xy));\n}\nvec2 randGrad(vec2 v) {\n  float a = 2.0 * 3.14159265358 * rand(dot(v, u_seed.xy));\n  return vec2(cos(a), sin(a));\n}\nfloat noise(vec2 op) {\n  mat2 t = mat2(1.0, 0.0, 0.5, sqrt(3.0 / 4.0));\n  mat2 it = mat2(1.0, 0.0, -sqrt(1.0 / 3.0), 2.0 * sqrt(1.0 / 3.0));\n  vec2 ip = it * op;\n  vec2 il = floor(ip);\n  vec2 f = fract(ip);\n  vec2 ol = t * il;\n  vec2 oc, oc1, oc2, oc3;\n  oc = ol + vec2(0.75, sqrt(3.0) / 4.0);\n  oc2 = ol + vec2(1.0, 0.0);\n  oc3 = ol + vec2(0.5, sqrt(3.0 / 4.0));\n  //float y23 = -sqrt(3.0 / 4.0), x32 = -0.5, x13, y13;\n  float y23 = oc2.y - oc3.y, x32 = oc3.x - oc2.x, x13, y13;\n  float x03 = op.x - oc3.x, y03 = op.y - oc3.y;\n  if(f.x + f.y < 1.0) {\n    oc1 = ol;\n    x13 = -0.5;\n    y13 = -sqrt(3.0 / 4.0);\n  }\n  else {\n    oc1 = ol + vec2(1.5, sqrt(3.0 / 4.0));\n    x13 = 1.0;\n    y13 = 0.0;\n  }\n  x13 = oc1.x - oc3.x;\n  y13 = oc1.y - oc3.y;\n  vec3 r = vec3(dot(randGrad(oc1), op - oc1), dot(randGrad(oc2), op - oc2), dot(randGrad(oc3), op - oc3));\n  //r = vec3(0.0, 0.0, 1.0);\n  //vec3 d = vec3(length(op - oc1), length(op - oc2), length(op - oc3));\n  //vec3 w = 1.0 / d;\n  vec3 w = vec3((y23 * x03 + x32 * y03) / (y23 * x13 + x32 * y13), (-y13 * x03 + x13 * y03) / (y23 * x13 + x32 * y13), 0.0);\n  w.z = 1.0 - w.x - w.y;\n  vec3 w3 = w * w * (3.0 - 2.0 * w);\n  vec3 w5 = w * w * w * (6.0 * w * w - 15.0 * w + 10.0);\n  vec3 rv = r * w5;\n  return (rv.x + rv.y + rv.z) / (w5.x + w5.y + w5.z);\n}'
    }];
    describe('A', function () {
      sss.forEach(function (snippetSource, i) {
        describe('parameter set #' + (i + 1) + ': ' + snippetSource.name, function () {
          var source, parameters, params, generated;
          var snippet;

          beforeEach(function () {
            source = snippetSource.source;
            parameters = snippetSource.parameters;
            params = snippetSource.params;
            generated = snippetSource.generated;
            snippet = new $oaWebglShaderSnippet();
            snippet.source = source;
            Object.keys(parameters).forEach(function (k) {
              snippet.setParameter(k, parameters[k]);
            });
          });

          it('should generate correct string', function () {
            assert.equal(snippet.generate(params), generated);
          });
        });
      });
    });

    var i = sss.length;
    describe('B', function () {
      var vertexShaderSnippet;
      var vertexShaderInnerSnippet;

      beforeEach(function () {
        vertexShaderSnippet = new $oaWebglShaderSnippet();
        vertexShaderSnippet.source = 'precision ${precision:mediump} float;\n${a:uniforms:\n}\n${a:attributes:\n}\n${a:varying:\n}\n${a:definitions:\n}\nvoid main() {\n${s:body:gl_Position = vec4(0.0);}\n}\n${a:declarations:\n}';
      });

      describe('parameter set #' + (i + 1) + ': snippet value', function () {
        var generated;

        beforeEach(function () {
          vertexShaderInnerSnippet = new $oaWebglShaderSnippet();
          vertexShaderInnerSnippet.source = 'gl_Position = a_position;';
          vertexShaderSnippet.setParameter('attributes', ['attribute vec4 a_position;']);
          vertexShaderSnippet.setParameter('body', vertexShaderInnerSnippet);
          vertexShaderSnippet.setSnippetParameter('body', 'indent', 1);
          generated = 'precision mediump float;\n\nattribute vec4 a_position;\n\n\nvoid main() {\n  gl_Position = a_position;\n}\n';
        });

        it('should generate correct string', function () {
          assert.equal(vertexShaderSnippet.generate(), generated);
        });
      });
    });
  });
});
