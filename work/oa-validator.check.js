'use strict';

// oaValidators with tests
var _window = window,
    angular = _window.angular;

angular.module('oaValidatorsTestApp', ['oaValidators', 'ngMessages']).controller('NumericTestCtrl', function () {
  this.vals = [{
    name: 'ValA',
    value: '1.6'
  }, {
    name: 'ValB',
    value: '1.73f5'
  }, {
    name: 'ValC',
    value: 'one'
  }, {
    name: 'ValD',
    value: '1.7'
  }, {
    name: 'ValE',
    value: '5.2'
  }, {
    name: 'ValF',
    value: '-3'
  }];
  this.vals2min = 1.6;
  this.vals3max = 1.8;
  this.vals4step = 0.008;
  //this.vals4step = 0.04;
});
