# rc-util

Common Utils For React Component.

[![NPM version][npm-image]][npm-url]
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

## Install

[![rc-util](https://nodei.co/npm/rc-util.png)](https://npmjs.org/package/rc-util)

## API

### createChainedFunction

> (...functions): Function

Create a function which will call all the functions with it's arguments from left to right.

### deprecated

> (prop: string, instead: string, component: string): void

Log an error message to warn developers that `prop` is deprecated.

### getContainerRenderMixin

> (config: Object): Object

To generate a mixin which will render specific component into specific container automatically.

Fields in `config` and their meanings.

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| autoMount | boolean | Whether to render component into container automatically | true |
| autoDestroy | boolean | Whether to remove container automatically while the component is unmounted | true |
| isVisible | (instance): boolean | A function to get current visibility of the component | - |
| getComponent | (instance, extra): ReactNode | A function to get the component which will be rendered into container | - |
| getContaienr | (instance): HTMLElement | A function to get the container | |

### getScrollBarSize

> (fresh?: boolean): number

Get the width of scrollbar.

### guid

> (): string

To generate a global unique id across current application.

### pickAttrs

> (props: Object): Object

Pick valid HTML attributes and events from props.

### warn

> (msg: string): void

A shallow wrapper of `console.warn`.

### Children

A collection of functions to operate React elements' children.

#### Children/mapSelf

> (children): children

Return a shallow copy of children.

#### Children/toArray

> (children: ReactNode[]): ReactNode[]

Convert children into an array.

### Dom

A collection of functions to operate DOM elements.

#### Dom/addEventlistener

> (target: ReactNode, eventType: string, listener: Function): { remove: Function }

A shallow wrapper of [add-dom-event-listener](https://github.com/yiminghe/add-dom-event-listener).

#### Dom/casUseDom

> (): boolean

Check if DOM is available.

#### Dom/class

A collection of functions to operate DOM nodes' class name.

* `hasClass(node: HTMLElement, className: string): boolean`
* `addClass(node: HTMLElement, className: string): void`
* `removeClass(node: HTMLElement, className: string): void`

#### Dom/contains

> (root: HTMLElement, node: HTMLElement): boolean

Check if node is equal to root or in the subtree of root.

#### Dom/css

A collection of functions to get or set css styles.

* `get(node: HTMLElement, name?: string): any`
* `set(node: HTMLElement, name?: string, value: any) | set(node, object)`
* `getOuterWidth(el: HTMLElement): number`
* `getOuterHeight(el: HTMLElement): number`
* `getDocSize(): { width: number, height: number }`
* `getClientSize(): { width: number, height: number }`
* `getScroll(): { scrollLeft: number, scrollTop: number }`
* `getOffset(node: HTMLElement): { left: number, top: number }`

#### Dom/focus

A collection of functions to operate focus status of DOM node.

* `saveLastFocusNode(): void`
* `clearLastFocusNode(): void`
* `backLastFocusNode(): void`
* `getFocusNodeList(node: HTMLElement): HTMLElement[]` get a list of focusable nodes from the subtree of node.
* `limitTabRange(node: HTMLElement, e: Event): void`

#### Dom/support

> { animation: boolean | Object, transition: boolean | Object }

A flag to tell whether current environment supports `animationend` or `transitionend`.

### KeyCode

> Enum

Enum of KeyCode, please check the [definition](https://github.com/react-component/util/blob/master/src/KeyCode.js) of it.

#### KeyCode.isTextModifyingKeyEvent

> (e: Event): boolean

Whether text and modified key is entered at the same time.

#### KeyCode.isCharacterKey

> (keyCode: KeyCode): boolean

Whether character is entered.

## License

rc-util is released under the MIT license.
