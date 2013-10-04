define(['vendor/collie', 'models/hit'], function (collie, Hit) {
  var Cat = function (x, y, layer, player) {
    var self = this;

    this.sprites    = {};
    this.animations = {};
    this.player     = player;

    this.displayObject = new collie.DisplayObject({
      x: x,
      y: y,
      width: 30,
      height: 30
    }).addTo(layer);

    this.sprites['sitting'] = new collie.DisplayObject({
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      backgroundImage: 'cat.sitting'
    }).addTo(this.displayObject);

    this.sprites['beingPetted'] = new collie.DisplayObject({
      x: 0,
      y: 0,
      width: 30,
      height: 30,
      visible: false,
      backgroundImage: 'cat.beingPetted'
    }).addTo(this.displayObject);

    this.animations['sitting'] = collie.Timer.cycle(this.sprites['sitting'], 300, {
      from: 0,
      to: 1,
      loop: 0,

      onStart: function () {
        self.sprites['sitting'].set('visible', true);
        self.sprites['beingPetted'].set('visible', false);
      }
    });

    this.animations['beingPetted'] = collie.Timer.cycle(this.sprites['beingPetted'], 300, {
      to: 9,
      loop: 0,
      useAutoStart: false,

      onStart: function () {
        self.sprites['beingPetted'].set('visible', true);
        self.sprites['sitting'].set('visible', false);
      }
    });

    this.bindEvents();
  };

  Cat.prototype.bindEvents = function () {
    var self = this;

    this.displayObject.attach({
      mousedown: function (e) {
        self.animations['sitting'].stop();
        self.animations['beingPetted'].start();
      },

      mouseup: function (e) {
        var worth;

        self.animations['beingPetted'].stop();
        self.animations['sitting'].start();

        worth = self.player.registerClick();
        new Hit(worth, e.x, e.y, self.displayObject.getLayer());
      }
    });
  };

  return Cat;
});
