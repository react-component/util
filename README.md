# rc-util
---

Common Utils For React Component

[![NPM version][npm-image]][npm-url]
[![SPM version](http://spmjs.io/badge/rc-util)](http://spmjs.io/package/rc-util)
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-util.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-util
[travis-image]: https://img.shields.io/travis/react-component/util.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/util
[coveralls-image]: https://img.shields.io/coveralls/react-component/util.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/util?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/util.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/util
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-util.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-util

## install

[![rc-util](https://nodei.co/npm/rc-util.png)](https://npmjs.org/package/rc-util)

## Usage

```js
var rcUtil = require('rc-util');
console.log(rcUtil.classSet({x:1,y:0}));
```

## API

### classSet:function

http://facebook.github.io/react/docs/class-name-manipulation.html

### shallowEqual:function

### KeyCode:enum

enum of KeyCode

```
KeyCode.ENTER
KeyCode.DOWN
```

### guid:function

return string represent a global unique id across current application

### createChainedFunction:function

### Dom.addEventListener:function

### Dom.contains:function

### Children.toArray

transform React Children into Array type




## License

rc-util is released under the MIT license.
