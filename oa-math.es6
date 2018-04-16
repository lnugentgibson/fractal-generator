/**
 * OAlpha Math Extension
 */
const {
  angular
} = window;
angular
  .module('oaMath', [])
  .service('oaMath', function() {
    const {
      PI,
      E,
      LOG2E: LGE,
      LN2,
      LN10,
      LOG10E: LOGE,
      SQRT1_2,
      SQRT2,
      
      log2: lg,
      log: ln,
      log10: log,
      sqrt
    } = Math;
    
    Math.LGE = LGE;
    const LG10 = Math.LG10 = LN10 / LN2;
    const LOG2 = Math.LOG2 = LN2 / LN10;
    Math.LOGE = LOGE;
    //const π = Math.π = PI; // 227
    //const φ = Math.φ = Math.PHI = Math.GOLDENRATIO = (1 + sqrt(5)) / 2; // 237
    //const δ = Math.δ = Math.DELTA = Math.SILVERRATIO = 1 + SQRT2; // 235
    const PHI = Math.PHI = Math.GOLDENRATIO = (1 + sqrt(5)) / 2; // 237
    const DELTA = Math.DELTA = Math.SILVERRATIO = 1 + SQRT2; // 235
    
    Math.lg = lg;
    Math.ln = ln;
    Math.log = log;
    
    return Math;
  });