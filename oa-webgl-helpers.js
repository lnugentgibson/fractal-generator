'use strict';

/**
 * OAlpha WebGL Helper Library
 */
var _window = window,
    angular = _window.angular,
    _ = _window._;


function GlHelpGen() {
  function oaWebglHelpers() {
    this.FLOAT32 = 0;
    this.UINT16 = 1;
    this.loadShader = function loadShader(gl, type, source, onErr) {
      if (!onErr) onErr = function onErr(msg) {
        return console.error(msg);
      };
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        onErr(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    this.loadProgram = function loadProgram(gl, vertexSource, fragmentSource, onErr) {
      if (!onErr) onErr = function onErr(msg) {
        return console.error(msg);
      };
      var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexSource, function (msg) {
        onErr('VERTEXSHADER\n' + msg);
      });
      if (!vertexShader) {
        onErr('vertexshader failed to compile');
        return null;
      }
      var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource, function (msg) {
        onErr('FRAGMENTSHADER\n' + msg);
      });
      if (!vertexShader) {
        onErr('fragmentshader failed to compile');
        return null;
      }
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        onErr(gl.getProgramInfoLog(shaderProgram));
        return null;
      }
      return shaderProgram;
    };
  }
  return new oaWebglHelpers();
}

function ShaderHelpGen() {
  function oaWebglShaderHelpers() {
    var _this = this;

    var constants = [{
      type: 'datatype',
      name: 'BOOL',
      data: {
        string: 'bool',
        id: 'b'
      }
    }, {
      type: 'datatype',
      name: 'INT',
      data: {
        string: 'int',
        id: 'i'
      }
    }, {
      type: 'datatype',
      name: 'UINT',
      data: {
        string: 'uint',
        id: 'u'
      }
    }, {
      type: 'datatype',
      name: 'FLOAT',
      data: {
        string: 'float',
        id: 'f'
      }
    }, {
      type: 'datatype',
      name: 'BVEC2',
      data: {
        string: 'bvec2',
        id: 'b2'
      }
    }, {
      type: 'datatype',
      name: 'BVEC3',
      data: {
        string: 'bvec3',
        id: 'b3'
      }
    }, {
      type: 'datatype',
      name: 'BVEC4',
      data: {
        string: 'bvec4',
        id: 'b4'
      }
    }, {
      type: 'datatype',
      name: 'IVEC2',
      data: {
        string: 'ivec2',
        id: 'i2'
      }
    }, {
      type: 'datatype',
      name: 'IVEC3',
      data: {
        string: 'ivec3',
        id: 'i3'
      }
    }, {
      type: 'datatype',
      name: 'IVEC4',
      data: {
        string: 'ivec4',
        id: 'i4'
      }
    }, {
      type: 'datatype',
      name: 'UVEC2',
      data: {
        string: 'uvec2',
        id: 'u2'
      }
    }, {
      type: 'datatype',
      name: 'UVEC3',
      data: {
        string: 'uvec3',
        id: 'u3'
      }
    }, {
      type: 'datatype',
      name: 'UVEC4',
      data: {
        string: 'uvec4',
        id: 'u4'
      }
    }, {
      type: 'datatype',
      name: 'VEC2',
      data: {
        string: 'vec2',
        id: 'v2'
      }
    }, {
      type: 'datatype',
      name: 'VEC3',
      data: {
        string: 'vec3',
        id: 'v3'
      }
    }, {
      type: 'datatype',
      name: 'VEC4',
      data: {
        string: 'vec4',
        id: 'v4'
      }
    }, {
      type: 'datatype',
      name: 'MAT2',
      data: {
        string: 'mat2',
        id: 'm2'
      }
    }, {
      type: 'datatype',
      name: 'MAT3',
      data: {
        string: 'mat3',
        id: 'm3'
      }
    }, {
      type: 'datatype',
      name: 'MAT4',
      data: {
        string: 'mat4',
        id: 'm4'
      }
    }, {
      type: 'datatype',
      name: 'MAT2x3',
      data: {
        string: 'mat2x3',
        id: 'm23'
      }
    }, {
      type: 'datatype',
      name: 'MAT2x4',
      data: {
        string: 'mat2x4',
        id: 'm24'
      }
    }, {
      type: 'datatype',
      name: 'MAT3x2',
      data: {
        string: 'mat3x2',
        id: 'm32'
      }
    }, {
      type: 'datatype',
      name: 'MAT3x4',
      data: {
        string: 'mat3x4',
        id: 'm34'
      }
    }, {
      type: 'datatype',
      name: 'MAT4x2',
      data: {
        string: 'mat4x2',
        id: 'm42'
      }
    }, {
      type: 'datatype',
      name: 'MAT4x3',
      data: {
        string: 'mat4x3',
        id: 'm43'
      }
    }];
    if (false) console.log({
      keys: constants.map(function (c) {
        return c.type.toUpperCase() + '_' + c.name;
      }),
      names: constants.map(function (c) {
        return c.name;
      }),
      strings: constants.map(function (c) {
        return c.data.string;
      }),
      ids: constants.map(function (c) {
        return c.data.id;
      })
    });
    constants.forEach(function (c, i) {
      //console.log(c);
      Object.defineProperty(_this, c.type.toUpperCase() + '_' + c.name, {
        get: function get() {
          return i;
        }
      });
    });
    this.glDataType = function glDataType(type) {
      if (!constants[type]) return null;
      return constants[type].data.string;
    };
    this.glDataTypeId = function glDataTypeId(type) {
      if (!constants[type]) return null;
      return constants[type].data.id;
    };
    if (false) Object.defineProperties(this, {
      DATATYPE_BOOL: {
        get: function get() {
          return 0;
        }
      },
      DATATYPE_INT: {
        get: function get() {
          return 1;
        }
      },
      DATATYPE_UINT: {
        get: function get() {
          return 2;
        }
      },
      DATATYPE_FLOAT: {
        get: function get() {
          return 3;
        }
      },
      DATATYPE_BVECT2: {
        get: function get() {
          return 4;
        }
      },
      DATATYPE_BVECT3: {
        get: function get() {
          return 5;
        }
      },
      DATATYPE_BVECT4: {
        get: function get() {
          return 6;
        }
      },
      DATATYPE_IVEC2: {
        get: function get() {
          return 7;
        }
      },
      DATATYPE_IVEC3: {
        get: function get() {
          return 8;
        }
      },
      DATATYPE_IVEC4: {
        get: function get() {
          return 9;
        }
      },
      DATATYPE_UVEC2: {
        get: function get() {
          return 10;
        }
      },
      DATATYPE_UVEC3: {
        get: function get() {
          return 11;
        }
      },
      DATATYPE_UVEC4: {
        get: function get() {
          return 12;
        }
      },
      DATATYPE_VEC2: {
        get: function get() {
          return 13;
        }
      },
      DATATYPE_VEC3: {
        get: function get() {
          return 14;
        }
      },
      DATATYPE_VEC4: {
        get: function get() {
          return 15;
        }
      },
      DATATYPE_MAT2: {
        get: function get() {
          return 16;
        }
      },
      DATATYPE_MAT3: {
        get: function get() {
          return 17;
        }
      },
      DATATYPE_MAT4: {
        get: function get() {
          return 18;
        }
      },
      DATATYPE_MAT23: {
        get: function get() {
          return 19;
        }
      },
      DATATYPE_MAT24: {
        get: function get() {
          return 20;
        }
      },
      DATATYPE_MAT32: {
        get: function get() {
          return 21;
        }
      },
      DATATYPE_MAT34: {
        get: function get() {
          return 22;
        }
      },
      DATATYPE_MAT42: {
        get: function get() {
          return 23;
        }
      },
      DATATYPE_MAT43: {
        get: function get() {
          return 24;
        }
      }
    });
    this.precision = 9;
    this.orthagonalBasis = function (_options) {
      var inA = _options.inA,
          outA = _options.outA,
          inB = _options.inB,
          outB = _options.outB,
          c = _options.c,
          swap = _options.swap;

      return 'vec4 ' + outA + ' = vec4(normalize(' + inA + '.xyz), 0.0);\nvec4 ' + c + ' = vec4(normalize(cross(normalize(' + inB + ').xyz, cz.xyz)), 0.0);\nvec4 ' + outB + ' = vec4(normalize(cross(' + (swap ? c : outA) + '.xyz, ' + (swap ? outA : c) + '.xyz)), 0.0);';
    };
    this.cameraMatrix = function (_options) {
      var _Object$assign = Object.assign({
        cameraPosition: 'camP',
        cameraDirection: 'camZ',
        cameraUp: 'camY',
        matrix: 'cameraMatrix',
        normalizedDirection: 'cz',
        normalizedUp: 'cy',
        right: 'cx'
      }, _options),
          p = _Object$assign.cameraPosition,
          z = _Object$assign.cameraDirection,
          y = _Object$assign.cameraUp,
          m = _Object$assign.matrix,
          Z = _Object$assign.normalizedDirection,
          Y = _Object$assign.normalizedUp,
          X = _Object$assign.right;

      var basis = this.orthagonalBasis({
        inA: z,
        outA: Z,
        inB: y,
        outB: Y,
        c: X,
        swap: true
      });
      return basis + '\nmat4 ' + m + ' = inverse(mat4(cx, cy, cz, vec4(vec3(0.0), 1.0))) * mat4(vec4(1.0, vec3(0.0)), vec4(0.0, 1.0, vec2(0.0)), vec4(vec2(0.0), 1.0, 0.0), vec4(-' + p + '.xyz, 1.0))';
    };
    this.projectionMatrix = function (_options) {
      var _Object$assign2 = Object.assign({
        fov: 'fov',
        far: 'far',
        near: 'near'
      }, _options),
          fov = _Object$assign2.fov,
          far = _Object$assign2.far,
          near = _Object$assign2.near;

      return 'mat4(vec4(1.0 / tan(' + fov + '.x / 2.0), vec3(0.0)), vec4(0.0, 1.0 / tan(' + fov + '.y / 2.0), vec2(0.0)), ve4(vec2(0.0), -(' + far + ' + ' + near + ') / (' + far + ' - ' + near + '), -1.0), vec4(vec2(0.0), -' + far + ' * ' + near + ' / (' + far + ' - ' + near + '), 0.0));';
    };
  }
  return new oaWebglShaderHelpers();
}

