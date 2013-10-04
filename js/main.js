requirejs.config({
  shim: {
    'vendor/collie': {
      exports: 'collie'
    },

    'vendor/underscore': {
      exports: '_'
    }
  }
});

require(['vendor/collie', 'models/game', 'models/ground', 'models/cat', 'models/counter', 'models/player', 'helpers'], function (collie, game, Ground, Cat, Counter, Player, helpers) {
  var player, cat, ground, counter;

  collie.ImageManager.addImages({
    'cat.sitting': 'img/pixelcat-sitting-sprite.png',
    'cat.beingPetted': 'img/pixelcat-being-petted-sprite.png'
  });

  // This shall be the cat layer
  game.addLayer(0, new collie.Layer({
    width: 320,
    height: 480
  }));

  // And this the HUD layer for notifications et al
  game.addLayer(1, new collie.Layer({
    width: 320,
    height: 480
  }));

  // Let's setup our actors
  player  = new Player();
  ground  = new Ground(0, 0, 320, 480, game.getLayer(0));
  counter = new Counter('center', 100, game.getLayer(1), player, 'sum');
  cat     = new Cat('center', 'center', game.getLayer(0), player);

  game.eachLayer(function (layer) {
    collie.Renderer.addLayer(layer);
  });

  // Brush upgrade button
  // TODO: Use jQuery
  document.getElementById('brush-btn').addEventListener('click', function (e) {
    if (player.registerUpgrade('brush')) {
      this.parentNode.parentNode.removeChild(this.parentNode);
      helpers.notify('Brush that cat!');
    }
  }, false);

  // Robohand purchase button
  document.getElementById('robohand-btn').addEventListener('click', function (e) {
    player.registerAutomation('robohand');
  }, false);

  // Update tab title with the current number of pets
  player.observe('sum', function (sum) {
    document.title = helpers.numberFormat(sum) + ' pets - Cat Petting Simulator 2014';
  });

  // Update price and number when robohand number changes
  player.observe('automations.robohand', function (num) {
    var nextPrice = player.getNextAutomationPrice('robohand');
    document.getElementById('robohand-btn').children[0].innerHTML = 'Robohand (' + num + ')';
    document.getElementById('robohand-btn').childNodes[2].data = '1 pet/s, Costs ' + nextPrice;
  });

  // Remove brush upgrade button when brush upgrade is purchased
  player.observe('upgrades.brush', function (has) {
    if (has) {
      var btn = document.getElementById('brush-btn');
      btn.parentNode.parentNode.removeChild(btn.parentNode);
    }
  });

  // Woof woof
  collie.Renderer.load(document.getElementById("container"));
  collie.Renderer.start();
});
