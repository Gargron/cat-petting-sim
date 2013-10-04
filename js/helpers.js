define(['vendor/underscore', 'models/game', 'models/growl'], function (_, game, Growl) {
  return {
    // Whoosh, make notification!
    notify: function (text) {
      new Growl(text, game.getLayer(1));
    },

    // Get an object's property (supports foo.bar.baz paths)
    get: function (context, path) {
      return path.split('.').reduce(function (a, b) {
        return a && a[b];
      }, context);
    },

    // Set an object's property (supports foo.bar.baz paths)
    // Fires a specified callback
    set: function (context, path, value, fn) {
      var tmp, parts;

      tmp   = context;
      parts = path.split('.');

      while (parts.length > 1) {
        tmp = context[parts.shift()];
      }

      tmp[parts.shift()] = value;

      if (typeof fn === 'function') {
        fn.apply(this, [context, path, value]);
      }
    },

    // Extend a parent class to create a child class
    extend: function (parent, protoProps) {
      var child, Surrogate;

      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function () {
          return parent.apply(this, arguments);
        };
      }

      _.extend(child, parent);

      Surrogate = function () {
        this.constructor = child;
      };

      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;

      if (protoProps) {
        _.extend(child.prototype, protoProps);
      }

      child.__super__ = parent.prototype;

      return child;
    },

    // 123,456,789
    numberFormat: function (nStr) {
      var rgx, x, x1;

      nStr += '';
      x     = nStr.split('.');
      x1    = x[0];
      rgx   = /(\d+)(\d{3})/;

      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }

      return x1;
    }
  }
});
