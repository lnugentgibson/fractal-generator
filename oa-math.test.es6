var sinon = require('sinon');
var chai = require('chai');
const { assert } = chai;
const {
  inject,
  ngModule
} = require('./test-helpers');

// Loads the module we want to test
require('./oa-math');

describe('oaMath module', function() {
  beforeEach(ngModule('oaMath'));
  describe('oaMath service', function() {
    var $oaMath;

    beforeEach(inject(oaMath => {
      $oaMath = oaMath;
    }));

    var properties = {
      LGE: () => $oaMath.log(Math.E) / $oaMath.log(2),
      LOGE: () => $oaMath.log(Math.E) / $oaMath.log(10),
      LG10: () => $oaMath.log(10) / $oaMath.log(2),
      LOG2: () => $oaMath.log(2) / $oaMath.log(10)
    };
    
    Object.keys(properties).forEach(function(property) {
      var value;
      var precision = 0.000001;

      beforeEach(() => {
        value = properties[property]();
      });
      
      describe(`${property} property`, () => {
        it('should be defined', () => {
          assert.isDefined($oaMath[property], `oaMath.${property} not defined`);
        });
  
        it(`should equal ${value}`, () => {
          assert(Math.abs($oaMath[property] -  value) < precision, `oaMath.${property} should equal ${value}`);
        });
      });
    });
  });
});
