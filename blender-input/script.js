"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module("oaBlenderInput", ["oaValidators"]).constant('ConfigStates', ['none', 'edit', 'down', 'drag', 'fromdrag']).factory('BlenderNumberFieldConfig', ['ConfigStates', function (ConfigStates) {
  function FieldConfig($scope, index) {
    var This = this;
    var configProperty = function configProperty(key, keys) {
      Object.defineProperty(This, '_' + key, {
        //get: () => $scope[keys ? keys : key + 's'][index] || $scope[key],
        get: function get() {
          try {
            return $scope[keys ? keys : key + 's'][index] || $scope[key];
          } catch (err) {
            console.log(key);
            console.log(err);
            throw err;
          }
        },
        set: function set(v) {
          $scope[key + 's'][index] = v;
        }
      });
    };
    var specProperty = function specProperty(key, keys) {
      configProperty(key, keys);
      Object.defineProperty(This, key + 'Spec', {
        get: function get() {
          return This[key] != undefined;
        }
      });
    };
    var numberProperty = function numberProperty(key) {
      specProperty(key);
      Object.defineProperty(This, key, {
        get: function get() {
          return This['_' + key];
        },
        set: function set(v) {
          try {
            This['_' + key] = new Decimal(v);
          } catch (err) {}
        }
      });
    };
    configProperty('state');
    Object.defineProperty(This, 'state', {
      get: function get() {
        return ConfigStates[This._state];
      },
      set: function set(v) {
        This._state = ConfigStates.indexOf(v);
        if (This._state < 0) This._state = 0;
      }
    });
    this.state = 'none';
    numberProperty('value');
    numberProperty('min');
    numberProperty('max');
    numberProperty('step');
    numberProperty('speed');
    this.speed = 1;
    specProperty('basis', 'bases');
    Object.defineProperty(This, 'basis', {
      get: function get() {
        return This._basis || This.min || This.max || new Decimal(0);
      },
      set: function set(v) {
        try {
          This._basis = new Decimal(v);
        } catch (err) {}
      }
    });
    specProperty('required');
    specProperty('label');
    specProperty('fieldname');
  }

  return FieldConfig;
}]).directive("oaBnumber", function () {
  function oaBnumberCtrl() {}

  function oaBnumberLink($scope, $element, $attrs, $ctrls) {
    var _$ctrls = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls[0],
        $ngModel = _$ctrls[1];

    $ctrl.state = "none";
    ["min", "max", "step", "speed", "basis"].forEach(function (key) {
      var ngKey = "ng" + key.charAt(0).toUpperCase() + key.substr(1, key.length);
      var ng_key = "ng-" + key;
      $ctrl[key + "Spec"] = false;
      if (false) console.log({
        ngKey: ngKey,
        ng_key: ng_key,
        keys: Object.keys($attrs)
      });
      if ($attrs[ngKey] || $attrs[ng_key]) {
        var expr = $attrs[ngKey] || $attrs[ng_key];
        $scope.$watch(expr, function (oldValue, newValue) {
          if (newValue != undefined) {
            $ctrl[key + "Spec"] = true;
            if (false) {
              console.log({
                key: key,
                ngKey: ngKey,
                ng_key: ng_key,
                expr: expr,
                newValue: newValue,
                spec: $ctrl[key + "Spec"]
              });
            }
            $ctrl[key] = new Decimal(newValue);
            if (key === "basis") $ctrl.basis = newValue || $ctrl.min || $ctrl.max || 0;
            if (key === "min") $ctrl.basis = $ctrl.basis || newValue || $ctrl.max || 0;else if (key === "max") $ctrl.basis = $ctrl.basis || $ctrl.min || newValue || 0;
          } else $ctrl[key + "Spec"] = false;
        });
      } else if ($attrs[key]) {
        $ctrl[key + "Spec"] = true;
        try {
          $ctrl[key] = new Decimal($attrs[key]);
          if (false) console.log({
            key: key,
            newValue: $attrs[key],
            spec: $ctrl[key + "Spec"],
            success: true
          });
        } catch (err) {
          console.log(err.message);
          console.log(Object.assign({
            key: key,
            newValue: $attrs[key],
            spec: $ctrl[key + "Spec"],
            success: false
          }, err));
        }
      }
    });
    ["required", "label"].forEach(function (key) {
      var ngKey = "ng" + key.charAt(0).toUpperCase() + key.substr(1, key.length);
      var ng_key = "ng-" + key;
      if (false) console.log({
        ngKey: ngKey,
        ng_key: ng_key,
        keys: Object.keys($attrs)
      });
      if ($attrs[ngKey] || $attrs[ng_key]) {
        $ctrl[key + "Spec"] = true;
        var expr = $attrs[ngKey] || $attrs[ng_key];
        $scope.$watch(expr, function (oldValue, newValue) {
          $ctrl[key] = newValue;
        });
      } else if ($attrs[key]) {
        $ctrl[key] = $attrs[key];
      }
    });
    $ctrl.name = $ngModel.$name.trim();
    if (false) console.log({
      ctrl: $ctrl.name,
      ngModel: $ngModel.$name
    });
    $ngModel.$render = function () {
      $ctrl.value = $ngModel.$viewValue;
    };
    $scope.$watch("ib.value", function () {
      $ngModel.$setViewValue($ctrl.value);
      //console.log($ngModel);
      var $error = $ngModel.$error;
      Object.keys($error).forEach(function (key) {
        var valid = !$error[key];
        $ngModel.$setValidity(key, valid);
      });
    });
    var $label = $element.find(".oa-bnumber-label");
    var $field = $element.find(".oa-bnumber-field");
    var $overlay = $element.find(".oa-bnumber-overlay");
    var $decrement = $element.find(".oa-decrement-button");
    var $increment = $element.find(".oa-increment-button");
    var $oaNumeric = $field.controller('oa-numeric');
    var $ngModelInner = $field.controller('ng-model');
    //console.log($oaNumeric);
    var debugstate = false;
    $overlay.click(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      if ($ctrl.state !== "drag" && $ctrl.state !== "fromdrag") {
        $ctrl.state = "edit";
        $element.addClass("oa-edit-mode");
        $field.select();
        $field.focus();
      }
      if ($ctrl.state === "fromdrag") $ctrl.state = "none";
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("click from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $overlay.mousedown(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      $ctrl.state = "down";
      $ctrl.float = new Number($ctrl.value);
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("down from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $(document).mouseup(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      if ($ctrl.state === 'drag') delete $ctrl.float;
      $ctrl.state = $ctrl.state === "drag" ? "fromdrag" : "none";
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("up from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $(document).mousemove(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      if (false) console.log(dt);
      if ($ctrl.state === "down" && dt > 100) $ctrl.state = "drag";
      if ($ctrl.state === "drag") {
        event.preventDefault();
        var ds = $ctrl.step.mul($ctrl.speed.mul(dx));
        var pf = $ctrl.float;
        $ctrl.float = parseFloat(pf) + new Number(ds);
        if (false) console.log({
          ds: ds,
          p: pf,
          n: $ctrl.float
        });
        if ($ctrl.minSpec && $ctrl.min.gt($ctrl.float)) {
          $ctrl.float = $ctrl.min;
          var valid = $oaNumeric.isValidInterval($ctrl.min);
          if (valid) {
            var nvalue = valid.closest;
            if (nvalue.lt($ctrl.min)) nvalue = valid.next;
            var valueStr = nvalue.toString();
            $ctrl.value = valueStr;
            $ngModel.$setViewValue(valueStr);
          }
        } else if ($ctrl.maxSpec && $ctrl.max.lt($ctrl.float)) {
          $ctrl.float = $ctrl.max;
          var valid = $oaNumeric.isValidInterval($ctrl.max);
          if (valid) {
            var nvalue = valid.closest;
            if (nvalue.gt($ctrl.max)) nvalue = valid.previous;
            var valueStr = nvalue.toString();
            $ctrl.value = valueStr;
            $ngModel.$setViewValue(valueStr);
          }
        } else {
          var valid = $oaNumeric.isValidInterval($ctrl.float);
          if (valid) {
            var nvalue = new Number(valid.closest);
            var valueStr = valid.closest.toString();
            $ctrl.value = valueStr;
            $ngModel.$setViewValue(valueStr);
          }
          if (false) {
            console.log({
              state: $ctrl.state,
              pageX: event.pageX,
              pageY: event.pageY,
              dx: dx,
              dy: dy,
              ds: ds,
              modelValue: $ngModel.$modelValue,
              viewValue: $ngModel.$viewValue,
              ctrlValue: $ctrl.value,
              value: value,
              valueStr: valueStr
            });
            //console.log($ngModel);
          }
        }
      }
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("move from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $field.blur(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      $element.removeClass("oa-edit-mode");
      $ctrl.state = 'none';
      console.log('blur');
      console.log($ngModelInner.$error);
      if ($ngModelInner.$error.oaNumeric) {
        var valueStr = $oaNumeric.numeric.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ngModelInner.$error.min) {
        var valueStr = $ctrl.min.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ngModelInner.$error.max) {
        var valueStr = $ctrl.max.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ngModelInner.$error.step) {
        console.log('blur-step');
        var valueStr = $oaNumeric.closest.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("blur from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $decrement.click(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      var n = $oaNumeric.previous;
      if (!n.lt($ctrl.min)) {
        var valueStr = $oaNumeric.previous.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("dec from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
    $increment.click(function (event) {
      $ctrl.prevstate = $ctrl.state;
      var now = Date.now();
      var dx = event.pageX - $ctrl.pageX;
      var dy = event.pageY - $ctrl.pageY;
      var dt = now - $ctrl.lastEvent;
      $ctrl.pageX = event.pageX;
      $ctrl.pageY = event.pageY;
      $ctrl.lastEvent = now;
      var n = $oaNumeric.previous;
      if (!n.gt($ctrl.max)) {
        var valueStr = $oaNumeric.next.toString();
        $ctrl.value = valueStr;
        $ngModel.$setViewValue(valueStr);
      }
      if ($ctrl.prevstate !== $ctrl.state && debugstate) {
        console.log("inc from state " + $ctrl.prevstate + " to " + $ctrl.state);
      }
    });
  }
  return {
    templateUrl: "oa-bnumber-template",
    scope: true,
    restrict: "E",
    require: ["oaBnumber", "ngModel"],
    replace: true,
    controllerAs: "ib",
    controller: oaBnumberCtrl,
    link: oaBnumberLink
  };
}).directive("oaBnumbers", function () {
  var ConfigStates = ['none', 'edit', 'down', 'drag', 'fromdrag'];

  function FieldConfig(config, index) {
    var This = this;
    var configProperty = function configProperty(key, keys) {
      Object.defineProperty(This, '_' + key, {
        get: function get() {
          return config[keys ? keys : key + 's'][index] || config[key];
        },
        set: function set(v) {
          config[key + 's'][index] = v;
        }
      });
    };
    var specProperty = function specProperty(key, keys) {
      configProperty(key, keys);
      Object.defineProperty(This, key + 'Spec', {
        get: function get() {
          return This[key] != undefined;
        }
      });
    };
    var numberProperty = function numberProperty(key) {
      specProperty(key);
      Object.defineProperty(This, key, {
        get: function get() {
          return This['_' + key];
        },
        set: function set(v) {
          try {
            This['_' + key] = new Decimal(v);
          } catch (err) {}
        }
      });
    };
    configProperty('state');
    Object.defineProperty(This, 'state', {
      get: function get() {
        return ConfigStates[This._state];
      },
      set: function set(v) {
        This._state = ConfigStates.indexOf(v);
        if (This._state < 0) This._state = 0;
      }
    });
    this.state = 'none';
    numberProperty('value');
    numberProperty('min');
    numberProperty('max');
    numberProperty('step');
    numberProperty('speed');
    this.speed = 1;
    specProperty('basis', 'bases');
    Object.defineProperty(This, 'basis', {
      get: function get() {
        return This._basis || This.min || This.max || new Decimal(0);
      },
      set: function set(v) {
        try {
          This._basis = new Decimal(v);
        } catch (err) {}
      }
    });
    specProperty('required');
    specProperty('label');
    specProperty('fieldname');
  }

  function oaBnumberCtrl() {}

  function oaBnumberLink($scope, $element, $attrs, $ctrls) {
    var i;

    var _$ctrls2 = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls2[0],
        $ngModel = _$ctrls2[1];

    $ctrl.configOptions = { states: [], values: [] };
    $ctrl.elements = [];
    var keys = [{ key: "min" }, { key: "max" }, { key: "step" }, { key: "speed" }, { key: "basis", keys: 'bases' }, { key: "required" }, { key: "label" }, { key: 'fieldname' }];
    keys.forEach(function (keyset) {
      {
        if (!keyset.keys) keyset.keys = keyset.key + 's';
        if (!keyset.ngKey) keyset.ngKey = "ng" + keyset.key.charAt(0).toUpperCase() + keyset.key.substr(1, keyset.key.length);
        if (!keyset.ngKeys) keyset.ngKeys = keyset.ngKey + 's';
        if (!keyset.ng_key) keyset.ng_key = "ng-" + keyset.key;
        if (!keyset.ng_keys) keyset.ng_keys = keyset.ng_key + 's';
      }
      var attrs = {};
      Object.keys(keyset).forEach(function (k) {
        attrs[k] = $attrs[keyset[k]];
      });
      $ctrl.configOptions[keyset.keys] = [];
      if (false) {
        console.log({
          keyset: keyset,
          attrs: attrs,
          config: Object.keys($ctrl.configOptions)
        });
      }
      if (attrs.ngKeys || attrs.ng_keys) {
        var expr = attrs.ngKeys || attrs.ng_keys;
        $scope.$watch(expr, function (oldValue, newValue) {
          if (false) {
            console.log({
              keyset: keyset,
              newValue: newValue
            });
          }
          if (newValue != undefined) for (i = 0; i < newValue.length; i++) {
            if (newValue[i] != undefined) $ctrl.configOptions[keyset.keys][i] = newValue[i];
            if (false) {
              console.log({
                key: keyset.key,
                element: $ctrl.configOptions[keyset.keys][i],
                newValue: newValue[i]
              });
            }
            //$scope.$apply();
          }
        });
      }
      if (attrs.ngKey || attrs.ng_key) {
        var expr = attrs.ngKey || attrs.ng_key;
        $scope.$watch(expr, function (oldValue, newValue) {
          if (newValue != undefined) $ctrl.configOptions[keyset.key] = newValue;
        });
      }
      if (attrs.key && attrs.key != undefined) $ctrl.configOptions[keyset.key] = attrs.key;
    });
    if (true) {
      console.log({
        config: $ctrl.configOptions
      });
    }
    for (i = 0; i < parseInt($attrs.length, 10); i++) {
      $ctrl.elements[i] = new FieldConfig($ctrl.configOptions, i);
      //console.log($ctrl.elements[i].basis);
    }
    $ctrl.name = $ngModel.$name.trim();
    if (false) {
      $ngModel.$formatters.push(function (modelValue) {
        if (modelValue.length != undefined) return modelValue.map(function (model) {
          return model.toString();
        });else return [modelValue.toString()];
        console.log('format');
        console.log($ngModel);
      });
      $ngModel.$parsers.push(function (viewValue) {
        if ($ngModel.$modelValue.length != undefined) return viewValue.map(function (view) {
          return parseFloat(view);
        });else return parseFloat(viewValue[0]);
        console.log('parse');
        console.log($ngModel);
      });
      $ngModel.$render = function () {
        $ctrl.value = $ngModel.$viewValue[0];
        $ngModel.$viewValue.forEach(function (view, i) {
          $ctrl.config[i].value = view;
        });
        console.log('render');
        console.log($ngModel);
      };
      $scope.$watch("ib.value", function () {
        $ngModel.$setViewValue($ctrl.value);
        //console.log($ngModel);
        var $error = $ngModel.$error;
        Object.keys($error).forEach(function (key) {
          var valid = !$error[key];
          $ngModel.$setValidity(key, valid);
        });
      });
      var $label = $element.find(".oa-bnumber-label");
      var $field = $element.find(".oa-bnumber-field");
      var $overlay = $element.find(".oa-bnumber-overlay");
      var $decrement = $element.find(".oa-decrement-button");
      var $increment = $element.find(".oa-increment-button");
      var $oaNumeric = $field.controller('oa-numeric');
      var $ngModelInner = $field.controller('ng-model');
      //console.log($oaNumeric);
      var debugstate = false;
      $overlay.click(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        if ($ctrl.state !== "drag" && $ctrl.state !== "fromdrag") {
          $ctrl.state = "edit";
          $element.addClass("oa-edit-mode");
          $field.select();
          $field.focus();
        }
        if ($ctrl.state === "fromdrag") $ctrl.state = "none";
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("click from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $overlay.mousedown(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        $ctrl.state = "down";
        $ctrl.float = new Number($ctrl.value);
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("down from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $(document).mouseup(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        if ($ctrl.state === 'drag') delete $ctrl.float;
        $ctrl.state = $ctrl.state === "drag" ? "fromdrag" : "none";
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("up from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $(document).mousemove(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        if (false) console.log(dt);
        if ($ctrl.state === "down" && dt > 100) $ctrl.state = "drag";
        if ($ctrl.state === "drag") {
          event.preventDefault();
          var ds = $ctrl.step.mul($ctrl.speed.mul(dx));
          var pf = $ctrl.float;
          $ctrl.float = parseFloat(pf) + new Number(ds);
          if (false) console.log({
            ds: ds,
            p: pf,
            n: $ctrl.float
          });
          if ($ctrl.minSpec && $ctrl.min.gt($ctrl.float)) {
            $ctrl.float = $ctrl.min;
            var valid = $oaNumeric.isValidInterval($ctrl.min);
            if (valid) {
              var nvalue = valid.closest;
              if (nvalue.lt($ctrl.min)) nvalue = valid.next;
              var valueStr = nvalue.toString();
              $ctrl.value = valueStr;
              $ngModel.$setViewValue(valueStr);
            }
          } else if ($ctrl.maxSpec && $ctrl.max.lt($ctrl.float)) {
            $ctrl.float = $ctrl.max;
            var valid = $oaNumeric.isValidInterval($ctrl.max);
            if (valid) {
              var nvalue = valid.closest;
              if (nvalue.gt($ctrl.max)) nvalue = valid.previous;
              var valueStr = nvalue.toString();
              $ctrl.value = valueStr;
              $ngModel.$setViewValue(valueStr);
            }
          } else {
            var valid = $oaNumeric.isValidInterval($ctrl.float);
            if (valid) {
              var nvalue = new Number(valid.closest);
              var valueStr = valid.closest.toString();
              $ctrl.value = valueStr;
              $ngModel.$setViewValue(valueStr);
            }
            if (false) {
              console.log({
                state: $ctrl.state,
                pageX: event.pageX,
                pageY: event.pageY,
                dx: dx,
                dy: dy,
                ds: ds,
                modelValue: $ngModel.$modelValue,
                viewValue: $ngModel.$viewValue,
                ctrlValue: $ctrl.value,
                value: value,
                valueStr: valueStr
              });
              //console.log($ngModel);
            }
          }
        }
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("move from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $field.blur(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        $element.removeClass("oa-edit-mode");
        $ctrl.state = 'none';
        console.log('blur');
        console.log($ngModelInner.$error);
        if ($ngModelInner.$error.oaNumeric) {
          var valueStr = $oaNumeric.numeric.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ngModelInner.$error.min) {
          var valueStr = $ctrl.min.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ngModelInner.$error.max) {
          var valueStr = $ctrl.max.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ngModelInner.$error.step) {
          console.log('blur-step');
          var valueStr = $oaNumeric.closest.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("blur from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $decrement.click(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        var n = $oaNumeric.previous;
        if (!n.lt($ctrl.min)) {
          var valueStr = $oaNumeric.previous.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("dec from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
      $increment.click(function (event) {
        $ctrl.prevstate = $ctrl.state;
        var now = Date.now();
        var dx = event.pageX - $ctrl.pageX;
        var dy = event.pageY - $ctrl.pageY;
        var dt = now - $ctrl.lastEvent;
        $ctrl.pageX = event.pageX;
        $ctrl.pageY = event.pageY;
        $ctrl.lastEvent = now;
        var n = $oaNumeric.previous;
        if (!n.gt($ctrl.max)) {
          var valueStr = $oaNumeric.next.toString();
          $ctrl.value = valueStr;
          $ngModel.$setViewValue(valueStr);
        }
        if ($ctrl.prevstate !== $ctrl.state && debugstate) {
          console.log("inc from state " + $ctrl.prevstate + " to " + $ctrl.state);
        }
      });
    }
  }
  return {
    templateUrl: "oa-bnumbers-template",
    scope: true,
    restrict: "E",
    require: ["oaBnumbers", "ngModel"],
    replace: true,
    controllerAs: "ib",
    controller: oaBnumberCtrl,
    link: oaBnumberLink
  };
}).directive('oaBnumberset', ['BlenderNumberFieldConfig', function (BlenderNumberFieldConfig) {
  function oaBnumberSetCtrl() {}

  function oaBnumberSetLink($scope, $element, $attrs, $ctrls) {
    var i;

    var _$ctrls3 = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls3[0],
        $ngModel = _$ctrls3[1];

    $scope.states = [];
    $scope.values = [];
    $scope.elements = [];
    for (i = 0; i < parseInt($attrs.length, 10); i++) {
      $ctrl.elements[i] = new BlenderNumberFieldConfig($scope, i);
      //console.log($ctrl.elements[i].basis);
    }
  }
  return {
    templateUrl: "oa-bnumberset-template",
    scope: {
      length: '@',
      fieldname: '@?',
      ngFieldname: '=?',
      ngFieldnames: '=?',
      label: '@?',
      ngLabel: '=?',
      ngLabels: '=?',
      required: '@?',
      ngRequired: '=?',
      ngRequireds: '=?',
      speed: '@?',
      ngSpeed: '=?',
      ngSpeeds: '=?',
      step: '@?',
      ngStep: '=?',
      ngSteps: '=?',
      basis: '@?',
      ngBasis: '=?',
      ngBases: '=?',
      min: '@?',
      ngMin: '=?',
      ngMins: '=?',
      max: '@?',
      ngMax: '=?',
      ngMaxs: '=?'
    },
    restrict: "E",
    require: ["oaBnumberset", "ngModel"],
    replace: true,
    controllerAs: "ib",
    controller: oaBnumberSetCtrl,
    link: oaBnumberSetLink
  };
}]);
angular.module("oaBlenderInputTestApp", ["oaBlenderInput", "ngMessages"]).controller("TestCtrl", function () {
  this.num1 = 0.012;
  this.num2 = 0.887;
  this.nums = [0.3, 0.4, 0.5];
  this.names = ['numX', 'numY', 'numZ'];
  this.labels = ['X', 'Y', 'Z'];
});
