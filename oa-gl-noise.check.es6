const {
  angular,
  $
} = window;
angular
  .module('oaGLSLNoiseCheck', ['oaGLSLNoise'])
  .controller(
    'NoiseCheckCtrl', [
      '$scope',
      'oaWebglHelpers',
      'oaWebglCanvas',
      'oaWebglProgram',
      'oaWebglShaderSource',
      'oaWebglShaderSnippet',
      'oaWebglFunctionSnippet',
      'oaWebglSnippet',
      'oaNoiseShaderFunctions',
      function(
        $scope,
        oaWebglHelpers,
        oaWebglCanvas,
        oaWebglProgram,
        oaWebglShaderSource,
        oaWebglShaderSnippet,
        oaWebglFunctionSnippet,
        oaWebglSnippet,
        oaNoiseShaderFunctions
      ) {
        // setup
        {
          var options = {
            width: 512,
            height: 512
          };
          var vertexSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.vertex.standardVertexShader.generate();
            })()
          );
          //vertexSource.printShader();
          var attributes = {
            position: {
              name: 'a_position'
            }
          };
          var uniforms = {
            sineseed: {
              name: 'u_sineseed'
            },
            dotseed: {
              name: 'u_dotseed'
            },
            resolution: {
              name: 'u_resolution',
              value: 1
            },
            time: {
              name: 'u_time',
              value: 0
            }
          };
          var buffers = {
            positions: {
              name: 'positions',
              data: [-1, -1,
                1, -1, -1, 1,
                1, 1,
              ],
              datatype: oaWebglHelpers.FLOAT32,
              target: 'ARRAY_BUFFER',
              usage: 'STATIC_DRAW',
              attribute: 'position',
              numComponents: 2,
              type: 'FLOAT',
              normalize: false,
              stride: 0,
              offset: 0
            },
            indices: {
              name: 'indices',
              data: [
                0, 1, 2,
                2, 1, 3
              ],
              datatype: oaWebglHelpers.UINT16,
              target: 'ELEMENT_ARRAY_BUFFER',
              usage: 'STATIC_DRAW'
            }
          };
          var textures = {};
          var epoch = Date.now();
          var executor = function(gl) {
            //console.log('executing');
            gl.clearColor(0, 0, 0, 1);
            gl.enable(gl.DEPTH_TEST);
            gl.clearDepth(-1.0);
            gl.depthFunc(gl.GEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.pushAttribute(gl, 'position');
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bIndices);
            gl.useProgram(this.program);
            if (false)
              gl.uniformMatrix4fv(this.uSeed, false, new Float32Array([
                0.0, 0.0, 35256.1646873, 43758.5453123,
                12.9898, 78.233, 92.543, 0.0,
                84.158, 98.235, 15.6431, 0.0,
                29.815, 10.1099, 91.507, 0.0
              ]));
            gl.uniformMatrix4fv(this.uSineseed, false, new Float32Array([
              84423.9141, 72162.3789, 54253.9214, 94823.3014,
              45809.7063, 19660.3408, 41988.1591, 17751.3314,
              70649.2482, 72822.8071, 31994.1736, 29779.3959,
              68961.4210, 33300.0043, 38860.2285, 67090.7920
            ]));
            gl.uniformMatrix4fv(this.uDotseed, false, new Float32Array([
              84.4239141, 72.1623789, 54.2539214, 94.8233014,
              45.8097063, 19.6603408, 41.9881591, 17.7513314,
              70.6492482, 72.8228071, 31.9941736, 29.7793959,
              68.9614210, 33.3000043, 38.8602285, 67.0907920
            ]));
            gl.uniform1f(this.uResolution, this.uResolutionSpec.value);
            var time = (Date.now() - epoch) / 5 / 1000;
            //time = 0;
            //console.log('now: ' + time);
            gl.uniform1f(this.uTime, time);
            const offset = 0;
            const vertexCount = 3 * 2;
            //gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
            gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, offset);
            //console.log('executed');
          };
        }
        var name;
        var program;
        var $canvas;
        var Canvas;
        var shadersnippet;
        var fragmentSource;
        var printShaders = true;
        var update = [];
        // sine-noise
        {
          name = 'sine-noise';
          $canvas = $('#sine-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          shadersnippet = oaNoiseShaderFunctions.shaders.fragment.sineNoiseFragment;
          console.log({
            params: shadersnippet.getParameterNames(),
            vals: shadersnippet.getParameterValues(),
            snippets: shadersnippet.getSnippetNames()
          });
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return shadersnippet.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          Canvas.draw();
        }
        // sine-rot-2-noise
        {
          name = 'sine-rot-2-noise';
          $canvas = $('#sine-rot-2-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.sine2RotNoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          Canvas.draw();
        }
        // perlin-2-noise
        {
          name = 'perlin-2-noise';
          $canvas = $('#perlin-2-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.perlin2NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 16;
          Canvas.draw();
        }
        // fractal-perlin-2-noise
        {
          name = 'fractal-perlin-2-noise';
          $canvas = $('#fractal-perlin-2-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.fractalPerlin2NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 512;
          Canvas.draw();
        }
        // perlin-3-noise
        {
          name = 'perlin-3-noise';
          $canvas = $('#perlin-3-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.perlin3NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          //*
          update.push({
            name,
            resolution: 16,
            Canvas
          });
          //*/
        }
        // fractal-perlin-3-noise
        {
          name = 'fractal-perlin-3-noise';
          $canvas = $('#fractal-perlin-3-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.fractalPerlin3NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          update.push({
            name,
            resolution: 512,
            Canvas
          });
        }
        // perlin-2-gradient-noise
        {
          name = 'perlin-2-gradient-noise';
          $canvas = $('#perlin-2-gradient-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.perlin2GradientNoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 16;
          Canvas.draw();
        }
        // fractal-perlin-2-gradient-noise
        {
          name = 'fractal-perlin-2-gradient-noise';
          $canvas = $('#fractal-perlin-2-gradient-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.fractalPerlin2GradientNoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 512;
          Canvas.draw();
        }
        // simplex-2-noise
        {
          name = 'simplex-2-noise';
          $canvas = $('#simplex-2-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.simplex2NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 16;
          Canvas.draw();
        }
        // fractal-simplex-2-noise
        {
          name = 'fractal-simplex-2-noise';
          $canvas = $('#fractal-simplex-2-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.fractalSimplex2NoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 128;
          uniforms.resolution.value = 32;
          Canvas.draw();
        }
        // simplex-2-gradient-noise
        {
          name = 'simplex-2-gradient-noise';
          $canvas = $('#simplex-2-gradient-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.simplex2GradientNoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 16;
          Canvas.draw();
        }
        // fractal-simplex-2-gradient-noise
        {
          name = 'fractal-simplex-2-gradient-noise';
          $canvas = $('#fractal-simplex-2-gradient-noise');
          Canvas = new oaWebglCanvas(name, $canvas[0], options);
          fragmentSource = new oaWebglShaderSource(
            (() => {
              return oaNoiseShaderFunctions.shaders.fragment.fractalSimplex2GradientNoiseFragment.generate();
            })()
          );
          if (printShaders) {
            console.log(name);
            fragmentSource.printShader();
          }
          program = new oaWebglProgram({
            vertexSource,
            fragmentSource,
            attributes,
            uniforms,
            buffers,
            textures,
            executor
          });
          Canvas.registerProgram('main', program);
          uniforms.resolution.value = 512;
          uniforms.resolution.value = 128;
          Canvas.draw();
        }
        var render = () => {
          update.forEach(c => {
            let {
              Canvas,
              resolution,
              //name
            } = c;
            uniforms.resolution.value = resolution;
            //console.log('drawing ' + name);
            Canvas.draw();
          });
        };
        var renderLoop = () => {
          render();
          requestAnimationFrame(renderLoop());
        };
        //renderLoop();
        window.setInterval(render, 60);
        //render();
      }
    ]
  );
