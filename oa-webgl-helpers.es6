/**
 * OAlpha WebGL Helper Library
 */
const {
  angular,
  _
} = window;
angular
  .module('oaWebglHelpers', ['oaObject'])
  .service('oaWebglHelpers', function() {
    function oaWebglHelpers() {
      this.FLOAT32 = 0;
      this.UINT16 = 1;
      this.loadShader = function loadShader(gl, type, source, onErr) {
        if (!onErr)
          onErr = msg => console.error(msg);
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          onErr(gl.getShaderInfoLog(shader));
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
        const vertexShader = this.loadShader(
          gl,
          gl.VERTEX_SHADER,
          vertexSource,
          msg => {
            onErr('VERTEXSHADER\n' + msg);
          });
        if (!vertexShader) {
          onErr('vertexshader failed to compile');
          return null;
        }
        const fragmentShader = this.loadShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentSource,
          msg => {
            onErr('FRAGMENTSHADER\n' + msg);
          }
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
  .service('oaWebglShaderHelpers', function() {
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
            cameraPosition: 'camP',
            cameraDirection: 'camZ',
            cameraUp: 'camY',
            matrix: 'cameraMatrix',
            normalizedDirection: 'cz',
            normalizedUp: 'cy',
            right: 'cx'
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
            fov: 'fov',
            far: 'far',
            near: 'near'
          },
          _options
        );
        return `mat4(vec4(1.0 / tan(${fov}.x / 2.0), vec3(0.0)), vec4(0.0, 1.0 / tan(${fov}.y / 2.0), vec2(0.0)), ve4(vec2(0.0), -(${far} + ${near}) / (${far} - ${near}), -1.0), vec4(vec2(0.0), -${far} * ${near} / (${far} - ${near}), 0.0));`;
      };
    }

    return new oaWebglShaderHelpers();
  })
  .factory('oaWebglSnippet', ['oaObject', function() {
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
    if (false)
      console.log(JSON.stringify({
        marker: parameterMarker.toString(),
        expression: expressionRegexGlobal.toString(),
        parameterGlobal: parameterReferenceRegexGlobal.toString(),
        parameter: parameterReferenceRegex.toString(),
        snippetGlobal: snippetReferenceRegexGlobal.toString(),
        snippet: snippetReferenceRegex.toString()
      }, null, 2));

    function Snippet(name, source) {
      var specifiers = {
        'null': {
          type: 'o'
        },
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
        'null': {},
        indent: true,
        indentationStr: true,
        lineNumbers: true,
        lineNumberWidth: true
      };
      var parameters = {};
      var snippets = {};

      this.addParameter = (t, k, s, o) => {
        const {
          replace,
          ignore
        } = Object.assign({
          replace: false
        }, o);
        if (specifiers[k]) {
          if (ignore)
            return;
          if (!replace)
            throw `parameter ${k} already exists`;
          //apples.thorwup();
        }
        var ks = k.split('.');
        var parent = objectKeys,
          child;
        for (var i = 0; i + 1 < ks.length; i++) {
          child = parent[ks[i]];
          if (!child)
            child = parent[ks[i]] = {};
          parent = child;
        }
        if (ks.length > 1)
          this.addParameter('o', ks.slice(0, ks.length - 1).join('.'), null, { ignore: true });
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
              }, s.filter([
                'type',
                'nullObject',
                'nullProperty'
              ]));
              if (parent[ks[ks.length - 1]] == undefined)
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
              }, s.filter([
                'type',
                'nullArray',
                'nullElement',
                'delimiter',
                'prefix',
                'suffix'
              ]));
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
      this.setParameter = (k, v) => {
        if (specifiers[k])
          parameters[k] = v;
      };
      this.addSnippet = (k, s) => {
        if (snippets[k])
          throw 'snippet already exists';
        snippets[k] = s;
      };
      this.addSnippets = ss => {
        _(ss).each((s, k) => {
          this.addSnippet(k, s);
        });
      };
      this.setSnippet = (k, s) => {
        snippets[k] = s;
      };
      this.sddSnippets = ss => {
        _(ss).each((s, k) => {
          this.sddSnippet(k, s);
        });
      };

      function render(string, options) {
        const {
          indent,
          indentationStr,
          lineNumbers,
          lineNumberWidth
        } = Object.assign({
          indent: 0,
          indentationStr: '  ',
          lineNumbers: false,
          lineNumberWidth: 4
        }, options);
        var i;
        var indentaion = '';
        for (i = 0; i < indent; i++)
          indentaion += indentationStr;
        var zeros = '';
        for (i = 0; i < lineNumberWidth; i++)
          zeros += '0';
        return string.split(/\n/g).map((line, i) => {
          var lineNumber = lineNumbers ? (zeros + (i + 1)).substr(-lineNumberWidth, lineNumberWidth) + ': ' : '';
          return lineNumber + indentaion + line;
        }).join('\n');
      }

      function applyParams(string, _params, touch) {
        var params = Object.assign({}, _params);
        if (false)
          console.log(JSON.stringify({
            specifiers,
            objectKeys,
            parameters,
            params,
            snippets
          }, null, 2));

        function O(param) {
          var object = specifiers[param];
          if (object.parameterType !== 'a')
            return;
          var objectValue = params[param];
          var out = objectValue ? objectValue : {};
          if (false)
            console.log(JSON.stringify({
              param,
              object,
              objectValue,
              out
            }, null, 2));
          return out;
        }

        function A(param) {
          var array = specifiers[param];
          if (array.parameterType !== 'a')
            return;
          var arrayElements = params[param];
          var out = arrayElements && arrayElements.length ? arrayElements.map(e => e != null ? e : array.nullElement) : [];
          if (false)
            console.log(JSON.stringify({
              param,
              array,
              arrayElements,
              out
            }, null, 2));
          return out;
        }

        function P(param) {
          if (false)
            console.log({
              f: 'P',
              param
            });
          var spec = specifiers[param];
          var out;
          if (spec.parameterType === 'a') {
            var arrayElements = params[param];
            out = arrayElements && arrayElements.length ? arrayElements.map(e => e != null ? e : spec.nullElement).join(spec.delimiter) : spec.nullArray;
          }
          else {
            var paramValue = params[param];
            out = paramValue == undefined ? spec.nullValue : paramValue;
          }
          if (false)
            console.log({
              param,
              spec,
              paramValue,
              out
            });
          return out;
        }

        function S(param, paramSet) {
          if (false)
            console.log({
              f: 'S',
              snippet: param,
              param: paramSet
            });
          var value = specifiers[paramSet];
          var out;
          if (value.parameterType === 'a') {
            if (false)
              console.log(JSON.stringify({
                type: 'a',
                value: params[paramSet]
              }, null, 2));
            out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)).join(value.delimiter) : '';
            //out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)) : snippets[param].generate();
          }
          else {
            if (false)
              console.log(JSON.stringify({
                type: '!a',
                value: params[paramSet]
              }, null, 2));
            out = snippets[param].generate(params[paramSet]);
          }
          if (false)
            console.log({
              snippet: param,
              param: paramSet,
              out
            });
          return out;
        }

        function D(param, paramSet) {
          if (false)
            console.log({
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
          }
          else if (pspec.parameterType === 'a') {
            if (false)
              console.log(JSON.stringify({
                type: 'a',
                value: params[paramSet]
              }, null, 2));
            out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)).join(pspec.delimiter) : '';
            //out = params[paramSet] ? params[paramSet].map(p => snippets[param].generate(p)) : snippets[param].generate();
          }
          else if (sspec.parameterType === 'a') {
            out = params[param] ? params[param].map(p => snippets[p].generate(params[paramSet])).join(sspec.delimiter) : '';
          }
          else {
            if (false)
              console.log(JSON.stringify({
                type: '!a',
                value: params[paramSet]
              }, null, 2));
            out = snippets[param].generate(params[paramSet]);
          }
          if (false)
            console.log({
              snippet: param,
              param: paramSet,
              out
            });
          return out;
        }

        function apply(exp) {
          return eval(exp);
        }

        if (false)
          console.log(string);
        var out = string.replace(expressionRegexGlobal, (match, p1, p2) => {
          if (false)
            console.log(JSON.stringify({
              match,
              p1,
              p2
            }, null, 2));
          let [prefix, exp] = [p1, p2];
          var parameterMatches = exp.match(parameterReferenceRegexGlobal) || [];
          var arrayMatches = exp.match(arrayReferenceRegexGlobal) || [];
          var snippetMatches = exp.match(snippetReferenceRegexGlobal) || [];
          var dynamicSnippetMatches = exp.match(dynamicSnippetReferenceRegexGlobal) || [];
          if (false)
            console.log(JSON.stringify({
              exp,
              parameterMatches,
              arrayMatches,
              snippetMatches,
              dynamicSnippetMatches
            }, null, 2));
          var parameterReferences = parameterMatches.map(match => match.match(parameterReferenceRegex));
          var arrayReferences = arrayMatches.map(match => match.match(arrayReferenceRegex));
          var snippetReferences = snippetMatches.map(match => match.match(snippetReferenceRegex));
          var dynamicSnippetReferences = dynamicSnippetMatches.map(match => match.match(dynamicSnippetReferenceRegex));
          var pmatches = parameterReferences.map(ref => {
            return {
              data: ref,
              ref: ref[1],
              match: !!specifiers[ref[1]]
            };
          });
          var amatches = arrayReferences.map(ref => {
            return {
              data: ref,
              ref: ref[1],
              match: !!specifiers[ref[1]]
            };
          });
          var smatches = snippetReferences.map(ref => {
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
          var dmatches = dynamicSnippetReferences.map(ref => {
            var snippetmatch = !!specifiers[ref[1]];
            var snippetsmatch = true;
            if (snippetmatch && !!parameters[ref[1]]) {
              snippetsmatch = parameters[ref[1]].every(s => !!snippets[s]);
              if (!snippetsmatch)
                console.log(JSON.stringify(parameters[ref[1]].map(s => {
                  return {
                    s,
                    match: !!snippets[s]
                  };
                }), null, 2));
            }
            return {
              data: ref,
              sref: ref[1],
              pref: ref[3],
              snippetmatch,
              snippetsmatch,
              specifiersmatch: !!specifiers[ref[3]],
              match: snippetmatch && snippetsmatch && !!specifiers[ref[3]]
            };
          });
          var pmatch = pmatches.every(m => m.match);
          var amatch = amatches.every(m => m.match);
          var smatch = smatches.every(m => m.match);
          var dmatch = dmatches.every(m => m.match);
          if (false)
            console.log(JSON.stringify({
              exp,
              parameterMatches,
              arrayMatches,
              snippetMatches,
              dynamicSnippetMatches,
              parameterReferences,
              arrayReferences,
              snippetReferences,
              dynamicSnippetReferences,
              pmatches,
              amatches,
              smatches,
              dmatches,
              pmatch,
              amatch,
              smatch,
              dmatch
            }, null, 2));
          var out;
          if (pmatch && amatch && smatch && dmatch)
            out = prefix + apply.call({
              P,
              A,
              S,
              D
            }, exp);
          else
            out = touch ? prefix : match;
          if (false)
            console.log({
              exp,
              pmatch,
              amatch,
              smatch,
              dmatch,
              out
            });
          return out;
        });
        //console.log(out);
        return out;
      }

      function objectify(params) {
        if (!params)
          return {};

        function obj(model, parent, parentKey) {
          model.getKeys().map(key => {
            return {
              key,
              full: parentKey + key
            };
          }).map(key => {
            return Object.assign(key, {
              spec: specifiers[key.full]
            });
          }).filter(key => {
            if (!key.spec)
              console.log(JSON.stringify({ key }, null, 2));
            return key.spec.parameterType === 'o';
          }).forEach(key => {
            var paramObj = parent[key.key];
            var subparams = parent.getKeys().filter(subkey => subkey.startsWith(key.key + '.'));
            if (subparams.length) {
              if (!paramObj)
                paramObj = parent[key.key] = {};
              subparams.forEach(subkey => {
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

      this.generate = _params => {
        //console.log(`generating ${name}.`);
        if (!source)
          throw `snippet ${name} does not have a non-null source.`;
        //if (name === 'noiseDef' || name === 'noiseDec')
        //if (name === 'noiseBody')
        if (false)
          console.log(JSON.stringify({
            name,
            _params,
            parameters,
            specifiers,
            objectKeys
          }, null, 2));
        var objectParameters = objectify(parameters);
        var fparams1 = _params ? _params.filter(specifiers.getKeys()) : null;
        var fparams2 = fparams1 ? fparams1.filter(objectKeys) : null;
        var objectParams = fparams2 ? objectify(fparams2) : null;
        var params = Object.assign({}, objectParameters, objectParams);
        //if (name === 'noiseDef' || name === 'noiseDec')
        //if (name === 'noiseBody')
        if (false)
          console.log(JSON.stringify({
            name,
            _params,
            specifiers,
            objectKeys,
            objectParameters,
            fparams1,
            fparams2,
            objectParams,
            params
          }, null, 2));
        return render(applyParams(source, params, true), params);
      };

      this.applyParams = params => {
        var p = Array.isArray(params) ? parameters.filter(params) : params.filter(parameters.getKeys());
        source = applyParams(source, p);
      };
      Object.defineProperty(this, 'source', {
        get: () => source,
        set: v => {
          source = v;
        }
      });
    }

    return Snippet;
  }])
  .factory('oaWebglFunctionSnippet', ['oaWebglSnippet', function(oaWebglSnippet) {
    function FunctionSnippet(funcName, returnType, bodyType) {
      oaWebglSnippet.call(this, funcName + 'Def');
      var bodySnippet, bodyString;
      var sourceGen = () => `\${S("signiture", "signiture")} {
${bodyType === 'string' ? '${P("bodyString")}' : '${S("body", "body")}'}
}`;
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
      parameters.add = (paramname, datatype, index) => {
        if (parameters.names.indexOf(paramname) > -1)
          throw 'parameter already exists';
        if (parameters.order[index])
          throw 'index already in use';
        parameters.names.push(paramname);
        parameters.order[index] = parameters[paramname] = {
          datatype,
          paramname,
          index
        };
      };
      parameters.apply = () => {
        this.setParameter('signiture.parameterList', parameters.order);
        declarationSnippet.setParameter('signiture.parameterList', parameters.order);
      };
      this.addParameter('v', 'signiture.returnType', {
        type: 'str',
        nullValue: 'float'
      });
      this.setParameter('signiture.returnType', returnType);
      this.addParameter('v', 'signiture.funcName', {
        type: 'str'
      });
      this.setParameter('signiture.funcName', funcName);
      this.addParameter('a', 'signiture.parameterList', {
        delimiter: ', '
      });
      declarationSnippet.addParameter('v', 'signiture.returnType', {
        type: 'str',
        nullValue: 'float'
      });
      declarationSnippet.setParameter('signiture.returnType', returnType);
      declarationSnippet.addParameter('v', 'signiture.funcName', {
        type: 'str'
      });
      declarationSnippet.setParameter('signiture.funcName', funcName);
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
      this.setParameter('body.indent', 1);
      Object.defineProperties(this, {
        bodySnippet: {
          get: () => bodySnippet,
          set: v => {
            bodySnippet = v;
            this.setSnippet('body', bodySnippet);
          }
        },
        bodyString: {
          get: () => bodyString,
          set: v => {
            bodyString = v;
            this.setParameter('body', bodyString);
          }
        },
        bodyType: {
          get: () => bodyType,
          set: v => {
            if (v !== 'string' && v !== 'snippet')
              return;
            bodyType = v;
            this.source = sourceGen();
          }
        },
        parameters: {
          get: () => parameters
        },
        declarationSnippet: {
          get: () => declarationSnippet
        },
        returnType: {
          get: () => returnType,
          set: v => {
            returnType = v;
            this.setParameter('signiture.returnType', returnType);
            declarationSnippet.setParameter('signiture.returnType', returnType);
          }
        },
        funcName: {
          get: () => funcName,
          set: v => {
            funcName = v;
            this.setParameter('signiture.funcName', funcName);
            declarationSnippet.setParameter('signiture.funcName', funcName);
          }
        }
      });
    }

    return FunctionSnippet;
  }])
  .factory('oaWebglShaderSnippet', ['oaWebglSnippet', function(oaWebglSnippet) {
    function ShaderSnippet(name) {
      oaWebglSnippet.call(this, name);
      this.source = `precision \${P("precision")} float;
\${S("variable", "variables")}
\${D("functionDeclarations", "null")}
void main() {
\${S("body", "body")}
}
\${D("functionDefinitions", "null")}`;
      this.addParameter('v', 'precision', {
        type: 'str',
        nullValue: 'mediump'
      });
      this.addParameter('a', 'variables', {
        delimiter: '\n'
      });
      this.addParameter('a', 'functionDeclarations', {
        delimiter: '\n'
      });
      this.addParameter('a', 'functionDefinitions', {
        delimiter: '\n'
      });
      this.addParameter('v', 'body.indent', {
        type: 'int',
        nullValue: 1
      });
      this.setParameter('body.indent', 1);
      var variables = {
        names: [],
        order: []
      };
      variables.add = (varname, vartype, datatype, index) => {
        if (variables.names.indexOf(varname) > -1)
          throw 'parameter already exists';
        if (variables.order[index])
          throw 'index already in use';
        variables.names.push(varname);
        variables.order[index] = variables[varname] = {
          vartype,
          datatype,
          varname,
          index
        };
      };
      variables.addMultiple = vars => {
        //console.log(JSON.stringify(vars, null, 2));
        var I = variables.order.length;
        vars.forEach((v, i) => {
          let {
            varname,
            vartype,
            datatype,
            index
          } = v;
          variables.add(varname, vartype, datatype, index == undefined ? I + i : index);
        });
      };
      variables.apply = () => {
        //console.log(JSON.stringify(variables.order, null, 2));
        this.setParameter('variables', variables.order);
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
      this.addFunction = f => {
        functions.push(f);
        this.addSnippet('declaration' + functions.length, f.declarationSnippet);
        this.addSnippet('definition' + functions.length, f);
        this.setParameter('functionDeclarations', _.times(functions.length, i => `declaration${i + 1}`));
        this.setParameter('functionDefinitions', _.times(functions.length, i => `definition${i + 1}`));
      };
      this.addFunctions = fs => {
        fs.forEach(f => {
          this.addFunction(f);
        });
      };
      Object.defineProperties(this, {
        variables: {
          get: () => variables
        },
        mainSnippet: {
          get: () => mainSnippet,
          set: v => {
            mainSnippet = v;
            this.setSnippet('body', mainSnippet);
          }
        }
      });
    }

    return ShaderSnippet;
  }])
  .factory('oaWebglShaderSource', function() {
    function oaWebglShaderSource(_source, _generator, _parameters) {
      var source = _source;
      var generator = _generator;
      var parameterNames = _parameters || [];
      var parameters = {};
      this.printShader = function(_options) {
        console.log(
          source
          .split(/\n/g)
          .map((line, i) => ('0000' + (i + 1)).substr(-4, 4) + ': ' + line)
          .join('\n')
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
            parameters && parameters.length ? 'dynamic' : 'generated' : 'static'
        }
      });
    }

    return oaWebglShaderSource;
  })
  .factory('oaWebglProgram', [
    'oaWebglHelpers',
    'oaWebglShaderSource',
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
            Object.defineProperty(bufferSpec, 'data', {
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
  .factory('oaWebglCanvas', function() {
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
          gl = canvas.getContext('webgl');
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
            else name = 'main';
          }
          var program = programs[name];
          if (program) program.draw(gl);
        }
        console.log('canvas.drawn');
      };
    }
    return oaWebglCanvas;
  });
