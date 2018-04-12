// oaMesh
const {
  angular
} = window;
  angular.module('oaMesh', ['oaSylvester', 'oaUtil'])
    .factory('oaMesh', ['oaSylvester', 'oaIndexProvider', function(oaSylvester, oaIndexProvider) {
      function oaMesh(_options) {
        var options = Object.assign({
          elementSize: 4,
          initialSize: 4 * 4 * 64,
          growthFactor: 0,
          growthIncrement: 4 * 4 * 64,
          growOnFull: false,
          maximumSize: 0
        }, _options);
        var buffer = new ArrayBuffer(options.initialSize);
        var index = [],
          bufferIndicies = new oaIndexProvider(options.initialSize / (4 * options.elementSize)),
          ids = new oaIndexProvider(-1);
        var vertices = [],
          edges = [],
          faces = [];
        this.addVertex = function(v) {
          if (!bufferIndicies.capacity) {
            if (options.maximumSize && buffer.byteLength >= options.maximumSize)
              throw 'maximum size reached';
            this.grow();
          }
          var i = bufferIndicies.requestIndex();
          var id = ids.requestIndex();
          index[id] = i;
          var vect = vertices[id] = oaSylvester.$V(buffer, options.elementSize, 4 * i * options.elementSize, 4 * options.elementSize);
          vect.setElements(v);
          return vect;
        };
      }

      return oaMesh;
    }]);