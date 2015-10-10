# cerebral-baobab
Baobab Model layer for Cerebral

## The Cerebral Webpage is now launched
You can access the webpage at [http://christianalfoni.com/cerebral/](http://christianalfoni.com/cerebral/)

## Debugger
You can download the Chrome debugger [here](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb?hl=no).

## Install
`npm install cerebral-baobab`

### Instantiate a Cerebral controller
*controller.js*
```js
import Controller from 'cerebral';
import Model from 'cerebral-baobab';
import request from 'superagent';

// Any Baobab options
const options = {

};

// The initial state of the application
const model = Model({
  isLoading: false,
  user: null,
  error: null
}, options);

// You have access to the Baobab tree itself
model.tree.on('invalid', function () {
  
});

// Any utils you want each action to receive
const services = {
  request: request
};

// Instantiate the controller
export default Controller(model, services);
```
With Baobab you can also map state using facets, read more about that [here](https://github.com/Yomguithereal/baobab/issues/278).

### Creating signals
Creating actions are generic. It works the same way across all packages. You can read more about that on the [cerebral webpage](http://www.christianalfoni.com/cerebral).

Typically you would create your signals in the *main.js* file, but you can split them out as you see fit.

*main.js*
```js
import controller from './controller.js';

import setLoading from './actions/setLoading.js';
import saveForm from './actions/saveForm.js';
import unsetLoading from './actions/unsetLoading.js';

controller.signal('formSubmitted', setLoading, [saveForm], unsetLoading);

```

### Listening to changes
You can manually listen to changes on the controller, in case you want to explore [reactive-router](https://github.com/christianalfoni/reactive-router) for example.

*main.js*
```js
import controller from './controller.js';

const onChange = function () {
  controller.get() // New state
};
controller.on('change', onChange);
controller.removeListener('change', onChange);

// When debugger traverses state
controller.on('remember', onChange);
controller.removeListener('remember', onChange);
```

### Listening to errors
You can listen to errors in the controller. Now, Cerebral helps you a lot to avoid errors, but there are probably scenarios you did not consider. By using the error event you can indicate messages to the user and pass these detailed error messages to a backend service. This lets you quickly fix bugs in production.

*main.js*
```js
...
const onError = function (error) {
  controller.signals.errorOccured({error: error.message});
  myErrorService.post(error);
};
controller.on('error', onError);
```
