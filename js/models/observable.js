define(['helpers'], function (helpers) {
  var get  = helpers.get,
    set    = helpers.set,
    extend = helpers.extend;

  var Observable = function () {
    this.observers = {};
    this.initialize.apply(this, arguments);
  };

  // Callback will be fired when property changes
  Observable.prototype.observe = function (property, fn) {
    if (typeof this.observers[property] !== 'object') {
      this.observers[property] = [];
    }

    this.observers[property].push(fn);
  };

  // Notify observers for property
  Observable.prototype.notifyObservers = function (property, newValue, oldValue) {
    var i, len, key;

    if (typeof this.observers[property] !== 'undefined') {
      for (i = 0, len = this.observers[property].length; i < len; i += 1) {
        this.observers[property][i].apply(this, [newValue, oldValue]);
      }
    }

    // If this property has children, they changed too, so fire
    // notifications for them as well
    if (typeof newValue === 'object' && newValue instanceof Object) {
      for (key in newValue) {
        if (newValue.hasOwnProperty(key)) {
          this.notifyObservers(property + '.' + key, this.get(property + '.' + key), get(oldValue, key));
        }
      }
    }
  };

  // Set a property and fire notifications
  Observable.prototype.set = function (property, value) {
    var oldValue = this.get(property);

    set(this, property, value, function (context, path, value) {
      context.notifyObservers(path, value, oldValue);
    });
  };

  // Get a property
  Observable.prototype.get = function (path) {
    return get(this, path);
  };

  return Observable;
});
