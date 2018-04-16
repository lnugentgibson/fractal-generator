var sinon = require('sinon');
var chai = require('chai');
const { assert } = chai;
const {
  inject,
  ngModule
} = require('./test-helpers');

// Loads the module we want to test
require('./oa-object');

describe('oaObject module', function() {
  beforeEach(ngModule('oaObject'));
});
