# simple-model

Simple model for getting and setting values

```javascript

var SimpleModel = require('simple-model');

var x = new SimpleModel();

x.on('change', function (prop, newVal, oldVal) {
    console.log('change ' + prop + ' from ' + oldVal + ' to ' + newVal);
});

x.set('foo', 'bar');
// 'change foo from undefined to bar'
x.set('foo', 'baz');
// 'change foo from bar to baz'

x.get('foo');
// 'baz'

```

## Installation

    $ npm install simple-model

## Dependencies

  - [deepequal](https://npmjs.org/package/deepequal)
  - [attach-middleware](https://npmjs.org/package/attach-middleware)
  - [emitter-context](https://npmjs.org/package/emitter-context)

## API

### SimpleModel

Create a new instance of a model

### model.set(prop, value)

Set the value of `prop` as `value`

### model.get(prop)

Return the value of `prop`

### model.setMiddleware(fn)

Attach middleware for setting values

refer to [attach-middleware](https://npmjs.org/package/attach-middleware) for documentation

```javascript
// resume from previous example
x.setMiddleware(function (prop, val, next) {
    next(null, prop.replace(/ /g, '_'), 'val: ' + val);
});

x.set('foo bar', 'baz');

x.get('foo bar');
// undefined

x.get('foo_bar');
// 'val: baz'

```

### model.getMiddleware(fn)

Attach middleware for getting values

refer to [attach-middleware](https://npmjs.org/package/attach-middleware) for documentation

```javascript
// resume from previous example
x.getMiddleware(function (prop, val, next) {
    next(null, prop.replace(/ /g, '_'), 'getMiddleware: ' + val);
});

x.get('foo bar');
// 'getMiddleware: val: baz'

```

## Events

### 'change' (prop, newVal, oldVal)

Listen for all changes on the model

### 'change PROP' (newVal, oldVal)

Listen for a specific prop change on the model

## Limitations

  - Getting values must be synchronous. Let me know if an asynchronous model is needed