define(['vendor/collie'], function (collie) {
  var instance = null;

  var Game = function () {
    this.layers = {};
  };

  Game.prototype.addLayer = function (key, layer) {
    this.layers[key] = layer;
  };

  Game.prototype.getLayer = function (key) {
    return this.layers[key];
  };

  Game.prototype.popLayer = function (key) {
    delete this.layers[key];
  };

  // Fire a callback for each layer (this is kind of like Array.prototype.forEach,
  // except this.layers is an object)
  Game.prototype.eachLayer = function (fn) {
    for (key in this.layers) {
      if (this.layers.hasOwnProperty(key)) {
        fn.apply(this, [this.layers[key]]);
      }
    }
  };

  // This is a singleton
  return function () {
    if (instance === null) {
      instance = new Game();
    }

    return instance;
  }();
});
