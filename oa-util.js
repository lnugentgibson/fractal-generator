'use strict';

/**
 * OAlpha Utilities Library
 * 
 * An anular module containing providers for string, object and array
 * manipulation.
 */

// explicitly define angular object to please error checkers
var _window = window,
    angular = _window.angular;


angular.module('oaUtil', []).service('oaUtil', function () {
  /**
   * Service oaUtil
   * 
   * Defines the static functionality of the module.
   */
  function oaUtil() {
    /**
     * This function generates a set of keys derived by the spcified key for
     * use in angular directives. It generates singular and plural forms of
     * the key prepended with 'ng' in lower title case and dash delimeted
     * forms.
     */
    this.ngKeySet = function (key, _options) {
      var options = Object.assign({
        key: true,
        keys: true,
        Key: false,
        Keys: false,
        ngKey: true,
        ngKeys: true,
        ng_key: false,
        ng_keys: false
      }, _options);
      var keyset = {};
      keyset.key = key.toLowerCase();
      keyset.keys = options.plural ? options.plural.toLowerCase() : keyset.key + 's';
      keyset.Key = keyset.key.charAt(0).toUpperCase() + keyset.key.substr(1, keyset.key.length);
      keyset.Keys = options.plural ? keyset.keys.charAt(0).toUpperCase() + keyset.keys.substr(1, keyset.keys.length) : keyset.Key + 's';
      keyset.ngKey = 'ng' + keyset.Key;
      keyset.ngKeys = options.plural ? 'ng' + keyset.Keys : keyset.ngKey + 's';
      keyset.ng_key = 'ng-' + keyset.key;
      keyset.ng_keys = options.plural ? 'ng-' + keyset.keys : keyset.ng_key + 's';
      var out = {};
      Object.keys(keyset).forEach(function (type) {
        if (options[type]) out[type] = keyset[type];
      });
      return out;
    };

    /**
     * This function defines the methods of an array such as forEach and
     * reduce. The object this function is called on must define the length
     * property and the elements must be accessible by integer keys.
     * 
     * Usage: oaUtil.arrayFunctions.call(arr, options);
     */
    this.arrayFunctions = function (_options) {
      var _this = this;

      this.asArray = function () {
        var arr = [];
        for (var i = 0; i < _this.length; i++) {
          arr.push(_this[i]);
        }
      };
      var options = Object.assign({
        every: true,
        fill: true,
        forEach: true,
        join: true,
        map: true,
        reduce: true,
        reduceRight: true,
        reverse: true,
        rotate: true,
        rotateRight: true
      }, _options);
      if (options.every) this.every = function (callback, thisArg) {
        var arr = this.asArray();
        for (var i = 0; i < this.length; i++) {
          if (!callback.call(thisArg, this[i], i, arr)) return false;
        }return true;
      };
      if (options.fill) this.fill = function (value, start, end) {
        if (arguments.length < 2) {
          start = 0;
          end = this.length;
        } else if (arguments.length < 3) end = this.length;
        for (var i = Math.max(start, 0); i < this.length && i < end; i++) {
          this[i] = value;
        }
      };
      if (options.forEach) this.forEach = function (callback, thisArg) {
        var arr = this.asArray();
        for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, arr);
        }
      };
      if (options.join) this.join = function (sep) {
        var str = '';
        for (var i = 0; i < this.length; i++) {
          str += (i > 0 ? sep : '') + this[i];
        }return str;
      };
      if (options.map) this.map = function (callback, thisArg) {
        var arr = this.asArray();
        var out = [];
        for (var i = 0; i < this.length; i++) {
          out[i] = callback.call(thisArg, this[i], i, arr);
        }return out;
      };
      if (options.reduce) this.reduce = function (callback, initialValue) {
        var arr = this.asArray();
        var a = initialValue;
        for (var i = 0; i < this.length; i++) {
          a = callback.call(null, a, this[i], i, arr);
        }return a;
      };
      if (options.reduceRight) this.reduceRight = function (callback, initialValue) {
        var arr = this.asArray();
        var a = initialValue;
        for (var i = this.length - 1; i >= 0; i++) {
          a = callback.call(null, a, this[i], i, arr);
        }return a;
      };
      if (options.reverse) this.reverse = function () {
        var _this2 = this;

        keys.reverse().forEach(function (key, i) {
          return _this2[i] = _this2[key];
        });
      };
      if (options.rotate) this.rotate = function (shift) {
        var _this3 = this;

        shift %= this.length;
        keys.slice(shift, this.length).concat(keys.slice(0, shift)).forEach(function (key, i) {
          return _this3[i] = _this3[key];
        });
      };
      if (options.rotateRight) this.rotateRight = function (shift) {
        var _this4 = this;

        shift %= this.length;
        keys.slice(this.length - shift, this.length).concat(keys.slice(0, this.length - shift)).forEach(function (key, i) {
          return _this4[i] = _this4[key];
        });
      };
    };
  }

  return new oaUtil();
}).factory('oaArrayObject', ['oaUtil', function (oaUtil) {
  /**
   * Factory oaArrObj
   * 
   * Provides array functionality on an object. Using an array of keys, this
   * object maps integer keys to the keys specified.
   */
  function oaArrObj(_src, _keys, _length, getters, setters, _options) {
    var _this5 = this;

    var src = _src ? _src : this;
    Object.defineProperty(this, 'objSource', {
      get: function get() {
        return src;
      },
      set: function set(v) {
        if (v) src = v;
      }
    });
    if (!_keys || !_keys.length) throw 'keys cannot be empty';
    var length = arguments.length > 1 ? parseInt(_length, 10) : _keys.length;
    if (length < 1) throw 'length must be positive integer';
    var keys = _keys.slice(0, length);
    for (var i = 0; i < length; i++) {
      (function (j) {
        Object.defineProperty(_this5, j, {
          get: function get() {
            return getters && getters[j] ? getters[j](src[keys[j]]) : src[keys[j]];
          },
          set: function set(v) {
            if (setters && setters[j]) src[keys[j]] = setters[j](v);else src[keys[j]] = v;
          }
        });
      })(i);
    }Object.defineProperty(this, 'length', {
      get: function get() {
        return length;
      }
    });
    this.setArray = function (arr) {
      return keys.map(function (key, i) {
        if (arr && arr.length > i) _this5[key] = arr[i];
      });
    };
    oaUtil.arrayFunctions.call(this, _options);
    this.asArray = function () {
      return keys.map(function (key) {
        return _this5[key];
      });
    };
  }

  return oaArrObj;
}]).factory('oaObjectArray', function () {
  /**
   * Factory oaObjArr
   * 
   * Provides object functionality on an array. Using an array of keys, this
   * object maps the specified keys to the corresponding integer keys.
   */
  function oaObjArr(_src, _keys, _length, getters, setters, _options) {
    var _this6 = this;

    var src = _src ? _src : this;
    Object.defineProperty(this, 'arrSource', {
      get: function get() {
        return src;
      },
      set: function set(v) {
        if (v) {
          src = v;
          //console.log('array source set to ' + v);
        }
      }
    });
    if (!_keys || !_keys.length) throw 'keys cannot be empty';
    var length = arguments.length > 1 ? parseInt(_length, 10) : _keys.length;
    if (length < 1) throw 'length must be positive integer';
    var keys = _keys.slice(0, length);
    var options = Object.assign({
      offset: 0,
      skip: 1
    }, _options);
    Object.defineProperties(this, {
      offset: {
        get: function get() {
          return options.offset;
        },
        set: function set(v) {
          options.offset = parseInt(v, 10);
          if (isNaN(options.offset)) options.offset = 0;
        }
      },
      skip: {
        get: function get() {
          return options.skip;
        },
        set: function set(v) {
          options.skip = parseInt(v, 10);
          if (isNaN(options.skip)) options.skip = 0;
        }
      }
    });
    var index = function index(i) {
      if (options.skip) i *= options.skip;
      if (options.offset) i += options.offset;
      return i;
    };
    for (var i = 0; i < length; i++) {
      (function (j) {
        Object.defineProperty(_this6, keys[j], {
          get: function get() {
            return getters && getters[j] ? getters[j](src[index(j)]) : src[index(j)];
          },
          set: function set(v) {
            if (setters && setters[j]) src[index(j)] = setters[j](v);else src[index(j)] = v;
          }
        });
      })(i);
    }
  }

  return oaObjArr;
}).factory('oaIndexProvider', function () {
  /**
   * Factory oaIndexProvider
   * 
   * This class serves as an index repository. Using this object you can
   * request and release indices up to a specified total indices.
   */
  function oaIndexProvider(initialCapacity) {
    var ranges = [[0, initialCapacity > 0 ? initialCapacity : -1]];
    var size = initialCapacity > 0 ? initialCapacity : -1;
    var capacity = initialCapacity > 0 ? initialCapacity : 0;
    Object.defineProperties(this, {
      size: {
        get: function get() {
          return size;
        },
        set: function set(v) {
          var d;
          var lastIndex = ranges.length - 1;
          var last = ranges[lastIndex];
          if (size == -1) return 0;
          if (v > size) {
            d = v - size;
            if (last[0] + last[1] < size) ranges.push([size, d]);else last[1] = last[1] + d;
            size = v;
            return d;
          } else if (v == size) return 0;else {
            if (last[0] + last[1] < size) return 0;
            v = Math.min(v, last[0]);
            d = v - size;
            size = v;
            if (last[0] == v) ranges.splice(lastIndex, 1);else last[1] = size - last[0];
            return d;
          }
        }
      },
      capacity: {
        get: function get() {
          return capacity;
        }
      }
    });
    this.requestIndex = function () {
      if (!ranges.length) return null;
      var range = ranges[0];
      var i = range[0];
      if (range[1] == 1) {
        ranges.splice(0, 1);
        if (size == -1 && !ranges.length) ranges.push([capacity, 1]);
      } else {
        range[0] = range[0] + 1;
        range[1] = range[1] - 1;
      }
      if (size == -1) capacity = Math.max(capacity, i + 1);else capacity--;
      return i;
    };
    this.releaseIndex = function (index) {
      if (index < 0 || index >= size) return;
      for (var i = 0; i < ranges.length; i++) {
        if (index < ranges[i][0]) {
          ranges.splice(i, 0, [index, 1]);
          return;
        } else if (index >= ranges[i][0] && index < ranges[i][0] + ranges[i][1]) return;else if (index == ranges[i][0] + ranges[i][1]) {
          ranges[i][1] = ranges[i][1] + 1;
          return;
        }
      }ranges.push([index, 1]);
      if (size != -1) capacity++;
    };
  }

  return oaIndexProvider;
});
