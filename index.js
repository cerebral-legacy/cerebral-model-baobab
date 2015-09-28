var Baobab = require('baobab');
var deepmerge = require('deepmerge');

var Model = function (initialState, options) {

  options = options || {};

  var tree = new Baobab(initialState, options);

  var model = function (controller) {

    controller.on('reset', function () {
      tree.set(initialState);
    });

    controller.on('seek', function (seek, isPlaying, recording) {
      var newState = deepmerge(initialState, recording.initialState);
      tree.set(newState);
    });

    return {
        tree: tree,
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
          return tree.set(newState);
        },
        mutators: {
          set: function (path, value) {
            return tree.set(path, value);
          },
          unset: function (path) {
            return tree.unset(path);
          },
          push: function (path, value) {
            return tree.push(path, value);
          },
          splice: function () {
            var args = [].slice.call(arguments);
            return tree.splice.call(tree, args.shift(), args);
          },
          merge: function (path, value) {
            tree.merge(path, value);
          },
          concat: function () {
            return tree.apply(path, function (existingValue) {
              return existingValue.concat(value);
            });
          },
          pop: function (path) {
            return tree.apply(path, function (existingValue) {
              existingValue.pop();
              return existingValue;
            });
          },
          shift: function (path) {
            return tree.apply(path, function (existingValue) {
              existingValue.shift();
              return existingValue;
            });
          },
          unshift: function (path, value) {
            return tree.unshift(path, value);
          }
        }
    };

  };

  model.tree = tree;

  return model;

};

Model.monkey = Baobab.monkey;

module.exports = Model;