function SnippetGen() {
  var parameterMarker = /(^|[^\$])\$/;
  var expressionRegexGlobal = new RegExp(parameterMarker.source + '{([^}]+)}', 'ig');
  var parameterReferenceRegexString = /P\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var parameterReferenceRegexGlobal = new RegExp(parameterReferenceRegexString.source, 'ig');
  var parameterReferenceRegex = new RegExp(parameterReferenceRegexString.source, 'i');
  var arrayReferenceRegexString = /A\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var arrayReferenceRegexGlobal = new RegExp(arrayReferenceRegexString.source, 'ig');
  var arrayReferenceRegex = new RegExp(arrayReferenceRegexString.source, 'i');
  var snippetReferenceRegexString = /S\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)", *"([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var snippetReferenceRegexGlobal = new RegExp(snippetReferenceRegexString.source, 'ig');
  var snippetReferenceRegex = new RegExp(snippetReferenceRegexString.source, 'i');
  var dynamicSnippetReferenceRegexString = /D\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)", *"([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var dynamicSnippetReferenceRegexGlobal = new RegExp(dynamicSnippetReferenceRegexString.source, 'ig');
  var dynamicSnippetReferenceRegex = new RegExp(dynamicSnippetReferenceRegexString.source, 'i');
  if (false) console.log(JSON.stringify({
    marker: parameterMarker.toString(),
    expression: expressionRegexGlobal.toString(),
    parameterGlobal: parameterReferenceRegexGlobal.toString(),
    parameter: parameterReferenceRegex.toString(),
    snippetGlobal: snippetReferenceRegexGlobal.toString(),
    snippet: snippetReferenceRegex.toString()
  }, null, 2));

  function Snippet(name, source) {
    var _this2 = this;

    var specifiers = {
      'null': {
        datatype: this.DATATYPE_OBJECT
      },
      indent: {
        datatype: this.DATATYPE_OBJECT,
        nullValue: 0
      },
      indentationStr: {
        datatype: this.DATATYPE_OBJECT,
        nullValue: '  '
      },
      lineNumbers: {
        datatype: this.DATATYPE_OBJECT,
        nullValue: false
      },
      lineNumberWidth: {
        datatype: this.DATATYPE_OBJECT,
        nullValue: 4
      }
    };
    var objectKeys = {
      'null': {},
      indent: true,
      indentationStr: true,
      lineNumbers: true,
      lineNumberWidth: true
    };
    var parameters = {};
    var snippets = {};

    this.addParameter = function (t, k, s, o) {
      var _Object$assign3 = Object.assign({
        replace: false
      }, o),
          replace = _Object$assign3.replace,
          ignore = _Object$assign3.ignore;

      if (specifiers[k]) {
        if (ignore) return;
        if (!replace) throw 'parameter ' + k + ' already exists';
        //apples.thorwup();
      }
      if (!Snippet.parameterType(t)) {
        console.log('invalid type: ' + t);
        return;
      }
      var match = k.match(/^([a-z][_a-z0-9]*)(\.([a-z][_a-z0-9]*)|\[([0-9]+)\])*$/i);
      if (false) console.log({
        match: match
      });
      if (!match) return;
      var ks = k.match(/\.([a-z][_a-z0-9]*)|\[([0-9]+)\]/ig);
      //console.log(ks);
      var parent = objectKeys,
          child;
      if (ks) {
        var k0 = k.match(/^([a-z][_a-z0-9]*)/i)[1];
        ks = [{
          key: k0,
          match: k0
        }].concat(ks.map(function (match) {
          var breakdown = match.match(/\.([a-z][_a-z0-9]*)|\[([0-9]+)\]/i);
          var type;
          var key;
          if (breakdown[1]) {
            type = 'o';
            key = breakdown[1];
          } else {
            type = 'a';
            key = parseInt(breakdown[2], 10);
          }
          return {
            match: match,
            breakdown: breakdown,
            type: type,
            key: key
          };
        }));
        var rk = ks[0].key;
        //console.log(k);
        for (var i = 0; i + 1 < ks.length; i++) {
          //console.log(rk);
          child = parent[ks[i].key];
          if (!child) child = parent[ks[i].key] = ks[i + 1].type === 'o' ? {} : [];
          if (!specifiers[rk]) specifiers[rk] = ks[i + 1].type === 'o' ? {
            parameterType: 'o',
            datatype: 'default',
            nullObject: '',
            nullProperty: '',
            validators: []
          } : {
            parameterType: 'a',
            datatype: 'default',
            nullArray: '',
            nullElement: '',
            delimiter: '',
            prefix: '',
            suffix: '',
            validators: []
          };
          parent = child;
          rk += ks[i + 1].match;
        }
      }
      s = Object.assign({}, s);
      switch (t) {
        case _this2.PARAMTYPE_OBJECT:
          {
            specifiers[k] = Object.assign({
              parameterType: _this2.PARAMTYPE_OBJECT,
              datatype: _this2.DATATYPE_DEFAULT,
              nullObject: '',
              nullProperty: '',
              validators: []
            }, s.filter(['datatype', 'nullObject', 'nullProperty']));
            if (parent[ks[ks.length - 1]] == undefined) parent[ks[ks.length - 1]] = {};
            break;
          }
        case _this2.PARAMTYPE_ARRAY:
          {
            specifiers[k] = Object.assign({
              parameterType: _this2.PARAMTYPE_ARRAY,
              datatype: _this2.DATATYPE_DEFAULT,
              nullArray: '',
              nullElement: '',
              delimiter: '',
              prefix: '',
              suffix: '',
              minlenth: 0,
              maxlength: -1,
              length: -1,
              validators: []
            }, s.filter(['datatype', 'nullArray', 'nullElement', 'delimiter', 'prefix', 'suffix', 'minlenth', 'maxlength', 'length']));
            parent[ks[ks.length - 1]] = true;
            break;
          }
        case _this2.PARAMTYPE_VALUE:
          {
            var constraints = {};
            switch (s.datatype) {
              case _this2.DATATYPE_STRING:
                constraints = Object.assign({
                  pattern: null,
                  minlength: 0,
                  maxlength: -1,
                  length: -1
                }, s.filter(['pattern', 'minlength', 'maxlength', 'length']));
                break;
              case _this2.DATATYPE_INT:
              case _this2.DATATYPE_FLOAT:
                constraints = Object.assign({
                  pattern: null,
                  min: null,
                  max: null
                }, s.filter(['pattern', 'min', 'max']));
                break;
            }
            specifiers[k] = Object.assign({
              parameterType: _this2.PARAMTYPE_VALUE,
              datatype: _this2.DATATYPE_DEFAULT,
              nullValue: '',
              validators: []
            }, constraints, s.filter(['datatype', 'nullValue']));
            parent[ks[ks.length - 1]] = true;
            break;
          }
      }
      if (false) console.log(JSON.stringify({
        objectKeys: objectKeys,
        specifiers: specifiers
      }, null, 2));
    };
    this.getParameterNames = function () {
      return specifiers.getKeys();
    };
    this.getParameterValues = function () {
      var pvs = {};
      specifiers.getKeys().forEach(function (k) {
        pvs[k] = parameters[k];
      });
      return pvs;
    };
    this.setParameterValue = function (k, v) {
      var specifier = specifiers[k];
      if (!specifier) return;
      var datatype = specifier.datatype,
          validators = specifier.validators;

      switch (datatype) {
        case _this2.DATATYPE_BOOL:
          v = !!v;
          break;
        case _this2.DATATYPE_STRING:
          v = v.toString();
          break;
        case _this2.DATATYPE_INT:
          v = parseInt(v, 10);
          if (isNaN(v)) return;
          break;
        case _this2.DATATYPE_FLOAT:
          v = parseFloat(v);
          if (isNaN(v)) return;
          break;
        case _this2.DATATYPE_OBJECT:
          break;
        case _this2.DATATYPE_TEMPLATE:
          break;
        case _this2.DATATYPE_ARRAY:
          break;
      }
      if (validators.map(function (validator) {
        return validator(v);
      }).every(function (valid) {
        return valid;
      })) parameters[k] = v;
    };

    this.addSnippet = function (k, s) {
      if (snippets[k]) throw 'snippet already exists';
      snippets[k] = s;
    };
    this.addSnippets = function (ss) {
      _(ss).each(function (s, k) {
        _this2.addSnippet(k, s);
      });
    };
    this.setSnippet = function (k, s) {
      snippets[k] = s;
    };
    this.addSnippets = function (ss) {
      _(ss).each(function (s, k) {
        _this2.sddSnippet(k, s);
      });
    };
    this.getSnippetNames = function () {
      return snippets.getKeys();
    };

    function render(string, options) {
      var _Object$assign4 = Object.assign({
        indent: 0,
        indentationStr: '  ',
        lineNumbers: false,
        lineNumberWidth: 4
      }, options),
          indent = _Object$assign4.indent,
          indentationStr = _Object$assign4.indentationStr,
          lineNumbers = _Object$assign4.lineNumbers,
          lineNumberWidth = _Object$assign4.lineNumberWidth;

      var i;
      var indentaion = '';
      for (i = 0; i < indent; i++) {
        indentaion += indentationStr;
      }var zeros = '';
      for (i = 0; i < lineNumberWidth; i++) {
        zeros += '0';
      }return string.split(/\n/g).map(function (line, i) {
        var lineNumber = lineNumbers ? (zeros + (i + 1)).substr(-lineNumberWidth, lineNumberWidth) + ': ' : '';
        return lineNumber + indentaion + line;
      }).join('\n');
    }

    function applyParams(string, _params, touch) {
      var params = Object.assign({}, _params);
      if (false) console.log(JSON.stringify({
        specifiers: specifiers,
        objectKeys: objectKeys,
        parameters: parameters,
        params: params,
        snippets: snippets
      }, null, 2));

      function O(param) {
        var object = specifiers[param];
        if (object.parameterType !== 'a') return;
        var objectValue = params[param];
        var out = objectValue ? objectValue : {};
        if (false) console.log(JSON.stringify({
          param: param,
          object: object,
          objectValue: objectValue,
          out: out
        }, null, 2));
        return out;
      }

      function A(param) {
        var array = specifiers[param];
        if (array.parameterType !== 'a') return;
        var arrayElements = params[param];
        var out = arrayElements && arrayElements.length ? arrayElements.map(function (e) {
          return e != null ? e : array.nullElement;
        }) : [];
        if (false) console.log(JSON.stringify({
          param: param,
          array: array,
          arrayElements: arrayElements,
          out: out
        }, null, 2));
        return out;
      }

      function P(param) {
        if (false) console.log({
          f: 'P',
          param: param
        });
        var spec = specifiers[param];
        var out;
        if (spec.parameterType === 'a') {
          var arrayElements = params[param];
          out = arrayElements && arrayElements.length ? arrayElements.map(function (e) {
            return e != null ? e : spec.nullElement;
          }).join(spec.delimiter) : spec.nullArray;
        } else {
          var paramValue = params[param];
          out = paramValue == undefined ? spec.nullValue : paramValue;
        }
        if (false) console.log({
          param: param,
          spec: spec,
          paramValue: paramValue,
          out: out
        });
        return out;
      }

      function S(param, paramSet) {
        if (false) console.log({
          f: 'S',
          snippet: param,
          param: paramSet
        });
        var value = specifiers[paramSet];
        var out;
        if (value.parameterType === 'a') {
          if (false) console.log(JSON.stringify({
            type: 'a',
            value: params[paramSet]
          }, null, 2));
          out = params[paramSet] ? params[paramSet].map(function (p) {
            return snippets[param].generate(p);
          }).join(value.delimiter) : '';
          //out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)) : snippets[param].generate();
        } else {
          if (false) console.log(JSON.stringify({
            type: '!a',
            value: params[paramSet]
          }, null, 2));
          out = snippets[param].generate(params[paramSet]);
        }
        if (false) console.log({
          snippet: param,
          param: paramSet,
          out: out
        });
        return out;
      }

      function D(param, paramSet) {
        if (false) console.log({
          f: 'D',
          snippet: param,
          param: paramSet
        });
        var pspec = specifiers[paramSet];
        var sspec = specifiers[param];
        var out;
        if (sspec.parameterType === 'a' && pspec.parameterType === 'a') {
          out = '';
          //out = params[param] ? params[param].map(p => snippets[p].generate(params[paramSet])).join(sspec.delimiter) : '';
        } else if (pspec.parameterType === 'a') {
          if (false) console.log(JSON.stringify({
            type: 'a',
            value: params[paramSet]
          }, null, 2));
          out = params[paramSet] ? params[paramSet].map(function (p) {
            return snippets[param].generate(p);
          }).join(pspec.delimiter) : '';
          //out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)) : snippets[param].generate();
        } else if (sspec.parameterType === 'a') {
          out = params[param] ? params[param].map(function (p) {
            return snippets[p].generate(params[paramSet]);
          }).join(sspec.delimiter) : '';
        } else {
          if (false) console.log(JSON.stringify({
            type: '!a',
            value: params[paramSet]
          }, null, 2));
          out = snippets[param].generate(params[paramSet]);
        }
        if (false) console.log({
          snippet: param,
          param: paramSet,
          out: out
        });
        return out;
      }

      function apply(exp) {
        return eval(exp);
      }

      if (false) console.log(string);
      var out = string.replace(expressionRegexGlobal, function (match, p1, p2) {
        if (false) console.log(JSON.stringify({
          match: match,
          p1: p1,
          p2: p2
        }, null, 2));
        var prefix = p1,
            exp = p2;

        var parameterMatches = exp.match(parameterReferenceRegexGlobal) || [];
        var arrayMatches = exp.match(arrayReferenceRegexGlobal) || [];
        var snippetMatches = exp.match(snippetReferenceRegexGlobal) || [];
        var dynamicSnippetMatches = exp.match(dynamicSnippetReferenceRegexGlobal) || [];
        if (false) console.log(JSON.stringify({
          exp: exp,
          parameterMatches: parameterMatches,
          arrayMatches: arrayMatches,
          snippetMatches: snippetMatches,
          dynamicSnippetMatches: dynamicSnippetMatches
        }, null, 2));
        var parameterReferences = parameterMatches.map(function (match) {
          return match.match(parameterReferenceRegex);
        });
        var arrayReferences = arrayMatches.map(function (match) {
          return match.match(arrayReferenceRegex);
        });
        var snippetReferences = snippetMatches.map(function (match) {
          return match.match(snippetReferenceRegex);
        });
        var dynamicSnippetReferences = dynamicSnippetMatches.map(function (match) {
          return match.match(dynamicSnippetReferenceRegex);
        });
        var pmatches = parameterReferences.map(function (ref) {
          return {
            data: ref,
            ref: ref[1],
            match: !!specifiers[ref[1]]
          };
        });
        var amatches = arrayReferences.map(function (ref) {
          return {
            data: ref,
            ref: ref[1],
            match: !!specifiers[ref[1]]
          };
        });
        var smatches = snippetReferences.map(function (ref) {
          return {
            data: ref,
            sref: ref[1],
            pref: ref[3],
            snippetsmatch: !!snippets[ref[1]],
            specifiersmatch: !!specifiers[ref[3]],
            paramsmatch: !!params[ref[3]],
            match: !!snippets[ref[1]] && !!specifiers[ref[3]]
          };
        });
        var dmatches = dynamicSnippetReferences.map(function (ref) {
          var snippetmatch = !!specifiers[ref[1]];
          var snippetsmatch = true;
          if (snippetmatch && !!parameters[ref[1]]) {
            snippetsmatch = parameters[ref[1]].every(function (s) {
              return !!snippets[s];
            });
            if (false && !snippetsmatch) console.log(JSON.stringify(parameters[ref[1]].map(function (s) {
              return {
                s: s,
                match: !!snippets[s]
              };
            }), null, 2));
          }
          return {
            data: ref,
            sref: ref[1],
            pref: ref[3],
            snippetmatch: snippetmatch,
            snippetsmatch: snippetsmatch,
            specifiersmatch: !!specifiers[ref[3]],
            match: snippetmatch && snippetsmatch && !!specifiers[ref[3]]
          };
        });
        var pmatch = pmatches.every(function (m) {
          return m.match;
        });
        var amatch = amatches.every(function (m) {
          return m.match;
        });
        var smatch = smatches.every(function (m) {
          return m.match;
        });
        var dmatch = dmatches.every(function (m) {
          return m.match;
        });
        if (false) console.log(JSON.stringify({
          exp: exp,
          parameterMatches: parameterMatches,
          arrayMatches: arrayMatches,
          snippetMatches: snippetMatches,
          dynamicSnippetMatches: dynamicSnippetMatches,
          parameterReferences: parameterReferences,
          arrayReferences: arrayReferences,
          snippetReferences: snippetReferences,
          dynamicSnippetReferences: dynamicSnippetReferences,
          pmatches: pmatches,
          amatches: amatches,
          smatches: smatches,
          dmatches: dmatches,
          pmatch: pmatch,
          amatch: amatch,
          smatch: smatch,
          dmatch: dmatch
        }, null, 2));
        var out;
        if (pmatch && amatch && smatch && dmatch) out = prefix + apply.call({
          P: P,
          A: A,
          S: S,
          D: D
        }, exp);else out = touch ? prefix : match;
        if (false) console.log({
          exp: exp,
          pmatch: pmatch,
          amatch: amatch,
          smatch: smatch,
          dmatch: dmatch,
          out: out
        });
        return out;
      });
      //console.log(out);
      return out;
    }

    function objectify(params) {
      if (!params) return {};

      function obj(model, parent, parentKey) {
        model.getKeys().map(function (key) {
          return {
            key: key,
            full: parentKey + key
          };
        }).map(function (key) {
          return Object.assign(key, {
            spec: specifiers[key.full]
          });
        }).filter(function (key) {
          if (!key.spec) console.log(JSON.stringify({ key: key }, null, 2));
          return key.spec.parameterType === 'o';
        }).forEach(function (key) {
          var paramObj = parent[key.key];
          var subparams = parent.getKeys().filter(function (subkey) {
            return subkey.startsWith(key.key + '.');
          });
          if (subparams.length) {
            if (!paramObj) paramObj = parent[key.key] = {};
            subparams.forEach(function (subkey) {
              var subparam = parent[subkey];
              delete parent[subkey];
              subkey = subkey.replace(key.key + '.', '');
              paramObj[subkey] = subparam;
            });
            obj(model[key.key], paramObj, key.full + '.');
          }
        });
      }
      var out = Object.assign({}, params);
      obj(objectKeys, out, '');
      return out;
    }

    this.generate = function (_params) {
      //console.log(`generating ${name}.`);
      if (!source) throw 'snippet ' + name + ' does not have a non-null source.';
      //if (name === 'noiseDef' || name === 'noiseDec')
      //if (name === 'noiseBody')
      if (false) console.log(JSON.stringify({
        name: name,
        _params: _params,
        parameters: parameters,
        specifiers: specifiers,
        objectKeys: objectKeys
      }, null, 2));
      var objectParameters = objectify(parameters);
      var fparams1 = _params ? _params.filter(specifiers.getKeys()) : null;
      var fparams2 = fparams1 ? fparams1.filter(objectKeys) : null;
      var objectParams = fparams2 ? objectify(fparams2) : null;
      var params = Object.assign({}, objectParameters, objectParams);
      //if (name === 'noiseDef' || name === 'noiseDec')
      //if (name === 'noiseBody')
      if (false) console.log(JSON.stringify({
        name: name,
        _params: _params,
        specifiers: specifiers,
        objectKeys: objectKeys,
        objectParameters: objectParameters,
        fparams1: fparams1,
        fparams2: fparams2,
        objectParams: objectParams,
        params: params
      }, null, 2));
      return render(applyParams(source, params, true), params);
    };

    this.applyParams = function (params) {
      var p = Array.isArray(params) ? parameters.filter(params) : params.filter(parameters.getKeys());
      source = applyParams(source, p);
    };
    Object.defineProperty(this, 'source', {
      get: function get() {
        return source;
      },
      set: function set(v) {
        source = v;
      }
    });
  }
  var constants = [{
    type: 'paramtype',
    name: 'OBJECT',
    data: {
      id: 'o'
    }
  }, {
    type: 'paramtype',
    name: 'ARRAY',
    data: {
      id: 'a'
    }
  }, {
    type: 'paramtype',
    name: 'VALUE',
    data: {
      id: 'v'
    }
  }, {
    type: 'datatype',
    name: 'DEFAULT',
    data: {
      id: 'd'
    }
  }, {
    type: 'datatype',
    name: 'TEMPLATE',
    data: {
      id: 't'
    }
  }, {
    type: 'datatype',
    name: 'OBJECT',
    data: {
      id: 'o'
    }
  }, {
    type: 'datatype',
    name: 'ARRAY',
    data: {
      id: 'a'
    }
  }, {
    type: 'datatype',
    name: 'STRING',
    data: {
      id: 's'
    }
  }, {
    type: 'datatype',
    name: 'BOOL',
    data: {
      id: 'b'
    }
  }, {
    type: 'datatype',
    name: 'INT',
    data: {
      id: 'i'
    }
  }, {
    type: 'datatype',
    name: 'FLOAT',
    data: {
      id: 't'
    }
  }];
  constants.forEach(function (c, i) {
    //console.log(c);
    Object.defineProperty(Snippet, c.type.toUpperCase() + '_' + c.name, {
      enumerable: true,
      get: function get() {
        return i;
      }
    });
  });
  //console.log(Snippet.getKeys());
  Snippet.parameterType = function parameterType(type) {
    var constant = constants[type];
    //console.log(constant);
    if (!constant || constant.type !== 'paramtype') return null;
    return constants[type].data.id;
  };
  Snippet.parameterDataType = function parameterDataType(type) {
    var constant = constants[type];
    //console.log(constant);
    if (!constant || constant.type !== 'datatype') return null;
    return constants[type].data.id;
  };
  return Snippet;
}

function FunctionSnippetGen(oaWebglSnippet, oaWebglShaderHelpers) {
  function FunctionSnippet(funcName, returnType, bodyType) {
    var _this3 = this;

    oaWebglSnippet.call(this, funcName + 'Def');
    var bodySnippet, bodyString;
    var sourceGen = function sourceGen() {
      return '${S("signiture", "signiture")} {\n' + (bodyType === 'string' ? '${P("bodyString")}' : '${S("body", "body")}') + '\n}';
    };
    this.source = sourceGen();
    var declarationSnippet = new oaWebglSnippet(funcName + 'Dec');
    declarationSnippet.source = '${S("signiture", "signiture")};';
    var signitureSnippet = new oaWebglSnippet(funcName + 'Signiture');
    signitureSnippet.source = '${P("returnType")} ${P("funcName")}(${S("parameter", "parameterList")})';
    signitureSnippet.addParameter('v', 'returnType', {
      type: 'str',
      nullValue: 'float'
    });
    signitureSnippet.addParameter('v', 'funcName', {
      type: 'str'
    });
    signitureSnippet.addParameter('a', 'parameterList', {
      delimiter: ', '
    });
    var parameterSnippet = new oaWebglSnippet(funcName + 'Parameter');
    parameterSnippet.source = '${P("datatype")} ${P("paramname")}';
    parameterSnippet.addParameter('v', 'datatype', {
      type: 'str',
      nullValue: 'float'
    });
    parameterSnippet.addParameter('v', 'paramname', {
      type: 'str'
    });
    signitureSnippet.addSnippet('parameter', parameterSnippet);
    this.addSnippet('signiture', signitureSnippet);
    declarationSnippet.addSnippet('signiture', signitureSnippet);
    var parameters = {
      names: [],
      order: []
    };
    parameters.add = function (paramname, datatype, index) {
      if (parameters.names.indexOf(paramname) > -1)
        //throw 'parameter already exists';
        apples.throw();
      if (index == undefined) index = parameters.order.length;else if (parameters.order[index]) throw 'index already in use';
      parameters.names.push(paramname);
      parameters.order[index] = parameters[paramname] = {
        datatype: oaWebglShaderHelpers.glDataType(datatype),
        paramname: paramname,
        index: index
      };
    };
    parameters.addMultiple = function (vars) {
      //console.log(JSON.stringify(vars, null, 2));
      var I = parameters.order.length;
      vars.forEach(function (v, i) {
        var paramname = v.paramname,
            datatype = v.datatype,
            index = v.index;

        parameters.add(paramname, datatype, index == undefined ? I + i : index);
      });
    };
    parameters.apply = function () {
      _this3.setParameterValue('signiture.parameterList', parameters.order);
      declarationSnippet.setParameterValue('signiture.parameterList', parameters.order);
    };
    this.addParameter('v', 'signiture.returnType', {
      type: 'str',
      nullValue: 'float'
    });
    this.setParameterValue('signiture.returnType', returnType);
    this.addParameter('v', 'signiture.funcName', {
      type: 'str'
    });
    this.setParameterValue('signiture.funcName', funcName);
    this.addParameter('a', 'signiture.parameterList', {
      delimiter: ', '
    });
    declarationSnippet.addParameter('v', 'signiture.returnType', {
      type: 'str',
      nullValue: 'float'
    });
    declarationSnippet.setParameterValue('signiture.returnType', returnType);
    declarationSnippet.addParameter('v', 'signiture.funcName', {
      type: 'str'
    });
    declarationSnippet.setParameterValue('signiture.funcName', funcName);
    declarationSnippet.addParameter('a', 'signiture.parameterList', {
      delimiter: ', '
    });
    this.addParameter('v', 'bodyString', {
      type: 'str'
    });
    this.addParameter('v', 'body.indent', {
      type: 'int',
      nullValue: 1
    });
    this.setParameterValue('body.indent', 1);
    Object.defineProperties(this, {
      bodySnippet: {
        get: function get() {
          return bodySnippet;
        },
        set: function set(v) {
          bodySnippet = v;
          _this3.setSnippet('body', bodySnippet);
        }
      },
      bodyString: {
        get: function get() {
          return bodyString;
        },
        set: function set(v) {
          bodyString = v;
          _this3.setParameterValue('body', bodyString);
        }
      },
      bodyType: {
        get: function get() {
          return bodyType;
        },
        set: function set(v) {
          if (v !== 'string' && v !== 'snippet') return;
          bodyType = v;
          _this3.source = sourceGen();
        }
      },
      parameters: {
        get: function get() {
          return parameters;
        }
      },
      declarationSnippet: {
        get: function get() {
          return declarationSnippet;
        }
      },
      returnType: {
        get: function get() {
          return returnType;
        },
        set: function set(v) {
          returnType = v;
          _this3.setParameterValue('signiture.returnType', returnType);
          declarationSnippet.setParameterValue('signiture.returnType', returnType);
        }
      },
      funcName: {
        get: function get() {
          return funcName;
        },
        set: function set(v) {
          funcName = v;
          _this3.setParameterValue('signiture.funcName', funcName);
          declarationSnippet.setParameterValue('signiture.funcName', funcName);
        }
      },
      sname: {
        get: function get() {
          return funcName + '_' + parameters.order.map(function (p) {
            return oaWebglShaderHelpers.glDataTypeId(p.datatype);
          }).join('');
        }
      }
    });
  }
  return FunctionSnippet;
}

function ShaderSnippetGen(oaWebglSnippet) {
  function ShaderSnippet(name) {
    var _this4 = this;

    oaWebglSnippet.call(this, name);
    this.source = 'precision ${P("precision")} float;\n${S("variable", "variables")}\n${D("functionDeclarations", "functionParams")}\nvoid main() {\n${S("body", "body")}\n}\n${D("functionDefinitions", "functionDefinitionParams")}';
    this.addParameter(oaWebglSnippet.PARAMTYPE_VALUE, 'precision', {
      type: oaWebglSnippet.DATATYPE_STRING,
      nullValue: 'mediump'
    });
    this.addParameter(oaWebglSnippet.PARAMTYPE_ARRAY, 'variables', {
      delimiter: '\n'
    });
    this.addParameter(oaWebglSnippet.PARAMTYPE_ARRAY, 'functionDeclarations', {
      delimiter: '\n'
    });
    this.addParameter(oaWebglSnippet.PARAMTYPE_ARRAY, 'functionDefinitions', {
      delimiter: '\n'
    });
    this.addParameter(oaWebglSnippet.PARAMTYPE_VALUE, 'body.indent', {
      type: oaWebglSnippet.DATATYPE_INT,
      nullValue: 1
    });
    this.setParameterValue('body.indent', 1);
    var variables = {
      names: [],
      order: []
    };
    variables.add = function (varname, vartype, datatype, index) {
      if (variables.names.indexOf(varname) > -1) throw 'parameter already exists';
      if (index == undefined) index = variables.order.length;else if (variables.order[index]) throw 'index already in use';
      variables.names.push(varname);
      variables.order[index] = variables[varname] = {
        vartype: vartype,
        datatype: datatype,
        varname: varname,
        index: index
      };
    };
    variables.addMultiple = function (vars) {
      //console.log(JSON.stringify(vars, null, 2));
      var I = variables.order.length;
      vars.forEach(function (v, i) {
        var varname = v.varname,
            vartype = v.vartype,
            datatype = v.datatype,
            index = v.index;

        variables.add(varname, vartype, datatype, index == undefined ? I + i : index);
      });
    };
    variables.apply = function () {
      //console.log(JSON.stringify(variables.order, null, 2));
      _this4.setParameterValue('variables', variables.order);
    };
    var variableSnippet = new oaWebglSnippet();
    variableSnippet.source = '${P("vartype")} ${P("datatype")} ${P("varname")};';
    variableSnippet.addParameter('v', 'datatype', {
      type: 'str',
      nullValue: 'float'
    });
    variableSnippet.addParameter('v', 'vartype', {
      type: 'str',
      nullValue: 'attribute'
    });
    variableSnippet.addParameter('v', 'varname', {
      type: 'str'
    });
    this.addSnippet('variable', variableSnippet);
    var mainSnippet;
    var functions = [];
    var functionNames = {};
    this.addFunction = function (f) {
      console.log(f.sname);
      if (functionNames[f.sname]) apples.throw();
      functionNames[f.sname] = {
        func: f,
        index: functions.length,
        parameters: {}
      };
      functions.push(f);
      _this4.addSnippet(f.sname + 'Declaration', f.declarationSnippet);
      _this4.addSnippet(f.sname + 'Definition', f);
      _this4.setParameterValue('functionDeclarations', functions.map(function (f) {
        return f.sname + 'Declaration';
      }));
      _this4.setParameterValue('functionDefinitions', functions.map(function (f) {
        return f.sname + 'Definition';
      }));
    };
    this.addFunctions = function (fs) {
      fs.forEach(function (f) {
        _this4.addFunction(f);
      });
    };
    Object.defineProperties(this, {
      variables: {
        get: function get() {
          return variables;
        }
      },
      mainSnippet: {
        get: function get() {
          return mainSnippet;
        },
        set: function set(v) {
          mainSnippet = v;
          _this4.setSnippet('body', mainSnippet);
        }
      }
    });
  }
  return ShaderSnippet;
}

function ProgramGen(oaWebglHelpers, oaWebglShaderSource) {
  function oaWebglProgram(_options) {
    var _this6 = this;

    var options = Object.assign({}, _options);
    var dirty = true;
    var vertexSource = options.vertexSource instanceof oaWebglShaderSource ? options.vertexSource : new oaWebglShaderSource(options.vertexSource);
    var fragmentSource = options.fragmentSource instanceof oaWebglShaderSource ? options.fragmentSource : new oaWebglShaderSource(options.fragmentSource);
    var attributeSpecs = options.attributes;
    var uniformSpecs = options.uniforms;
    var bufferSpecs = options.buffers;
    var textureSpecs = options.textures;
    var executor = options.draw || options.executor;
    var program;
    var attributes = {};
    var uniforms = {};
    var buffers = {};
    var textures = {};
    var vertexShaderParameters = {};
    var fragmentShaderParameters = {};
    vertexSource.parameterNames.forEach(function (p) {
      Object.defineProperty(vertexShaderParameters, p, {
        get: vertexSource.getParameter(p),
        set: function set(v) {
          vertexSource.setParameterValue(p, v);
          dirty = true;
        }
      });
    });
    fragmentSource.parameterNames.forEach(function (p) {
      Object.defineProperty(fragmentShaderParameters, p, {
        get: fragmentSource.getParameter(p),
        set: function set(v) {
          fragmentSource.setParameterValue(p, v);
          dirty = true;
        }
      });
    });
    Object.defineProperties(this, {
      vertexSource: {
        get: function get() {
          return vertexSource;
        },
        set: function set(v) {
          vertexSource = v instanceof oaWebglShaderSource ? v : new oaWebglShaderSource(v);
          dirty = true;
        }
      },
      fragmentSource: {
        get: function get() {
          return fragmentSource;
        },
        set: function set(v) {
          fragmentSource = v instanceof oaWebglShaderSource ? v : new oaWebglShaderSource(v);
          dirty = true;
        }
      },
      vertexShaderParameters: {
        get: function get() {
          return vertexShaderParameters;
        }
      },
      vParams: {
        get: function get() {
          return vertexShaderParameters;
        }
      },
      fragmentShaderParameters: {
        get: function get() {
          return fragmentShaderParameters;
        }
      },
      fParams: {
        get: function get() {
          return fragmentShaderParameters;
        }
      },
      program: {
        get: function get() {
          return program;
        }
      }
    });
    this.initialize = function initialize(gl) {
      var _this5 = this;

      if (!dirty) return;
      //console.log('program.initialize');
      var vertexSourceCode = vertexSource.generate();
      var fragmentSourceCode = fragmentSource.generate();
      program = oaWebglHelpers.loadProgram(gl, vertexSourceCode, fragmentSourceCode);
      Object.keys(attributeSpecs).forEach(function (attributeId) {
        var attributeSpec = attributeSpecs[attributeId];
        var attributeName = attributeSpec.name;

        var attribute = gl.getAttribLocation(program, attributeName);
        var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeId.length);
        var attributeSpeckey = attributeKey + 'Spec';
        _this5[attributeKey] = attribute;
        attributes[attributeKey] = attribute;
        _this5[attributeSpeckey] = attributeSpec;
      });
      Object.keys(uniformSpecs).forEach(function (uniformId) {
        var uniformSpec = uniformSpecs[uniformId];
        var uniformName = uniformSpec.name;

        var uniform = gl.getUniformLocation(program, uniformName);
        var uniformKey = 'u' + uniformId.charAt(0).toUpperCase() + uniformId.substr(1, uniformId.length);
        var uniformSpeckey = uniformKey + 'Spec';
        _this5[uniformKey] = uniform;
        uniforms[uniformKey] = uniform;
        _this5[uniformSpeckey] = uniformSpec;
      });
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[bufferId];
        var data = bufferSpec.data,
            datatype = bufferSpec.datatype,
            target = bufferSpec.target,
            usage = bufferSpec.usage,
            bufferName = bufferSpec.name,
            attributeId = bufferSpec.attribute;

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl[target], buffer);
        var bufferKey = 'b' + bufferId.charAt(0).toUpperCase() + bufferId.substr(1, bufferId.length);
        var bufferSpeckey = bufferKey + 'Spec';
        _this5[bufferKey] = buffer;
        buffers[bufferKey] = buffer;
        _this5[bufferSpeckey] = bufferSpec;
        switch (datatype) {
          case oaWebglHelpers.FLOAT32:
            bufferSpec.Data = new Float32Array(data);
            break;
          case oaWebglHelpers.UINT16:
            bufferSpec.Data = new Uint16Array(data);
            break;
          default:
            console.error('invalid datatype');
        }
        if (false) console.log({
          bufferId: bufferId,
          data: data,
          Data: bufferSpec.Data
        });
        gl.bufferData(gl[target], bufferSpec.Data, gl[usage]);
        bufferSpec.applied = true;
        bufferSpec._data = bufferSpec.data;
        Object.defineProperty(bufferSpec, 'data', {
          get: function get() {
            return bufferSpec._data;
          },
          set: function set(v) {
            var data = bufferSpec._data = v;
            if (v) {
              switch (datatype) {
                case oaWebglHelpers.FLOAT32:
                  bufferSpec.Data = new Float32Array(data);
                  break;
                case oaWebglHelpers.UINT16:
                  bufferSpec.Data = new Uint16Array(data);
                  break;
                default:
                  console.error('invalid datatype');
              }
              if (false) console.log({
                bufferId: bufferId,
                data: data,
                Data: bufferSpec.Data
              });
              bufferSpec.applied = false;
            }
          }
        });
        if (attributeId) {
          var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeId.length);
          var attributeSpeckey = attributeKey + 'Spec';
          var attributeSpec = _this5[attributeSpeckey];
          attributeSpec.buffer = bufferId;
        }
      });
      Object.keys(textureSpecs).forEach(function (textureId) {
        var textureSpec = textureSpecs[textureId];
        var image = textureSpec.image,
            type = textureSpec.type,
            textureName = textureSpec.name;

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl[type], image);
        var textureKey = 't' + textureId.charAt(0).toUpperCase() + textureId.substr(1, textureId.length);
        var textureSpeckey = textureKey + 'Spec';
        _this5[textureKey] = texture;
        textures[textureKey] = texture;
        _this5[textureSpeckey] = textureSpec;
      });
      dirty = false;
      if (false) console.log('program.initialized');
    };
    this.pushAttribute = function pushAttribute(gl, attributeId) {
      if (false) console.log(Object.keys(this));
      var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeId.length);
      var attributeSpeckey = attributeKey + 'Spec';
      var attribute = this[attributeKey];
      var attributeSpec = this[attributeSpeckey];
      if (false) console.log({
        attributeId: attributeId,
        attributeKey: attributeKey,
        attributeSpeckey: attributeSpeckey,
        attributeSpec: attributeSpec
      });
      var bufferId = attributeSpec.buffer;
      var bufferKey = 'b' + bufferId.charAt(0).toUpperCase() + bufferId.substr(1, bufferId.length);
      var bufferSpeckey = bufferKey + 'Spec';
      var buffer = this[bufferKey];
      var bufferSpec = this[bufferSpeckey];
      if (false) console.log({
        bufferId: bufferId,
        bufferKey: bufferKey,
        bufferSpeckey: bufferSpeckey,
        bufferSpec: bufferSpec
      });
      var numComponents = bufferSpec.numComponents,
          type = bufferSpec.type,
          normalize = bufferSpec.normalize,
          stride = bufferSpec.stride,
          offset = bufferSpec.offset,
          target = bufferSpec.target;

      gl.bindBuffer(gl[target], buffer);
      gl.vertexAttribPointer(attribute, numComponents, gl[type], normalize, stride, offset);
      gl.enableVertexAttribArray(attribute);
    };
    this.draw = function (gl) {
      if (false) console.log('program.draw');
      _this6.initialize(gl);
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[bufferId];
        if (!bufferSpec.applied && bufferSpec.Data) gl.bufferData(gl[bufferSpec.target], bufferSpec.Data, gl[bufferSpec.usage]);
      });
      if (executor) {
        if (false) console.log('program.execute');
        executor.call(_this6, gl);
      } else if (false) console.log('!executor');
      if (false) console.log('program.drawn');
    };
  }
  return oaWebglProgram;
}

