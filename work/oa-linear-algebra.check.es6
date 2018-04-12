// oaLinearAlgebra with tests
const {
  angular
} = window;
  angular
    .module('oaLinearAlgebraTestApp', ['oaLinearAlgebra'])
    .controller('RectTestCtrl', [
      '$scope',
      'oaRectangular',
      'oaPolar',
      'oaCartesian',
      'oaCylindrical',
      'oaSpherical',
      'oaHomogeneous',
      function(
        $scope,
        oaRectangular,
        oaPolar,
        oaCartesian,
        oaCylindrical,
        oaSpherical,
        oaHomogeneous
      ) {
        $scope.rect1 = new oaRectangular([2.5, 3.7]);
        $scope.rect2 = new oaRectangular([5.4, 6.8]);
        $scope.rectScale = 1.3;
        $scope.cart1 = new oaCartesian([7.2, 9.1, 1.3]);
        $scope.cart2 = new oaCartesian([6.7, 8.2, -1.4]);
        $scope.cartScale = 2.4;
        $scope.homg1 = new oaHomogeneous([1.2, 3.7, 2.8, 1.1]);
        $scope.homg2 = new oaHomogeneous([0.9, 1.8, 3.5, 2.7]);
        $scope.homgScale = 0.6;
        $scope.update = () => {
          $scope.rect3 = oaRectangular.sum($scope.rect1, $scope.rect2);
          $scope.rect4 = $scope.rect1.difference($scope.rect2);
          $scope.rectDot = $scope.rect1.dot($scope.rect2);

          $scope.cart3 = oaCartesian.sum($scope.cart1, $scope.cart2);
          $scope.cart4 = $scope.cart1.difference($scope.cart2);
          $scope.cartDot = $scope.cart1.dot($scope.cart2);

          $scope.homg3 = oaHomogeneous.sum($scope.homg1, $scope.homg2);
          $scope.homg4 = $scope.homg1.difference($scope.homg2);
          $scope.homgDot = $scope.homg1.dot($scope.homg2);
        };
        $scope.update();
      }
    ]);