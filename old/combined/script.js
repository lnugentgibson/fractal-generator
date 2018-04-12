'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Math.log10 = Math.log(10);
$(function () {
  $('#app-menu').tabs();
  $('.app-menu-accordion').accordion({
    header: 'header',
    collapsible: true
  });
  //$('input[type=spinner]').spinner();
  /*
  $('[type=slider]').slider();
  $('#input-size-slider').slider('option', {
    min: 0.1,
    max: 1000,
    step: 1
  });
  */
});
var _window = window,
    angular = _window.angular,
    $ = _window.$;

angular.module("oaUtil", []).service("oaUtil", function () {
  function Util() {
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
      keyset.keys = options.plural ? options.plural.toLowerCase() : keyset.key + "s";
      keyset.Key = keyset.key.charAt(0).toUpperCase() + keyset.key.substr(1, keyset.key.length);
      keyset.Keys = options.plural ? keyset.keys.charAt(0).toUpperCase() + keyset.keys.substr(1, keyset.keys.length) : keyset.Key + "s";
      keyset.ngKey = "ng" + keyset.Key;
      keyset.ngKeys = options.plural ? "ng" + keyset.Keys : keyset.ngKey + "s";
      keyset.ng_key = "ng-" + keyset.key;
      keyset.ng_keys = options.plural ? "ng-" + keyset.keys : keyset.ng_key + "s";
      var out = {};
      Object.keys(keyset).forEach(function (type) {
        if (options[type]) out[type] = keyset[type];
      });
      return out;
    };
  }

  return new Util();
}).factory("oaArrayObject", function () {
  function oaArrObj(_src, _keys, _length, getters, setters, _options) {
    var _this = this;

    var src = _src ? _src : this;
    Object.defineProperty(this, "objSource", {
      get: function get() {
        return src;
      },
      set: function set(v) {
        if (v) src = v;
      }
    });
    if (!_keys || !_keys.length) throw "keys cannot be empty";
    var length = arguments.length > 1 ? parseInt(_length, 10) : _keys.length;
    if (length < 1) throw "length must be positive integer";
    var keys = _keys.slice(0, length);
    for (var i = 0; i < length; i++) {
      (function (j) {
        Object.defineProperty(_this, j, {
          get: function get() {
            return getters && getters[j] ? getters[j](src[keys[j]]) : src[keys[j]];
          },
          set: function set(v) {
            if (setters && setters[j]) src[keys[j]] = setters[j](v);else src[keys[j]] = v;
          }
        });
      })(i);
    }Object.defineProperty(this, "length", {
      get: function get() {
        return length;
      }
    });
    var options = Object.assign({
      every: true,
      fill: true,
      forEach: true,
      map: true,
      reduce: true,
      reduceRight: true,
      reverse: true,
      rotate: true,
      rotateRight: true
    }, _options);
    this.asArray = function () {
      return keys.map(function (key) {
        return _this[key];
      });
    };
    this.setArray = function (arr) {
      return keys.map(function (key, i) {
        if (arr && arr.length > i) _this[key] = arr[i];
      });
    };
    if (options.every) this.every = function (callback, thisArg) {
      var arr = this.asArray();
      for (var i = 0; i < length; i++) {
        if (!callback.call(thisArg, this[i], i, arr)) return false;
      }return true;
    };
    if (options.fill) this.fill = function (value, start, end) {
      if (arguments.length < 2) {
        start = 0;
        end = length;
      } else if (arguments.length < 3) end = length;
      for (var i = Math.max(start, 0); i < length && i < end; i++) {
        this[i] = value;
      }
    };
    if (options.forEach) this.forEach = function (callback, thisArg) {
      var arr = this.asArray();
      for (var i = 0; i < length; i++) {
        callback.call(thisArg, this[i], i, arr);
      }
    };
    if (options.map) this.map = function (callback, thisArg) {
      var arr = this.asArray();
      var out = [];
      for (var i = 0; i < length; i++) {
        out[i] = callback.call(thisArg, this[i], i, arr);
      }return out;
    };
    if (options.reduce) this.reduce = function (callback, initialValue) {
      var arr = this.asArray();
      var a = initialValue;
      for (var i = 0; i < length; i++) {
        a = callback.call(null, a, this[i], i, arr);
      }return a;
    };
    if (options.reduceRight) this.reduceRight = function (callback, initialValue) {
      var arr = this.asArray();
      var a = initialValue;
      for (var i = length - 1; i >= 0; i++) {
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

      shift %= length;
      keys.slice(shift, length).concat(keys.slice(0, shift)).forEach(function (key, i) {
        return _this3[i] = _this3[key];
      });
    };
    if (options.rotateRight) this.rotateRight = function (shift) {
      var _this4 = this;

      shift %= length;
      keys.slice(length - shift, length).concat(keys.slice(0, length - shift)).forEach(function (key, i) {
        return _this4[i] = _this4[key];
      });
    };
  }

  return oaArrObj;
}).factory("oaObjectArray", function () {
  function oaObjArr(_src, _keys, _length, getters, setters, _options) {
    var _this5 = this;

    var src = _src ? _src : this;
    Object.defineProperty(this, "arrSource", {
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
    if (!_keys || !_keys.length) throw "keys cannot be empty";
    var length = arguments.length > 1 ? parseInt(_length, 10) : _keys.length;
    if (length < 1) throw "length must be positive integer";
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
        Object.defineProperty(_this5, keys[j], {
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
});
angular.module("oaValidators", ["oaUtil"]).constant("oaFloatPattern", function () {
  return '(^[0-9]+.([0-9]+)?([eE][-+][0-9]+)?$)|(^.[0-9]+([eE][-+][0-9]+)?$)|(^[0-9]+([eE][-+][0-9]+)?$)';
}()).constant("oaIntPattern", '^[0-9]+([eE][-+][0-9]+)?$').factory("oaFloatRegExp", ["oaFloatPattern", function (oaFloatPattern) {
  return new RegExp(oaFloatPattern);
}]).factory("oaIntRegExp", ["oaIntPattern", function (oaIntPattern) {
  return new RegExp(oaIntPattern);
}]).factory("oaNumber", ["oaUtil", "oaFloatPattern", function (oaUtil, oaFloatPattern) {
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
      Object.defineProperty(T, "_" + key, {
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
      Object.defineProperty(T, key + "Spec", {
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
          return T["_" + key] != undefined ? parseFloat(T["_" + key]) : undefined;
        },
        set: function set(v) {
          T["_" + key] = v == undefined ? v : v.toString();
        }
      });
      Object.defineProperty(T, key + "Dec", {
        enumerable: true,
        get: function get() {
          //console.log(`get this.${key}Dec`);
          var v = T["_" + key];
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
          T["_" + key] = v == undefined ? v : v.toString();
        }
      });
    };
    This.genProperty = function (T, src, key, keys, specP, srcP, getter) {
      if (!specP) T.specProperty(T, src, key, keys, srcP, getter);else if (!srcP) T.sourceProperty(T, src, key, keys, getter);
      Object.defineProperty(T, key, {
        enumerable: true,
        get: function get() {
          if (T["_" + key] == undefined) return;
          return T["_" + key];
        },
        set: function set(v) {
          T["_" + key] = v == undefined ? v : v.toString();
        }
      });
    };
    This.isNumeric = function (v) {
      return v && v.match(oaFloatPattern);
    };
    Object.defineProperty(This, "numeric", {
      get: function get() {
        return This.valueSpec && This.isNumeric(This._value);
      }
    });
    Object.defineProperty(This, "_number", {
      get: function get() {
        return isNaN(This.value) ? This._basis : This.value.toString();
      }
    });
    This.numberProperty(This, source, "number", null, true, true);
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
    Object.defineProperty(This, "validInterval", {
      get: function get() {
        return This.isValidInterval(This._value).valid;
      }
    });
    Object.defineProperty(This, "_previous", {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).floor().mul(This.step).add(This.basis) : This.valueDec.sub(This.step)).toString();
      }
    });
    Object.defineProperty(This, "_next", {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).ceil().mul(This.step).add(This.basis) : This.valueDec.add(This.step)).toString();
      }
    });
    Object.defineProperty(This, "_closest", {
      get: function get() {
        if (!This.valueSpec || !This.numeric || !This.stepSpec) return;
        var shift = This.valueDec.sub(This.basis);
        return (!This.validInterval ? shift.div(This.step).round().mul(This.step).add(This.basis) : This._value).toString();
      }
    });
    This.numberProperty(This, source, "previous", null, true, true);
    This.numberProperty(This, source, "next", null, true, true);
    This.numberProperty(This, source, "closest", null, true, true);
    This.numberProperty(This, source, "value");
    This.numberProperty(This, source, "min");
    This.numberProperty(This, source, "max");
    This.numberProperty(This, source, "step");
    This.numberProperty(This, source, "basis", "bases", false, false, function (v) {
      return v || This.min || This.max || 0;
    });
    This.genProperty(This, source, "required");
    This.ensureMin = function () {
      if (false) console.log("ensure-min called");
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
      if (false) console.log("ensure-max called");
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
      if (false) console.log("ensure-numeric called");
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
      if (false) console.log("ensure-step called");
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
}]).directive("oaNumeric", ["oaFloatPattern", "oaNumber", function (oaFloatPattern, oaNumber) {
  function oaNumericLink($scope, $element, $attrs, $ctrls) {
    var _$ctrls = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls[0],
        $ngModel = _$ctrls[1];

    $ctrl.$scope = $scope;
    $ctrl.$ngModel = $ngModel;
    $scope.number = $ctrl;
    console.log($ctrl.toJSON());
    //$ctrl.name = $attrs.name;
    window["oaNumber_" + $ngModel.$name] = $ctrl;
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
      if ($ctrl.required && $ctrl.required.length && $ctrl.required !== "false") if (!viewValue || !viewValue.length) return false;
      return true;
    };
  }
  return {
    restrict: "A",
    scope: {
      required: "@?",
      ngRequired: "=?",
      ensureValid: "@?",
      ensureNumeric: "@?",
      step: "@?",
      ngStep: "=?",
      ensureStep: "@?",
      basis: "@?",
      ngBasis: "=?",
      min: "@?",
      ngMin: "=?",
      ensureMin: "@?",
      max: "@?",
      ngMax: "=?",
      ensureMax: "@?",
      number: '=?'
    },
    require: ["oaNumeric", "ngModel"],
    //controller: oaNumericCtrl,
    controller: ['$scope', oaNumber],
    link: oaNumericLink
  };
}]);
angular.module("oaBlenderInput", ["oaValidators"]).constant("ConfigStates", ["none", "edit", "down", "drag", "fromdrag"]).service("oaBlenderInputDocumentState", ["ConfigStates", function (ConfigStates) {
  function DocumentState() {
    var $target, $targetNumber;
    var pageX, pageY, lastEvent;
    var dx, dy, dt;
    var debugState = false;
    var update = function update($event) {
      var now = Date.now();
      dx = $event.pageX - pageX;
      dy = $event.pageY - pageY;
      dt = now - lastEvent;
      pageX = $event.pageX;
      pageY = $event.pageY;
      lastEvent = now;
    };
    var stateDebug = function stateDebug(e, number) {
      if (number.prevstate !== number.state && debugState) {
        console.log('click from state ' + number.prevstate + ' to ' + number.state);
      }
    };
    this.overlayClick = function ($element, number, $event) {
      var $field = $element.find(".oa-bnumber-field");
      update($event);
      number.prevstate = number.state;
      if (number.state !== "drag" && number.state !== "fromdrag") {
        number.state = "edit";
        $element.addClass("oa-edit-mode");
        $field.select();
        $field.focus();
      }
      if (number.state === "fromdrag") number.state = "none";
      stateDebug('click', number);
    };
    this.overlayDown = function ($element, number, $event) {
      var $ngModel = $element.controller("ng-model");
      update($event);
      number.prevstate = number.state;
      number.state = "down";
      $target = $element;
      $targetNumber = number;
      number.float = number.value;
      stateDebug('down', number);
    };
    this.documentUp = function ($event) {
      if (!$target) return;
      $targetNumber.prevstate = $targetNumber.state;
      update($event);
      $targetNumber.state = $targetNumber.state === "drag" ? "fromdrag" : "none";
      stateDebug('up', $targetNumber);
    };
    this.documentMove = function ($event) {
      if (!$target) return;
      var $field = $target.find(".oa-bnumber-field");
      var $ngModel = $field.controller("ng-model");
      $targetNumber.prevstate = $targetNumber.state;
      update($event);
      if (false) console.log(dt);
      if ($targetNumber.state === "down" && dt > 100) $targetNumber.state = "drag";
      if ($targetNumber.state === "drag") {
        $event.preventDefault();
        if (!$targetNumber.stepSpec) return;
        var ds = $targetNumber.stepDec.mul($targetNumber.speedDec.mul(dx));
        var pf = $targetNumber.float;
        $targetNumber.float = parseFloat(pf) + new Number(ds);
        if (false) console.log({
          ds: ds,
          p: pf,
          n: $targetNumber.float
        });
        $targetNumber._value = $targetNumber._float;
        $targetNumber.ensureValid();
        $ngModel.$setViewValue($targetNumber._value);
        $ngModel.$render();
      }
      stateDebug('move', $targetNumber);
    };
    this.fieldBlur = function ($element, number, $event) {
      var $field = $element.find(".oa-bnumber-field");
      update($event);
      number.prevstate = number.state;
      $element.removeClass("oa-edit-mode");
      number.state = "none";
      //console.log('blur');
      //console.log($ngModelInner.$error);
      number.ensureValid();
      stateDebug('blur', number);
    };
    this.decrement = function ($element, number, $event) {
      $event.preventDefault();
      var $field = $element.find(".oa-bnumber-field");
      update($event);
      number.prevstate = number.state;
      number.decrement();
      stateDebug('dec', number);
    };
    this.increment = function ($element, number, $event) {
      $event.preventDefault();
      var $field = $element.find(".oa-bnumber-field");
      if (false) console.log({
        alen: arguments.length,
        element: $element.get(0).outerHTML,
        field: $field.get(0).outerHTML,
        number: number.toJSON(),
        event: $event
      });
      update($event);
      number.prevstate = number.state;
      var o = number.value;
      if (false) console.log({
        dt: dt,
        p: number.prevstate,
        state: number.state,
        o: o
      });
      number.increment();
      if (false) console.log({
        f: 'inc',
        o: o,
        n: number.value
      });
      stateDebug('inc', number);
    };
    $(document).mouseup(this.documentUp);
    $(document).mousemove(this.documentMove);
  }

  return new DocumentState();
}]).factory("oaNumberElement", ["ConfigStates", 'oaNumber', function (ConfigStates, oaNumber) {
  function FieldConfig($scope, index) {
    var This = this;
    oaNumber.call(This, $scope, index);
    This.sourceProperty(This, $scope, "previousstate", null, function (v) {
      return ConfigStates[v];
    }, function (v) {
      return ConfigStates.indexOf(v);
    });
    This.sourceProperty(This, $scope, "state", null, function (v) {
      return ConfigStates[v];
    }, function (v) {
      return ConfigStates.indexOf(v);
    });
    This.state = "none";
    This.numberProperty(This, $scope, "speed");
    This.speed = 1;
    This.genProperty(This, $scope, "label");
    This.genProperty(This, $scope, "fieldname");
    This.numberProperty(This, $scope, "float");
  }

  return FieldConfig;
}]).directive("oaBnumberset", ["oaBlenderInputDocumentState", "oaNumberElement", function (oaBlenderInputDocumentState, oaNumberElement) {
  function oaBnumberSetCtrl() {}

  function oaBnumberSetLink($scope, $element, $attrs, $ctrls) {
    var i;

    var _$ctrls2 = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls2[0],
        $ngModel = _$ctrls2[1];

    $scope.state = "none";
    $scope.states = [];
    $scope.values = [];
    var elements = $scope.elements = [];
    $scope.length = parseInt($attrs.length, 10);
    console.log($scope);
    for (i = 0; i < $scope.length; i++) {
      (function (j) {
        var $$element = $($element);
        //console.log(j);
        var element = elements[j] = new oaNumberElement($scope, j);
        console.log(element.toJSON());
        if (true) {
          //console.log($ctrl.elements[i].basis);
          element.onClick = function ($event) {
            oaBlenderInputDocumentState.overlayClick($$element.find('.oa-bnumbers-element[data-element-index=' + j + ']'), element, $event);
          };
          element.onDown = function ($event) {
            oaBlenderInputDocumentState.overlayDown($$element.find('.oa-bnumbers-element[data-element-index=' + j + ']'), element, $event);
          };
          element.onBlur = function ($event) {
            oaBlenderInputDocumentState.fieldBlur($$element.find('.oa-bnumbers-element[data-element-index=' + j + ']'), element, $event);
          };
          element.onDecrement = function ($event) {
            oaBlenderInputDocumentState.decrement($$element.find('.oa-bnumbers-element[data-element-index=' + j + ']'), element, $event);
          };
          element.onIncrement = function ($event) {
            //console.log($event);
            oaBlenderInputDocumentState.increment($$element.find('.oa-bnumbers-element[data-element-index=' + j + ']'), element, $event);
          };
        }
      })(i);
    }
    $scope.name = $ngModel.$name;
    if (true) $ngModel.$render = function () {
      $ngModel.$viewValue.forEach(function (view, i) {
        if (elements[i].value != view) elements[i].value = view;
      });
    };
    if (true) $scope.$watch('values', function (oldValue, newValue) {
      $ngModel.$setViewValue(elements.map(function (element) {
        return element._value;
      }));
    }, true);
    if (false) for (i = 0; i < $scope.length; i++) {
      (function (j) {
        $scope.$watch('elements[' + j + '].value', function watchElement(oldValue, newValue) {
          //$ngModel.$viewValue[j] = newValue;
          //$ngModel.$$parse();
          $ngModel.$setViewValue($scope.values);
          if (true) {
            console.log({
              f: 'watch("values")',
              $viewValue: $ngModel.$viewValue,
              $modelValue: $ngModel.$modelValue,
              scope: $scope.values,
              element: elements[j],
              elementJSON: elements[j].toJSON(),
              _value: elements[j]._value,
              value: elements[j].value,
              valueDec: elements[j].valueDec,
              index: j
            });
          }
        });
      })(i);
    }
    if (true) $ngModel.$formatters.push(function (modelValue) {
      return modelValue.map(function (model) {
        return model.toString();
      });
    });
    if (true) $ngModel.$parsers.push(function (viewValue) {
      return viewValue.map(function (model) {
        return parseFloat(model);
      });
    });
  }
  return {
    templateUrl: "oa-bnumberset-template",
    scope: {
      length: "@",
      fieldname: "@?",
      ngFieldname: "=?",
      ngFieldnames: "=?",
      label: "@?",
      ngLabel: "=?",
      ngLabels: "=?",
      required: "@?",
      ngRequired: "=?",
      ngRequireds: "=?",
      speed: "@?",
      ngSpeed: "=?",
      ngSpeeds: "=?",
      step: "@?",
      ngStep: "=?",
      ngSteps: "=?",
      basis: "@?",
      ngBasis: "=?",
      ngBases: "=?",
      min: "@?",
      ngMin: "=?",
      ngMins: "=?",
      max: "@?",
      ngMax: "=?",
      ngMaxs: "=?"
    },
    restrict: "E",
    require: ["oaBnumberset", "ngModel"],
    replace: true,
    controllerAs: "ib",
    controller: oaBnumberSetCtrl,
    link: oaBnumberSetLink
  };
}]);
angular.module("oaLinearAlgebra", ["oaUtil"]).factory("oaVect", function () {
  function oaVect(_getters, _setters, _length) {
    var _this6 = this;

    var length = _length == undefined ? this.length : _length;
    var getters = _getters && _length != undefined ? _getters : function () {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr[i] = function (j) {
          return function () {
            return _this6[j];
          };
        }(i);
      }return arr;
    }();
    var setters = _setters && _length != undefined ? _setters : function () {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr[i] = function (j) {
          return function (v) {
            _this6[j] = v;
          };
        }(i);
      }return arr;
    }();
    this.add = function (b) {
      if (b.length != length) throw "invalid vector";
      for (var i = 0; i < length; i++) {
        setters[i](getters[i] + b[i]);
      }
    };
  }

  return oaVect;
}).factory("oaRectangular", ["oaArrayObject", "oaObjectArray", function (oaArrayObject, oaObjectArray) {
  function oaRectangular(arr, offset, skip) {
    var _this7 = this;

    var keys = ["x", "y"];
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
          return Math.sqrt(_this7.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this7.modulus;
          _this7.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this7.argument;
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
        Object.defineProperty(_this7, [k1, k2].join(""), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this7[k];
            }));
          },
          set: function set(v) {
            if (v.t !== "rectangular") throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this7[k] = v[i];
            });
          }
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this7.t) throw 'argument must be ' + _this7.t + ' vector';
      _this7.forEach(function (c, i) {
        _this7[i] = c + b[i];
      });
      return _this7;
    };
    this.sum = function (b) {
      return new oaRectangular(_this7).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this7.t) throw 'argument must be ' + _this7.t + ' vector';
      _this7.forEach(function (c, i) {
        _this7[i] = c - b[i];
      });
      return _this7;
    };
    this.difference = function (b) {
      return new oaRectangular(_this7).minus(b);
    };
    this.scale = function (s) {
      _this7.forEach(function (c, i) {
        _this7[i] = c * s;
      });
      return _this7;
    };
    this.scaled = function (b) {
      return new oaRectangular(_this7).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this7.t) throw 'argument must be ' + _this7.t + ' vector';
      return _this7.reduce(function (d, c, i) {
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
}]).factory("oaPolar", ["oaArrayObject", function (oaArrayObject) {
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
}]).factory("oaCartesian", ["oaArrayObject", "oaObjectArray", "oaRectangular", function (oaArrayObject, oaObjectArray, oaRectangular) {
  function oaCartesian(arr, offset, skip) {
    var _this8 = this;

    var keys = ["x", "y", "z"];
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
          return Math.sqrt(_this8.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this8.modulus;
          _this8.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this8.argument;
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
        Object.defineProperty(_this8, [k1, k2].join(""), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this8[k];
            }));
          },
          set: function set(v) {
            if (v.t !== "rectangular") throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this8[k] = v[i];
            });
          }
        });
        keys.forEach(function (k3) {
          Object.defineProperty(_this8, [k1, k2, k3].join(""), {
            get: function get() {
              return new oaCartesian([k1, k2, k3].map(function (k) {
                return _this8[k];
              }));
            },
            set: function set(v) {
              if (v.t !== "cartesian") throw 'argument must be cartesian vector';
              [k1, k2, k3].forEach(function (k, i) {
                _this8[k] = v[i];
              });
            }
          });
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this8.t) throw 'argument must be ' + _this8.t + ' vector';
      _this8.forEach(function (c, i) {
        _this8[i] = c + b[i];
      });
      return _this8;
    };
    this.sum = function (b) {
      return new oaCartesian(_this8).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this8.t) throw 'argument must be ' + _this8.t + ' vector';
      _this8.forEach(function (c, i) {
        _this8[i] = c - b[i];
      });
      return _this8;
    };
    this.difference = function (b) {
      return new oaCartesian(_this8).minus(b);
    };
    this.scale = function (s) {
      _this8.forEach(function (c, i) {
        _this8[i] = c * s;
      });
      return _this8;
    };
    this.scaled = function (b) {
      return new oaCartesian(_this8).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this8.t) throw 'argument must be ' + _this8.t + ' vector';
      return _this8.reduce(function (d, c, i) {
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
}]).factory("oaCylindrical", function () {
  function Cylindrical(r, a, z) {}

  return Cylindrical;
}).factory("oaSpherical", function () {
  function Spherical(r, a, b) {}

  return Spherical;
}).factory("oaHomogeneous", ["oaArrayObject", "oaObjectArray", "oaCartesian", "oaRectangular", function (oaArrayObject, oaObjectArray, oaCartesian, oaRectangular) {
  function oaHomogeneous(arr, offset, skip) {
    var _this9 = this;

    var keys = ["x", "y", "z", "w"];
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
          return Math.sqrt(_this9.reduce(function (a, c) {
            return a + c * c;
          }, 0));
        },
        set: function set(v) {
          var m = _this9.modulus;
          _this9.scale(m != 0 && v != 0 ? v / m : 0);
        }
      },
      argument: {
        get: function get() {
          return Math.atan2(y, x);
        },
        set: function set(v) {
          var r = v - _this9.argument;
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
        Object.defineProperty(_this9, [k1, k2].join(""), {
          get: function get() {
            return new oaRectangular([k1, k2].map(function (k) {
              return _this9[k];
            }));
          },
          set: function set(v) {
            if (v.t !== "rectangular") throw 'argument must be rectangular vector';
            [k1, k2].forEach(function (k, i) {
              _this9[k] = v[i];
            });
          }
        });
        keys.forEach(function (k3) {
          Object.defineProperty(_this9, [k1, k2, k3].join(""), {
            get: function get() {
              return new oaCartesian([k1, k2, k3].map(function (k) {
                return _this9[k];
              }));
            },
            set: function set(v) {
              if (v.t !== "cartesian") throw 'argument must be cartesian vector';
              [k1, k2, k3].forEach(function (k, i) {
                _this9[k] = v[i];
              });
            }
          });
          keys.forEach(function (k4) {
            Object.defineProperty(_this9, [k1, k2, k3, k4].join(""), {
              get: function get() {
                return new oaHomogeneous([k1, k2, k3, k4].map(function (k) {
                  return _this9[k];
                }));
              },
              set: function set(v) {
                if (v.t !== "cartesian") throw 'argument must be homogeneous vector';
                [k1, k2, k3, k4].forEach(function (k, i) {
                  _this9[k] = v[i];
                });
              }
            });
          });
        });
      });
    });
    this.setArray(arr);
    this.add = function (b) {
      if (b.t !== _this9.t) throw 'argument must be ' + _this9.t + ' vector';
      _this9.forEach(function (c, i) {
        _this9[i] = c + b[i];
      });
      return _this9;
    };
    this.sum = function (b) {
      return new oaHomogeneous(_this9).add(b);
    };
    this.minus = function (b) {
      if (b.t !== _this9.t) throw 'argument must be ' + _this9.t + ' vector';
      _this9.forEach(function (c, i) {
        _this9[i] = c - b[i];
      });
      return _this9;
    };
    this.difference = function (b) {
      return new oaHomogeneous(_this9).minus(b);
    };
    this.scale = function (s) {
      _this9.forEach(function (c, i) {
        _this9[i] = c * s;
      });
      return _this9;
    };
    this.scaled = function (b) {
      return new oaHomogeneous(_this9).scale(b);
    };
    this.dot = function (b) {
      if (b.t !== _this9.t) throw 'argument must be ' + _this9.t + ' vector';
      return _this9.reduce(function (d, c, i) {
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
function CanvasWebGL(cname, canvas, options) {
  var _this10 = this;

  this.registerProgram = function (name, program) {
    //console.log(`${cname}: registerProgram(${name})`);
    programs[name] = program;
    if (gl) {
      //console.log(`${cname}: initializing program ${name}`);
      program.initializeProgram(gl);
      program.queryLocations(gl);
      program.initializeBuffers(gl);
      program.initializeTextures(gl);
    }
  };
  this.draw = function (name) {
    if (gl) {
      if (!name) name = _this10.main;
      if (!name) name = "main";
      //console.log(`drawing program ${name}`);
      var program = programs[name];
      if (program) program.draw(gl);
      //else console.log("program is null");
    }
  };
}
function Program() {
  var _this11 = this;

  this.initializeTextures = function (gl) {
    //console.log("initializing textures");
    Object.keys(textureNames).forEach(function (key) {
      var meta = textureNames[key];
      var image = meta.image,
          type = meta.type;

      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl[type], image);
      var metakey = 't' + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + 'Meta';
      key = 't' + key.substr(0, 1).toUpperCase() + key.substr(1, 99);
      _this11[metakey] = meta;
      _this11[key] = texture;
      textures[key] = texture;
    });
  };
  this.pushAttribute = function (gl, key) {
    var attribute = _this11['a' + key.substr(0, 1).toUpperCase() + key.substr(1, 99)];
    var attributeMeta = _this11['a' + key.substr(0, 1).toUpperCase() + key.substr(1, 99) + 'Meta'];
    var buffer = _this11[attributeMeta.buffer];
    var bufferMeta = _this11[attributeMeta.buffer + "Meta"];
    /*
    console.log(
      `pushing buffer ${attributeMeta.buffer} to attribute ${`a${key
        .substr(0, 1)
        .toUpperCase()}${key.substr(1, 99)}`}`
    );
    console.log({
      attributeMeta,
      bufferMeta,
      attribute,
      buffer
    });
    //*/
    var numComponents = bufferMeta.numComponents,
        type = bufferMeta.type,
        normalize = bufferMeta.normalize,
        stride = bufferMeta.stride,
        offset = bufferMeta.offset;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, numComponents, gl[type], normalize, stride, offset);
    gl.enableVertexAttribArray(attribute);
  };
  this.draw = function (gl) {
    //console.log("preparing to draw");
    if (draw) {
      //console.log("drawing");
      draw.call(_this11, gl);
    }
  };

  Object.defineProperties(this, {
    program: {
      get: function get() {
        return program;
      }
    }
  });
}
angular.module('oaWebglHelpers', []).service('oaWebglHelpers', function () {
  function oaWebglHelpers() {
    this.FLOAT32 = 0;
    this.loadShader = function loadShader(gl, type, source, onErr) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        onErr(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    this.loadProgram = function loadProgram(gl, vertexSource, fragmentSource, onErr) {
      var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
      var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        onErr(gl.getProgramInfoLog(shaderProgram));
        return null;
      }
      return shaderProgram;
    };
  }

  return new oaWebglHelpers();
}).factory('oaWebglShaderSource', function () {
  function oaWebglShaderSource() {
    var source;
    var generator;
    var parameters = {};
    this.printShader = function (_options) {
      console.log(source.split(/\n/g).map(function (line, i) {
        return ("0000" + (i + 1)).substr(-4, 4) + ": " + line;
      }).join("\n"));
    };
  }

  return oaWebglShaderSource;
}).factory('oaWebglProgram', ['oaWebglHelpers', function (oaWebglHelpers) {
  function oaWebglProgram(_options) {
    var options = Object.assign({}, _options);
    var attributeSpecs = options.attributes;
    var uniformSpecs = options.uniforms;
    var bufferSpecs = options.buffers;
    var textureSpecs = options.textures;
    var executor = options.draw;
    var program;
    var attributes = {};
    var uniforms = {};
    var buffers = {};
    var textures = {};
    this.initialize = function initialize(gl) {
      var _this12 = this;

      program = oaWebglHelpers.loadProgram(gl, this.vertexSource, this.fragmentSource);
      Object.keys(attributeSpecs).forEach(function (attributeId) {
        var attributeSpec = attributeSpecs[attributeId];
        var attributeName = attributeSpec.name;

        var attribute = gl.getAttribLocation(program, attributeName);
        var attributeKey = 'a' + attributeId.charAt(0).toUpperCase() + attributeId.substr(1, attributeName.length);
        var attributeSpeckey = attributeKey + 'Spec';
        _this12[attributeKey] = attribute;
        attributes[attributeKey] = attribute;
        _this12[attributeSpeckey] = attributeSpec;
      });
      Object.keys(uniformSpecs).forEach(function (uniformId) {
        var uniformSpec = uniformSpecs[key];
        var uniformName = uniformSpec.name;

        var uniform = gl.getUniformLocation(program, uniformName);
        var uniformKey = 'a' + uniformId.charAt(0).toUpperCase() + uniformId.substr(1, uniformName.length);
        var uniformSpeckey = uniformKey + 'Spec';
        _this12[uniformKey] = uniform;
        uniforms[uniformKey] = uniform;
        _this12[uniformSpeckey] = uniformSpec;
      });
      Object.keys(bufferSpecs).forEach(function (bufferId) {
        var bufferSpec = bufferSpecs[key];
        var data = bufferSpec.data,
            datatype = bufferSpec.datatype,
            target = bufferSpec.target,
            usage = bufferSpec.usage,
            bufferName = bufferSpec.name,
            attributeId = bufferSpec.attribute;

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        var bufferKey = 'a' + bufferId.charAt(0).toUpperCase() + bufferId.substr(1, bufferName.length);
        var bufferSpeckey = bufferKey + 'Spec';
        _this12[bufferKey] = buffer;
        uniforms[bufferKey] = buffer;
        _this12[bufferSpeckey] = bufferSpec;
        var Data;
        switch (datatype) {
          case oaWebglHelpers.FLOAT32:
            Data = new Float32Array(data);
            break;
        }
        gl.bufferData(gl[target], Data, gl[usage]);
        if (attributeId) {
          var attributeKey = 'a' + attributeId.substr(0, 1).toUpperCase() + attributeId.substr(1, attributeId.length);
          var attributeMeta = _this12[attributeKey + "Meta"];
          attributeMeta.buffer = key;
        }
      });
    };
  }

  return oaWebglProgram;
}]).factory('oaWebglCanvas', function () {
  function oaWebglCanvas(name, canvas, _options) {
    var options = Object.assign({}, _options);
    var gl;
    var programs = {};
    var newCanvas = function newCanvas() {
      if (canvas) {
        if (options.width && options.height) {
          canvas.width = options.width;
          canvas.height = options.height;
        }
        gl = canvas.getContext('webgl');
      } else gl = null;
    };
    newCanvas();
    Object.defineProperties(this, {
      canvas: {
        get: function get() {
          return canvas;
        },
        set: function set(v) {
          canvas = v;
          newCanvas();
        }
      },
      gl: {
        get: function get() {
          return gl;
        }
      }
    });
  }
  return oaWebglCanvas;
});
angular.module('vectorPicker', ['oaUtil', 'oaBlenderInput', 'oaLinearAlgebra']).directive('vectorRect', ['oaRectangular', function (Rect) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'vector-rect-template',
    scope: {
      vector: '=',
      //source: '=',
      name: '@'
    },
    controller: function controller() {},
    controllerAs: 'rp',
    link: function link($scope, $element, âattrs, ângModelCtrl) {
      $scope.labels = ['X', 'Y'];
      $scope.names = [$scope.name + '.x', $scope.name + '.y'];
      $scope.mode = 'none';
      $scope.setMode = function (mode) {
        $element.removeClass($scope.mode);
        $scope.mode = mode;
        $element.addClass($scope.mode);
      };
    }
  };
}]).directive('vectorPolar', ['oaPolar', function (Polar) {
  return {
    restrict: 'E',
    templateUrl: 'vector-polar-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD2', ['oaRectangular', 'oaPolar', function (Rect, Polar) {
  return {
    restrict: 'E',
    templateUrl: 'vector-2d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorCartesian', ['oaCartesian', function (Cartesian) {
  return {
    restrict: 'E',
    templateUrl: 'vector-cartesian-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorCylindrical', ['oaCylindrical', function (Cylindrical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-cylindrical-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorSpherical', ['oaSpherical', function (Spherical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-spherical-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD3', ['oaCartesian', 'oaCylindrical', 'oaSpherical', function (Cartesian, Cylindrical, Spherical) {
  return {
    restrict: 'E',
    templateUrl: 'vector-3d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorHomogeneous', ['oaHomogeneous', function (Homogeneous) {
  return {
    restrict: 'E',
    templateUrl: 'vector-homogeneous-template',
    link: function link($scope, $element, $attrs) {}
  };
}]).directive('vectorD4', ['oaHomogeneous', function (Homogeneous) {
  return {
    restrict: 'E',
    templateUrl: 'vector-4d-template',
    link: function link($scope, $element, $attrs) {}
  };
}]);
angular.module('fractalGenerator', [/*'vectorPicker'*/]).controller('Ctrl', function ($scope) {
  $scope.showHeader = false;
  $scope.showTopMenu = false;
  $scope.showSideMenu = false;
  var Ctrl = this;
  Ctrl.distanceFunctions = [{
    name: 'spherical',
    label: 'Sphere',
    type: 'shape',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'icoscahedral',
    label: 'Icoscahedron',
    type: 'shape',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveTetrahedral',
    label: 'Recursive Tetrahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveOctahedral',
    label: 'Recursive Octahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveIcoscahedral',
    label: 'Recursive Icoscahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }];
  Ctrl.distanceFunctionNames = {};
  Ctrl.distanceFunctions.forEach(function (de, i) {
    Ctrl.distanceFunctionNames[de.name] = i;
  });
  Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['recursiveIcoscahedral'];
  //Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['spherical'];
  Ctrl.distanceFunction = Ctrl.distanceFunctions[Ctrl.distanceFunctionIndex];
  Ctrl.size = 0.5;
  var spinSlide = function spinSlide(prop, initial, min, max, step, page, _spin, _slide) {
    Ctrl[prop] = initial;
    $('#input-' + prop + '-spinner').spinner({
      min: Array.isArray(min) ? min[0] : min,
      max: Array.isArray(max) ? max[0] : max,
      step: Array.isArray(step) ? step[0] : step,
      page: page,
      spin: function spin(event, ui) {
        Ctrl[prop] = _spin ? _spin.set(ui.value) : ui.value;
        var slideVal = $('#input-' + prop + '-slider').slider('value');
        var diff = (_slide ? _slide.set(slideVal) : slideVal) - Ctrl[prop];
        if (diff) $('#input-' + prop + '-slider').slider('value', _slide ? _slide.get(Ctrl[prop]) : Ctrl[prop]);
      }
    });
    $('#input-' + prop + '-slider').slider({
      min: Array.isArray(min) ? min[1] : min,
      max: Array.isArray(max) ? max[1] : max,
      step: Array.isArray(step) ? step[1] : step,
      value: _slide ? _slide.get(Ctrl[prop]) : Ctrl[prop],
      slide: function slide(event, ui) {
        Ctrl[prop] = _slide ? _slide.set(ui.value) : ui.value;
        var spinVal = $('#input-' + prop + '-spinner').spinner('value');
        var diff = (_slide ? _slide.set(spinVal) : spinVal) - Ctrl[prop];
        if (diff) $('#input-' + prop + '-spinner').spinner('value', Ctrl[prop]);
      }
    });
    $('#input-' + prop + '-spinner').spinner('value', _spin ? _spin.get(Ctrl[prop]) : Ctrl[prop]);
  };
  spinSlide('size', 1, [0.1, 0], [10000, 1000], [0.001, 1], 3, {
    get: function get(r) {
      return r;
    },
    set: function set(v) {
      return v;
    }
  }, {
    get: function get(r) {
      return Math.round(200 * (1 + Math.log(r) / Math.log10));
    },
    set: function set(v) {
      return parseFloat(Math.pow(10, v / 200.0 - 1).toFixed(3), 10);
    }
  });
  spinSlide('scale', 2, 2, 20, 1, 3);
  spinSlide('iterations', 13, 2, 50, 1, 6);
});
