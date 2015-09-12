var Baobab = require('baobab');

var updateTree = function (tree, state, path) {
  Object.keys(state).forEach(function (key) {
    if (key[0] === '$') {
      return;
    }
    path.push(key);
    if (!Array.isArray(state[key]) && typeof state[key] === 'object' && state[key] !== null) {
      updateTree(tree, state[key], path)
    } else {
      tree.set(path, state[key])
    }
    path.pop();
  });
};

module.exports = function (initialState, options) {

  options = options || {};

  return function (controller) {

    var tree = new Baobab(initialState, options);
    initialState = tree.get();

    controller.on('reset', function () {
      updateTree(tree, initialState, []);
    });

    controller.on('seek', function (seek, isPlaying, recording) {
      // Not available yet
    });

    return {
        tree: tree,
        get: function (path) {
          return tree.get(path);
        },
        toJSON: function () {
          return tree.toJSON();
        },
        getRecordingState: function () {
          // Not available yet
        },
        mutators: {
          set: function (path, value) {
            tree.set(path, value);
          },
          unset: function (path) {
            tree.unset(path);
          },
          push: function (path, value) {
            tree.push(path, value);
          },
          splice: function () {
            tree.splice.apply(tree, arguments);
          },
          merge: function (path, value) {
            tree.merge(path, value);
          },
          concat: function () {
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

};
