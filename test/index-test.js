var Model = require('../index');

exports.setWhere = {
  ['updates collections matching a query']: function(test) {
    var data = {
      todos: [
        {id: 1, title: 'one', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'three', completed: false},
        {id: 4, title: 'four', completed: true}
      ]
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todos', {completed: true}, {title: 'bam'});

    test.deepEqual(
      accessors.get('todos'), [
        {id: 1, title: 'one', completed: false},
        {id: 2, title: 'bam', completed: true},
        {id: 3, title: 'three', completed: false},
        {id: 4, title: 'bam', completed: true}
      ]
    );
    test.done();
  },

  ['updates collections matching multiple query keys']: function(test) {
    var data = {
      todos: [
        {id: 1, title: 'foo', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'foo', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todos', {title: 'foo', completed: true}, {title: 'bam'});

    test.deepEqual(
      accessors.get('todos'), [
        {id: 1, title: 'foo', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'bam', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    );
    test.done();
  },

  ['updates collections by a provided filter function']: function(test) {
    var data = {
      todos: [
        {id: 1, title: 'foo', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'foo', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todos', function(todo) {
      return todo.id !== 1 && todo.title !== 'four';
    }, {title: 'bam'});

    test.deepEqual(
      accessors.get('todos'), [
        {id: 1, title: 'foo', completed: false},
        {id: 2, title: 'bam', completed: true},
        {id: 3, title: 'bam', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    );
    test.done();
  },

  ['adds an item to the collection if there are no matches']: function(test) {
    var data = {
      todos: [
        {id: 1, title: 'one', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'three', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todos', {title: 'grandma', completed: true}, {
      id: 5, title: 'grandma bam', completed: false
    });

    test.deepEqual(
      accessors.get('todos'), [
        {id: 1, title: 'one', completed: false},
        {id: 2, title: 'two', completed: true},
        {id: 3, title: 'three', completed: true},
        {id: 4, title: 'four', completed: true},
        {id: 5, title: 'grandma bam', completed: false}
      ]
    );
    test.done();
  },

  ['updates an object matching a query']: function(test) {
    var data = {
      todo: {id: 1, title: 'one', completed: true}
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todo', {completed: true}, {title: 'bam'});

    test.deepEqual(
      accessors.get('todo'),
      {id: 1, title: 'bam', completed: true}
    );
    test.done();
  },

  ['performs a noop if an object doesn\'t match the query']: function(test) {
    var data = {
      todo: {id: 1, title: 'one', completed: false}
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todo', {completed: true}, {title: 'bam'});

    test.deepEqual(
      accessors.get('todo'),
      {id: 1, title: 'one', completed: false}
    );
    test.done();
  },

  ['updates an object matching multiple query keys']: function(test) {
    var data = {
      todo: {id: 1, title: 'foo', completed: true}
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todo', {title: 'foo', completed: true}, {title: 'bam'});

    test.deepEqual(
      accessors.get('todo'),
      {id: 1, title: 'bam', completed: true}
    );
    test.done();
  },

  ['throws an error if you query an object by a function']: function(test) {
    var data = {
      todo: {id: 1, title: 'one', completed: false}
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    var message = "Data at the path: 'todo' can't be queried by a function.\n" +
    " Please use an object to query by properties. Example:\n" +
    " setWhere('todo', {completed: true}, {title: 'bam'}).";

    test.throws(
      function() {
        mutators.setWhere('todo', function(attr){}, {title: 'bam'})
      },
      function(err) {
        if ((err instanceof Error) && err.message == message) {
          return true;
        }
      },
      "unexpected error"
    );

    test.done();
  },

  ['removes items from the collection when no attributes are passed in']: function(test) {
    var data = {
      todos: [
        {id: 1, title: 'foo', completed: true},
        {id: 2, title: 'two', completed: false},
        {id: 3, title: 'foo', completed: true},
        {id: 4, title: 'four', completed: true}
      ]
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todos', {title: 'foo', completed: true});

    test.deepEqual(
      accessors.get('todos'), [
        {id: 2, title: 'two', completed: false},
        {id: 4, title: 'four', completed: true}
      ]
    );
    test.done();
  },

  ['sets an object to null when no attributes are passed in']: function(test) {
    var data = {
      todo: {id: 1, title: 'foo', completed: true}
    };
    var model = Model(data);
    var controller = { on: function(){} };
    var mutators = model(controller).mutators;
    var accessors = model(controller).accessors;

    test.expect(1);

    mutators.setWhere('todo', {title: 'foo', completed: true});

    test.strictEqual(
      accessors.get('todo'),
      null
    );
    test.done();
  },
};
