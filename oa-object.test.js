'use strict';

var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var _require = require('./test-helpers'),
    inject = _require.inject,
    ngModule = _require.ngModule;

// Loads the module we want to test


require('./oa-object');

describe('oaObject module', function () {
  beforeEach(ngModule('oaObject'));
});
