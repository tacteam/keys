### TAC Development Guide

# tac-keys

**tac.keys** manages keyboard events triggered by the browser, and calls the corresponding action on anyone who subscribes to the provided service.

## Install

This repo is for distribution on `bower`. The source for this module is in the
[main TacTeam repo](https://github.com/tacteam/keys).
Please file issues and pull requests against that repo.

### bower

You can install this package with `bower`.

```shell
bower install tac-keys
```

Optionally you can add --save prefix to add package to bower.js

```shell
bower install tac-keys --save
```

Then add a `<script>` to your `index.html`:

```html
<script src="/bower_components/tac-keys/dist/keys.js"></script>
```

## Documentation

##### Angular dependency

You must add the component identifier to Angular dependencies in order to load module into the application.

```js
angular.module('main-application',[
  '...dependencies...',
  'module.tac.keys',
  '...dependencies...'
])
```

##### Initialize component

```js
angular.module('main-application')
.run([
  'tac.keys',
  function(keys) {
    keys.bind_keydown(document);
  }
])
```

##### Using

```js
angular.module('main-application')
.run([
  'tac.keys',
  'handler',
  function(keys, handler) {
    keys.bind_keydown(document);
    keys.subscribe(handler);
  }
])
```

When a key is pressed **tac.key** verify the **handler** implements the corresponding action and call it. 

## License

License is not available yet
