'use strict';

// oaVectorPicker with tests
var _window = window,
    angular = _window.angular;

angular.module('oaVectorPicker', ['oaUtil', 'oaBlenderInput', 'oaLinearAlgebra']).directive('vectorRect', ['oaRectangular', function (Rect) {
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
