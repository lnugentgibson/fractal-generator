'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// oaValidators with tests
var _window = window,
    angular = _window.angular;

angular.module('oaValidators', ['oaUtil']).constant('oaFloatPattern', function () {
  return '(^[0-9]+.([0-9]+)?([eE][-+][0-9]+)?$)|(^.[0-9]+([eE][-+][0-9]+)?$)|(^[0-9]+([eE][-+][0-9]+)?$)';
}()).constant('oaIntPattern', '^[0-9]+([eE][-+][0-9]+)?$').factory('oaFloatRegExp', ['oaFloatPattern', function (oaFloatPattern) {
  return new RegExp(oaFloatPattern);
}]).factory('oaIntRegExp', ['oaIntPattern', function (oaIntPattern) {
  return new RegExp(oaIntPattern);
}]).factory('oaNumber', ['oaUtil', 'oaFloatPattern', function (oaUtil, oaFloatPattern) {
  function oaNumber(source, index, keyOptions) {
    var This = this;
    keyOptions = Object.assign({
      key: true,
      keys: true,
      ngKey: true,
      ngKeys: true
    }, keyOptions);
    This.sourceProperty = function (T, src, key, keys, getter, setter) {
      var keySet = oaUtil.ngKeySet(key, Object.assign({}, keyOptions, { plural: keys }));
      var getArr = function getArr() {
        var arr;
        if (keySet.ngKeys) arr = src[keySet.ngKeys];
        if (keySet.ng_keys && !arr) arr = src[keySet.ng_keys];
        if (keySet.keys && !arr) arr = src[keySet.keys];
        return arr;
      };
      var getVal = function getVal() {
        var val;
        if (keySet.ngKey) val = src[keySet.ngKey];
        if (keySet.ng_key && val == undefined) val = src[keySet.ng_key];
        if (keySet.key && val == undefined) val = src[keySet.key];
        return val;
      };
      var setVal = function setVal(v) {
        if (keySet.ngKey) src[keySet.ngKey] = v;
        if (keySet.ng_key) src[keySet.ng_key] = v;
        if (keySet.key) src[keySet.key] = v;
      };
      Object.defineProperty(T, '_' + key, {
        enumerable: true,
        get: function get() {
          var arr = getArr();
          var val = getVal();
          var v = arr && index != undefined ? arr[index] || val : val;
          return getter ? getter(v) : v;
        },
        set: function set(v) {
          if (v == undefined) return;
          if (setter) v = setter(v);
          var arr = getArr();
          if (arr && index != undefined) arr[index] = v;else setVal(v);
        }
      });
    };
    This.specProperty = function (T, src, key, keys, srcP, getter) {
      if (!srcP) T.sourceProperty(T, src, key, keys, getter);
      Object.defineProperty(T, key + 'Spec', {
        enumerable: true,
        get: function get() {
          return T[key] != undefined;
        }
      });
    };
    This.numberProperty = function (T, src, key, keys, specP, srcP, getter) {
      if (!specP) T.specProperty(T, src, key, keys, srcP, getter);else if (!srcP) T.sourceProperty(T, src, key, keys, getter);
      Object.defineProperty(T, key, {
        enumerable: true,
        get: function get() {
          return T['_' + key] != undefined ? parseFloat(T['_' + key]) : undefined;
        },
        set: function set(v) {
          T['_' + key] = v == undefined ? v : v.toString();
        }
      });
      Object.defineProperty(T, key + 'Dec', {
        enumerable: true,
        get: function get() {
          //console.log(`get this.${key}Dec`);
          var v = T['_' + key];
          if (v == undefined) {
            //console.log(`this._${key} is undefined`);
            return;
          }
          try {
            var o = new Decimal(v);
            //console.log(`this.${key}Dec is ${o}`);
            return o;
          } catch (err) {
            //console.log(`error generating this.${key}Dec`);
            //console.log(err);
          }
        },
        set: function set(v) {
          T['_' + key] = v == undefined ? v : v.toString();
        }
      });
    };
    This.genProperty = function (T, src, key, keys, specP, srcP, getter) {
      if (!specP) T.specProperty(T, src, key, keys, srcP, getter);else if (!srcP) T.sourceProperty(T, src, key, keys, getter);
      Object.defineProperty(T, key, {
        enumerable: true,
        get: function get() {
          if (T['_' + key] == undefined) return;
          return T['_' + key];
        },
        set: function set(v) {
          T['_' + key] = v == undefined ? v : v.toString();
        }
      });
    };
    This.isNumeric = function (v) {
      return v && v.match(oaFloatPattern);
    };
    Object.defineProperty(This, 'numeric', {
      get: function get() {
        return This.valueSpec && This.isNumeric(This._value);
      }
    });
    Object.defineProperty(This, '_number', {
      get: function get() {
        return isNaN(This.value) ? This._basis : This.value.toString();
      }
    });
    This.numberProperty(This, source, 'number', null, true, true);
    This.isValidInterval = function (v) {
      if (v == undefined) return { valid: false };else if (typeof v === 'string') {
        if (!v.length || !This.isNumeric(v)) return { valid: false };
        v = new Decimal(v);
      } else if (typeof v === 'number') {
        if (isNaN(v)) return { valid: false };
        v = new Decimal(v);
      }
      if (!This.stepSpec) return { valid: true };
      var out = {};
      var shift = v.sub(This.basis);
      out.valid = shift.mod(This.step).equals(0);
      if (out.valid) {
        out.previous = v.sub(This.step);
        out.closest = v;
        out.next = v.add(This.step);
      } else {
        out.previous = shift.div(This.step).floor().mul(This.step).add(This.basis);
        out.closest = shift.div(This.step).round().mul(This.step).add(This.basis);
        out.next = shift.div(This.step).ceil().mul(This.step).add(This.basis);
      }
      return out;
    };
    Object.defineProperty(This, 'validInterval', {
      get: function get() {
        return This.isValidInterval(This._value).valid;
      }
    });
    Object.defineProperty(This, '_previous', {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).floor().mul(This.step).add(This.basis) : This.valueDec.sub(This.step)).toString();
      }
    });
    Object.defineProperty(This, '_next', {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).ceil().mul(This.step).add(This.basis) : This.valueDec.add(This.step)).toString();
      }
    });
    Object.defineProperty(This, '_closest', {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).round().mul(This.step).add(This.basis) : This._value).toString();
      }
    });
    This.numberProperty(This, source, 'previous', null, true, true);
    This.numberProperty(This, source, 'next', null, true, true);
    This.numberProperty(This, source, 'closest', null, true, true);
    This.numberProperty(This, source, 'value');
    This.numberProperty(This, source, 'min');
    This.numberProperty(This, source, 'max');
    This.numberProperty(This, source, 'step');
    This.numberProperty(This, source, 'basis', 'bases', false, false, function (v) {
      return v || This.min || This.max || 0;
    });
    This.genProperty(This, source, 'required');
    This.ensureMin = function () {
      if (false) console.log('ensure-min called');
      if (!This.numeric || !This.minSpec) return;
      var valid;
      if (This.valueDec.lt(This.min)) {
        valid = This.isValidInterval(This.min);
        if (valid.valid) {
          if (false) console.log('setting min to ' + config.min);
          This.value = valid.closest;
        } else {
          if (false) console.log('setting min to ' + this.next);
          This.value = valid.next;
        }
      }
    };
    This.ensureMax = function () {
      if (false) console.log('ensure-max called');
      if (!This.numeric || !This.maxSpec) return;
      var valid;
      if (This.valueDec.gt(This.max)) {
        valid = This.isValidInterval(This.max);
        if (valid.valid) {
          if (false) console.log('setting min to ' + config.max);
          This.value = valid.closest;
        } else {
          if (false) console.log('setting min to ' + this.next);
          This.value = valid.previous;
        }
      }
    };
    This.ensureNumeric = function () {
      if (false) console.log('ensure-numeric called');
      var orig = This._value;
      if (!This.numeric) {
        This.value = This.number;
      }
      if (false) console.log({
        old: orig,
        new: This._value
      });
    };
    This.ensureStep = function () {
      if (false) console.log('ensure-step called');
      if (!This.numeric || !This.stepSpec) return;
      var orig = This._value;
      if (!This.validInterval) {
        This.value = This.closest;
        This.ensureMin();
        This.ensureMax();
      }
      if (true) console.log({
        old: orig,
        new: This._value,
        closest: This._closest
      });
    };
    This.ensureValid = function () {
      This.ensureNumeric();
      This.ensureMin();
      This.ensureMax();
      This.ensureStep();
    };
    This.decrement = function () {
      if (!This.numeric || !This.stepSpec) return;
      This.value = This.previous;
      This.ensureMin();
    };
    This.increment = function () {
      if (!This.numeric || !This.stepSpec) return;
      This.value = This.next;
      This.ensureMax();
    };
    This.toJSON = function () {
      var json = {};
      Object.keys(This).forEach(function (p) {
        json[p] = This[p];
      });
      return json;
    };
  }

  return oaNumber;
}]).directive('oaNumeric', ['oaFloatPattern', 'oaNumber', function (oaFloatPattern, oaNumber) {
  function oaNumericLink($scope, $element, $attrs, $ctrls) {
    var _$ctrls = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls[0],
        $ngModel = _$ctrls[1];

    $ctrl.$scope = $scope;
    $ctrl.$ngModel = $ngModel;
    $scope.number = $ctrl;
    console.log($ctrl.toJSON());
    //$ctrl.name = $attrs.name;
    window['oaNumber_' + $ngModel.$name] = $ctrl;
    $ngModel.$validators.oaNumeric = function (modelValue, viewValue) {
      $ctrl.value = viewValue;
      if (false) {
        console.log({
          validator: 'numeric',
          number: number.value,
          view: viewValue,
          model: modelValue
        });
      }
      if (!viewValue || !viewValue.length) return true;
      if (!$ctrl.numeric) {
        if ($scope.ensureValid != undefined) $ctrl.ensureValid();else if ($scope.ensureNumeric != undefined) $ctrl.ensureNumeric();else return false;
        $ngModel.$setViewValue($ctrl._value);
        $ngModel.$validate();
        $ngModel.$render();
      }
      return true;
    };
    $ngModel.$validators.min = function (modelValue, viewValue) {
      $ctrl.value = viewValue;
      if (false) {
        console.log({
          validator: 'min',
          number: number.value,
          view: viewValue,
          model: modelValue
        });
      }
      if (!$ctrl.minSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.numeric) return true;
      if ($ctrl.minDec.gt(modelValue)) {
        if ($scope.ensureValid != undefined) $ctrl.ensureValid();else if ($scope.ensureMin != undefined) $ctrl.ensureMin();else return false;
        $ngModel.$setViewValue($ctrl._value);
        $ngModel.$validate();
        $ngModel.$render();
      }
      return true;
    };
    $ngModel.$validators.max = function (modelValue, viewValue) {
      $ctrl.value = viewValue;
      if (false) {
        console.log({
          validator: 'max',
          number: number.value,
          view: viewValue,
          model: modelValue
        });
      }
      if (!$ctrl.maxSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.numeric) return true;
      if ($ctrl.maxDec.lt(modelValue)) {
        if ($scope.ensureValid != undefined) $ctrl.ensureValid();else if ($scope.ensureMax != undefined) $ctrl.ensureMax();else return false;
        $ngModel.$setViewValue($ctrl._value);
        $ngModel.$validate();
        $ngModel.$render();
      }
      return true;
    };
    $ngModel.$validators.step = function (modelValue, viewValue) {
      $ctrl.value = viewValue;
      if (false) {
        console.log({
          validator: 'step',
          number: number.value,
          view: viewValue,
          model: modelValue
        });
      }
      if (!$ctrl.stepSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.numeric) return true;
      if (!$ctrl.validInterval) {
        if ($scope.ensureValid != undefined) $ctrl.ensureValid();else if ($scope.ensureStep != undefined) $ctrl.ensureStep();else return false;
        $ngModel.$setViewValue($ctrl._value);
        $ngModel.$validate();
        $ngModel.$render();
      }
      return true;
    };
    $ngModel.$validators.required = function (modelValue, viewValue) {
      $ctrl.value = viewValue;
      if (false) console.log({
        validator: 'required',
        number: $ctrl.value,
        view: viewValue,
        model: modelValue
      });
      if (!$ctrl.requiredSpec) return true;
      if ($ctrl.required && $ctrl.required.length && $ctrl.required !== 'false') if (!viewValue || !viewValue.length) return false;
      return true;
    };
  }
  return {
    restrict: 'A',
    scope: {
      required: '@?',
      ngRequired: '=?',
      ensureValid: '@?',
      ensureNumeric: '@?',
      step: '@?',
      ngStep: '=?',
      ensureStep: '@?',
      basis: '@?',
      ngBasis: '=?',
      min: '@?',
      ngMin: '=?',
      ensureMin: '@?',
      max: '@?',
      ngMax: '=?',
      ensureMax: '@?',
      number: '=?'
    },
    require: ['oaNumeric', 'ngModel'],
    //controller: oaNumericCtrl,
    controller: ['$scope', oaNumber],
    link: oaNumericLink
  };
}]);
