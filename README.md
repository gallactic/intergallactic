  [![NPM Version][npm-image]][npm-url]

# Intergallactic
A module for Interacting with `Gallactic` blockchain node. This provides a simple way to communicate with the node.
Intergallactic supports json rpc protocol to communicate with `Gallactic`. You can use this module to get information such as account, transaction also send, call, bond or unbond transaction.

## Installation
```npm install intergallactic```

## Usage:
To use intergallactic in Node.js, just ```require``` it:

```js
var intergallactic = require('intergallactic');
```

A minified, browserified file ```dist/intergallactic.min.js``` is included for use in the browser. Including this file simply attaches ```Intergallactic``` object to ```window```:

```<sciprt src="dist/intergallactic.min.js" type="text/javascript"></script>```

## Tests
Unit tests are in the ```test``` directory and can be run with mocha:
```
npm test
```

The command will help run webpack generate new minified file under dist folder. inside the test folder, there's ```test.html``` that will trigger to run ```mocha``` if opened using a browser for browser testing. Otherwise, you can run ```mocha``` to start the test
```
mocha
```

## License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/intergallactic.svg
[npm-url]: https://npmjs.org/package/intergallactic
