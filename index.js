var Baobab = require('baobab');
var deepmerge = require('deepmerge');

var Model = function (initialState, options) {

  options = options || {};

  var tree = new Baobab(initialState, options);

  var model = function (controller) {

    controller.on('reset', function () {
      tree.set(initialState);
    });

    controller.on('seek', function (seek, recording) {
      var newState = deepmerge(initialState, recording.initialState);
      tree.set(newState);
    });

    return {
        tree: tree,
        accessors: {
          get: function (path) {
            return tree.get(path);
          },
          toJSON: function () {
            return tree.toJSON();
          },
          export: function () {
            return tree.serialize();
          },
          import: function (newState) {
            var newState = deepmerge(initialState, newState);
            tree.set(newState);
          },
          keys: function (path) {
            return Object.keys(tree.get(path));
          },
          findWhere: function (path, obj) {
            var keysCount = Object.keys(obj).length;
            return tree.get(path).filter(function (item) {
              return Object.keys(item).filter(function (key) {
                return key in obj && obj[key] === item[key];
              }).length === keysCount;
            }).pop();
          }
        },
        mutators: {
          set: function (path, value) {
            tree.set(path, value);
          },
          unset: function (path, keys) {
            if (keys) {
              keys.forEach(function (key) {
                tree.unset(path.concat(key));
              })
            } else {
              tree.unset(path);
            }
          },
          push: function (path, value) {
            tree.push(path, value);
          },
          splice: function () {
            var args = [].slice.call(arguments);
            tree.splice.call(tree, args.shift(), args);
          },
          merge: function (path, value) {
            tree.merge(path, value);
          },
          concat: function (path, value) {
            tree.apply(path, function (existingValue) {
              return existingValue.concat(value);
            });
          },
          pop: function (path) {
            tree.apply(path, function (existingValue) {
              existingValue.pop();
              return existingValue;
            });
          },
          shift: function (path) {
            tree.apply(path, function (existingValue) {
              existingValue.shift();
              return existingValue;
            });
          },
          unshift: function (path, value) {
            tree.unshift(path, value);
          }
        }
    };

  };

  model.tree = tree;

  return model;

};

Model.monkey = Baobab.monkey;

module.exports = Model;
