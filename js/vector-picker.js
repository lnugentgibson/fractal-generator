'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module('vectorPicker', ['ngMessages']).factory('Rect', function () {
  function Rect(_x, _y) {
    var _this = this;

    var x = parseFloat(_x);
    var y = parseFloat(_y);
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
      },
      modulus: {
        get: function get() {
          return Math.sqrt(x * x + y * y);
        },
        set: function set(v) {
          var m = _this.modulus;
          if (m != 0 && v != 0) {
            x *= v / m;
            y *= v / m;
          } else if (v == 0) {
            x = 0;
            y = 0;
          }
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this.argument;
          var c = Math.cos(r),
              s = Math.sin(r);
          var t = c * x - s * y;
          y = s * x + c * y;
          x = t;
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

  Rect.sum = function (a, b) {
    return new Rect(a.x + b.x, a.y + b.y);
  };

  return Rect;
}).factory('Polar', function () {
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
}).factory('Cartesian', function () {
  function Cartesian(x, y, z) {
    var x = parseFloat(_x);
    var y = parseFloat(_y);
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

  return Cartesian;
}).factory('Cylindrical', function () {
  function Cylindrical(r, a, z) {}

  return Cylindrical;
}).factory('Spherical', function () {
  function Spherical(r, a, b) {}

  return Spherical;
}).factory('Homogeneous', function () {
  function Homogeneous(x, y, z, w) {}

  return Homogeneous;
}).directive('validationFloat', function () {
  return {
    restrict: 'A',
    require: '^ngModel',
    link: function link(âscope, âelement, âattrs, ângModelCtrl) {
      var patStr = '^' + ['[1-9][0-9]*.([0-9]+)?([eE][+-][0-9]+)?', '.[0-9]+([eE][+-][0-9]+)?', '[1-9][0-9]([eE][+-][0-9]+)?'].map(function (s) {
        return '(' + s + ')';
      }).join('|') + '$';
      console.log(patStr);
      var pat = new RegExp(patStr);
      var isFloat = function isFloat(value) {
        var valid = !!value.match(pat);
        return {
          value: parseFloat(value),
          valid: valid
        };
      };
      ângModelCtrl.$parsers.push(function (val) {
        var valid = isFloat(val);
        ângModelCtrl.$setValidity('validationFloat', valid.valid);
        return valid.valid ? valid.value : undefined;
      });
      ângModelCtrl.$formatters.push(function (val) {
        ângModelCtrl.$setValidity('validationFloat', !isNaN(parseInt(val)));
        return val;
      });
    }
  };
}).directive('inputBlender', function () {
  return {
    restrict: 'AE',
    templateUrl: "input-blender-template",
    replace: true,
    require: ['inputBlender', 'ngModel'],
    scope: {
      min: '@?',
      max: '@?',
      step: '@?',
      required: '@?',
      ngMin: '=?',
      ngMax: '=?',
      ngStep: '=?',
      ngRequired: '=?',
      speed: '@'
    },
    controller: function controller() {},
    controllerAs: 'ib',
    link: function link(âscope, âelement, âattrs, âctrls) {
      var _ctrls = _slicedToArray(âctrls, 2),
          âinputBlenderCtrl = _ctrls[0],
          ângModelCtrl = _ctrls[1];

      âinputBlenderCtrl.name = ângModelCtrl.$name;
      âinputBlenderCtrl.value = ângModelCtrl.$viewValue;
      ['min', 'max', 'step', 'required'].forEach(function (a) {
        var ngA = 'ng' + a.substr(0, 1).toUpperCase() + a.substr(1, -1);
        if (âscope[ngA] != undefined) {
          âinputBlenderCtrl[a] = âscope[ngA];
        } else if (âscope[a] != undefined) {
          âinputBlenderCtrl[a] = âscope[a];
        }
      });
      console.log({
        scope: âscope,
        ctrl: âinputBlenderCtrl
      });
      ângModelCtrl.$formatters.push(function (v) {
        return v.toString();
      });
      ângModelCtrl.$render = function () {
        âinputBlenderCtrl.value = ângModelCtrl.$viewValue;
      };
      ângModelCtrl.$parsers.push(function (v) {
        return v;
      });
      âscope.$watch('ib.value', function () {
        ângModelCtrl.$setViewValue(âinputBlenderCtrl.value);
        var $error = ângModelCtrl.$$parentForm[ângModelCtrl.$name + '-val'].$error;
        console.log($error);
        ['validationFloat', 'min', 'max', 'step', 'required'].forEach(function (key) {
          var valid = !$error[key];
          if (valid != undefined) ângModelCtrl.$setValidity(key, valid);
        });
      });
      var $overlay = âelement.find(".ib-overlay");
      var $input = âelement.find(".ib-input");
      $overlay.click(function (event) {
        if (âinputBlenderCtrl.state !== "drag" && âinputBlenderCtrl.state !== "fromdrag") {
          âinputBlenderCtrl.state = "edit";
          âelement.addClass("ib-edit-mode");
          $input.select();
          $input.focus();
        }
        if (âinputBlenderCtrl.state !== "fromdrag") âinputBlenderCtrl.state = "none";
      });
      $overlay.mousedown(function (event) {
        âinputBlenderCtrl.state = "down";
        âinputBlenderCtrl.pageX = event.pageX;
        âinputBlenderCtrl.pageY = event.pageY;
      });
      $overlay.mouseup(function (event) {
        âinputBlenderCtrl.state = âinputBlenderCtrl.state === "drag" ? "fromdrag" : "";
      });
      $overlay.mousemove(function (event) {
        var dx = event.pageX - âinputBlenderCtrl.pageX;
        var dy = event.pageY - âinputBlenderCtrl.pageY;
        âinputBlenderCtrl.pageX = event.pageX;
        âinputBlenderCtrl.pageY = event.pageY;
        if (âinputBlenderCtrl.state === "down") âinputBlenderCtrl.state = "drag";
        if (âinputBlenderCtrl.state === "drag") {
          var ds = âscope.speed * dx * âinputBlenderCtrl.step;
          var value = parseFloat(ângModelCtrl.$modelValue) + ds;
          if (âinputBlenderCtrl.min != undefined && value < âinputBlenderCtrl.min) value = âinputBlenderCtrl.min;
          if (âinputBlenderCtrl.max != undefined && value > âinputBlenderCtrl.max) value = âinputBlenderCtrl.max;
          var basis;
          if (âinputBlenderCtrl.min != undefined) basis = âinputBlenderCtrl.min;else if (âinputBlenderCtrl.max != undefined) basis = âinputBlenderCtrl.max;
          var nvalue;
          if (basis != undefined) nvalue = âinputBlenderCtrl.step * Math.round((value - basis) / âinputBlenderCtrl.step) + basis;
          var valueStr = nvalue.toString();
          âinputBlenderCtrl.value = valueStr;
          ângModelCtrl.$setViewValue(valueStr);
          if (false) {
            console.log({
              state: âinputBlenderCtrl.state,
              pageX: event.pageX,
              pageY: event.pageY,
              dx: dx,
              dy: dy,
              ds: ds,
              modelValue: ângModelCtrl.$modelValue,
              viewValue: ângModelCtrl.$viewValue,
              ctrlValue: âinputBlenderCtrl.value,
              value: value,
              valueStr: valueStr
            });
            console.log(ângModelCtrl);
          }
        }
      });
      $input.blur(function (event) {
        âelement.removeClass("ib-edit-mode");
      });
    }
  };
}).directive('vectorRect', ['Rect', function (Rect) {
  return {
    restrict: 'E',
    templateUrl: 'vector-rect-template',
    scope: {
      vector: '='
    },
    controller: function controller($scope) {
      var Ctrl = this;

      Ctrl.vector = $scope.vector;
    },
    controllerAs: 'rp',
    link: function link(âscope, âelement, âattrs, ângModelCtrl) {}
  };
}]).directive('vectorPolar', ['Polar', function (Polar) {
  return {
    restrict: 'E',
    templateUrl: 'vector-polar-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD2', ['Rect', 'Polar', function (Rect, Polar) {
  return {
    restrict: 'E',
    templateUrl: 'vector-2d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorCartesian', ['Cartesian', function (Cartesian) {
  return {
    restrict: 'E',
    templateUrl: 'vector-cartesian-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorCylindrical', ['Cylindrical', function (Cylindrical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-cylindrical-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorSpherical', ['Spherical', function (Spherical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-spherical-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD3', ['Cartesian', 'Cylindrical', 'Spherical', function (Cartesian, Cylindrical, Spherical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-3d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorHomogeneous', ['Homogeneous', function (Homogeneous) {
  return {
    restrict: 'E',
    templateUrl: 'vector-homogeneous-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD4', ['Homogeneous', function (Homogeneous) {
  return {
    restrict: 'E',
    templateUrl: 'vector-4d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).controller('Ctrl', ['Rect', 'Polar', 'Cartesian', 'Cylindrical', 'Spherical', 'Homogeneous', function (Rect, Polar, Cartesian, Cylindrical, Spherical, Homogeneous) {
  this.num1 = 1.3;
  this.rect1 = new Rect(2.5, 3.7);
}]);
