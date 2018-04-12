'use strict';

// oaBlenderView
var _window = window,
    angular = _window.angular;

angular.module('oaBlenderView', ['oaLinearAlgebra', 'oaWebglHelpers']).directive('oaBlenderView3', ['oaWebglCanvas', function (oaWebglCanvas) {
  function oaBlenderView3Ctrl($scope) {
    this.render = function () {};
  }

  function oaBlenderView3Link($scope, $element, $attrs, $ctrl) {
    var canvas = $scope.canvas = new oaWebglCanvas($scope.name, $element[0]);
  }
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'oa-blender-view-3d-template',
    scope: {
      mode: '=',
      elements: '=',
      name: '@',
      camera: '='

    },
    controller: oaBlenderView3Ctrl,
    controllerAs: 'v3',
    link: oaBlenderView3Link
  };
}]);
