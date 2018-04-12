"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module("oaValidators", []).constant("oaFloatPattern", function () {
  return "(^[0-9]+.([0-9]+)?([eE][-+][0-9]+)?$)|(^.[0-9]+([eE][-+][0-9]+)?$)|(^[0-9]+([eE][-+][0-9]+)?$)";
}()).constant("oaIntPattern", "^[0-9]+([eE][-+][0-9]+)?$").factory("oaFloatRegExp", ["oaFloatPattern", function (oaFloatPattern) {
  return new RegExp(oaFloatPattern);
}]).factory("oaIntRegExp", ["oaIntPattern", function (oaIntPattern) {
  return new RegExp(oaIntPattern);
}]).directive("oaNumeric", ["oaFloatPattern", function (oaFloatPattern) {
  function oaNumericLink($scope, $element, $attrs, $ctrls) {
    var _$ctrls = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls[0],
        $ngModel = _$ctrls[1];

    $ctrl.basis = 0;
    ["min", "max", "step", "basis"].forEach(function (key) {
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
            $ctrl[key] = new Decimal(newValue);
            if (key === "basis") $ctrl.basis = new Decimal(newValue || $ctrl.min || $ctrl.max || 0);
            if (key === "min") $ctrl.basis = new Decimal($ctrl.basis || newValue || $ctrl.max || 0);else if (key === "max") $ctrl.basis = new Decimal($ctrl.basis || $ctrl.min || newValue || 0);
            $ngModel.$validate();
            if (false) console.log({
              key: key,
              ngKey: ngKey,
              ng_key: ng_key,
              expr: expr,
              newValue: newValue,
              spec: $ctrl[key + "Spec"],
              ctrl: $ctrl[key],
              basis: $ctrl.basis
            });
          } else $ctrl[key + "Spec"] = false;
        });
      } else if ($attrs[key]) {
        $ctrl[key + "Spec"] = true;
        try {
          $ctrl[key] = new Decimal($attrs[key]);
          $ngModel.$validate();
          console.log({
            key: key,
            newValue: $attrs[key],
            spec: $ctrl[key + "Spec"],
            success: true
          });
        } catch (err) {
          console.log(err.message);
          console.log(Object.asign({
            key: key,
            newValue: $attrs[key],
            spec: $ctrl[key + "Spec"],
            success: false
          }, err));
        }
      }
    });
    ["required"].forEach(function (key) {
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
        //console.log(expr);
        $scope.$watch(expr, function (oldValue, newValue) {
          $ctrl[key] = newValue;
          if (key === "min") $ctrl.basis = newValue || $ctrl.max || 0;else if (key === "max") $ctrl.basis = $ctrl.min || newValue || 0;
          //console.log($scope[key]);
          $ngModel.$validate();
        });
      } else if ($attrs[key]) $ctrl[key] = $attrs[key];
      //console.log(ngKey);
    });
    $ctrl.name = $attrs.name;
    $ngModel.$validators.oaNumeric = function (modelValue, viewValue) {
      if (!viewValue || !viewValue.length) return true;
      if (!$ctrl.isNumeric(viewValue)) {
        $ctrl.numeric = parseFloat(viewValue);
        return false;
      }
      if (isNaN(modelValue)) return false;
      return true;
    };
    $ngModel.$validators.min = function (modelValue, viewValue) {
      if (!$ctrl.minSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.isNumeric(viewValue)) return true;
      if ($ctrl.min.gt(modelValue)) return false;
      return true;
    };
    $ngModel.$validators.max = function (modelValue, viewValue) {
      if (!$ctrl.maxSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.isNumeric(viewValue)) return true;
      if ($ctrl.max.lt(modelValue)) return false;
      return true;
    };
    $ngModel.$validators.step = function (modelValue, viewValue) {
      if (!$ctrl.stepSpec) return true;
      if (!viewValue || !viewValue.length || !$ctrl.isNumeric(viewValue)) return true;
      var valid = $ctrl.isValidInterval(viewValue);
      if (valid) {
        $ctrl.internalValue = valid.value;
        $ctrl.previous = valid.previous;
        $ctrl.next = valid.next;
        $ctrl.closest = valid.closest;
      }
      return valid && valid.valid;
    };
    $ngModel.$validators.required = function (modelValue, viewValue) {
      if (!$ctrl.requiredSpec) return true;
      if ($ctrl.required && $ctrl.required.length && $ctrl.required !== "false") if (!viewValue || !viewValue.length) return false;
      return true;
    };
  }
  function oaNumericCtrl() {
    this.isNumeric = function isNumeric(str) {
      return str.match(oaFloatPattern);
    };
    this.isValidInterval = function isValidInterval(val) {
      if (val == undefined || !val.toString().length || !this.step) return null;
      val = new Decimal(val);
      var shift = val.sub(this.basis);
      var out = { value: val };
      if (!shift.mod(this.step).equals(0)) {
        out.valid = false;
        out.previous = shift.div(this.step).floor().mul(this.step).add(this.basis);
        out.next = shift.div(this.step).ceil().mul(this.step).add(this.basis);
        out.closest = shift.div(this.step).round().mul(this.step).add(this.basis);
      } else {
        out.valid = true;
        out.previous = val.sub(this.step);
        out.next = val.add(this.step);
        out.closest = val;
      }
      out.pStr = out.previous.toString();
      out.nStr = out.next.toString();
      out.cStr = out.closest.toString();
      if (false) console.log(Object.assign({
        val: val,
        valStr: val.toString(),
        basis: this.basis,
        step: this.step
      }, out));
      return out;
    };
  }
  return {
    restrict: "A",
    require: ["oaNumeric", "ngModel"],
    controller: oaNumericCtrl,
    link: oaNumericLink
  };
}]);
angular.module('oaValidatorsTestApp', ["oaValidators", "ngMessages"]).controller("NumericTestCtrl", function () {
  this.vals = [{
    name: "ValA",
    value: "1.6"
  }, {
    name: "ValB",
    value: "1.23f5"
  }, {
    name: "ValC",
    value: "one"
  }, {
    name: "ValD",
    value: "1.7"
  }, {
    name: "ValE",
    value: "5.2"
  }, {
    name: "ValF",
    value: "-3"
  }];
  this.vals2min = 1.6;
  this.vals3max = 1.8;
  this.vals4step = 0.2;
});
