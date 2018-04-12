// oaLinearAlgebra with tests
const {
  angular
} = window;
  angular
    .module('oaLinearAlgebra', ['oaUtil'])
    .factory('oaVect', function() {
      function oaVect(_getters, _setters, _length) {
        var length = _length == undefined ? this.length : _length;
        var getters =
          _getters && _length != undefined ?
          _getters :
          (() => {
            var arr = [];
            for (var i = 0; i < length; i++)
              arr[i] = (j => {
                return () => this[j];
              })(i);
            return arr;
          })();
        var setters =
          _setters && _length != undefined ?
          _setters :
          (() => {
            var arr = [];
            for (var i = 0; i < length; i++)
              arr[i] = (j => {
                return v => {
                  this[j] = v;
                };
              })(i);
            return arr;
          })();
        this.add = b => {
          if (b.length != length) throw 'invalid vector';
          for (var i = 0; i < length; i++) setters[i](getters[i] + b[i]);
        };
      }

      return oaVect;
    })
    .factory('oaRectangular', [
      'oaArrayObject',
      'oaObjectArray',
      function(oaArrayObject, oaObjectArray) {
        function oaRectangular(arr, offset, skip) {
          var keys = ['x', 'y'];
          var setter = v => {
            var o = parseFloat(v);
            if (isNaN(o)) return 0;
            return o;
          };
          oaObjectArray.call(this, arr, keys, 2, null, [setter, setter], {
            offset,
            skip
          });
          Object.defineProperties(this, {
            t: {
              get: () => `rectangular`
            },
            d: {
              get: () => 2
            },
            modulus: {
              get: () => Math.sqrt(this.reduce((a, c) => a + c * c, 0)),
              set: v => {
                var m = this.modulus;
                this.scale(m != 0 && v != 0 ? v / m : 0);
              }
            },
            argument: {
              get: () => Math.atan2(y, x),
              set: v => {
                var r = v - this.argument;
                var c = Math.cos(r),
                  s = Math.sin(r);
                var t = c * x - s * y;
                y = s * x + c * y;
                x = t;
              }
            }
          });
          oaArrayObject.call(this, this, keys, 2);
          keys.forEach(k1 => {
            keys.forEach(k2 => {
              Object.defineProperty(this, [k1, k2].join(''), {
                get: () => new oaRectangular([k1, k2].map(k => this[k])),
                set: v => {
                  if (v.t !== 'rectangular')
                    throw `argument must be rectangular vector`;
                  [k1, k2].forEach((k, i) => {
                    this[k] = v[i];
                  });
                }
              });
            });
          });
          this.setArray(arr);
          this.add = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c + b[i];
            });
            return this;
          };
          this.sum = b => new oaRectangular(this).add(b);
          this.minus = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c - b[i];
            });
            return this;
          };
          this.difference = b => new oaRectangular(this).minus(b);
          this.scale = s => {
            this.forEach((c, i) => {
              this[i] = c * s;
            });
            return this;
          };
          this.scaled = b => new oaRectangular(this).scale(b);
          this.dot = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            return this.reduce((d, c, i) => d + c * b[i], 0);
          };
        }

        oaRectangular.sum = function(a, b) {
          return new oaRectangular(a).add(b);
        };
        oaRectangular.difference = function(a, b) {
          return new oaRectangular(a).minus(b);
        };
        oaRectangular.scaled = function(a, b) {
          return new oaRectangular(a).scale(b);
        };
        oaRectangular.dot = function(a, b) {
          return new oaRectangular(a).dot(b);
        };

        return oaRectangular;
      }
    ])
    .factory('oaPolar', [
      'oaArrayObject',
      function(oaArrayObject) {
        function Polar(_r, _a) {
          var r = parseFloat(_r);
          var a = parseFloat(_a);
          Object.defineProperties(this, {
            t: {
              get: () => `rect`
            },
            d: {
              get: () => 2
            },
            length: {
              get: () => 2
            },
            x: {
              get: () => x,
              set: v => {
                x = parseFloat(v);
              }
            },
            0: {
              get: () => x,
              set: v => {
                x = parseFloat(v);
              }
            },
            y: {
              get: () => y,
              set: v => {
                y = parseFloat(v);
              }
            },
            1: {
              get: () => y,
              set: v => {
                y = parseFloat(v);
              }
            }
          });
          this.forEach = function(func, thisArg) {
            func.call(thisArg, x, 0, [x, y]);
            func.call(thisArg, y, 1, [x, y]);
          };
          this.map = function(func, thisArg) {
            return [
              func.call(thisArg, x, 0, [x, y]),
              func.call(thisArg, y, 1, [x, y])
            ];
          };
          this.reduce = function(func, initial) {
            return func.call(null, func.call(null, initial, x, 0, [x, y]), y, 1, [
              x,
              y
            ]);
          };
          this.reduceRight = function(func, initial) {
            return func.call(null, func.call(null, initial, y, 0, [x, y]), x, 1, [
              x,
              y
            ]);
          };
          this.every = function(func, thisArg) {
            return (
              func.call(thisArg, x, 0, [x, y]) && func.call(thisArg, y, 0, [x, y])
            );
          };
          this.fill = function(val, start, end) {
            if (start == undefined) start = 0;
            if (end == undefined) end = this.length;
            for (var i = 0; i < this.length; i++) this[i] = val;
          };
          this.reverse = function() {
            var t = x;
            x = y;
            y = t;
          };
        }

        return Polar;
      }
    ])
    .factory('oaCartesian', [
      'oaArrayObject',
      'oaObjectArray',
      'oaRectangular',
      function(oaArrayObject, oaObjectArray, oaRectangular) {
        function oaCartesian(arr, offset, skip) {
          var keys = ['x', 'y', 'z'];
          var setter = v => {
            var o = parseFloat(v);
            if (isNaN(o)) return 0;
            return o;
          };
          oaObjectArray.call(this, arr, keys, 3, null, [setter, setter, setter], {
            offset,
            skip
          });
          Object.defineProperties(this, {
            t: {
              get: () => `cartesian`
            },
            d: {
              get: () => 3
            },
            modulus: {
              get: () => Math.sqrt(this.reduce((a, c) => a + c * c, 0)),
              set: v => {
                var m = this.modulus;
                this.scale(m != 0 && v != 0 ? v / m : 0);
              }
            },
            argument: {
              get: () => Math.atan2(y, x),
              set: v => {
                var r = v - this.argument;
                var c = Math.cos(r),
                  s = Math.sin(r);
                var t = c * x - s * y;
                y = s * x + c * y;
                x = t;
              }
            }
          });
          oaArrayObject.call(this, this, keys, 3);
          keys.forEach(k1 => {
            keys.forEach(k2 => {
              Object.defineProperty(this, [k1, k2].join(''), {
                get: () => new oaRectangular([k1, k2].map(k => this[k])),
                set: v => {
                  if (v.t !== 'rectangular')
                    throw `argument must be rectangular vector`;
                  [k1, k2].forEach((k, i) => {
                    this[k] = v[i];
                  });
                }
              });
              keys.forEach(k3 => {
                Object.defineProperty(this, [k1, k2, k3].join(''), {
                  get: () => new oaCartesian([k1, k2, k3].map(k => this[k])),
                  set: v => {
                    if (v.t !== 'cartesian')
                      throw `argument must be cartesian vector`;
                    [k1, k2, k3].forEach((k, i) => {
                      this[k] = v[i];
                    });
                  }
                });
              });
            });
          });
          this.setArray(arr);
          this.add = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c + b[i];
            });
            return this;
          };
          this.sum = b => new oaCartesian(this).add(b);
          this.minus = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c - b[i];
            });
            return this;
          };
          this.difference = b => new oaCartesian(this).minus(b);
          this.scale = s => {
            this.forEach((c, i) => {
              this[i] = c * s;
            });
            return this;
          };
          this.scaled = b => new oaCartesian(this).scale(b);
          this.dot = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            return this.reduce((d, c, i) => d + c * b[i], 0);
          };
        }

        oaCartesian.sum = function(a, b) {
          return new oaCartesian(a).add(b);
        };
        oaCartesian.difference = function(a, b) {
          return new oaCartesian(a).minus(b);
        };
        oaCartesian.scaled = function(a, b) {
          return new oaCartesian(a).scale(b);
        };
        oaCartesian.dot = function(a, b) {
          return new oaCartesian(a).dot(b);
        };

        return oaCartesian;
      }
    ])
    .factory('oaCylindrical', function() {
      function Cylindrical(r, a, z) {}

      return Cylindrical;
    })
    .factory('oaSpherical', function() {
      function Spherical(r, a, b) {}

      return Spherical;
    })
    .factory('oaHomogeneous', [
      'oaArrayObject',
      'oaObjectArray',
      'oaCartesian',
      'oaRectangular',
      function(oaArrayObject, oaObjectArray, oaCartesian, oaRectangular) {
        function oaHomogeneous(arr, offset, skip) {
          var keys = ['x', 'y', 'z', 'w'];
          var setter = v => {
            var o = parseFloat(v);
            if (isNaN(o)) return 0;
            return o;
          };
          oaObjectArray.call(
            this,
            arr,
            keys,
            3,
            null, [setter, setter, setter, setter], {
              offset,
              skip
            }
          );
          Object.defineProperties(this, {
            t: {
              get: () => `homogeneous`
            },
            d: {
              get: () => 4
            },
            modulus: {
              get: () => Math.sqrt(this.reduce((a, c) => a + c * c, 0)),
              set: v => {
                var m = this.modulus;
                this.scale(m != 0 && v != 0 ? v / m : 0);
              }
            },
            argument: {
              get: () => Math.atan2(y, x),
              set: v => {
                var r = v - this.argument;
                var c = Math.cos(r),
                  s = Math.sin(r);
                var t = c * x - s * y;
                y = s * x + c * y;
                x = t;
              }
            }
          });
          oaArrayObject.call(this, this, keys, 4);
          keys.forEach(k1 => {
            keys.forEach(k2 => {
              Object.defineProperty(this, [k1, k2].join(''), {
                get: () => new oaRectangular([k1, k2].map(k => this[k])),
                set: v => {
                  if (v.t !== 'rectangular')
                    throw `argument must be rectangular vector`;
                  [k1, k2].forEach((k, i) => {
                    this[k] = v[i];
                  });
                }
              });
              keys.forEach(k3 => {
                Object.defineProperty(this, [k1, k2, k3].join(''), {
                  get: () => new oaCartesian([k1, k2, k3].map(k => this[k])),
                  set: v => {
                    if (v.t !== 'cartesian')
                      throw `argument must be cartesian vector`;
                    [k1, k2, k3].forEach((k, i) => {
                      this[k] = v[i];
                    });
                  }
                });
                keys.forEach(k4 => {
                  Object.defineProperty(this, [k1, k2, k3, k4].join(''), {
                    get: () =>
                      new oaHomogeneous([k1, k2, k3, k4].map(k => this[k])),
                    set: v => {
                      if (v.t !== 'cartesian')
                        throw `argument must be homogeneous vector`;
                      [k1, k2, k3, k4].forEach((k, i) => {
                        this[k] = v[i];
                      });
                    }
                  });
                });
              });
            });
          });
          this.setArray(arr);
          this.add = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c + b[i];
            });
            return this;
          };
          this.sum = b => new oaHomogeneous(this).add(b);
          this.minus = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            this.forEach((c, i) => {
              this[i] = c - b[i];
            });
            return this;
          };
          this.difference = b => new oaHomogeneous(this).minus(b);
          this.scale = s => {
            this.forEach((c, i) => {
              this[i] = c * s;
            });
            return this;
          };
          this.scaled = b => new oaHomogeneous(this).scale(b);
          this.dot = b => {
            if (b.t !== this.t) throw `argument must be ${this.t} vector`;
            return this.reduce((d, c, i) => d + c * b[i], 0);
          };
        }

        oaHomogeneous.sum = function(a, b) {
          return new oaHomogeneous(a).add(b);
        };
        oaHomogeneous.difference = function(a, b) {
          return new oaHomogeneous(a).minus(b);
        };
        oaHomogeneous.scaled = function(a, b) {
          return new oaHomogeneous(a).scale(b);
        };
        oaHomogeneous.dot = function(a, b) {
          return new oaHomogeneous(a).dot(b);
        };

        return oaHomogeneous;
      }
    ]);