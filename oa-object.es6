/**
 * OAlpha Object Extension
 */
const {
  angular,
  _
} = window;
angular
  .module('oaObject', [])
  .service('oaObject', function() {
    Object.filter = function(obj, filters) {
      var o = {};
      var _filters = _(filters);
      if(_filters.isArray())
        _filters.each(key => {
          o[key] = obj[key];
        });
      else
        _filters.each((value, key) => {
          var _value = _(value);
          if(_value.isObject())
            o[key] = obj.filter(obj[key], value);
          else if(value)
            o[key] = obj[key];
        });
      return o;
    };
    
    return Object;
  });