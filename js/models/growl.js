define(['vendor/collie'], function (collie) {
  var Growl = function (text, layer) {
    var self = this;

    this.displayObject = new collie.Text({
      x: -150,
      y: 'center',
      fontSize: 18,
      width: 150,
      textAlign: 'center',
      fontColor: '#fff'
    }).text(text).addTo(layer);

    // Slide in from the left, pause and zoom in, slide out to the right
    collie.Timer.queue().transition(this.displayObject, 300, {
      from: [-150, 0],
      to: [85, 0.3],
      set: ['x', 'opacity'],
    }).transition(this.displayObject, 700, {
      from: [0.3, 1, 1],
      to: [1, 1.2, 1.2],
      set: ['opacity', 'scaleX', 'scaleY']
    }).transition(this.displayObject, 300, {
      from: [85, 1, 1.2, 1.2],
      to: [470, 0, 1, 1],
      set: ['x', 'opacity', 'scaleX', 'scaleY'],

      onComplete: function () {
        // Self-destruction
        layer.removeChild(self.displayObject);
        self = null;
      }
    });
  };

  return Growl;
});
