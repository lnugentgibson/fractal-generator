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

    [
      // simple substitution
      {
        name: 'simple substitution',
        source: 'param1 = "${param1}"',
        parameters: {
          param1: 'Val1'
        },
        generated: 'param1 = "Val1"'
      },
      // missing parameter substitution
      {
        name: 'missing parameter substitution',
        source: `param1 = "\${param1}"
param2 = "\${paramB}"`,
        parameters: {
          param1: 'Val1'
        },
        generated: `param1 = "Val1"
param2 = "\${paramB}"`
      },
      // single substitution in vertex shader
      {
        name: 'single substitution in vertex shader',
        source: `precision \${precision} float;
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
          precision: 'mediump'
        },
        options: {
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
        parameters: {},
        options: {
          indent: 1,
          indentationStr: '  '
        },
        generated: `  void main() {
    gl_Position = a_position;
  }`
      }
    ].forEach(function(snippetSource, i) {
      describe(`parameter set #${i + 1}: ${snippetSource.name}`, function() {
        var source, parameters, params, options, generated;
        var snippet;

        beforeEach(inject(oaWebglHelpers => {
          source = snippetSource.source;
          parameters = snippetSource.parameters;
          params = snippetSource.params;
          options = snippetSource.options;
          generated = snippetSource.generated;
          snippet = new $oaWebglShaderSnippet();
          snippet.source = source;
          Object.keys(parameters).forEach(k => {
            snippet.setParameter(k, parameters[k]);
          });
        }));

        it('should generate correct string', function() {
          assert.equal(snippet.generate(params, options), generated);
        });
      });
    });
  });
});
