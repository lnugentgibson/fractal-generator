'use strict';

/**
 * OAlpha Object Extension
 */
var _window = window,
    angular = _window.angular,
    _ = _window._;

angular.module('oaObject', []).service('oaObject', function () {
  Object.filter = function (obj, filters) {
    var o = {};
    var _filters = _(filters);
    if (_filters.isArray()) _filters.each(function (key) {
      o[key] = obj[key];
    });else _filters.each(function (value, key) {
      var _value = _(value);
      if (_value.isObject()) o[key] = obj.filter(obj[key], value);else if (value) o[key] = obj[key];
    });
    return o;
  };

  return Object;
});
