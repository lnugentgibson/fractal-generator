var jsdom = require('jsdom-no-contextify').jsdom;

global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.navigator = window.navigator = {};
global.Node = window.Node;

global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

var _ = require('./lib/js/underscore-min');
require('./lib/js/jquery.min');
require('./lib/js/angular.min');
require('angular-mocks');

window._ = _;

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;

module.exports = {
  document: global.document,
  window: global.window,
  navigator: global.navigator,
  Node: global.Node,
  angular: global.angular,
  $: global.$,
  _,
  inject: global.inject,
  ngModule: global.ngModule
};