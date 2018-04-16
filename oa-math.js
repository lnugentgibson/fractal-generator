'use strict';

/**
 * OAlpha Math Extension
 */
var _window = window,
    angular = _window.angular;

angular.module('oaMath', []).service('oaMath', function () {
  var PI = Math.PI,
      E = Math.E,
      LGE = Math.LOG2E,
      LN2 = Math.LN2,
      LN10 = Math.LN10,
      LOGE = Math.LOG10E,
      SQRT1_2 = Math.SQRT1_2,
      SQRT2 = Math.SQRT2,
      lg = Math.log2,
      ln = Math.log,
      log = Math.log10,
      sqrt = Math.sqrt;


  Math.LGE = LGE;
  var LG10 = Math.LG10 = LN10 / LN2;
  var LOG2 = Math.LOG2 = LN2 / LN10;
  Math.LOGE = LOGE;
  //const π = Math.π = PI; // 227
  //const φ = Math.φ = Math.PHI = Math.GOLDENRATIO = (1 + sqrt(5)) / 2; // 237
  //const δ = Math.δ = Math.DELTA = Math.SILVERRATIO = 1 + SQRT2; // 235
  var PHI = Math.PHI = Math.GOLDENRATIO = (1 + sqrt(5)) / 2; // 237
  var DELTA = Math.DELTA = Math.SILVERRATIO = 1 + SQRT2; // 235

  Math.lg = lg;
  Math.ln = ln;
  Math.log = log;

  return Math;
});
