"use strict";

angular.module("app", []).controller("Ctrl", function () {
  var _this4 = this;

  this.modal = '';

  var FLOAT32 = 2;

  function initShaderProgram(gl, vsSource, fsSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function CanvasWebGL(cname, canvas, options) {
    var _this = this;

    var gl;
    var programs = {};

    /*
    console.log(
      Object.assign(
        {
          name: cname
        },
        options
      )
    );
    //*/

    if (canvas) {
      if (options.width) canvas.width = options.width;
      if (options.height) canvas.height = options.height;
      /*
      console.log({
        width: canvas.width,
        height: canvas.height
      });
      //*/
      gl = canvas.getContext("webgl");
    }
    Object.defineProperties(this, {
      canvas: {
        get: function get() {
          return canvas;
        },
        set: function set(v) {
          canvas = v;
          if (!canvas) {
            gl = canvas.getContext("webgl");
          } else {
            gl = null;
          }
        }
      },
      gl: {
        get: function get() {
          return gl;
        }
      }
    });

    this.registerProgram = function (name, program) {
      //console.log(`${cname}: registerProgram(${name})`);
      programs[name] = program;
      if (gl) {
        //console.log(`${cname}: initializing program ${name}`);
        program.initializeProgram(gl);
        program.queryLocations(gl);
        program.initializeBuffers(gl);
        program.initializeTextures(gl);
      }
    };
    this.draw = function (name) {
      if (gl) {
        if (!name) name = _this.main;
        if (!name) name = "main";
        //console.log(`drawing program ${name}`);
        var program = programs[name];
        if (program) program.draw(gl);
        //else console.log("program is null");
      }
    };
  }

  function Program(vertexShaderSource, fragmentShaderSource, attributeNames, uniformNames, bufferNames, textureNames, draw) {
    var _this2 = this;

    var program;
    var attributes = {},
        uniforms = {};
    var buffers = {},
        textures = {};

    this.initializeProgram = function (gl) {
      //console.log("initializing shaders");
      program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
      /*
      console.log(
        vertexShaderSource
          .split(/\n/g)
          .map((line, i) => ("00" + (i + 1)).substr(-2, 2) + ": " + line)
          .join("\n")
      );
      console.log(
        fragmentShaderSource
          .split(/\n/g)
          .map((line, i) => ("00" + (i + 1)).substr(-2, 2) + ": " + line)
          .join("\n")
      );
      //*/
    };
    this.queryLocations = function (gl) {
      //console.log("initializing locations");
      //console.log("initializing attributes");
      Object.keys(attributeNames).forEach(function (key) {
        var meta = attributeNames[key];
        var name = meta.name;

        var attribute = gl.getAttribLocation(program, name);
        var metakey = "a" + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + "Meta";
        key = "a" + key.substr(0, 1).toUpperCase() + key.substr(1, 99);
        /*
        console.log({
          key,
          metakey
        });
        //*/
        _this2[metakey] = meta;
        _this2[key] = attribute;
        attributes[key] = attribute;
      });
      //console.log("initializing uniforms");
      Object.keys(uniformNames).forEach(function (key) {
        var meta = uniformNames[key];
        var name = meta.name;

        var uniform = gl.getUniformLocation(program, name);
        var metakey = "u" + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + "Meta";
        key = "u" + key.substr(0, 1).toUpperCase() + key.substr(1, 99);
        _this2[metakey] = meta;
        _this2[key] = uniform;
        uniforms[key] = uniform;
      });
    };
    this.initializeBuffers = function (gl) {
      //console.log("initializing buffers");
      Object.keys(bufferNames).forEach(function (key) {
        var meta = bufferNames[key];
        var data = meta.data,
            datatype = meta.datatype,
            target = meta.target,
            usage = meta.usage,
            aKey = meta.attribute;

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        var Data;
        switch (datatype) {
          case FLOAT32:
            Data = new Float32Array(data);
            break;
        }
        gl.bufferData(gl[target], Data, gl[usage]);
        var metakey = "b" + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + "Meta";
        key = "b" + key.substr(0, 1).toUpperCase() + key.substr(1, 99);
        /*
        console.log({
          key,
          metakey,
          datatype,
          data,
          Data
        });
        //*/
        _this2[metakey] = meta;
        _this2[key] = buffer;
        buffers[key] = buffer;
        if (aKey) {
          var attributeKey = "a" + aKey.substr(0, 1).toUpperCase() + aKey.substr(1, 99);
          /*
          console.log({
            attributeKey
          });
          //*/
          var attributeMeta = _this2[attributeKey + "Meta"];
          attributeMeta.buffer = key;
          //console.log(this[attributeKey + "Meta"]);
        }
      });
    };
    this.initializeTextures = function (gl) {
      //console.log("initializing textures");
      Object.keys(textureNames).forEach(function (key) {
        var meta = textureNames[key];
        var image = meta.image,
            type = meta.type;

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl[type], image);
        var metakey = "t" + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + "Meta";
        key = "t" + key.substr(0, 1).toUpperCase() + key.substr(1, 99);
        _this2[metakey] = meta;
        _this2[key] = texture;
        textures[key] = texture;
      });
    };
    this.pushAttribute = function (gl, key) {
      var attribute = _this2["a" + key.substr(0, 1).toUpperCase() + key.substr(1, 99)];
      var attributeMeta = _this2["a" + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + "Meta"];
      var buffer = _this2[attributeMeta.buffer];
      var bufferMeta = _this2[attributeMeta.buffer + "Meta"];
      /*
      console.log(
        `pushing buffer ${attributeMeta.buffer} to attribute ${`a${key
          .substr(0, 1)
          .toUpperCase()}${key.substr(1, 99)}`}`
      );
      console.log({
        attributeMeta,
        bufferMeta,
        attribute,
        buffer
      });
      //*/
      var numComponents = bufferMeta.numComponents,
          type = bufferMeta.type,
          normalize = bufferMeta.normalize,
          stride = bufferMeta.stride,
          offset = bufferMeta.offset;

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(attribute, numComponents, gl[type], normalize, stride, offset);
      gl.enableVertexAttribArray(attribute);
    };
    this.draw = function (gl) {
      //console.log("preparing to draw");
      if (draw) {
        //console.log("drawing");
        draw.call(_this2, gl);
      }
    };

    Object.defineProperties(this, {
      program: {
        get: function get() {
          return program;
        }
      }
    });
  }

  function Fractal(paramConfig, DE) {
    var _this3 = this;

    var defaultConfig = {
      positionAttribute: "aVertexPosition",
      cameraAttribute: "aCam",
      cameraVarying: "vCam",
      cameraUniform: "uCam",
      precision: "highp",
      deFuncName: "DE",
      marchFuncName: "march",
      maxSteps: 10,
      toleranceVarName: "tolerance",
      normalDiff: "0.0125"
    };
    var config = paramConfig ? Object.assign({}, defaultConfig, paramConfig) : Object.assign({}, defaultConfig);
    this.vertexShader = function () {
      var _config = config,
          positionAttribute = _config.positionAttribute,
          cameraAttribute = _config.cameraAttribute,
          cameraVarying = _config.cameraVarying,
          precision = _config.precision;

      return "attribute vec4 " + positionAttribute + ";\nattribute vec2 " + cameraAttribute + ";\nvarying " + precision + " vec2 " + cameraVarying + ";\nvoid main() {\n  gl_Position = " + positionAttribute + ";\n  " + cameraVarying + " = " + cameraAttribute + ";\n}";
    };
    this.uniforms = function () {
      var _config2 = config,
          cameraUniform = _config2.cameraUniform,
          toleranceVarName = _config2.toleranceVarName;

      return "uniform vec3 " + cameraUniform + ";\nuniform float " + cameraUniform + "L;\nuniform vec3 " + cameraUniform + "Y;\nuniform vec3 " + cameraUniform + "Z;\nuniform vec2 " + cameraUniform + "V;\nuniform float " + toleranceVarName + ";\nuniform vec3 lightP;\nuniform vec4 lightC;\nuniform vec4 ambientC;\nuniform float softness;\nuniform float ss;\nuniform float shine;\nuniform vec3 albedo;";
    };
    this.deDec = function () {
      var _config3 = config,
          deFuncName = _config3.deFuncName;

      return "float " + deFuncName + "(vec3 p, vec3 d);";
    };
    this.deDef = function () {
      return DE;
    };
    this.marchDec = function () {
      var _config4 = config,
          marchFuncName = _config4.marchFuncName;

      return "vec4 " + marchFuncName + "(vec3 start, vec3 dir, float tolerance);";
    };
    this.marchDef = function () {
      var _config5 = config,
          deFuncName = _config5.deFuncName,
          marchFuncName = _config5.marchFuncName,
          maxSteps = _config5.maxSteps;

      return "vec4 " + marchFuncName + "(vec3 start, vec3 dir, float tolerance) {\n  float dis = 0.0;\n  int steps = -1;\n  for(int i = 0; i < " + maxSteps + "; i++) {\n    vec3 p = start + dis * dir;\n    float d = " + deFuncName + "(p, dir);\n    dis += d;\n    if(steps < 0 && d < tolerance) {\n      steps = i;\n    }\n  }\n  if(steps < 0)\n    return vec4(0.0, 0.0, 0.0, 0.0);\n  return vec4(start + dis * dir, 1.0 - float(steps) / " + maxSteps + ".0);\n}";
    };
    this.declarations = function () {
      var _config6 = config,
          cameraVarying = _config6.cameraVarying,
          precision = _config6.precision;

      return "#define PI 3.1415926535897932384626433832795\nprecision " + precision + " float;\n" + _this3.uniforms() + "\n" + _this3.deDec() + "\n" + _this3.marchDec() + "\nvarying vec2 " + cameraVarying + ";";
    };
    this.position = function () {
      var _config7 = config,
          cameraVarying = _config7.cameraVarying,
          cameraUniform = _config7.cameraUniform,
          marchFuncName = _config7.marchFuncName,
          toleranceVarName = _config7.toleranceVarName;

      return "vec3 cy = normalize(" + cameraUniform + "Y);\n  vec3 cx = normalize(cross(cy, " + cameraUniform + "Z));\n  vec3 cz = normalize(cross(cx, cy));\n  vec3 cp = " + cameraUniform + " + " + cameraUniform + "L * cy;\n  cp = " + cameraUniform + " + 0.25 * cy;\n  vec2 fov = sin(" + cameraUniform + "V / 2.0);\n  fov = vec2(0.25, 0.25);\n  cp += fov.x * " + cameraVarying + ".x * cx + fov.y * " + cameraVarying + ".y * cz;\n  vec4 m = " + marchFuncName + "(" + cameraUniform + ", normalize(cp - " + cameraUniform + "), " + toleranceVarName + ");";
    };
    this.normal = function () {
      var _config8 = config,
          normalDiff = _config8.normalDiff;

      return "vec3 xDir = vec3(1.0, 0.0, 0.0);\n    vec3 yDir = vec3(0.0, 1.0, 0.0);\n    vec3 zDir = vec3(0.0, 0.0, 1.0);\n    vec3 origin = vec3(0.0, 0.0, 0.0);\n    float d = " + normalDiff + ";\n    vec3 n = normalize(vec3(DE(m.xyz + d * xDir, origin)-DE(m.xyz - d * xDir, origin), DE(m.xyz + d * yDir, origin)-DE(m.xyz - d * yDir, origin), DE(m.xyz + d * zDir, origin)-DE(m.xyz - d * zDir, origin)));\n    vec3 nt = cross(n, vec3(1.0, 0.0, 0.0));\n    if(length(nt) < 0.1) nt = cross(n, vec3(0.0, 1.0, 0.0));";
    };
    this.lightpath = function () {
      var _config9 = config,
          cameraUniform = _config9.cameraUniform;

      return "vec4 lp = vec4(lightP - m.xyz, 1.0);\n    lp.w = length(lp.xyz);\n    lp.xyz = normalize(lp.xyz);\n    vec2 incident = vec2(dot(n, lp.xyz), dot(lp.xyz - dot(n, lp.xyz) * n, nt));\n    vec3 reflected = 2.0 * incident.x * n - lp.xyz;\n    vec4 cp = vec4(" + cameraUniform + " - m.xyz, 1.0);\n    cp.w = length(cp.xyz);\n    cp.xyz = normalize(cp.xyz);\n    vec2 recieving = vec2(dot(n, cp.xyz), dot(cp.xyz - dot(n, cp.xyz) * n, nt));";
    };
    this.shadow = function () {
      var _config10 = config,
          toleranceVarName = _config10.toleranceVarName,
          marchFuncName = _config10.marchFuncName;

      return "float s = 1.0;\n    /*float t = 0.01;\n    for(int i = 0; i < 100; i++)\n    {\n      float h = DE(m.xyz + lp.xyz*t, lp.xyz);\n      if( h<" + toleranceVarName + " )\n        s = 0.0;\n      else\n        s = min( s, softness*h/t );\n      t += h;\n    }*/\n    vec4 lm = " + marchFuncName + "(m.xyz + 0.01 * lp.xyz, lp.xyz, " + toleranceVarName + ");\n    if(lm.a > 0.0) s = 0.0;";
    };
    this.energy = function () {
      return "float e = lightC.a * s / (PI * pow(lp.w, 2.0));";
    };
    this.lambert = function () {
      return "vec3 lambert = max(vec3(0.0, 0.0, 0.0), incident.x * lightC.rgb * e);";
    };
    this.orennayar = function () {
      return "vec2 greek = vec2(max(acos(incident.x), acos(recieving.x)), min(acos(incident.x), acos(recieving.x)));\n    vec2 latin = vec2(1.0 - 0.5 * ss / (ss + 0.33), 0.45 * ss / (ss + 0.09));\n    vec3 orennayar = max(vec3(0.0, 0.0, 0.0), e * lightC.rgb * incident.x * (latin.x + latin.y * max(0.0, cos(acos(incident.y) - acos(recieving.y))) * sin(greek.x) * tan(greek.y)));";
    };
    this.phong = function () {
      return "vec3 phong = max(vec3(0.0, 0.0, 0.0), pow(dot(reflected, cp.xyz), shine) * e * incident.x);";
    };
    var vectorColor = function vectorColor(vname, center, scale) {
      return "vec3((" + vname + ".x - " + center[0] + ") / " + scale[0] + " + 0.5, (" + vname + ".y - " + center[1] + ") / " + scale[1] + " + 0.5, (" + vname + ".z - " + center[2] + ") / " + scale[2] + " + 0.5)";
    };
    this.debugShader = function () {
      var _config11 = config,
          cameraVarying = _config11.cameraVarying,
          cameraUniform = _config11.cameraUniform,
          marchFuncName = _config11.marchFuncName,
          toleranceVarName = _config11.toleranceVarName;

      return _this3.declarations() + "\nvoid main() {\n  vec3 cy = normalize(" + cameraUniform + "Y);\n  vec3 cx = normalize(cross(cy, " + cameraUniform + "Z));\n  vec3 cz = normalize(cross(cx, cy));\n  vec3 cp = " + cameraUniform + " + " + cameraUniform + "L * cy;\n  cp = " + cameraUniform + " + 0.25 * cy;\n  vec2 fov = 0.25 * tan(" + cameraUniform + "V / 2.0);\n  fov = vec2(0.25, 0.25);\n  cp += fov.x * " + cameraVarying + ".x * cx + fov.y * " + cameraVarying + ".y * cz;\n  vec3 dir = normalize(cp - " + cameraUniform + ");\n  //vec4 m = " + marchFuncName + "(" + cameraUniform + ", dir, " + toleranceVarName + ");\n  //gl_FragColor = vec4(" + vectorColor("cx", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + ", 1.0);\n  //gl_FragColor = vec4(" + vectorColor(cameraUniform, ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + ", 1.0);\n  //gl_FragColor = vec4(" + vectorColor("cp", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + ", 1.0);\n  gl_FragColor = vec4(" + vectorColor("dir", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + ", 1.0);\n  //gl_FragColor = vec4(m.w, m.w, m.w, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    this.iterationsShader = function () {
      return _this3.declarations() + "\nvoid main() {\n  " + _this3.position() + "\n  gl_FragColor = vec4(m.w, m.w, m.w, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    this.positionsShader = function () {
      return _this3.declarations() + "\nvoid main() {\n  " + _this3.position() + "\n  if(m.w > 0.001 && length(m.xyz) > 0.001) {\n    m = normalize(m);\n    gl_FragColor = vec4(" + vectorColor("m", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + " * m.w, 1.0);\n  }\n  else\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    this.normalShader = function () {
      return _this3.declarations() + "\nvoid main() {\n  " + _this3.position() + "\n  if(m.w > 0.001 && length(m.xyz) > 0.001) {\n    " + _this3.normal() + "\n    gl_FragColor = vec4(" + vectorColor("n", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + " * m.w, 1.0);\n  }\n  else\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    this.lightpathShader = function () {
      var _config12 = config,
          fragVar = _config12.fragVar;

      return _this3.declarations() + "\nvoid main() {\n  " + _this3.position() + "\n  if(m.w > 0.001 && length(m.xyz) > 0.001) {\n    vec3 lp = normalize(lightP - m.xyz);\n    gl_FragColor = vec4(" + vectorColor("lp", ["0.0", "0.0", "0.0"], ["2.0", "2.0", "2.0"]) + " * m.w, 1.0);\n  }\n  else\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    this.fragmentShader = function () {
      var _config13 = config,
          fragVar = _config13.fragVar;

      return _this3.declarations() + "\nvoid main() {\n  " + _this3.position() + "\n  if(m.w > 0.001 && length(m.xyz) > 0.001) {\n    " + _this3.normal() + "\n    " + _this3.lightpath() + "\n    " + _this3.shadow() + "\n    " + _this3.energy() + "\n    " + _this3.lambert() + "\n    " + _this3.orennayar() + "\n    " + _this3.phong() + "\n    gl_FragColor = vec4((albedo.y * orennayar + albedo.z * phong + albedo.x * ambientC.rgb * ambientC.a) * m.w, 1.0);\n  }\n  else\n    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n" + _this3.deDef() + "\n" + _this3.marchDef();
    };
    Object.defineProperty(this, "config", {
      get: function get() {
        return config;
      },
      set: function set(v) {
        config = paramConfig ? Object.assign({}, defaultConfig, paramConfig) : Object.assign({}, defaultConfig);
      }
    });
    Object.keys(defaultConfig).forEach(function (prop) {
      Object.defineProperty(_this3, prop, {
        get: function get() {
          return config[prop];
        },
        set: function set(v) {
          config[prop] = v ? v : defaultConfig[prop];
        }
      });
    });
  }

  if (false) {
    var sphereDE = function sphereDE(i, R) {
      var funcs = ["float DE(vec3 p) {\n  return max(0.0, length(p) - " + R + ");\n}", "float DE(vec3 p) {\n  return length(p) - " + R + ";\n}", "float DE(vec3 p) {\n  return abs(length(p) - " + R + ");\n}"];
      return funcs[i];
    };
    var combSphereDE = function combSphereDE(i, R) {
      var funcs = ["float DE(vec3 p) {\n  return min( length(p)-1.0 , length(p-vec3(2.0,0.0,0.0))-1.0 );\n}", "float DE(vec3 p) {\n  return max( length(p)-1.0 , length(p-vec3(1.0,0.0,0.0))-1.0 );\n}"];
      return funcs[i];
    };
  }
  var infSphereDE = function infSphereDE(R, S) {
    return "float DE(vec3 z, vec3 d)\n{\n  z.xy = mod(z.xy," + S + ")-vec2(" + S + " / 2.0); // instance on xy-plane\n  return length(z)-" + R + ";\n}";
  };
  var recursiveTetrahedral = function recursiveTetrahedral(Scale, Iterations, Ra, Rb, c) {
    return "float DE(vec3 z, vec3 d)\n{\n  vec3 n1 = normalize(vec3(1.0,1.0,0.0));\n  vec3 n2 = normalize(vec3(0.0,1.0,1.0));\n  vec3 n3 = normalize(vec3(1.0,0.0,1.0));\n  mat3 Ra = mat3(\n    cos(" + Ra + "), sin(" + Ra + "), 0.0,\n    -sin(" + Ra + "), cos(" + Ra + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  mat3 Rb = mat3(\n    cos(" + Rb + "), sin(" + Rb + "), 0.0,\n    -sin(" + Rb + "), cos(" + Rb + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  for(int n = 0; n < " + Iterations + "; n++) {\n    z = Ra * z;\n    z -= 2.0 * min(0.0, dot(z, n1)) * n1;\n    z -= 2.0 * min(0.0, dot(z, n2)) * n2;\n    z -= 2.0 * min(0.0, dot(z, n3)) * n3;\n    z = Rb * z;\n    z = " + Scale + " * (z - " + c + ");\n  }\n  return length(z) * pow(" + Scale + ", -" + Iterations + ".0);\n}";
  };
  var recursiveTetrahedralB = function recursiveTetrahedralB(Scale, Iterations, Ra, Rb, c) {
    return "float DE(vec3 z, vec3 d)\n{\n  vec3 n1 = normalize(vec3(1.0,1.0,0.0));\n  vec3 n2 = normalize(vec3(0.0,1.0,1.0));\n  vec3 n3 = normalize(vec3(1.0,0.0,1.0));\n  mat3 Ra = mat3(\n    cos(" + Ra + "), sin(" + Ra + "), 0.0,\n    -sin(" + Ra + "), cos(" + Ra + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  mat3 Rb = mat3(\n    cos(" + Rb + "), sin(" + Rb + "), 0.0,\n    -sin(" + Rb + "), cos(" + Rb + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  for(int n = 0; n < " + Iterations + "; n++) {\n    z = Ra * z;\n    z = abs(z);\n    z -= 2.0 * min(0.0, dot(z, n1)) * n1;\n    z -= 2.0 * min(0.0, dot(z, n2)) * n2;\n    z -= 2.0 * min(0.0, dot(z, n3)) * n3;\n    z = Rb * z;\n    z = " + Scale + " * (z - " + c + ");\n  }\n  return length(z) * pow(" + Scale + ", -" + Iterations + ".0);\n}";
  };
  var recursiveOctahedral = function recursiveOctahedral(Scale, Iterations, Ra, Rb, c) {
    return "float DE(vec3 z, vec3 d)\n{\n  vec3 n1 = normalize(vec3(1.0,1.0,0.0));\n  vec3 n2 = normalize(vec3(0.0,1.0,1.0));\n  vec3 n3 = normalize(vec3(1.0,0.0,1.0));\n  vec3 n4 = normalize(vec3(-1.0,1.0,0.0));\n  vec3 n5 = normalize(vec3(0.0,-1.0,1.0));\n  vec3 n6 = normalize(vec3(1.0,0.0,-1.0));\n  mat3 Ra = mat3(\n    cos(" + Ra + "), sin(" + Ra + "), 0.0,\n    -sin(" + Ra + "), cos(" + Ra + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  mat3 Rb = mat3(\n    cos(" + Rb + "), sin(" + Rb + "), 0.0,\n    -sin(" + Rb + "), cos(" + Rb + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  for(int n = 0; n < " + Iterations + "; n++) {\n    z = Ra * z;\n    z -= 2.0 * min(0.0, dot(z, n1)) * n1;\n    z -= 2.0 * min(0.0, dot(z, n2)) * n2;\n    z -= 2.0 * min(0.0, dot(z, n3)) * n3;\n    z -= 2.0 * min(0.0, dot(z, n4)) * n4;\n    z -= 2.0 * min(0.0, dot(z, n5)) * n5;\n    z -= 2.0 * min(0.0, dot(z, n6)) * n6;\n    z = Rb * z;\n    z = " + Scale + " * (z - " + c + ");\n  }\n  return length(z) * pow(" + Scale + ", -" + Iterations + ".0);\n}";
  };
  var recursiveOctahedralB = function recursiveOctahedralB(Scale, Iterations, Ra, Rb, c) {
    return "float DE(vec3 z, vec3 d)\n{\n  vec3 n1 = normalize(vec3(1.0,1.0,0.0));\n  vec3 n2 = normalize(vec3(0.0,1.0,1.0));\n  vec3 n3 = normalize(vec3(1.0,0.0,1.0));\n  vec3 n4 = normalize(vec3(-1.0,1.0,0.0));\n  vec3 n5 = normalize(vec3(0.0,-1.0,1.0));\n  vec3 n6 = normalize(vec3(1.0,0.0,-1.0));\n  mat3 Ra = mat3(\n    cos(" + Ra + "), sin(" + Ra + "), 0.0,\n    -sin(" + Ra + "), cos(" + Ra + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  mat3 Rb = mat3(\n    cos(" + Rb + "), sin(" + Rb + "), 0.0,\n    -sin(" + Rb + "), cos(" + Rb + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  for(int n = 0; n < " + Iterations + "; n++) {\n    z = Ra * z;\n    z = abs(z);\n    z -= 2.0 * min(0.0, dot(z, n1)) * n1;\n    z -= 2.0 * min(0.0, dot(z, n2)) * n2;\n    z -= 2.0 * min(0.0, dot(z, n3)) * n3;\n    z -= 2.0 * min(0.0, dot(z, n4)) * n4;\n    z -= 2.0 * min(0.0, dot(z, n5)) * n5;\n    z -= 2.0 * min(0.0, dot(z, n6)) * n6;\n    z = Rb * z;\n    z = " + Scale + " * (z - " + c + ");\n  }\n  return length(z) * pow(" + Scale + ", -" + Iterations + ".0);\n}";
  };
  var recursiveIcoscahedral = function recursiveIcoscahedral(Scale, Iterations, Ra, Rb, c) {
    return "float DE(vec3 z, vec3 d)\n{\n  float phi = (sqrt(5.0) - 1.0) / 2.0;\n  vec3 a = normalize(vec3(phi,1.0,0.0));\n  vec3 b = normalize(vec3(0.0,phi,1.0));\n  vec3 c = normalize(vec3(1.0,0.0,phi));\n  vec3 n7 = normalize(cross(a, b));\n  vec3 n8 = normalize(cross(b, c));\n  vec3 n9 = normalize(cross(c, a));\n  mat3 Ra = mat3(\n    cos(" + Ra + "), sin(" + Ra + "), 0.0,\n    -sin(" + Ra + "), cos(" + Ra + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  mat3 Rb = mat3(\n    cos(" + Rb + "), sin(" + Rb + "), 0.0,\n    -sin(" + Rb + "), cos(" + Rb + "), 0.0,\n    0.0, 0.0, 1.0\n  );\n  for(int n = 0; n < " + Iterations + "; n++) {\n    z = Ra * z;\n    d = Ra * d;\n    if(z.x < 0.0)\n      d.x *= -1.0;\n    if(z.y < 0.0)\n      d.y *= -1.0;\n    if(z.z < 0.0)\n      d.z *= -1.0;\n    z = abs(z);\n    if(dot(z, n7) < 0.0)\n      d -= 2.0 * dot(d, n7) * n7;\n    z -= 2.0 * min(0.0, dot(z, n7)) * n7;\n    if(dot(z, n8) < 0.0)\n      d -= 2.0 * dot(d, n8) * n8;\n    z -= 2.0 * min(0.0, dot(z, n8)) * n8;\n    if(dot(z, n9) < 0.0)\n      d -= 2.0 * dot(d, n9) * n9;\n    z -= 2.0 * min(0.0, dot(z, n9)) * n9;\n    z = Rb * z;\n    d = Rb * d;\n    z = " + Scale + " * (z - " + c + ");\n  }\n  return length(z) * pow(" + Scale + ", -" + Iterations + ".0);\n}";
  };
  var icoscahedral = function icoscahedral(R) {
    return "float DE(vec3 z, vec3 d)\n{\n  float phi = (sqrt(5.0) - 1.0) / 2.0;\n  vec3 a = normalize(vec3(phi,1.0,0.0));\n  vec3 b = normalize(vec3(0.0,phi,1.0));\n  vec3 c = normalize(vec3(1.0,0.0,phi));\n  vec3 p = " + R + " * (a + b + c) / 3.0;\n  vec3 n = normalize(p);\n  vec3 n7 = normalize(cross(a, b));\n  vec3 n8 = normalize(cross(b, c));\n  vec3 n9 = normalize(cross(c, a));\n  z = abs(z);\n  z -= 2.0 * min(0.0, dot(z, n7)) * n7;\n  z -= 2.0 * min(0.0, dot(z, n8)) * n8;\n  z -= 2.0 * min(0.0, dot(z, n9)) * n9;\n  return dot(z - p, n);\n}";
  };
  var mandelbulb = function mandelbulb(Power, Iterations, Bailout) {
    return "float DE(vec3 pos) {\n  vec3 z = pos;\n  float dr = 1.0;\n  float r = 0.0;\n  float br = -1.0;\n  float b = " + Bailout + ";\n  for (int i = 0; i < " + Iterations + " ; i++) {\n    r = length(z);\n    if (r>b && br < 0.0) br = r;\n    // convert to polar coordinates\n    float theta = acos(z.z/r);\n    float phi = atan(z.y,z.x);\n    dr = pow( r, " + Power + "-1.0)*" + Power + "*dr + 1.0;\n    // scale and rotate the point\n    float zr = pow( r," + Power + ");\n    theta = theta*" + Power + ";\n    phi = phi*" + Power + ";\n    // convert back to cartesian coordinates\n    z = zr*vec3(sin(theta)*cos(phi),\n    sin(phi)*sin(theta), cos(theta));\n    z+=pos;\n  }\n  if(br < 0.0) br = r;\n  return 0.5*log(br)*br/dr;\n}";
  };
  //var lightP = [2.5, -1.5, 2.0];
  //var lightP = [0.5, -5.0, 1.0];

  function FractalCanvas(DE, tolerance, maxSteps, normalDiff, camera, focus, lightP, lightC, ambient, softness, ss, shine, albedo) {
    var fractal = new Fractal({
      maxSteps: maxSteps,
      normalDiff: normalDiff
    }, DE);
    if (true) {
      console.log(fractal.fragmentShader().split(/\n/g).map(function (line, i) {
        return ("00" + (i + 1)).substr(-2, 2) + ": " + line;
      }).join("\n"));
    }

    var attributes = {
      positions: {
        name: "aVertexPosition"
      },
      camera: {
        name: "aCam"
      }
    };
    var uniforms = {
      camera: {
        name: "uCam"
      },
      cameraLength: {
        name: "uCamL"
      },
      cameraY: {
        name: "uCamY"
      },
      cameraZ: {
        name: "uCamZ"
      },
      cameraFOV: {
        name: "uCamV"
      },
      tolerance: {
        name: "tolerance"
      },
      lightP: {
        name: "lightP"
      },
      lightC: {
        name: "lightC"
      },
      ambientC: {
        name: "ambientC"
      },
      softness: {
        name: "softness"
      },
      ss: {
        name: "ss"
      },
      shine: {
        name: "shine"
      },
      albedo: {
        name: "albedo"
      }
    };
    var buffers = {
      positions: {
        data: [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0],
        datatype: FLOAT32,
        target: "ARRAY_BUFFER",
        usage: "STATIC_DRAW",
        attribute: "positions",
        numComponents: 2,
        type: "FLOAT",
        normalize: false,
        stride: 0,
        offset: 0
      },
      camera: {
        data: [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0],
        datatype: FLOAT32,
        target: "ARRAY_BUFFER",
        usage: "STATIC_DRAW",
        attribute: "camera",
        numComponents: 2,
        type: "FLOAT",
        normalize: false,
        stride: 0,
        offset: 0
      }
    };
    var fragments = {
      fractal: fractal.fragmentShader(),
      iterations: fractal.iterationsShader(),
      positions: fractal.positionsShader(),
      normal: fractal.normalShader(),
      lightpath: fractal.lightpathShader()
    };
    var draw = function draw(gl) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      this.pushAttribute(gl, "positions");
      this.pushAttribute(gl, "camera");

      gl.useProgram(this.program);

      gl.uniform3fv(this.uCamera, new Float32Array(camera));
      gl.uniform1f(this.uCameraL, 1.0);
      gl.uniform3fv(this.uCameraY, new Float32Array(focus));
      gl.uniform3fv(this.uCameraZ, new Float32Array([0.0, 0.0, 1.0]));
      gl.uniform2fv(this.uCameraV, new Float32Array([Math.PI / 2, Math.PI / 2]));
      gl.uniform1f(this.uTolerance, tolerance);
      gl.uniform3fv(this.uLightP, new Float32Array(lightP));
      gl.uniform4fv(this.uLightC, new Float32Array(lightC));
      gl.uniform4fv(this.uAmbientC, new Float32Array(ambient));
      gl.uniform1f(this.uSoftness, softness);
      gl.uniform1f(this.uSs, ss);
      gl.uniform1f(this.uShine, shine);
      gl.uniform3fv(this.uAlbedo, new Float32Array(albedo));

      {
        var offset = 0;
        var vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    };
    Object.keys(fragments).forEach(function (key) {
      var $canvas = $("#" + key);
      var cw = new CanvasWebGL(key, $canvas[0], {
        width: 1 << 10,
        height: 1 << 10
      });
      cw.registerProgram("main", new Program(fractal.vertexShader(), fragments[key], attributes, uniforms, buffers, {}, draw));
      cw.draw();
      var $preview = $("#" + key + "-preview");
      $preview.attr("src", $canvas[0].toDataURL());
      $preview.addClass("active");
    });
  }
  this.softness = 0.0;
  this.preset = function (f) {
    if (f == 0) {
      _this4.de = 'recursiveIcoscahedral';
      _this4.scale = 2;
      _this4.iterations = 13;
      _this4.rotationA = 0.1;
      _this4.rotationB = -0.2;
      _this4.center = [0.6, 1.25 * 0.6, 0.6];
      _this4.tolerance = 0.00025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.0125;
      _this4.camera = [1.0, -3.0, 1.5];
      _this4.focus = [-0.25, 1.0, -0.5];
      _this4.lightP = [2.2, -1.3, 2.5];
      _this4.lightC = [0.75, 0.5, 1.0, 20.0];
      _this4.ambient = [1.0, 0.75, 0.75, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 1.0;
      _this4.albedo = [0.2, 0.5, 1.0];
    } else if (f == 1) {
      _this4.de = 'recursiveOctahedral';
      _this4.scale = 2;
      _this4.iterations = 13;
      _this4.rotationA = -0.5;
      _this4.rotationB = 0.6;
      _this4.center = [0.75, 0.5, 0.5];
      _this4.tolerance = 0.00025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.005;
      _this4.camera = [1.0, -2.0, 1.0];
      _this4.focus = [-0.5, 1.0, -0.5];
      _this4.lightP = [5.0, -2.0, 2.5];
      _this4.lightC = [0.75, 0.5, 1.0, 50.0];
      _this4.ambient = [1.0, 0.75, 0.75, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 1.0;
      _this4.albedo = [0.2, 0.5, 1.0];
    } else if (f == 2) {
      _this4.de = 'recursiveOctahedral';
      _this4.scale = 2;
      _this4.iterations = 13;
      _this4.rotationA = -0.5;
      _this4.rotationB = 0.3;
      _this4.center = [0.5, 0.5, 0.5];
      _this4.tolerance = 0.00025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.0125;
      _this4.camera = [1.0, -2.0, 0.0];
      _this4.focus = [-0.5, 1.0, 0.0];
      _this4.lightP = [2.2, -1.3, 2.5];
      _this4.lightC = [0.75, 0.5, 1.0, 20.0];
      _this4.ambient = [1.0, 1.0, 1.0, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 1.0;
      _this4.albedo = [1.0, 0.0, 0.0];
    } else if (f == 3) {
      _this4.de = 'spheres';
      _this4.radius = 1;
      _this4.modulus = 2.5;
      _this4.tolerance = 0.0025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.0125;
      _this4.camera = [0.0, 0.0, 5.0];
      _this4.focus = [1.0, 1.0, -1.0];
      _this4.lightP = [5, 7, 5];
      _this4.lightC = [0.75, 0.5, 1.0, 50.0];
      _this4.ambient = [1.0, 0.75, 0.75, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 5;
      _this4.albedo = [0.2, 0.5, 1.0];
    } else if (f == 4) {
      _this4.de = 'recursiveOctahedral';
      _this4.scale = 2;
      _this4.iterations = 13;
      _this4.rotationA = 0.3;
      _this4.rotationB = 0.8;
      _this4.center = [0.5, 0.5, 0.25];
      _this4.tolerance = 0.00025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.005;
      _this4.camera = [1.0, -2.0, 1.0];
      _this4.focus = [-0.5, 1.0, -0.5];
      _this4.lightP = [5.0, -2.0, 2.5];
      _this4.lightC = [0.75, 0.5, 1.0, 50.0];
      _this4.ambient = [1.0, 1.0, 1.0, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 1.0;
      _this4.albedo = [1.0, 0.0, 0.0];
    } else if (f == 5) {
      _this4.de = 'icoscahedral';
      _this4.radius = 1;
      _this4.tolerance = 0.00025;
      _this4.maxSteps = 100;
      _this4.normalDiff = 0.0125;
      _this4.camera = [1.0, -3.0, 1.5];
      _this4.focus = [-0.25, 1.0, -0.5];
      _this4.lightP = [2.2, -1.3, 2.5];
      _this4.lightC = [0.75, 0.5, 1.0, 20.0];
      _this4.ambient = [1.0, 0.75, 0.75, 1.0];
      _this4.ss = 1.0;
      _this4.shine = 1.0;
      _this4.albedo = [0.2, 0.5, 1.0];
    }
  };
  this.preset(0);
  this.presets = ['Arch', 'Aster', 'Orb', 'Spheres', 'Cloud', 'Icosahedron'];
  this.render = function () {
    switch (_this4.de) {
      case 'spheres':
        _this4.DE = infSphereDE(_this4.radius.toFixed(3), _this4.modulus.toFixed(3));
        break;
      case 'recursiveTetrahedral':
        _this4.DE = recursiveTetrahedral(_this4.scale.toFixed(2), _this4.iterations, _this4.rotationA.toFixed(3), _this4.rotationB.toFixed(3), 'vec3(' + _this4.center.map(function (c) {
          return c.toFixed(3);
        }).join(',') + ')');
        break;
      case 'recursiveOctahedral':
        _this4.DE = recursiveOctahedral(_this4.scale.toFixed(2), _this4.iterations, _this4.rotationA.toFixed(3), _this4.rotationB.toFixed(3), 'vec3(' + _this4.center.map(function (c) {
          return c.toFixed(3);
        }).join(',') + ')');
        break;
      case 'recursiveIcoscahedral':
        _this4.DE = recursiveIcoscahedral(_this4.scale.toFixed(2), _this4.iterations, _this4.rotationA.toFixed(3), _this4.rotationB.toFixed(3), 'vec3(' + _this4.center.map(function (c) {
          return c.toFixed(3);
        }).join(',') + ')');
        break;
      case 'icoscahedral':
        _this4.DE = icoscahedral(_this4.radius.toFixed(3));
        break;
    }
    FractalCanvas(_this4.DE, _this4.tolerance, _this4.maxSteps, _this4.normalDiff.toFixed(5), _this4.camera, _this4.focus, _this4.lightP, _this4.lightC, _this4.ambient, _this4.softness.toFixed(3), _this4.ss.toFixed(3), _this4.shine.toFixed(3), _this4.albedo);
  };
  this.render();
  this.setActive = function (key) {
    var $canvas = $("#" + key);
    $canvas.addClass("active");
    $('#download').attr("href", $canvas[0].toDataURL());
    var $canvases = $("#canvases");
    if ($canvases.attr("data-active-canvas") && $canvases.attr("data-active-canvas").length) {
      $("#" + $canvases.attr("data-active-canvas")).removeClass("active");
    }
    $canvases.attr("data-active-canvas", key);
  };
  this.setActive("fractal");
});
