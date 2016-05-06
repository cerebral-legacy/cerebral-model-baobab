var assign  = require('lodash.assign');
var isEmpty = require('lodash.isempty');
var isArray = require('lodash.isarray');

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
  Object.keys(query).forEach(function(queryKey) {
    if (!(queryKey in cursor.get())) throw new Error(`No key: ${queryKey} in object.`);
  });

  !newAttrs ? cursor.set(null) : cursor.merge(newAttrs);
}

function setCollection(collection, query, newAttrs) {
  var items = collection.get().filter(function(item) {
    return Object.keys(query).reduce((bool, queryKey) => {
      return bool && (item[queryKey] === query[queryKey]);
    }, true);
  });

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
