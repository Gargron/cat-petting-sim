define(['vendor/collie', 'helpers'], function (collie, helpers) {
  var Counter = function (x, y, layer, master, property, text, fontSize) {
    var self = this;

    // Initital value from master property
    this.value = master[property] || 0;
    this.text  = text;

    this.displayObject = new collie.Text({
      x: x,
      y: y,
      width: 320,
      textAlign: 'center',
      fontSize: fontSize || 30,
      fontColor: '#fff'
    }).text(helpers.numberFormat(this.value) + (text || '')).addTo(layer);

    // Observe master's property for changes
    master.observe(property, function (value) {
      self.update(value);
    });
  };

  Counter.prototype.update = function (value) {
    this.value = value;
    this.displayObject.text(helpers.numberFormat(this.value) + (this.text || ''));
  };

  Counter.prototype.increment = function (by) {
    if (typeof by === 'number') {
      this.update(this.value + by);
    } else {
      this.update(this.value + 1);
    }
  };

  return Counter;
});
