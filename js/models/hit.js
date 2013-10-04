define(['vendor/collie'], function (collie) {
  var Hit = function (amount, x, y, layer) {
    var self = this;

    this.displayObject = new collie.Text({
      x: x,
      y: y,
      fontColor: '#fff'
    }).text('+' + amount).addTo(layer);

    collie.Timer.transition(this.displayObject, 1000, {
      from: [y, 1],
      to: [y - 100, 0],
      set: ['y', 'opacity'],

      onComplete: function () {
        // Self-destruction
        layer.removeChild(self.displayObject);
        self = null;
      }
    });
  };

  return Hit;
});
