'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * OAlpha WebGL Helper Library
 */
var _window = window,
    angular = _window.angular,
    _ = _window._;

angular.module('oaWebglHelpers', []).service('oaWebglHelpers', function () {
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
}).factory('oaWebglShaderSnippet', function () {
  var parameterMarker = /(^|[^\$])\$/;
  var keyPattern = /[a-z]([-_a-z0-9]*[a-z0-9])?/;
  var valueModifiers = /(:([^}]+)?)?/;
  var valueParameterRegexGlobal = new RegExp(parameterMarker.source + '{(' + keyPattern.source + ')' + valueModifiers.source + '}', 'ig');
  var valueParameterRegex = new RegExp(parameterMarker.source + '{(' + keyPattern.source + ')' + valueModifiers.source + '}', 'i');
  var arrayMarker = /(array|arr|a):/;
  var arrayModifiers = /(:([^}:]+)?(:([^}:]+)?(:([^}:]+)?)?)?)?/;
  var arrayParameterRegexGlobal = new RegExp(parameterMarker.source + '{' + arrayMarker.source + '(' + keyPattern.source + ')' + arrayModifiers.source + '}', 'ig');
  var arrayParameterRegex = new RegExp(parameterMarker.source + '{' + arrayMarker.source + '(' + keyPattern.source + ')' + arrayModifiers.source + '}', 'i');
  var snippetMarker = /(snippet|s):/;
  var snippetModifiers = /(:[^}]+(:([^}:]+)?)?)?/;
  var snippetParameterRegexGlobal = new RegExp(parameterMarker.source + '{' + snippetMarker.source + '(' + keyPattern.source + ')' + snippetModifiers.source + '}', 'ig');
  var snippetParameterRegex = new RegExp(parameterMarker.source + '{' + snippetMarker.source + '(' + keyPattern.source + ')' + snippetModifiers.source + '}', 'i');
  if (false) console.log(JSON.stringify({
    parameterRegexGlobal: valueParameterRegexGlobal.toString(),
    parameterRegex: valueParameterRegex.toString(),
    arrayParameterRegexGlobal: arrayParameterRegexGlobal.toString(),
    arrayParameterRegex: arrayParameterRegex.toString(),
    snippetParameterRegexGlobal: snippetParameterRegexGlobal.toString(),
    snippetParameterRegex: snippetParameterRegex.toString()
  }, null, 2));

  function Snippet() {
    var _this3 = this;

    var source;
    var parameters;

    function ValueParam(name, _defaultValue) {
      var _this = this;

      var value;
      var defaultValue = _defaultValue == undefined ? '' : _defaultValue;
      if (false) console.log(JSON.stringify({
        value: value,
        defaultValue: defaultValue
      }, null, 2));
      Object.defineProperties(this, {
        type: {
          get: function get() {
            return 'value';
          }
        },
        value: {
          get: function get() {
            var o = value || defaultValue;
            if (false) console.log(name + ' = ' + o);
            return o;
          },
          set: function set(v) {
            value = v;
            if (false) console.log(name + ' := ' + _this.value);
          }
        },
        parameters: {
          get: function get() {
            return _this.value;
          }
        }
      });
      this.getValue = function (params) {
        return _this.value;
      };
    }

    function ArrayParam(name, _delimeter, _emptyString, _defaultElementValue) {
      var _this2 = this;

      var array;
      var delimeter = _delimeter == undefined ? '' : _delimeter;
      var emptyString = _emptyString == undefined ? '' : _emptyString;
      var defaultElementValue = _defaultElementValue == undefined ? '' : _defaultElementValue;
      Object.defineProperties(this, {
        type: {
          get: function get() {
            return 'array';
          }
        },
        value: {
          get: function get() {
            return array && array.length ? array.map(function (e) {
              return e != null ? e : defaultElementValue;
            }).join(delimeter) : emptyString;
          },
          set: function set(v) {
            if (v.length != undefined) {
              array = [];
              for (var i = 0; i < v.length; i++) {
                array[i] = v[i];
              }
            }
          }
        },
        parameters: {
          get: function get() {
            return _this2.value;
          }
        },
        delimeter: {
          get: function get() {
            return delimeter;
          },
          set: function set(v) {
            delimeter = v ? v.toString() : '';
          }
        },
        emptyString: {
          get: function get() {
            return emptyString;
          },
          set: function set(v) {
            emptyString = v ? v.toString() : '';
          }
        },
        defaultElementValue: {
          get: function get() {
            return defaultElementValue;
          },
          set: function set(v) {
            defaultElementValue = v ? v.toString() : '';
          }
        }
      });
      this.getValue = function (params) {
        return _this2.value;
      };
    }

    function SnippetParam(name, _nullString, _inherit, parent) {
      var snippet;
      var nullString = _nullString == undefined ? '' : _nullString;
      var inherit = !!_inherit;
      var parameters = {};
      Object.defineProperties(this, {
        type: {
          get: function get() {
            return 'snippet';
          }
        },
        value: {
          get: function get() {
            return snippet ? snippet.generate(inherit ? Object.assign({}, parent.getParameters(), parameters) : parameters) : nullString;
          },
          set: function set(v) {
            if (v instanceof Snippet) snippet = v;
          }
        },
        parameters: {
          get: function get() {
            return parameters;
          }
        },
        nullString: {
          get: function get() {
            return nullString;
          },
          set: function set(v) {
            nullString = v ? v.toString() : '';
          }
        },
        source: {
          get: function get() {
            return snippet ? snippet.source : null;
          },
          set: function set(v) {
            if (snippet) snippet.source = v;
          }
        }
      });
      this.getValue = function (params) {
        var p;
        if (inherit) p = Object.assign({}, parameters, params);else p = Object.assign({}, parent.getParameters(), parameters, params);
        if (false) console.log(JSON.stringify({
          parent: parent.getParameters(),
          child: parameters,
          argument: params,
          combined: p
        }, null, 2));
        return snippet ? snippet.generate(p) : nullString;
      };
      this.getParameter = function (k) {
        return parameters[k];
      };
      this.setParameter = function (k, v) {
        if (false) console.log(JSON.stringify({
          k: k,
          ov: parameters[k],
          nv: v
        }, null, 2));
        //if (parameters.hasOwnProperty(k))
        parameters[k] = v;
      };
    }

    function parseSource(source, snippet) {
      var params = {};
      var values = source.match(valueParameterRegexGlobal);
      if (values) values.map(function (match) {
        return match.match(valueParameterRegex);
      }).forEach(function (matchset) {
        var _matchset = _slicedToArray(matchset, 6),

        // parameter specification
        // match
        // first character
        k = _matchset[2],
            // key
        // rest of key
        //modifiers
        d // default value
        = _matchset[5];

        if (false) console.log(JSON.stringify({
          k: k,
          d: d
        }, null, 2));
        if (!params[k]) params[k] = new ValueParam(k, d);
      });
      var arrays = source.match(arrayParameterRegexGlobal);
      if (arrays) arrays.map(function (match) {
        return match.match(arrayParameterRegex);
      }).forEach(function (matchset) {
        var _matchset2 = _slicedToArray(matchset, 11),

        // parameter specification
        // match
        // first character
        // array marker
        k = _matchset2[3],
            // key
        // rest of key
        // modifiers,
        s = _matchset2[6],
            // delimeter
        // modifiers
        e = _matchset2[8],
            // empty string
        //modifiers
        d // default element value
        = _matchset2[10];

        if (false) console.log(JSON.stringify({
          k: k,
          s: s,
          e: e,
          d: d
        }, null, 2));
        if (!params[k]) params[k] = new ArrayParam(k, s, e, d);
      });
      var snippets = source.match(snippetParameterRegexGlobal);
      if (snippets) snippets.map(function (match) {
        return match.match(snippetParameterRegex);
      }).forEach(function (matchset) {
        var _matchset3 = _slicedToArray(matchset, 9),

        // parameter specification
        // match
        // first character
        // snippet marker
        k = _matchset3[3],
            // key
        // rest of key
        // modifiers
        n = _matchset3[6],
            // null string
        // modifiers
        i // inherit
        = _matchset3[8];

        if (false) console.log(JSON.stringify({
          k: k,
          n: n
        }, null, 2));
        if (!params[k]) params[k] = new SnippetParam(k, n, i, snippet);
      });
      //console.log(Object.keys(params));
      params.indent = new ValueParam('indent', 0);
      params.indentationStr = new ValueParam('indentationStr', '  ');
      params.lineNumbers = new ValueParam('lineNumbers', false);
      params.lineNumberWidth = new ValueParam('lineNumberWidth', 4);
      return params;
    }

    function render(string, options) {
      var _Object$assign3 = Object.assign({
        indent: 0,
        indentationStr: '  ',
        lineNumbers: false,
        lineNumberWidth: 4
      }, options),
          indent = _Object$assign3.indent,
          indentationStr = _Object$assign3.indentationStr,
          lineNumbers = _Object$assign3.lineNumbers,
          lineNumberWidth = _Object$assign3.lineNumberWidth;

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

    function applyParams(string, params) {
      string = string.replace(snippetParameterRegexGlobal, function (match, p1, p2, p3) {
        if (false) console.log(JSON.stringify({
          type: 'value',
          match: match,
          p1: p1,
          p2: p2,
          p3: p3
        }));
        var key = p3;
        if (!params.hasOwnProperty(key)) return match;
        return p1 + params[key];
      });
      string = string.replace(arrayParameterRegexGlobal, function (match, p1, p2, p3) {
        if (false) console.log(JSON.stringify({
          type: 'value',
          match: match,
          p1: p1,
          p2: p2,
          p3: p3
        }));
        var key = p3;
        if (!params.hasOwnProperty(key)) return match;
        return p1 + params[key];
      });
      string = string.replace(valueParameterRegexGlobal, function (match, p1, p2) {
        if (false) console.log(JSON.stringify({
          type: 'value',
          match: match,
          p1: p1,
          p2: p2
        }));
        var key = p2;
        if (!params.hasOwnProperty(key)) return match;
        return p1 + params[key];
      });
      return string;
    }

    this.generate = function (_params) {
      var params = Object.assign({}, _this3.getParameterValues(), _params);
      if (false) console.log(JSON.stringify(params, null, 2));
      return render(applyParams(source, params), params);
    };

    this.applyParams = function (params) {
      var p = {};
      if (Array.isArray(params)) params.forEach(function (paramName) {
        if (parameters.hasOwnProperty(paramName)) {
          p[paramName] = parameters[paramName].parameters;
          delete parameters[paramName];
        }
      });else Object.keys(params).forEach(function (paramName) {
        if (parameters.hasOwnProperty(paramName)) {
          p[paramName] = params[paramName];
          delete parameters[paramName];
        }
      });
      source = applyParams(source, p);
    };
    Object.defineProperty(this, 'source', {
      get: function get() {
        return source;
      },
      set: function set(v) {
        source = v;
        parameters = parseSource(v, _this3);
      }
    });
    this.getParameter = function (k) {
      return parameters[k].value;
    };
    this.getParameterType = function (k) {
      return parameters[k].type;
    };
    this.setParameter = function (k, v) {
      if (parameters.hasOwnProperty(k)) parameters[k].value = v;
    };
    this.setSnippetParameterSource = function (k, v) {
      if (parameters.hasOwnProperty(k) && parameters[k].type == 'snippet') parameters[k].source = v;
    };
    this.setSnippetParameter = function (k, p, v) {
      if (parameters.hasOwnProperty(k) && parameters[k].type == 'snippet') parameters[k].setParameter(p, v);
    };
    this.getParameters = function () {
      var p = {};
      Object.keys(parameters).forEach(function (k) {
        p[k] = parameters[k].parameters;
      });
      //console.log(JSON.stringify(p, null, 2));
      return p;
    };
    this.getParameterValues = function (params) {
      var p = {};
      Object.keys(parameters).forEach(function (k) {
        p[k] = parameters[k].getValue(params);
      });
      //console.log(JSON.stringify(p, null, 2));
      return p;
    };
    this.getParameterNames = function () {
      return Object.keys(parameters);
    };
  }

  return Snippet;
}).factory('oaWebglShaderSource', function () {
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
    var _this5 = this;

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
      var _this4 = this;

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
        _this4[attributeKey] = attribute;
        attributes[attributeKey] = attribute;
        _this4[attributeSpeckey] = attributeSpec;
      });
      Object.keys(uniformSpecs).forEach(function (uniformId) {
        var uniformSpec = uniformSpecs[uniformId];
        var uniformName = uniformSpec.name;

        var uniform = gl.getUniformLocation(program, uniformName);
        var uniformKey = 'u' + uniformId.charAt(0).toUpperCase() + uniformId.substr(1, uniformId.length);
        var uniformSpeckey = uniformKey + 'Spec';
        _this4[uniformKey] = uniform;
        uniforms[uniformKey] = uniform;
        _this4[uniformSpeckey] = uniformSpec;
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
        _this4[bufferKey] = buffer;
        buffers[bufferKey] = buffer;
        _this4[bufferSpeckey] = bufferSpec;
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
          var attributeSpec = _this4[attributeSpeckey];
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
        _this4[textureKey] = texture;
        textures[textureKey] = texture;
        _this4[textureSpeckey] = textureSpec;
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
      _this5.initialize(gl);
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[bufferId];
        if (!bufferSpec.applied && bufferSpec.Data) gl.bufferData(gl[bufferSpec.target], bufferSpec.Data, gl[bufferSpec.usage]);
      });
      if (executor) {
        console.log('program.execute');
        executor.call(_this5, gl);
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
