'use strict';

/**
 * OAlpha WebGL Helper Library
 */
var _window = window,
    angular = _window.angular,
    _ = _window._;

angular.module('oaWebglHelpers', ['oaObject']).service('oaWebglHelpers', function () {
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
}).service('oaWebglShaderHelpers', function () {
  function oaWebglShaderHelpers() {
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
}).factory('oaWebglSnippet', ['oaObject', function () {
  var parameterMarker = /(^|[^\$])\$/;
  var expressionRegexGlobal = new RegExp(parameterMarker.source + '{([^}]+)}', 'ig');
  var parameterReferenceRegexString = /P\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var parameterReferenceRegexGlobal = new RegExp(parameterReferenceRegexString.source, 'ig');
  var parameterReferenceRegex = new RegExp(parameterReferenceRegexString.source, 'i');
  var arrayReferenceRegexString = /A\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var arrayReferenceRegexGlobal = new RegExp(arrayReferenceRegexString.source, 'ig');
  var arrayReferenceRegex = new RegExp(arrayReferenceRegexString.source, 'i');
  var snippetReferenceRegexString = /S\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)", "([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
  var snippetReferenceRegexGlobal = new RegExp(snippetReferenceRegexString.source, 'ig');
  var snippetReferenceRegex = new RegExp(snippetReferenceRegexString.source, 'i');
  var dynamicSnippetReferenceRegexString = /D\("([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)", "([a-z][_a-z0-9]*(\.[a-z][_a-z0-9]*)*)"\)/;
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

  function Snippet() {
    var _this = this;

    var source;
    var specifiers = {
      indent: {
        type: 'int',
        nullValue: 0
      },
      indentationStr: {
        type: 'str',
        nullValue: '  '
      },
      lineNumbers: {
        type: 'bool',
        nullValue: false
      },
      lineNumberWidth: {
        type: 'int',
        nullValue: 4
      }
    };
    var objectKeys = {
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
        if (!replace) throw 'parameter already exists';
      }
      var ks = k.split('.');
      var parent = objectKeys;
      if (false) for (var i = 0; i + 1 < ks.length; i++) {
        parent = parent[ks[i]];
        if (!parent) parent = parent[ks[i]] = {};
      } else if (ks.length > 1) _this.addParameter('o', ks.slice(0, ks.length - 1).join('.'), null, { ignore: true });
      s = Object.assign({}, s);
      switch (t) {
        case 'o':
        case 'object':
          {
            specifiers[k] = Object.assign({
              parameterType: 'o',
              type: 'default',
              nullObject: '',
              nullProperty: ''
            }, s.filter(['type', 'nullObject', 'nullProperty']));
            parent[ks[ks.length - 1]] = {};
            break;
          }
        case 'a':
        case 'arr':
        case 'array':
          {
            specifiers[k] = Object.assign({
              parameterType: 'a',
              type: 'default',
              nullArray: '',
              nullElement: '',
              delimiter: '',
              prefix: '',
              suffix: ''
            }, s.filter(['type', 'nullArray', 'nullElement', 'delimiter', 'prefix', 'suffix']));
            parent[ks[ks.length - 1]] = true;
            break;
          }
        case 'v':
        case 'val':
        case 'value':
        default:
          {
            specifiers[k] = Object.assign({
              parameterType: 'v',
              type: 'default',
              nullValue: ''
            }, s);
            parent[ks[ks.length - 1]] = true;
            break;
          }
      }
    };
    this.setParameter = function (k, v) {
      if (specifiers[k]) parameters[k] = v;
    };
    this.addSnippet = function (k, s) {
      snippets[k] = s;
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
            if (!snippetsmatch) console.log(JSON.stringify(parameters[ref[1]].map(function (s) {
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
      var objectParameters = objectify(parameters);
      var fparams1 = _params ? _params.filter(specifiers.getKeys()) : null;
      var fparams2 = fparams1 ? fparams1.filter(objectKeys) : null;
      var objectParams = fparams2 ? objectify(fparams2) : null;
      var params = Object.assign({}, objectParameters, objectParams);
      if (false) console.log(JSON.stringify({
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

  return Snippet;
}]).factory('oaWebglShaderSnippet', ['oaWebglSnippet', function () {}]).factory('oaWebglShaderSource', function () {
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
}).factory('oaWebglProgram', ['oaWebglHelpers', 'oaWebglShaderSource', function (oaWebglHelpers, oaWebglShaderSource) {
  function oaWebglProgram(_options) {
    var _this3 = this;

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
          vertexSource.setParameter(p, v);
          dirty = true;
        }
      });
    });
    fragmentSource.parameterNames.forEach(function (p) {
      Object.defineProperty(fragmentShaderParameters, p, {
        get: fragmentSource.getParameter(p),
        set: function set(v) {
          fragmentSource.setParameter(p, v);
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
      var _this2 = this;

      if (!dirty) return;
      console.log('program.initialize');
      var vertexSourceCode = vertexSource.generate();
      var fragmentSourceCode = fragmentSource.generate();
      program = oaWebglHelpers.loadProgram(gl, vertexSourceCode, fragmentSourceCode);
      Object.keys(attributeSpecs).forEach(function (attributeId) {
        var attributeSpec = attributeSpecs[attributeId];
        var attributeName = attributeSpec.name;

        var attribute = gl.getAttribLocation(program, attributeName);
        var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeId.length);
        var attributeSpeckey = attributeKey + 'Spec';
        _this2[attributeKey] = attribute;
        attributes[attributeKey] = attribute;
        _this2[attributeSpeckey] = attributeSpec;
      });
      Object.keys(uniformSpecs).forEach(function (uniformId) {
        var uniformSpec = uniformSpecs[uniformId];
        var uniformName = uniformSpec.name;

        var uniform = gl.getUniformLocation(program, uniformName);
        var uniformKey = 'u' + uniformId.charAt(0).toUpperCase() + uniformId.substr(1, uniformId.length);
        var uniformSpeckey = uniformKey + 'Spec';
        _this2[uniformKey] = uniform;
        uniforms[uniformKey] = uniform;
        _this2[uniformSpeckey] = uniformSpec;
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
        _this2[bufferKey] = buffer;
        buffers[bufferKey] = buffer;
        _this2[bufferSpeckey] = bufferSpec;
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
        console.log({
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
              console.log({
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
          var attributeSpec = _this2[attributeSpeckey];
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
        _this2[textureKey] = texture;
        textures[textureKey] = texture;
        _this2[textureSpeckey] = textureSpec;
      });
      dirty = false;
      console.log('program.initialized');
    };
    this.pushAttribute = function pushAttribute(gl, attributeId) {
      console.log(Object.keys(this));
      var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeId.length);
      var attributeSpeckey = attributeKey + 'Spec';
      var attribute = this[attributeKey];
      var attributeSpec = this[attributeSpeckey];
      console.log({
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
      console.log({
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
      console.log('program.draw');
      _this3.initialize(gl);
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[bufferId];
        if (!bufferSpec.applied && bufferSpec.Data) gl.bufferData(gl[bufferSpec.target], bufferSpec.Data, gl[bufferSpec.usage]);
      });
      if (executor) {
        console.log('program.execute');
        executor.call(_this3, gl);
      } else console.log('!executor');
      console.log('program.drawn');
    };
  }

  return oaWebglProgram;
}]).factory('oaWebglCanvas', function () {
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
      console.log('canvas.draw');
      if (gl) {
        if (!name) {
          if (main) name = main;else name = 'main';
        }
        var program = programs[name];
        if (program) program.draw(gl);
      }
      console.log('canvas.drawn');
    };
  }
  return oaWebglCanvas;
});
