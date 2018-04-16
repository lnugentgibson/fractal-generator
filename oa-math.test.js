'use strict';

var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var _require = require('./test-helpers'),
    inject = _require.inject,
    ngModule = _require.ngModule;

// Loads the module we want to test


require('./oa-math');

describe('oaMath module', function () {
  beforeEach(ngModule('oaMath'));
  describe('oaMath service', function () {
    var $oaMath;

    beforeEach(inject(function (oaMath) {
      $oaMath = oaMath;
    }));

    var properties = {
      LGE: function LGE() {
        return $oaMath.log(Math.E) / $oaMath.log(2);
      },
      LOGE: function LOGE() {
        return $oaMath.log(Math.E) / $oaMath.log(10);
      },
      LG10: function LG10() {
        return $oaMath.log(10) / $oaMath.log(2);
      },
      LOG2: function LOG2() {
        return $oaMath.log(2) / $oaMath.log(10);
      }
    };

    Object.keys(properties).forEach(function (property) {
      var value;
      var precision = 0.000001;

      beforeEach(function () {
        value = properties[property]();
      });

      describe(property + ' property', function () {
        it('should be defined', function () {
          assert.isDefined($oaMath[property], 'oaMath.' + property + ' not defined');
        });

        it('should equal ' + value, function () {
          assert(Math.abs($oaMath[property] - value) < precision, 'oaMath.' + property + ' should equal ' + value);
        });
      });
    });
  });
});
