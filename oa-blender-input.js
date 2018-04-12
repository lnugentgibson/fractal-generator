'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// oaBlenderInput with tests
var _window = window,
    angular = _window.angular,
    $ = _window.$;

angular.module('oaBlenderInput', ['oaValidators']).constant('ConfigStates', ['none', 'edit', 'down', 'drag', 'fromdrag']).service('oaBlenderInputDocumentState', ['ConfigStates', function (ConfigStates) {
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
      var $field = $element.find('.oa-bnumber-field');
      update($event);
      number.prevstate = number.state;
      if (number.state !== 'drag' && number.state !== 'fromdrag') {
        number.state = 'edit';
        $element.addClass('oa-edit-mode');
        $field.select();
        $field.focus();
      }
      if (number.state === 'fromdrag') number.state = 'none';
      stateDebug('click', number);
    };
    this.overlayDown = function ($element, number, $event) {
      var $ngModel = $element.controller('ng-model');
      update($event);
      number.prevstate = number.state;
      number.state = 'down';
      $target = $element;
      $targetNumber = number;
      number.float = number.value;
      stateDebug('down', number);
    };
    this.documentUp = function ($event) {
      if (!$target) return;
      $targetNumber.prevstate = $targetNumber.state;
      update($event);
      $targetNumber.state = $targetNumber.state === 'drag' ? 'fromdrag' : 'none';
      stateDebug('up', $targetNumber);
    };
    this.documentMove = function ($event) {
      if (!$target) return;
      var $field = $target.find('.oa-bnumber-field');
      var $ngModel = $field.controller('ng-model');
      $targetNumber.prevstate = $targetNumber.state;
      update($event);
      if (false) console.log(dt);
      if ($targetNumber.state === 'down' && dt > 100) $targetNumber.state = 'drag';
      if ($targetNumber.state === 'drag') {
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
      var $field = $element.find('.oa-bnumber-field');
      update($event);
      number.prevstate = number.state;
      $element.removeClass('oa-edit-mode');
      number.state = 'none';
      //console.log('blur');
      //console.log($ngModelInner.$error);
      number.ensureValid();
      stateDebug('blur', number);
    };
    this.decrement = function ($element, number, $event) {
      $event.preventDefault();
      var $field = $element.find('.oa-bnumber-field');
      update($event);
      number.prevstate = number.state;
      number.decrement();
      stateDebug('dec', number);
    };
    this.increment = function ($element, number, $event) {
      $event.preventDefault();
      var $field = $element.find('.oa-bnumber-field');
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
}]).factory('oaNumberElement', ['ConfigStates', 'oaNumber', function (ConfigStates, oaNumber) {
  function FieldConfig($scope, index) {
    var This = this;
    oaNumber.call(This, $scope, index);
    This.sourceProperty(This, $scope, 'previousstate', null, function (v) {
      return ConfigStates[v];
    }, function (v) {
      return ConfigStates.indexOf(v);
    });
    This.sourceProperty(This, $scope, 'state', null, function (v) {
      return ConfigStates[v];
    }, function (v) {
      return ConfigStates.indexOf(v);
    });
    This.state = 'none';
    This.numberProperty(This, $scope, 'speed');
    This.speed = 1;
    This.genProperty(This, $scope, 'label');
    This.genProperty(This, $scope, 'fieldname');
    This.numberProperty(This, $scope, 'float');
  }

  return FieldConfig;
}]).directive('oaBnumberset', ['oaBlenderInputDocumentState', 'oaNumberElement', function (oaBlenderInputDocumentState, oaNumberElement) {
  function oaBnumberSetCtrl() {}

  function oaBnumberSetLink($scope, $element, $attrs, $ctrls) {
    var i;

    var _$ctrls = _slicedToArray($ctrls, 2),
        $ctrl = _$ctrls[0],
        $ngModel = _$ctrls[1];

    $scope.state = 'none';
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
              f: 'watch(\'values\')',
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
    templateUrl: 'oa-bnumberset-template',
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
    restrict: 'E',
    require: ['oaBnumberset', 'ngModel'],
    replace: true,
    controllerAs: 'ib',
    controller: oaBnumberSetCtrl,
    link: oaBnumberSetLink
  };
}]);
