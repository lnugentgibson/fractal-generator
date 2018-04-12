'use strict';

// oaSylvester
var _window = window,
    angular = _window.angular;

angular.module('oaSylvesterTestApp', ['oaSylvester']).controller('oaSylvesterTestCtrl', ['$scope', 'oaSylvester', function ($scope, oaSylvester) {
  $scope.vectors = [{
    name: 'a',
    vector: oaSylvester.$V([3, 4, 5])
  }, {
    name: 'b',
    vector: oaSylvester.$V([9, 8, 7])
  }, {
    name: 'a + b'
  }, {
    name: 'a - b'
  }, {
    name: 'a x b'
  }];
  $scope.update = function () {
    $scope.vectors[2].vector = $scope.vectors[0].vector.s($scope.vectors[1].vector);
    $scope.vectors[3].vector = $scope.vectors[0].vector.d($scope.vectors[1].vector);
    $scope.vectors[4].vector = $scope.vectors[0].vector.cross($scope.vectors[1].vector);
  };
  $scope.update();
}]);
