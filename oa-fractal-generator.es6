// oaFractalGenerator
const {
  angular
} = window;
  angular
    .module('oaFractalGenerator', ['oaVectorPicker'])
    .controller('Ctrl', function($scope) {
      $scope.showHeader = false;
      $scope.showTopMenu = false;
      $scope.showSideMenu = false;
      const Ctrl = this;
      Ctrl.distanceFunctions = [{
          name: 'spherical',
          label: 'Sphere',
          type: 'shape',
          size: 'Radius',
          generator: () => {}
        },
        {
          name: 'icoscahedral',
          label: 'Icoscahedron',
          type: 'shape',
          size: 'Radius',
          generator: () => {}
        },
        {
          name: 'recursiveTetrahedral',
          label: 'Recursive Tetrahedron',
          type: 'sierpinski',
          size: 'Radius',
          generator: () => {}
        },
        {
          name: 'recursiveOctahedral',
          label: 'Recursive Octahedron',
          type: 'sierpinski',
          size: 'Radius',
          generator: () => {}
        },
        {
          name: 'recursiveIcoscahedral',
          label: 'Recursive Icoscahedron',
          type: 'sierpinski',
          size: 'Radius',
          generator: () => {}
        }
      ];
      Ctrl.distanceFunctionNames = {};
      Ctrl.distanceFunctions.forEach((de, i) => {
        Ctrl.distanceFunctionNames[de.name] = i;
      });
      Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['recursiveIcoscahedral'];
      //Ctrl.distanceFunctionIndex = Ctrl.distanceFunctionNames['spherical'];
      Ctrl.distanceFunction = Ctrl.distanceFunctions[Ctrl.distanceFunctionIndex];
      Ctrl.size = 0.5;
      var spinSlide = (prop, initial, min, max, step, page, spin, slide) => {
        Ctrl[prop] = initial;
        $(`#input-${prop}-spinner`).spinner({
          min: Array.isArray(min) ? min[0] : min,
          max: Array.isArray(max) ? max[0] : max,
          step: Array.isArray(step) ? step[0] : step,
          page,
          spin: (event, ui) => {
            Ctrl[prop] = spin ? spin.set(ui.value) : ui.value;
            var slideVal = $(`#input-${prop}-slider`).slider('value');
            var diff = (slide ? slide.set(slideVal) : slideVal) - Ctrl[prop];
            if (diff)
              $(`#input-${prop}-slider`).slider('value', slide ? slide.get(Ctrl[prop]) : Ctrl[prop]);
          }
        });
        $(`#input-${prop}-slider`).slider({
          min: Array.isArray(min) ? min[1] : min,
          max: Array.isArray(max) ? max[1] : max,
          step: Array.isArray(step) ? step[1] : step,
          value: slide ? slide.get(Ctrl[prop]) : Ctrl[prop],
          slide: (event, ui) => {
            Ctrl[prop] = slide ? slide.set(ui.value) : ui.value;
            var spinVal = $(`#input-${prop}-spinner`).spinner('value');
            var diff = (slide ? slide.set(spinVal) : spinVal) - Ctrl[prop];
            if (diff)
              $(`#input-${prop}-spinner`).spinner('value', Ctrl[prop]);
          }
        });
        $(`#input-${prop}-spinner`).spinner('value', spin ? spin.get(Ctrl[prop]) : Ctrl[prop]);
      };
      spinSlide('size', 1, [0.1, 0], [10000, 1000], [0.001, 1], 3, {
        get: r => r,
        set: v => v
      }, {
        get: r => Math.round(200 * (1 + Math.log(r) / Math.log10)),
        set: v => parseFloat(Math.pow(10, v / 200.0 - 1).toFixed(3), 10)
      });
      spinSlide('scale', 2, 2, 20, 1, 3);
      spinSlide('iterations', 13, 2, 50, 1, 6);
    });