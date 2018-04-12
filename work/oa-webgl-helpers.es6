// oaWebglHelpers with tests
const {
  angular
} = window;
angular
  .module("oaWebglHelpers", [])
  .service("oaWebglHelpers", function() {
    function oaWebglHelpers() {
      this.FLOAT32 = 0;
      this.loadShader = function loadShader(gl, type, source, onErr) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          if (onErr) onErr(gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };
      this.loadProgram = function loadProgram(
        gl,
        vertexSource,
        fragmentSource,
        onErr
      ) {
        if (!onErr)
          onErr = msg => console.error(msg);
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexSource, onErr);
        if (!vertexShader) {
          onErr('vertexshader failed to compile');
          return null;
        }
        const fragmentShader = this.loadShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentSource,
          onErr
        );
        if (!vertexShader) {
          onErr('fragmentshader failed to compile');
          return null;
        }
        const shaderProgram = gl.createProgram();
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
  })
  .service("oaWebglShaderHelpers", function() {
    function oaWebglShaderHelpers() {
      this.precision = 9;
      this.orthagonalBasis = function(_options) {
        const { inA, outA, inB, outB, c, swap } = _options;
        return `vec4 ${outA} = vec4(normalize(${inA}.xyz), 0.0);
vec4 ${c} = vec4(normalize(cross(normalize(${inB}).xyz, cz.xyz)), 0.0);
vec4 ${outB} = vec4(normalize(cross(${swap ? c : outA}.xyz, ${
            swap ? outA : c
          }.xyz)), 0.0);`;
      };
      this.cameraMatrix = function(_options) {
        const {
          cameraPosition: p,
          cameraDirection: z,
          cameraUp: y,
          matrix: m,
          normalizedDirection: Z,
          normalizedUp: Y,
          right: X
        } = Object.assign({
            cameraPosition: "camP",
            cameraDirection: "camZ",
            cameraUp: "camY",
            matrix: "cameraMatrix",
            normalizedDirection: "cz",
            normalizedUp: "cy",
            right: "cx"
          },
          _options
        );
        var basis = this.orthagonalBasis({
          inA: z,
          outA: Z,
          inB: y,
          outB: Y,
          c: X,
          swap: true
        });
        return `${basis}
mat4 ${m} = inverse(mat4(cx, cy, cz, vec4(vec3(0.0), 1.0))) * mat4(vec4(1.0, vec3(0.0)), vec4(0.0, 1.0, vec2(0.0)), vec4(vec2(0.0), 1.0, 0.0), vec4(-${p}.xyz, 1.0))`;
      };
      this.projectionMatrix = function(_options) {
        const { fov, far, near } = Object.assign({
            fov: "fov",
            far: "far",
            near: "near"
          },
          _options
        );
        return `mat4(vec4(1.0 / tan(${fov}.x / 2.0), vec3(0.0)), vec4(0.0, 1.0 / tan(${fov}.y / 2.0), vec2(0.0)), ve4(vec2(0.0), -(${far} + ${near}) / (${far} - ${near}), -1.0), vec4(vec2(0.0), -${far} * ${near} / (${far} - ${near}), 0.0));`;
      };
    }

    return new oaWebglShaderHelpers();
  })
  .factory("oaWebglShaderSource", function() {
    function oaWebglShaderSource(_source, _generator, _parameters) {
      var source = _source;
      var generator = _generator;
      var parameterNames = _parameters || [];
      var parameters = {};
      this.printShader = function(_options) {
        console.log(
          source
          .split(/\n/g)
          .map((line, i) => ("0000" + (i + 1)).substr(-4, 4) + ": " + line)
          .join("\n")
        );
      };
      this.getParameter = p => parameters[p];
      this.setParameter = (p, v) => {
        parameters[p] = v;
      };
      this.generate = function() {
        if (!generator) return source;
        var params = {};
        parameterNames.forEach(p => {
          params[p] = parameters[p];
        });
        return (source = generator.call(params, params));
      };
      Object.defineProperties(this, {
        source: {
          get: () => source,
          set: v => {
            source = v;
          }
        },
        generator: {
          get: () => generator,
          set: v => {
            generator = v;
          }
        },
        parameterNames: {
          get: () => parameterNames
        },
        type: {
          get: () =>
            generator ?
            parameters && parameters.length ? "dynamic" : "generated" :
            "static"
        }
      });
    }

    return oaWebglShaderSource;
  })
  .factory("oaWebglProgram", [
    "oaWebglHelpers",
    "oaWebglShaderSource",
    function(oaWebglHelpers, oaWebglShaderSource) {
      function oaWebglProgram(_options) {
        var options = Object.assign({}, _options);
        var dirty = true;
        var vertexSource =
          options.vertexSource instanceof oaWebglShaderSource ?
          options.vertexSource :
          new oaWebglShaderSource(options.vertexSource);
        var fragmentSource =
          options.fragmentSource instanceof oaWebglShaderSource ?
          options.fragmentSource :
          new oaWebglShaderSource(options.fragmentSource);
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
        vertexSource.parameterNames.forEach(p => {
          Object.defineProperty(vertexShaderParameters, p, {
            get: vertexSource.getParameter(p),
            set: v => {
              vertexSource.setParameter(p, v);
              dirty = true;
            }
          });
        });
        fragmentSource.parameterNames.forEach(p => {
          Object.defineProperty(fragmentShaderParameters, p, {
            get: fragmentSource.getParameter(p),
            set: v => {
              fragmentSource.setParameter(p, v);
              dirty = true;
            }
          });
        });
        Object.defineProperties(this, {
          vertexSource: {
            get: () => vertexSource,
            set: v => {
              vertexSource =
                v instanceof oaWebglShaderSource ?
                v :
                new oaWebglShaderSource(v);
              dirty = true;
            }
          },
          fragmentSource: {
            get: () => fragmentSource,
            set: v => {
              fragmentSource =
                v instanceof oaWebglShaderSource ?
                v :
                new oaWebglShaderSource(v);
              dirty = true;
            }
          },
          vertexShaderParameters: {
            get: () => vertexShaderParameters
          },
          vParams: {
            get: () => vertexShaderParameters
          },
          fragmentShaderParameters: {
            get: () => fragmentShaderParameters
          },
          fParams: {
            get: () => fragmentShaderParameters
          },
          program: {
            get: () => program
          }
        });
        this.initialize = function initialize(gl) {
          if (!dirty) return;
          console.log('program.initialize');
          var vertexSourceCode = vertexSource.generate();
          var fragmentSourceCode = fragmentSource.generate();
          program = oaWebglHelpers.loadProgram(
            gl,
            vertexSourceCode,
            fragmentSourceCode
          );
          Object.keys(attributeSpecs).forEach(attributeId => {
            var attributeSpec = attributeSpecs[attributeId];
            let { name: attributeName } = attributeSpec;
            var attribute = gl.getAttribLocation(program, attributeName);
            var attributeKey = `a${attributeId
                .charAt(0)
                .toUpperCase()}${attributeId.substr(1, attributeId.length)}`;
            var attributeSpeckey = `${attributeKey}Spec`;
            this[attributeKey] = attribute;
            attributes[attributeKey] = attribute;
            this[attributeSpeckey] = attributeSpec;
          });
          Object.keys(uniformSpecs).forEach(uniformId => {
            var uniformSpec = uniformSpecs[uniformId];
            let { name: uniformName } = uniformSpec;
            var uniform = gl.getUniformLocation(program, uniformName);
            var uniformKey = `u${uniformId
                .charAt(0)
                .toUpperCase()}${uniformId.substr(1, uniformId.length)}`;
            var uniformSpeckey = `${uniformKey}Spec`;
            this[uniformKey] = uniform;
            uniforms[uniformKey] = uniform;
            this[uniformSpeckey] = uniformSpec;
          });
          Object.keys(bufferSpecs).forEach(bufferId => {
            var bufferSpec = bufferSpecs[bufferId];
            let {
              data,
              datatype,
              target,
              usage,
              name: bufferName,
              attribute: attributeId
            } = bufferSpec;
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl[target], buffer);
            var bufferKey = `b${bufferId
                .charAt(0)
                .toUpperCase()}${bufferId.substr(1, bufferId.length)}`;
            var bufferSpeckey = `${bufferKey}Spec`;
            this[bufferKey] = buffer;
            buffers[bufferKey] = buffer;
            this[bufferSpeckey] = bufferSpec;
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
              bufferId,
              data,
              Data: bufferSpec.Data
            });
            gl.bufferData(gl[target], bufferSpec.Data, gl[usage]);
            bufferSpec.applied = true;
            bufferSpec._data = bufferSpec.data;
            Object.defineProperty(bufferSpec, "data", {
              get: () => bufferSpec._data,
              set: v => {
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
                    bufferId,
                    data,
                    Data: bufferSpec.Data
                  });
                  bufferSpec.applied = false;
                }
              }
            });
            if (attributeId) {
              var attributeKey = `a${attributeId
                  .charAt(0)
                  .toUpperCase()}${attributeId.substr(1, attributeId.length)}`;
              var attributeSpeckey = `${attributeKey}Spec`;
              var attributeSpec = this[attributeSpeckey];
              attributeSpec.buffer = bufferId;
            }
          });
          Object.keys(textureSpecs).forEach(textureId => {
            var textureSpec = textureSpecs[textureId];
            let { image, type, name: textureName } = textureSpec;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_S,
              gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_WRAP_T,
              gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MIN_FILTER,
              gl.NEAREST
            );
            gl.texParameteri(
              gl.TEXTURE_2D,
              gl.TEXTURE_MAG_FILTER,
              gl.NEAREST
            );
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl[type],
              image
            );
            var textureKey = `t${textureId
                .charAt(0)
                .toUpperCase()}${textureId.substr(1, textureId.length)}`;
            var textureSpeckey = `${textureKey}Spec`;
            this[textureKey] = texture;
            textures[textureKey] = texture;
            this[textureSpeckey] = textureSpec;
          });
          dirty = false;
          console.log('program.initialized');
        };
        this.pushAttribute = function pushAttribute(gl, attributeId) {
          console.log(Object.keys(this));
          var attributeKey = `a${attributeId
              .charAt(0)
              .toUpperCase()}${attributeId.substr(1, attributeId.length)}`;
          var attributeSpeckey = `${attributeKey}Spec`;
          var attribute = this[attributeKey];
          var attributeSpec = this[attributeSpeckey];
          console.log({
            attributeId,
            attributeKey,
            attributeSpeckey,
            attributeSpec
          });
          var bufferId = attributeSpec.buffer;
          var bufferKey = `b${bufferId
                .charAt(0)
                .toUpperCase()}${bufferId.substr(1, bufferId.length)}`;
          var bufferSpeckey = `${bufferKey}Spec`;
          var buffer = this[bufferKey];
          var bufferSpec = this[bufferSpeckey];
          console.log({
            bufferId,
            bufferKey,
            bufferSpeckey,
            bufferSpec
          });
          const {
            numComponents,
            type,
            normalize,
            stride,
            offset,
            target
          } = bufferSpec;
          gl.bindBuffer(gl[target], buffer);
          gl.vertexAttribPointer(
            attribute,
            numComponents,
            gl[type],
            normalize,
            stride,
            offset
          );
          gl.enableVertexAttribArray(attribute);
        };
        this.draw = gl => {
          console.log('program.draw');
          this.initialize(gl);
          Object.keys(bufferSpecs).forEach(bufferId => {
            var bufferSpec = bufferSpecs[bufferId];
            if (!bufferSpec.applied && bufferSpec.Data)
              gl.bufferData(
                gl[bufferSpec.target],
                bufferSpec.Data,
                gl[bufferSpec.usage]
              );
          });
          if (executor) {
            console.log('program.execute');
            executor.call(this, gl);
          }
          else
            console.log('!executor');
          console.log('program.drawn');
        };
      }

      return oaWebglProgram;
    }
  ])
  .factory("oaWebglCanvas", function() {
    function oaWebglCanvas(name, canvas, _options) {
      var options = Object.assign({}, _options);
      var gl;
      var main;
      var programs = {};
      var newCanvas = () => {
        if (canvas) {
          if (options.width && options.height) {
            canvas.width = options.width;
            canvas.height = options.height;
          }
          gl = canvas.getContext("webgl");
        }
        else gl = null;
      };
      newCanvas();
      Object.defineProperties(this, {
        canvas: {
          get: () => canvas,
          set: v => {
            canvas = v;
            newCanvas();
          }
        },
        gl: {
          get: () => gl
        },
        main: {
          get: () => main,
          set: v => {
            if (programs[v]) main = v;
          }
        }
      });
      this.registerProgram = (name, program) => {
        programs[name] = program;
        if (gl) {
          program.initialize(gl);
        }
      };
      this.draw = name => {
        console.log('canvas.draw');
        if (gl) {
          if (!name) {
            if (main) name = main;
            else name = "main";
          }
          var program = programs[name];
          if (program) program.draw(gl);
        }
        console.log('canvas.drawn');
      };
    }
    return oaWebglCanvas;
  });
