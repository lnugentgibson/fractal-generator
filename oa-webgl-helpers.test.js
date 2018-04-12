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
      source: 'param1 = "${param1}"\nparam2 = "${paramB}"',
      parameters: {
        param1: 'Val1'
      },
      generated: 'param1 = "Val1"\nparam2 = "${paramB}"'
    },
    // single substitution in vertex shader
    {
      name: 'single substitution in vertex shader',
      source: 'precision ${precision} float;\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}',
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
        precision: 'mediump'
      },
      options: {
        lineNumbers: true,
        lineNumberWidth: 2
      },
      generated: '01: precision mediump float;\n02: attribute vec4 a_position;\n03: void main() {\n04:   gl_Position = a_position;\n05: }'
    },
    // single substitution in vertex shader with indentation
    {
      name: 'single substitution in vertex shader with indentation',
      source: 'void main() {\n  gl_Position = a_position;\n}',
      parameters: {},
      options: {
        indent: 1,
        indentationStr: '  '
      },
      generated: '  void main() {\n    gl_Position = a_position;\n  }'
    }].forEach(function (snippetSource, i) {
      describe('parameter set #' + (i + 1) + ': ' + snippetSource.name, function () {
        var source, parameters, params, options, generated;
        var snippet;

        beforeEach(inject(function (oaWebglHelpers) {
          source = snippetSource.source;
          parameters = snippetSource.parameters;
          params = snippetSource.params;
          options = snippetSource.options;
          generated = snippetSource.generated;
          snippet = new $oaWebglShaderSnippet();
          snippet.source = source;
          Object.keys(parameters).forEach(function (k) {
            snippet.setParameter(k, parameters[k]);
          });
        }));

        it('should generate correct string', function () {
          assert.equal(snippet.generate(params, options), generated);
        });
      });
    });
  });
});
