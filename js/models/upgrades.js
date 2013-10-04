define([], function () {
  var Upgrade;

  Upgrade = function (title, price, fn) {
    this.title = title;
    this.price = price;
    this.fn    = fn;
  };

  Upgrade.prototype.activate = function (player) {
    this.fn.apply(this, [player]);
  };

  return {
    'brush': new Upgrade('brush', 100, function (player) {
      // Brush gives the cursor a PPC of 2
      player.set('ppc', Math.max(player.get('ppc'), 2));
    }),

    'bionicLimbs': new Upgrade('bionicLimbs', 2000, function (player) {
      // TODO: Increase power of robohands
    }),
  };
});
