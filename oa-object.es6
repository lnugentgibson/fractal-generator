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
    Object.filterObject = function(obj, filters) {
      var o = {};
      var _filters = _(filters);
      if(_filters.isArray())
        _filters.each(key => {
          if(obj[key])
            o[key] = obj[key];
        });
      else
        _filters.each((value, key) => {
          var _value = _(value);
          if(_value.isObject()) {
            if(obj[key])
              o[key] = obj.filter(obj[key], value);
          }
          else if(value && obj[key])
            o[key] = obj[key];
        });
      return o;
    };
    Object.prototype.filter = function(filters) {
      return Object.filterObject(this, filters);
    };
    Object.prototype.getKeys = function() {
      return Object.keys(this);
    };
    
    return Object;
  });