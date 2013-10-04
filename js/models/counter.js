define(['vendor/collie', 'helpers'], function (collie, helpers) {
  var Counter = function (x, y, layer, master, property) {
    var self = this;

    // Initital value from master property
    this.value = master[property] || 0;

    this.displayObject = new collie.Text({
      x: x,
      y: y,
      width: 320,
      textAlign: 'center',
      fontSize: 30,
      fontColor: '#fff'
    }).text(helpers.numberFormat(this.value)).addTo(layer);

    // Observe master's property for changes
    master.observe(property, function (value) {
      self.update(value);
    });
  };

  Counter.prototype.update = function (value) {
    this.value = value;
    this.displayObject.text(helpers.numberFormat(this.value));
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
