'use strict';

// oaVectorPicker with tests
var _window = window,
    angular = _window.angular;

angular.module('oaVectorPickerTestApp', ['oaVectorPicker', 'ngMessages']).controller('vectorPickerTestCtrl', ['oaRectangular', 'oaPolar', 'oaCartesian', 'oaCylindrical', 'oaSpherical', 'oaHomogeneous', function (oaRectangular, oaPolar, oaCartesian, oaCylindrical, oaSpherical, oaHomogeneous) {
  this.rect1src = [2.5, 3.7];
  this.rect1 = new oaRectangular(this.rect1src);
}]);
