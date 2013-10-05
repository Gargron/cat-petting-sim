define(['models/observable', 'helpers', 'models/upgrades'], function (Observable, helpers, upgrades) {
  var get  = helpers.get,
    set    = helpers.set,
    extend = helpers.extend,
    notify = helpers.notify;

  // For now automations like robohands are stored here
  var automationsList = {
    'robohand': {
      basePrice: 20,
      basePps: 1
    }
  };

  // Achievements
  var achievsList = {
    'starter': ['i did it mom'],
    'goodGoing': ['Good going!'],
    'tooMuch': ['Cat status: Million Kelvin'],
    'fellowship': ['Fellowship of the cat'],
    'terminator': ['Terminator 20: Robohands']
  };

  var Player = extend(Observable, {
    initialize: function () {
      var self = this;

      this.upgrades    = {};
      this.automations = {};
      this.achievs     = {};
      this.sum         = 0;
      this.ppc         = 1;
      this.pps         = 0;

      setTimeout(function () {
        // Doing save checking asynchronously so that
        // observers from other components have a chance
        // to register
        if (self.checkStorage()) {
          self.loadFromStorage();
          notify('Game loaded');
        }

        self.bindOwnObservers();
      }, 0);

      this.bindTimers();
    }
  });

  Player.prototype.bindTimers = function () {
    var self = this,
      lastRun;

    // Save progress every minute
    setInterval(function () {
      self.saveToStorage();
      notify('Game saved');
    }, 1000 * 60);

    // Run automations 10 times per second
    lastRun = new Date() * 1;

    setInterval(function () {
      var nowRun, delta;

      nowRun = new Date() * 1;
      delta  = nowRun - lastRun;

      self.runAutomations(delta);

      lastRun = new Date() * 1;
    }, 100);
  };

  Player.prototype.bindOwnObservers = function () {
    var self = this;

    // Watch out for sum-based achievements
    this.observe('sum', function (sum) {
      if (sum >= 1000) {
        self.registerAchievement('starter');
      }

      if (sum >= 10000) {
        self.registerAchievement('goodGoing');
      }

      if (sum >= 1000000) {
        self.registerAchievement('tooMuch');
      }
    });

    // Watch out for robohand-related achievements
    this.observe('automations.robohand', function (num) {
      if (num >= 9) {
        self.registerAchievement('fellowship');
      }

      if (num >= 50) {
        self.registerAchievement('terminator');
      }
    });
  };

  Player.prototype.checkStorage = function () {
    return !(localStorage['save'] === null || typeof localStorage['save'] === 'undefined');
  };

  Player.prototype.loadFromStorage = function () {
    var str, obj, key;

    str = localStorage['save'];
    obj = JSON.parse(str);

    for (key in obj) {
      var upgradeKey;

      if (obj.hasOwnProperty(key)) {
        this.set(key, obj[key]);
      }

      // Special treatment for upgrades,
      // because we want to fire their activate method
      if (key === 'upgrades') {
        for (upgradeKey in this.upgrades) {
          upgrades[upgradeKey].activate(this);
        }
      }
    }
  };

  Player.prototype.saveToStorage = function () {
    var obj, str;

    // Only save these properties
    obj = {};
    obj.sum         = this.sum;
    obj.upgrades    = this.upgrades;
    obj.automations = this.automations;
    obj.achievs     = this.achievs;

    // JSON x localStorage. This is the future, bitch
    str = JSON.stringify(obj);
    localStorage['save'] = str;
  };

  Player.prototype.registerUpgrade = function (key) {
    var item = upgrades[key];

    if (typeof item === 'undefined') {
      return false;
    }

    if (item.price > this.sum) {
      return false;
    }

    this.set('sum', this.sum - item.price);
    this.set('upgrades.' + key, true);
    item.activate(this);

    return true;
  };

  Player.prototype.registerAutomation = function (key) {
    var price = this.getNextAutomationPrice(key);

    if (price === false) {
      return false;
    }

    if (price > this.sum) {
      return false;
    }

    this.set('sum', this.sum - price);
    this.set('automations.' + key, this.automations[key] + 1);

    return this.automations[key];
  };

  Player.prototype.getNextAutomationPrice = function (key) {
    var item, price;

    if (typeof this.automations[key] === 'undefined') {
      this.automations[key] = 0;
    }

    item = automationsList[key];

    if (typeof item === 'undefined') {
      return false;
    }

    // Price for item should increase the more of the item you buy
    return (item.basePrice * Math.pow(1.2, this.automations[key])).toFixed();
  };

  Player.prototype.runAutomations = function (delta) {
    var key, item, sum, aggrSum;

    aggrSum = 0;

    for (key in this.automations) {
      if (this.automations.hasOwnProperty(key)) {
        // Since this runs 10 times per second, and all base
        // values are "per second", we divide by 10
        item     = automationsList[key];
        sum      = item.basePps * this.automations[key];
        aggrSum += sum;
        this.set('sum', this.sum + (sum * delta / 1000));
      }
    }

    this.set('pps', aggrSum);
  };

  Player.prototype.registerClick = function () {
    this.set('sum', this.sum + this.ppc);
    return this.ppc;
  };

  Player.prototype.registerAchievement = function (key) {
    var item = achievsList[key];

    if (typeof item === 'undefined') {
      return false;
    }

    if (typeof this.achievs[key] === 'undefined') {
      this.set('achievs.' + key, true);
      notify(item[0]);
      return true;
    }

    return false;
  };

  return Player;
});