function oaWebglCanvas(name, canvas, _options) {
  var options = Object.assign({}, _options);
  var gl;
  var main;
  var programs = {};
  var newCanvas = function newCanvas() {
    if (canvas) {
      if (options.width && options.height) {
        canvas.width = options.width;
        canvas.height = options.height;
      }
      gl = canvas.getContext('webgl');
    } else gl = null;
  };
  newCanvas();
  Object.defineProperties(this, {
    canvas: {
      get: function get() {
        return canvas;
      },
      set: function set(v) {
        canvas = v;
        newCanvas();
      }
    },
    gl: {
      get: function get() {
        return gl;
      }
    },
    main: {
      get: function get() {
        return main;
      },
      set: function set(v) {
        if (programs[v]) main = v;
      }
    }
  });
  this.registerProgram = function (name, program) {
    programs[name] = program;
    if (gl) {
      program.initialize(gl);
    }
  };
  this.draw = function (name) {
    if (false) console.log('canvas.draw');
    if (gl) {
      if (!name) {
        if (main) name = main;else name = 'main';
      }
      var program = programs[name];
      if (program) program.draw(gl);
    }
    if (false) console.log('canvas.drawn');
  };
}

angular.module('oaWebglHelpers', ['oaObject']).service('oaWebglHelpers', [GlHelpGen]).service('oaWebglShaderHelpers', [ShaderHelpGen]).factory('oaWebglSnippet', ['oaObject', SnippetGen]).factory('oaWebglFunctionSnippet', ['oaWebglSnippet', 'oaWebglShaderHelpers', FunctionSnippetGen]).factory('oaWebglShaderSnippet', ['oaWebglSnippet', ShaderSnippetGen]).factory('oaWebglShaderSource', function () {
  function oaWebglShaderSource(_source, _generator, _parameters) {
    var source = _source;
    var generator = _generator;
    var parameterNames = _parameters || [];
    var parameters = {};
    this.printShader = function (_options) {
      console.log(source.split(/\n/g).map(function (line, i) {
        return ('0000' + (i + 1)).substr(-4, 4) + ': ' + line;
      }).join('\n'));
    };
    this.getParameter = function (p) {
      return parameters[p];
    };
    this.setParameter = function (p, v) {
      parameters[p] = v;
    };
    this.generate = function () {
      if (!generator) return source;
      var params = {};
      parameterNames.forEach(function (p) {
        params[p] = parameters[p];
      });
      return source = generator.call(params, params);
    };
    Object.defineProperties(this, {
      source: {
        get: function get() {
          return source;
        },
        set: function set(v) {
          source = v;
        }
      },
      generator: {
        get: function get() {
          return generator;
        },
        set: function set(v) {
          generator = v;
        }
      },
      parameterNames: {
        get: function get() {
          return parameterNames;
        }
      },
      type: {
        get: function get() {
          return generator ? parameters && parameters.length ? 'dynamic' : 'generated' : 'static';
        }
      }
    });
  }

  return oaWebglShaderSource;
}).factory('oaWebglProgram', ['oaWebglHelpers', 'oaWebglShaderSource', ProgramGen]).factory('oaWebglCanvas', function () {
  return oaWebglCanvas;
});
