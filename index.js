var Baobab = require('baobab');
function deepmerge(target, src) {
   var array = Array.isArray(src);
   var dst = array && [] || {};

   if (array) {
       target = target || [];
       dst = src.slice();
       src.forEach(function(e, i) {
           if (typeof dst[i] === 'undefined') {
               dst[i] = e;
           } else if (typeof e === 'object') {
               dst[i] = deepmerge(target[i], e);
           }
       });
   } else {
       if (target && typeof target === 'object') {
           Object.keys(target).forEach(function (key) {
               dst[key] = target[key];
           })
       }
       Object.keys(src).forEach(function (key) {
           if (typeof src[key] !== 'object' || !src[key]) {
               dst[key] = src[key];
           }
           else {
               if (!target[key]) {
                   dst[key] = src[key];
               } else {
                   dst[key] = deepmerge(target[key], src[key]);
               }
           }
       });
   }

   return dst;
};

var Model = function (initialState, options) {

  options = options || {};

  var tree = new Baobab(initialState, options);

  var model = function (controller) {

    controller.on('reset', function () {
      tree.set(initialState);
    });

    controller.on('seek', function (seek, recording) {
      recording.initialState.forEach(function (state) {
        tree.set(state.path, state.value);
      });
    });

    return {
        tree: tree,
        logModel: function () {
          return tree.get();
        },
        accessors: {
          get: function (path) {
            return tree.get(path);
          },
          toJSON: function () {
            return tree.toJSON();
          },
          serialize: function (path) {
            return tree.serialize(path);
          },
          export: function () {
            return tree.serialize();
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
          import: function (newState) {
            var newState = deepmerge(initialState, newState);
            tree.set(newState);
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
              var copy = existingValue.slice();
              copy.pop();
              return copy;
            });
          },
          shift: function (path) {
            tree.apply(path, function (existingValue) {
              var copy = existingValue.slice();
              copy.shift();
              return copy;
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
Model.dynamicNode = Baobab.dynamicNode;

module.exports = Model;
