const {
  angular,
} = window;
  angular
    .module('oaBlenderInputTestApp', ['oaBlenderInput', 'ngMessages'])
    .controller('NumbersetTestCtrl', function() {
      this.num1 = 0.012;
      this.num2 = 0.887;
      this.nums = [0.3, 0.4, 0.5];
      this.names = ['numX', 'numY', 'numZ'];
      this.labels = ['X', 'Y', 'Z'];
    });