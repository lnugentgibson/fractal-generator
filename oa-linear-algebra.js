'use strict';

// oaLinearAlgebra with tests
var _window = window,
    angular = _window.angular;

angular.module('oaLinearAlgebra', ['oaUtil']).factory('oaVect', function () {
  function oaVect(_getters, _setters, _length) {
    var _this = this;

    var length = _length == undefined ? this.length : _length;
    var getters = _getters && _length != undefined ? _getters : function () {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr[i] = function (j) {
          return function () {
            return _this[j];
          };
        }(i);
      }return arr;
    }();
    var setters = _setters && _length != undefined ? _setters : function () {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr[i] = function (j) {
          return function (v) {
            _this[j] = v;
          };
        }(i);
      }return arr;
    }();
    this.add = function (b) {
      if (b.length != length) throw 'invalid vector';
      for (var i = 0; i < length; i++) {
        setters[i](getters[i] + b[i]);
      }
    };
  }

  return oaVect;
}).factory('oaRectangular', ['oaArrayObject', 'oaObjectArray', function (oaArrayObject, oaObjectArray) {
  function oaRectangular(arr, offset, skip) {
    var _this2 = this;

    var keys = ['x', 'y'];
    var setter = function setter(v) {
      var o = parseFloat(v);
      if (isNaN(o)) return 0;
      return o;
    };
    oaObjectArray.call(this, arr, keys, 2, null, [setter, setter], {
      offset: offset,
      skip: skip
    });
    Object.defineProperties(this, {
      t: {
        get: function get() {
          return 'rectangular';
        }
      },
      d: {
        get: function get() {
          return 2;
        }
      },
      modulus: {
        get: function get() {
          return Math.sqrt(_this2.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this2.modulus;
          _this2.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this2.argument;
          var c = Math.cos(r),
              s = Math.sin(r);
          var t = c * x - s * y;
          y = s * x + c * y;
          x = t;
        }
      }
    });
    oaArrayObject.call(this, this, keys, 2);
    keys.forEach(function (k1) {
      keys.forEach(function (k2) {
        Object.defineProperty(_this2, [k1, k2].join(''), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this2[k];
            }));
          },
          set: function set(v) {
            if (v.t !== 'rectangular') throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this2[k] = v[i];
            });
          }
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this2.t) throw 'argument must be ' + _this2.t + ' vector';
      _this2.forEach(function (c, i) {
        _this2[i] = c + b[i];
      });
      return _this2;
    };
    this.sum = function (b) {
      return new oaRectangular(_this2).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this2.t) throw 'argument must be ' + _this2.t + ' vector';
      _this2.forEach(function (c, i) {
        _this2[i] = c - b[i];
      });
      return _this2;
    };
    this.difference = function (b) {
      return new oaRectangular(_this2).minus(b);
    };
    this.scale = function (s) {
      _this2.forEach(function (c, i) {
        _this2[i] = c * s;
      });
      return _this2;
    };
    this.scaled = function (b) {
      return new oaRectangular(_this2).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this2.t) throw 'argument must be ' + _this2.t + ' vector';
      return _this2.reduce(function (d, c, i) {
        return d + c * b[i];
      }, 0);
    };
  }

  oaRectangular.sum = function (a, b) {
    return new oaRectangular(a).add(b);
  };
  oaRectangular.difference = function (a, b) {
    return new oaRectangular(a).minus(b);
  };
  oaRectangular.scaled = function (a, b) {
    return new oaRectangular(a).scale(b);
  };
  oaRectangular.dot = function (a, b) {
    return new oaRectangular(a).dot(b);
  };

  return oaRectangular;
}]).factory('oaPolar', ['oaArrayObject', function (oaArrayObject) {
  function Polar(_r, _a) {
    var r = parseFloat(_r);
    var a = parseFloat(_a);
    Object.defineProperties(this, {
      t: {
        get: function get() {
          return 'rect';
        }
      },
      d: {
        get: function get() {
          return 2;
        }
      },
      length: {
        get: function get() {
          return 2;
        }
      },
      x: {
        get: function get() {
          return x;
        },
        set: function set(v) {
          x = parseFloat(v);
        }
      },
      0: {
        get: function get() {
          return x;
        },
        set: function set(v) {
          x = parseFloat(v);
        }
      },
      y: {
        get: function get() {
          return y;
        },
        set: function set(v) {
          y = parseFloat(v);
        }
      },
      1: {
        get: function get() {
          return y;
        },
        set: function set(v) {
          y = parseFloat(v);
        }
      }
    });
    this.forEach = function (func, thisArg) {
      func.call(thisArg, x, 0, [x, y]);
      func.call(thisArg, y, 1, [x, y]);
    };
    this.map = function (func, thisArg) {
      return [func.call(thisArg, x, 0, [x, y]), func.call(thisArg, y, 1, [x, y])];
    };
    this.reduce = function (func, initial) {
      return func.call(null, func.call(null, initial, x, 0, [x, y]), y, 1, [x, y]);
    };
    this.reduceRight = function (func, initial) {
      return func.call(null, func.call(null, initial, y, 0, [x, y]), x, 1, [x, y]);
    };
    this.every = function (func, thisArg) {
      return func.call(thisArg, x, 0, [x, y]) && func.call(thisArg, y, 0, [x, y]);
    };
    this.fill = function (val, start, end) {
      if (start == undefined) start = 0;
      if (end == undefined) end = this.length;
      for (var i = 0; i < this.length; i++) {
        this[i] = val;
      }
    };
    this.reverse = function () {
      var t = x;
      x = y;
      y = t;
    };
  }

  return Polar;
}]).factory('oaCartesian', ['oaArrayObject', 'oaObjectArray', 'oaRectangular', function (oaArrayObject, oaObjectArray, oaRectangular) {
  function oaCartesian(arr, offset, skip) {
    var _this3 = this;

    var keys = ['x', 'y', 'z'];
    var setter = function setter(v) {
      var o = parseFloat(v);
      if (isNaN(o)) return 0;
      return o;
    };
    oaObjectArray.call(this, arr, keys, 3, null, [setter, setter, setter], {
      offset: offset,
      skip: skip
    });
    Object.defineProperties(this, {
      t: {
        get: function get() {
          return 'cartesian';
        }
      },
      d: {
        get: function get() {
          return 3;
        }
      },
      modulus: {
        get: function get() {
          return Math.sqrt(_this3.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this3.modulus;
          _this3.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this3.argument;
          var c = Math.cos(r),
              s = Math.sin(r);
          var t = c * x - s * y;
          y = s * x + c * y;
          x = t;
        }
      }
    });
    oaArrayObject.call(this, this, keys, 3);
    keys.forEach(function (k1) {
      keys.forEach(function (k2) {
        Object.defineProperty(_this3, [k1, k2].join(''), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this3[k];
            }));
          },
          set: function set(v) {
            if (v.t !== 'rectangular') throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this3[k] = v[i];
            });
          }
        });
        keys.forEach(function (k3) {
          Object.defineProperty(_this3, [k1, k2, k3].join(''), {
            get: function get() {
              return new oaCartesian([k1, k2, k3].map(function (k) {
                return _this3[k];
              }));
            },
            set: function set(v) {
              if (v.t !== 'cartesian') throw 'argument must be cartesian vector';
              [k1, k2, k3].forEach(function (k, i) {
                _this3[k] = v[i];
              });
            }
          });
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this3.t) throw 'argument must be ' + _this3.t + ' vector';
      _this3.forEach(function (c, i) {
        _this3[i] = c + b[i];
      });
      return _this3;
    };
    this.sum = function (b) {
      return new oaCartesian(_this3).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this3.t) throw 'argument must be ' + _this3.t + ' vector';
      _this3.forEach(function (c, i) {
        _this3[i] = c - b[i];
      });
      return _this3;
    };
    this.difference = function (b) {
      return new oaCartesian(_this3).minus(b);
    };
    this.scale = function (s) {
      _this3.forEach(function (c, i) {
        _this3[i] = c * s;
      });
      return _this3;
    };
    this.scaled = function (b) {
      return new oaCartesian(_this3).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this3.t) throw 'argument must be ' + _this3.t + ' vector';
      return _this3.reduce(function (d, c, i) {
        return d + c * b[i];
      }, 0);
    };
  }

  oaCartesian.sum = function (a, b) {
    return new oaCartesian(a).add(b);
  };
  oaCartesian.difference = function (a, b) {
    return new oaCartesian(a).minus(b);
  };
  oaCartesian.scaled = function (a, b) {
    return new oaCartesian(a).scale(b);
  };
  oaCartesian.dot = function (a, b) {
    return new oaCartesian(a).dot(b);
  };

  return oaCartesian;
}]).factory('oaCylindrical', function () {
  function Cylindrical(r, a, z) {}

  return Cylindrical;
}).factory('oaSpherical', function () {
  function Spherical(r, a, b) {}

  return Spherical;
}).factory('oaHomogeneous', ['oaArrayObject', 'oaObjectArray', 'oaCartesian', 'oaRectangular', function (oaArrayObject, oaObjectArray, oaCartesian, oaRectangular) {
  function oaHomogeneous(arr, offset, skip) {
    var _this4 = this;

    var keys = ['x', 'y', 'z', 'w'];
    var setter = function setter(v) {
      var o = parseFloat(v);
      if (isNaN(o)) return 0;
      return o;
    };
    oaObjectArray.call(this, arr, keys, 3, null, [setter, setter, setter, setter], {
      offset: offset,
      skip: skip
    });
    Object.defineProperties(this, {
      t: {
        get: function get() {
          return 'homogeneous';
        }
      },
      d: {
        get: function get() {
          return 4;
        }
      },
      modulus: {
        get: function get() {
          return Math.sqrt(_this4.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this4.modulus;
          _this4.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this4.argument;
          var c = Math.cos(r),
              s = Math.sin(r);
          var t = c * x - s * y;
          y = s * x + c * y;
          x = t;
        }
      }
    });
    oaArrayObject.call(this, this, keys, 4);
    keys.forEach(function (k1) {
      keys.forEach(function (k2) {
        Object.defineProperty(_this4, [k1, k2].join(''), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this4[k];
            }));
          },
          set: function set(v) {
            if (v.t !== 'rectangular') throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this4[k] = v[i];
            });
          }
        });
        keys.forEach(function (k3) {
          Object.defineProperty(_this4, [k1, k2, k3].join(''), {
            get: function get() {
              return new oaCartesian([k1, k2, k3].map(function (k) {
                return _this4[k];
              }));
            },
            set: function set(v) {
              if (v.t !== 'cartesian') throw 'argument must be cartesian vector';
              [k1, k2, k3].forEach(function (k, i) {
                _this4[k] = v[i];
              });
            }
          });
          keys.forEach(function (k4) {
            Object.defineProperty(_this4, [k1, k2, k3, k4].join(''), {
              get: function get() {
                return new oaHomogeneous([k1, k2, k3, k4].map(function (k) {
                  return _this4[k];
                }));
              },
              set: function set(v) {
                if (v.t !== 'cartesian') throw 'argument must be homogeneous vector';
                [k1, k2, k3, k4].forEach(function (k, i) {
                  _this4[k] = v[i];
                });
              }
            });
          });
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this4.t) throw 'argument must be ' + _this4.t + ' vector';
      _this4.forEach(function (c, i) {
        _this4[i] = c + b[i];
      });
      return _this4;
    };
    this.sum = function (b) {
      return new oaHomogeneous(_this4).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this4.t) throw 'argument must be ' + _this4.t + ' vector';
      _this4.forEach(function (c, i) {
        _this4[i] = c - b[i];
      });
      return _this4;
    };
    this.difference = function (b) {
      return new oaHomogeneous(_this4).minus(b);
    };
    this.scale = function (s) {
      _this4.forEach(function (c, i) {
        _this4[i] = c * s;
      });
      return _this4;
    };
    this.scaled = function (b) {
      return new oaHomogeneous(_this4).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this4.t) throw 'argument must be ' + _this4.t + ' vector';
      return _this4.reduce(function (d, c, i) {
        return d + c * b[i];
      }, 0);
    };
  }

  oaHomogeneous.sum = function (a, b) {
    return new oaHomogeneous(a).add(b);
  };
  oaHomogeneous.difference = function (a, b) {
    return new oaHomogeneous(a).minus(b);
  };
  oaHomogeneous.scaled = function (a, b) {
    return new oaHomogeneous(a).scale(b);
  };
  oaHomogeneous.dot = function (a, b) {
    return new oaHomogeneous(a).dot(b);
  };

  return oaHomogeneous;
}]);
