define(['vendor/collie'], function (collie) {
  var Growl = function (text, layer) {
    var self = this;

    this.displayObject = new collie.Text({
      x: -150,
      y: 'center',
      fontSize: 20,
      width: 150,
      textAlign: 'center',
      fontColor: '#fff'
    }).text(text).addTo(layer);

    collie.Timer.queue().transition(this.displayObject, 300, {
      from: [-150, 0],
      to: [85, 0.3],
      set: ['x', 'opacity'],
    }).transition(this.displayObject, 500, {
      from: [0.3, 20],
      to: [1, 22],
      set: ['opacity', 'fontSize']
    }).transition(this.displayObject, 300, {
      from: [85, 1, 22],
      to: [470, 0, 20],
      set: ['x', 'opacity', 'fontSize'],

      onComplete: function () {
        layer.removeChild(self.displayObject);
        self = null;
      }
    });
  };

  return Growl;
});
