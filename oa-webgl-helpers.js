'use strict';

/**
 * OAlpha WebGL Helper Library
 */
var _window = window,
    angular = _window.angular;

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
  function Snippet() {
    var source = '';
    var parameters = {};

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

    function applyParams(string, params, options) {
      return string.replace(/(^|[^\$])\${([a-zA-Z]([-_a-zA-Z0-9]*[a-zA-Z0-9])?)}/g, function (match, p1, p2) {
        var key = p2;
        if (!params.hasOwnProperty(key)) return match;
        var value = params[key];
        if (value.generate) value = value.generate(params, options);
        return params.hasOwnProperty(key) ? p1 + params[key] : match;
      });
    }

    this.generate = function (_params, _options) {
      var params = Object.assign({}, parameters, _params),
          options = Object.assign({}, params, _options);
      return render(applyParams(source, params, options), options);
    };

    this.applyParams = function (params) {
      var p = {};
      if (Array.isArray(params)) params.forEach(function (paramName) {
        p[paramName] = parameters[paramName];
      });else p = params;
      source = applyParams(source, p);
    };
    Object.defineProperty(this, 'source', {
      get: function get() {
        return source;
      },
      set: function set(v) {
        source = v.generate ? v.generate(parameters) : v.toString();
      }
    });
    this.getParameter = function (k) {
      return parameters[k];
    };
    this.setParameter = function (k, v) {
      parameters[k] = v;
    };
    this.getParameterNames = function () {
      return Object.keys(parameters);
    };
    this.removeParameter = function (k) {
      delete parameters[k];
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
    var _this2 = this;

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
      var _this = this;

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
        _this[attributeKey] = attribute;
        attributes[attributeKey] = attribute;
        _this[attributeSpeckey] = attributeSpec;
      });
      Object.keys(uniformSpecs).forEach(function (uniformId) {
        var uniformSpec = uniformSpecs[uniformId];
        var uniformName = uniformSpec.name;

        var uniform = gl.getUniformLocation(program, uniformName);
        var uniformKey = 'u' + uniformId.charAt(0).toUpperCase() + uniformId.substr(1, uniformId.length);
        var uniformSpeckey = uniformKey + 'Spec';
        _this[uniformKey] = uniform;
        uniforms[uniformKey] = uniform;
        _this[uniformSpeckey] = uniformSpec;
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
        _this[bufferKey] = buffer;
        buffers[bufferKey] = buffer;
        _this[bufferSpeckey] = bufferSpec;
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
          var attributeSpec = _this[attributeSpeckey];
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
        _this[textureKey] = texture;
        textures[textureKey] = texture;
        _this[textureSpeckey] = textureSpec;
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
      _this2.initialize(gl);
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[bufferId];
        if (!bufferSpec.applied && bufferSpec.Data) gl.bufferData(gl[bufferSpec.target], bufferSpec.Data, gl[bufferSpec.usage]);
      });
      if (executor) {
        console.log('program.execute');
        executor.call(_this2, gl);
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
