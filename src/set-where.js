var assign     = require('lodash.assign');
var isEmpty    = require('lodash.isempty');
var isArray    = require('lodash.isarray');
var isFunction = require('lodash.isfunction');

module.exports = function() {
  var tree     = arguments[0];
  var path     = arguments[1];
  var query    = arguments[2];
  var newAttrs = arguments[3] || null;
  var cursor   = tree.select(path);

  if (isArray(cursor.get())) {
    setCollection(cursor, query, newAttrs);
  } else {
    setObject(cursor, query, newAttrs);
  }
}

function setObject(cursor, query, newAttrs) {
  if (isFunction(query)) throw new Error("Data at the path: '" + cursor.path +
    "' can't be queried by a function.\n Please use an object to query by properties." +
    " Example:\n setWhere('todo', {completed: true}, {title: 'bam'}).");

  Object.keys(query).forEach(function(queryKey) {
    if (!(queryKey in cursor.get())) throw new Error('No key: ' + queryKey + ' in object.');
  });

  var objectFound = Object.keys(query).reduce(function(bool, queryKey) {
    return bool && (cursor.get()[queryKey] === query[queryKey]);
  }, true);

  if (objectFound) !newAttrs ? cursor.set(null) : cursor.merge(newAttrs);
}

function setCollection(collection, query, newAttrs) {
  var filterFn = isFunction(query) ? query : function(item) {
    return Object.keys(query).reduce(function(bool, queryKey) {
      return bool && (item[queryKey] === query[queryKey]);
    }, true);
  };

  var items = collection.get().filter(filterFn);

  if (isEmpty(items)) return collection.push(newAttrs);

  items.forEach(function(item) {
    var i = collection.get().indexOf(item);

    if (!newAttrs) {
      collection.unset(i);
    } else {
      collection.splice([i, 1, assign({}, collection.get()[i], newAttrs)]);
    }
  });
}
