'use strict';

Math.log10 = Math.log(10);
$(function () {
  $('#app-menu').tabs();
  $('.app-menu-accordion').accordion({
    header: 'header',
    collapsible: true
  });
  //$('input[type=spinner]').spinner();
  /*
  $('[type=slider]').slider();
  $('#input-size-slider').slider('option', {
    min: 0.1,
    max: 1000,
    step: 1
  });
  */
});
angular.module('fractalGenerator', []).controller('Ctrl', function ($scope) {
  var Ctrl = this;
  Ctrl.distanceFunctions = [{
    name: 'spherical',
    label: 'Sphere',
    type: 'shape',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'icoscahedral',
    label: 'Icoscahedron',
    type: 'shape',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveTetrahedral',
    label: 'Recursive Tetrahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveOctahedral',
    label: 'Recursive Octahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }, {
    name: 'recursiveIcoscahedral',
    label: 'Recursive Icoscahedron',
    type: 'sierpinski',
    size: 'Radius',
    generator: function generator() {}
  }];
  Ctrl.distanceFunctionNames = {};
  Ctrl.distanceFunctions.forEach(function (de, i) {
    Ctrl.distanceFunctionNames[de.name] = i;
  });
  Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['recursiveIcoscahedral'];
  //Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['spherical'];
  Ctrl.distanceFunction = Ctrl.distanceFunctions[Ctrl.distanceFunctionIndex];
  Ctrl.size = 0.5;
  var spinSlide = function spinSlide(prop, initial, min, max, step, page, _spin, _slide) {
    Ctrl[prop] = initial;
    $('#input-' + prop + '-spinner').spinner({
      min: Array.isArray(min) ? min[0] : min,
      max: Array.isArray(max) ? max[0] : max,
      step: Array.isArray(step) ? step[0] : step,
      page: page,
      spin: function spin(event, ui) {
        Ctrl[prop] = _spin ? _spin.set(ui.value) : ui.value;
        var slideVal = $('#input-' + prop + '-slider').slider('value');
        var diff = (_slide ? _slide.set(slideVal) : slideVal) - Ctrl[prop];
        if (diff) $('#input-' + prop + '-slider').slider('value', _slide ? _slide.get(Ctrl[prop]) : Ctrl[prop]);
      }
    });
    $('#input-' + prop + '-slider').slider({
      min: Array.isArray(min) ? min[1] : min,
      max: Array.isArray(max) ? max[1] : max,
      step: Array.isArray(step) ? step[1] : step,
      value: _slide ? _slide.get(Ctrl[prop]) : Ctrl[prop],
      slide: function slide(event, ui) {
        Ctrl[prop] = _slide ? _slide.set(ui.value) : ui.value;
        var spinVal = $('#input-' + prop + '-spinner').spinner('value');
        var diff = (_slide ? _slide.set(spinVal) : spinVal) - Ctrl[prop];
        if (diff) $('#input-' + prop + '-spinner').spinner('value', Ctrl[prop]);
      }
    });
    $('#input-' + prop + '-spinner').spinner('value', _spin ? _spin.get(Ctrl[prop]) : Ctrl[prop]);
  };
  spinSlide('size', 1, [0.1, 0], [10000, 1000], [0.001, 1], 3, {
    get: function get(r) {
      return r;
    },
    set: function set(v) {
      return v;
    }
  }, {
    get: function get(r) {
      return Math.round(200 * (1 + Math.log(r) / Math.log10));
    },
    set: function set(v) {
      return parseFloat(Math.pow(10, v / 200.0 - 1).toFixed(3), 10);
    }
  });
  spinSlide('scale', 2, 2, 20, 1, 3);
  spinSlide('iterations', 13, 2, 50, 1, 6);
});
