# Magnet.js

Magnet.js is a JavaScript library that groups HTML elements and makes them attractable with each other

## Demo

### [Basic demo](https://lf2com.github.io/magnet.js/demo/demo_types.html)

> [jQuery version](https://lf2com.github.io/magnet.js/demo/demo_types_jquery.html)

- Configure magnet attract distance
- Switch to stay in parent element
- Align to outer/inner edge of the others
- Align to the x/y center of the others
- Align to the x/y center of parent element

### [Group demo](https://lf2com.github.io/magnet.js/demo/demo_groups.html)

4 magnet groups that can attract the others in their own groups or all the other group members.

### [Arrow key demo](https://lf2com.github.io/magnet.js/demo/demo_arrow.html)

Extend the [Basic demo](#basic-demo) with new features:

- Support arrow keys to move focused box (also support `a`/`w`/`d`/`s` keys)
- Configure `px` unit of arrow_ (
- _**`unit < distance` would cause the box stuck with the others when attracted**_

## Install

### Git

```sh
git clone https://github.com/lf2com/magnet.js.git
cd magnet.js
npm install .
```

### NodeJS

> **CAUTION: Magnet.js is not tested on NodeJS environment. It uses `document` and `eventListener` related functions.**

```sh
npm install @lf2com/magnet.js
# Or
npm install https://github.com/lf2com/magnet.js
```

> #### Import
>
> ```js
> import Magnet from '@lf2com/magnet.js';
> // Or
> const Magnet = require('@lf2com/magnet.js');
> ```

### Build

The required files are `./index.js` and `./libs/*.js`. All dependencies in `./package.json` are only used for building a packaged/minified JS file as `./magnet.min.js`. Since the code registered as `window.Magnet`. You can build a browser-used **`magnet.min.js`** with the following commands:

```sh
npm run build
```

> #### Build jQuery Plugin
>
> Build `./jquery-magnet.min.js`
>
> ```sh
> npm run jquery-build
> ```
>
> #### Build All
>
> Build both `./magnet.min.js` and `./jquery-magnet.min.js`
>
> ```sh
> npm run all-build
> ```
>
> #### Debug Build
>
> Append **`-debug`** on any `build` command
>
> ```sh
> npm run build-debug
>
> # for jQuery
> npm run jquery-build-debug
> 
> # for both
> npm run all-build-debug
> ```

### Browser

Download from this repository or use your own built: [**`magnet.min.js`**](https://lf2com.github.io/magnet.js/magnet.min.js)

```html
<!-- include script -->
<script src="PATH/TO/magnet.min.js"></script>

<script>
  console.log(window.Magnet); // here it is
</script>
```

> #### jQuery Plugin
>
> **NOTICE: Please include jQuery library before incluing `jquery-magnet.min.js`**
>
> ```html
> <script src="PATH/TO/jQuery.js"></script>
> <script src="PATH/TO/jquery-magnet.min.js"></script>
> <script>
>   (function($) {
>     console.log($.magnet); // here it is
>   })(jQuery);
> </script>
> ```

## Usage of Magnet

### Create Magnet Group

Create a magnet group. All the elements added into the group would be applied the attract behaviors.

```js
let magnet = new Magnet();
```

> _**jQuery**_
>
> Create a new group
>
> #### $.magnet([options?](#magnet-default-values))
>
> ```js
> let options = {
>   distance: 15,
>   stayInParent: true,
> };
> let $magnet = $.magnet(options);
> ```

### Add Elements

Add HTML elements into the group

#### .add(...DOMs)

```js
magnet.add(document.querySelectorAll('.magnet')); // return this
```

> _Or add HTML element when creating a group_
>
> ```js
> let magnet = new Magnet(document.querySelectorAll('.magnet'));
> ```
>
> _Flexable ways to add elements_
>
> ```js
> magnet.add(
>   document.querySelectorAll('.magnet'),
>   document.querySelectorAll('.other-magnet'),
>   document.getElementById('major-magnet')
> );
>
> // the same as above
> magnet
>   .add(document.querySelectorAll('.magnet'))
>   .add(document.querySelectorAll('.other-magnet'))
>   .add(document.getElementById('major-magnet'));
> ```
>
> _**jQuery**_
>
> #### [$magnet.add(...DOMs)](#adddoms)
>
> Add elements to an existing group
>
> #### $.fn.magnet([options?](#magnet-default-values))
>
> Add element to a new group
>
> ```js
> let $magnet = $('.magnet').magnet(options);
> ```

### Remove Elements

Remove HTML elements from the group

#### .remove(...DOMs)

_**Keep** the positon changed by the magnet_

```js
magnet.remove(document.querySelector('.magnet')); // return this
```

#### .removeFull(...DOMs)

_**Remove** the positions changed by the magnet_

```js
magnet.removeFull(document.querySelector('.magnet')); // return this
```

> _Flexable ways to remove elements_
>
> ```js
> magnet.remove(
>   document.querySelectorAll('.magnet'),
>   document.querySelectorAll('.other-magnet'),
>   document.getElementById('major-magnet')
> );
>
> // the same as above
> magnet
>   .remove(document.querySelectorAll('.magnet'))
>   .remove(document.querySelectorAll('.other-magnet'))
>   .remove(document.getElementById('major-magnet'));
> ```
>
> _**jQuery**_
>
> #### [$magnet.remove(...DOMs)](#removedoms)
>
> #### [$magnet.removeFull(...DOMs)](#removefulldoms)

### Clear All Elements

Remove all the HTML elements from the group

#### .clear()

_**Keep** the position changed by the magnet_

````js
magnet.clear();
````

#### .clearFull()

_**Remove** the position changed by the magnet_

```js
magnet.clearFull();
```

> _**jQuery**_
>
> #### [$magnet.clear()](#clear)
>
> #### [$magnet.clearFull()](#clearfull)

### Distance of Attraction

Distance for elements to attract others in the same group

> _Default: `0` (px)_

#### .distance(px?)

Get/set distance

```js
magnet.distance(15); // set: unit px, return this
magnet.distance(); // get: 15
```

> _Alias_
>
> #### .setDistance(px)
>
> ```js
> magnet.setDistance(15); // set to 15
> ```
>
> #### .getDistance()
>
> ```js
> magnet.getDistance(); // get 15
> ```
>
> _**jQuery**_
>
> #### [$magnet.distance(px?)](#distancepx)

### Attractable

Attractable between group members

> _Default: `true`_
>
> **NOTICE: Setting to `false` has the same effect as pressing `ctrl` key**

#### .attractable(enabled?)

Get/set attractable

```js
magnet.attractable(true); // set to attract members, return this
magnet.attractable(); // get: true
```

> _Alias_
>
> #### .setAttractable(enabled)
>
> ```js
> magnet.setAttractable(true); // set to true
> ```
>
> #### .getAttractable()
>
> ```js
> magnet.getAttractable(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.attractable(enabled?)](#attractableenabled)

### Allow `Ctrl` Key

Allow to press `ctrl` key to be unattractable temporarily

> _Default: `true`_
>
> **NOTICE: Pressing `ctrl` key makes group members unattractable, any magnet related event will not be triggered**

#### .allowCtrlKey(enabled?)

Get/set allow ctrl key

```js
magnet.allowCtrlKey(true); // set to allow ctrl key, return this
magnet.allowCtrlKey(); // get: true
```

> _Alias_
>
> #### .setAllowCtrlKey(enabled)
>
> ```js
> magnet.setAllowCtrlKey(true); // set to true
> ```
>
> #### .getAllowCtrlKey()
>
> ```js
> magnet.getAllowCtrlKey(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.allowCtrlKey(enabled?)](#allowctrlkeyenabled)

### Allow Drag Elements

Allow to drag element by mouse/touch

> _Default: `true`_

#### .allowDrag(enabled?)

Get/set allow drag

```js
magnet.allowDrag(true); // set to allow drag, return this
manget.allowDrag(); // get: true
```

> _Alias_
>
> #### .setAllowDrag(enabled)
>
> ```js
> magnet.setAllowDrag(true); // set to true
> ```
>
> #### .getAllowDrag()
>
> ```js
> magnet.getAllowDrag(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.allowDrag(enabled?)](#allowdragenabled)

### Use Relative Unit

Use relative unit `%` or absolute unit `px`

> _Default: `false`_

#### .useRelativeUnit(enabled?)

Get/set use relative unit

```js
magnet.useRelativeUnit(true); // set to use relative unit, return this
magnet.useRelativeUnit(); // get: true
```

> _Alias_
>
> #### .setUseRelativeUnit(enabled)
>
> ```js
> magnet.setUseRelativeUnit(true); // set to true
> ```
>
> ```js
> magnet.getUseRelativeUnit(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.useRelativeUnit(enabled?)](#userelativeunitenabled)

### Alignments

Magnet supports the following alignments:

| _Type_ | _Description_ | _Default_ |
| :-: | :- | :-: |
| **outer** | align edges to other edges from outside | `true` |
| **inner** | align edges to other edges from inside | `true` |
| **center** | align middle x/y to other's middle x/y | `true` |
| **parent center** | align middle x/y to parent's middle x/y | `false` |

#### .align{[Prop](#alignments)}(enabled?)

Get/set enabled of alignment

```js
magnet.alignOuter(true); // set: align to element outside edges, return this
magnet.alignInner(false); // set: align to element inside edges, return this
magnet.alignCenter(true); // set: align to element middle line, return this
magnet.alignParentCenter(false); // set: alien to parent element middle line, return this

magnet.alignOuter(); // get: true
```

> _Alias_
>
> #### .enabledAlign{[Prop](#alignments)}(enabled?)
>
> ```js
> magnet.enabledAlignOuter(true); // set to true
> magnet.enabledAlignParentCenter(false); // set to false
>
> magnet.enabledAlignOuter(); // get: true
> magnet.enabledAlignParentCenter(); // get: false
> ```
>
> #### .setEnabledAlign{[Prop](#alignments)}(enabled)
>
> ```js
> magnet.setEnabledAlignOuter(true); // set to true
> ```
>
> #### .getEnabledAlign{[Prop](#alignments)}()
>
> ```js
> magnet.getEnabledAlignOuter(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.align{Prop}(enabled?)](#alignpropenabled)

### Align to Parent Inner Edges

> _**CAUTION:**_
>
> - _**Parent** may **NOT** be the **1st** `parentNode` of the current element_._
> - _**Parent** is the **first matched** `parentNode` whose `style.position` is not `static`_
> - _All the `top`/`left` **offset** of magnet members is based on the **parent** element_

#### .stayInParent(enabled?)

Force elements of group not to be out of the edge of parent element

> _Default: `false`_

Get/set stay inside of the parent

```js
magnet.stayInParent(true); // set: not to move outside of the parent element, return this
magnet.stayInParent(); // get: true
```

> _Alias_
>
> #### .stayInParentEdge(enabled?)
>
> ```js
> magnet.stayInParentEdge(true); // set to true
> magnet.stayInParentEdge(); // get: true
> ```
>
> #### .stayInParentElem(enabled?)
>
> ```js
> magnet.stayInParentElem(true); // set to true
> magnet.stayInParentElem(); // get true
> ```
>
> _Another alias_
>
> #### .setStayInParent(enabled)
>
> ```js
> magnet.setStayInParent(true); // set to true
> ```
>
> #### .getStayInParent()
>
> ```js
> magnet.getStayInParent(); // get true
> ```
>
> _**jQuery**_
>
> #### [$magnet.stayInParent(enabled?)](#stayinparentenabled)

### Events of Magnet

Magnet supports the following events:

| _Name_ | _Description_ | _Alias_ |
| :-: | :- | :-: |
| **magnetstart** | when the last result has no any attract but now it does | `start`, `magnetenter`, `enter` |
| **magnetend** | when the last result has any attract but now it doesn't | `end`, `magnetleave`, `leave` |
| **magnetchange** | when any change of attract, including start/end and the changes of attracted alignment properties | `change` |

#### Arguments of Magnet Event

Each event has the following members in the detail of event object:

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **source** | _DOM_ | HTML element that is dragged |
| **x** | _Object_ | [Attract info](#attract-info) of x-axis, `null` if no attract |
| **y** | _Object_ | [Attract info](#attract-info) of y-axis, `null` if no attract |

#### .on(eventNames, functions)

Add event listener

```js
magnet.on('magnetenter', function(evt) {
  let detail = evt.detail;
  console.log('magnetenter', detail); // detail info of attract elements
  console.log('source', detail.source); // current HTML element
  console.log('targets', detail.x, detail.y); // current attracted of both axises
});

magnet.on('magnetleave', function(evt) {
  let detail = evt.detail;
  console.log('magnetleave', detail);
  console.log('source', detail.source);
  console.log('targets', detail.x, detail.y); // the last attracted of both axises
});

magnet.on('magnetchange', function(evt) {
  let detail = evt.detail;
  console.log('magnetchange', detail);
  console.log('source', detail.source);
  console.log('targets', detail.x, detail.y); // the newest attracted of both axises
});

// the same as above
magnet.on('magnetstart', function(evt) {
  // do something
}).on('magnetchange', function(evt) {
  // do something
}).on('magnetend', function(evt) {
  // do something
});
```

> _**jQuery**_
>
> #### [$magnet.on(eventNames, functions)](#oneventnames-functions)

#### .off(eventNames)

Remove event listeners

```js
magnet.off('magnetenter magnetleave magnetchange'); // remove event listeners

// the same as above
magnet
  .off('magnetenter')
  .off('magnetleave')
  .off('magnetchange');
```

> _**jQuery**_
>
> #### [$magnet.off(eventNames)](#offeventnames)

### Events of magnet members

Magnet members supports the following events:

| _Name_ | _Target_ | _description_ |
| :-: | :-: | :- |
| [**attract**](#arguments-of-attractunattract) | forcused | Attract to other members |
| [**unattract**](#arguments-of-attractunattract) | focused | Unattract from other members |
| [**attracted**](#arguments-of-attractedunattracted) | others | Attracted by the focused member |
| [**unattracted**](#arguments-of-attractedunattracted) | others | Unattracted by the focused member |
| [**attractstart**](#arguments-of-attractstartattractend) | focused | Start of dragging |
| [**attractend**](#arguments-of-attractstartattractend) | focused | End of dragging |
| [**attractmove**](#arguments-of-attractmove) | focused | Moving of dragging |

#### Arguments of `attract`/`unattract`

Events of `attract` and `unattract` have the following members in the detail of event object:

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **x** | _Object_ | [Attract info](#attract-info) of x-axis, `null` if no attract |
| **y** | _Object_ | [Attract info](#attract-info) of y-axis, `null` if no attract |

```js
let elem = document.querySelector('.block');
magnet.add(elem);

function onAttract(evt) {
  let detail = evt.detail;
  console.log('attract', detail); // detail info of attract elements
  console.log('targets', detail.x, detail.y); // current attracted of both axises
}
function onUnattract(evt) {
  let detail = evt.detail;
  console.log('unattract', detail);
  console.log('targets', detail.x, detail.y); // the last attracted of both axises
}

// add event listener
elem.addEventListener('attract', onAttract);
elem.addEventListener('unattract', onUnattract);

// remove event listener
elem.removeEventListener('attract', onAttract);
elem.removeEventListener('unattract', onUnattract);
```

> _**jQuery**_
>
> ```js
> // the same as above
> $(elem)
>   .on('attract', onAttract)
>   .on('unattract', onUnattract);
>
> $(elem)
>   .off('attract unattract');
> ```

#### Arguments of `attracted`/`unattracted`

Events of `attracted` and `unattracted` have the target member in the detail of event object

```js
function onAttracted(evt) {
  let dom = evt.detail;
  console.log('attracted', dom); // be attracted by dom
}
function onUnattracted(evt) {
  let dom = evt.detail;
  console.log('unattracted', dom); // be unattracted by dom
}

// add event listener
elem.addEventListener('attracted', onAttracted);
elem.addEventListener('unattracted', onUnattracted);

// remove event listener
elem.removeEventListener('attracted', onAttracted);
elem.removeEventListener('unattracted', onUnattracted);
```

> _**jQuery**_
>
> ```js
> // the same as above
> $(elem)
>   .on('attracted', onAttracted)
>   .on('unattracted', onUnattracted);
>
> $(elem).off('attracted unattracted');
> ```

#### Arguments of `attractstart`/`attractend`

```js
function onAttractStart(evt) {
  let rect = evt.detail;
  console.log('attract start', rect); // rectangle of dom
}
function onAttractEnd(evt) {
  let rect = evt.detail;
  console.log('attract end', rect); // rectangle of dom
}

// add event listener
elem.addEventListener('attractstart', onAttractStart);
elem.addEventListener('attractend', onAttractEnd;

// remove event listener
elem.removeEventListener('attractstart', onAttractStart);
elem.removeEventListener('attractend', onAttractEnd
```

> _**jQuery**_
>
> ```js
> // the same as above
> $(elem)
>   .on('attractstart', onAttractStart)
>   .on('attractend', onAttractEnd);
>
> $(elem).off('attractstart attractend');
> ```

#### Arguments of `attractmove`

> **NOTICE: Call `preventDefault()` to ignore attraction if need**

```js
function onAttractMove(evt) {
  let { rects, attracts } = evt.detail;
  let { origin, target } = rects;
  let { current, last } = attracts;
  
  // do something
  // ...

  evt.preventDefault(); // call this to ignore attraction if need
}

elem.addEventListener('attractmove', onAttractMove); // add event listener
elem.removeEventListener('attractmove', onAttractMove); // remove event listener
```

> _**jQuery**_
>
> ```js
> // the same as above
> $(elem).on('attractmove', onAttractMove);
>
> $(elem).off('attractmove');
> ```

### Check Attracting Result

Check the relationships between `source` and all the other group members

#### .check(sourceDOM[, sourceRect[, alignments]])

> _Default `sourceRect` is the [rectangle](#rectangle-object) of `sourceDOM`_
>
> _Default `alignments` is the [outer/inner/center](#alignments) settings of magnet_

#### Parameter of Check Result

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **source** | _Object_ | [Element object](#element-object) |
| **parent** | _Object_ | [Element object](#element-object) |
| **targets** | _Array_ | Array of [measurement result object](#measurement-result-object) |
| **results** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are array of [measurement results](#measurement-result-object) |
| **rankings** | _Object_ | Object as `results` but each property is sorted from near to far |
| **mins** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are the minimum value of distance |
| **maxs** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are the maximum value of distance |

```js
magnet.add(elem);
magnet.check(elem, ['topToTop', 'bottomToBottom']); // get the result of 'topToTop' and 'bottomToBottom' between the other members

// the same as above
magnet.check(elem, elem.getBoundingClientRect(), ['topToTop', 'bottomToBottom']);
```

> _**jQuery**_
>
> #### [$magnet.check(sourceDOM[, sourceRect[, alignments]])](#checksourcedom-sourcerect-alignments)

### Handle Rectangle Position of Element

Change the position of target member for the input position with checking the attracting relationships between `source` and all the other group members

#### .handle(sourceDOM[, sourceRect[, attractable]])

> _Default `sourceRect` is the [rectangle](#rectangle-object) of `sourceDOM`_
>
> _Default `attractable` is the value of [attractable](#attractable)_

```js
let { top, right, bottom, left } = elem.getBoundingClientRect();
let offset = {
  x: 15,
  y: 10
};
let rect = {
  top: (top-offset.y),
  right: (right-offset.x),
  bottom: (bottom-offset.y),
  left: (left-offset.x),
};
magnet.add(elem);
magnet.handle(elem, rect, true); // move the member to the new rectangle position with the attracting relationship, return this
```

> _**jQuery**_
>
> #### [$magnet.handle(sourceDOM[, sourceRect[, attractable]])](#handlesourcedom-sourcerect-attractable)

### Set Rectangle Position of Member

Directly change the position of member that is faster than `.handle(...)`

#### .setMemberRectangle(sourceDOM[, sourceRect[, useRelativeUnit]])

> _Default `sourceRect` is the [rectangle](#rectangle-object) of `sourceDOM`_
>
> _Default `useRelativeUnit` is the value of [`.getUseRelativeUnit()`](#use-relative-unit)_

```js
let { top, right, bottom, left } = elem.getBoundingClientRect();

magnet.setMemberRectangle(elem, rect);
```

### Before/After/Do Applying Rectangle Position

The group passes the info to target function before/after/do applying the change to target element

> **NOTICE: The function will be called with [rectangle infos](#rectangle-infos) and [attract infos](#attract-infos) as long as dragging the target element**

#### Rectangle Infos

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **origin** | _Object_ | Origin [rectangle object](#rectangle-object) |
| **target** | _Object_ | Target [rectangle object](#rectangle-object) |

#### Attract Infos

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **current** | _Object_ | Current [attract info](#attract-info)s of x/y axises |
| **last** | _Object_ | Last [attract info](#attract-info)s of x/y axises |

#### .beforeAttract = function(targetDom rectangleInfos, attractInfos)

Set to a function for confirming the change

| _Value_ | _Description_ |
| :-: | :- |
| `false` | Apply the original rectangle without attraction |
| `rectangle` | [Rectangle object](#rectangle-object) to apply on the target element |

```js
function beforeAttractFunc(dom, { origin, target }, { current, last }) {
  console.log(this); // manget

  if (MAKE_SOME_CHANGES) {
    // apply other rectangle info
    return {
      top: (target.top - 1),
      right: (target.right + 1),
      bottom: (target.bottom + 1),
      left: (target.left - 1),
    };
  } else if (NO_ATTRACTION) {
    return false; // ignore attraction
  } else if (STILL_NO_ATTRACTION) {
    return origin; // the same as no attraction
  }

  // if went here, it would apply default change
};

magnet.beforeAttract = beforeAttractFunc; // set function
console.log(magnet.beforeAttract); // print function

magnet.beforeAttract = null; // unset function
```

> _**jQuery**_
>
> #### [$magnet.beforeAttract(function(targetDom, rectangleInfos, attractInfos)?)](#beforeattract--functiontargetdom-rectangleinfos-attractinfos)
>
> ```js
> $magnet.beforeAttract(beforeAttractFunc); // set function
> $magnet.beforeAttract(); // get beforeAttractFunc
>
> $magnet.beforeAttract(null); // unset function (input non-function value)
> ```

#### .doAttract = function(targetDom, rectangleInfos, attractInfos)

Set the displacement handly which means the user has to set the style of DOM to apply the position change if need

```js
magnet.doAttract = function(dom, { origin, target }, { current, last }) {
  const { top, right, bottom, left } = origin;
  const { x, y } = current;
  const px = (p) => `${p}px`;

  if (x && y && x.element === y.element) {
    // attract current targets
    const elem = x.element;
    const { width, height } = x.rect;
    const move = (type) => {
      switch (type) {
        case 'topToTop': return elem.style.top = px(top);
        case 'rightToRight': return elem.style.left = px(right-width);
        case 'bottomToBottom': return elem.style.top = px(bottom-height);
        case 'leftToLeft': return elem.style.left = px(left);
        case 'topToBottom': return elem.style.top = px(top-height);
        case 'bottomToTop': return elem.style.top = px(bottom);
        case 'rightToLeft': return elem.style.left = px(right);
        case 'LeftToRight': return elem.style.left = px(left-width);
        case 'xCenter': return elem.style.left = px((right+left-width)/2);
        case 'yCenter': return elem.style.top = px((top+bottom-height)/2);
      }
    }
    move(x.type);
    move(y.type);
  }

  // keep original position
  dom.style.top = px(top);
  dom.style.left = px(left);
});
```

> _**jQuery**_
>
> #### [$magnet.doAttract(function(targetDom, rectangleInfos, attractInfos)?)](#doattract--functiontargetdom-rectangleinfos-attractinfos)

#### .afterAttract = function(targetDom, rectangleInfos, attractInfos)

See what changed after attracting

> _**jQuery**_
>
> #### [$magnet.afterAttract(function(targetDom, rectangleInfos, attractInfos)?)](#afterattract--functiontargetdom-rectangleinfos-attractinfos)

## Usage of Rectangle

### Check Rectangle

#### Magnet.isRect(rect)

Check if `rect` is a rectangle like object with the following object members and rules:

| _Property_ | _Rule_ |
| :-: | :-: |
| **top** | `<= bottom` |
| **right** | `>= left` |
| **bottom** | `>= top` |
| **left** | `<= right` |
| **width** | `= right - left` |
| **height** | `= bottom - top` |
| **x** _(optional)_ | `= left` |
| **y** _(optional)_ | `= top` |

> **NOTICE: Default use `0.0000000001` for bias of calculation**

```js
let rect = { top: 1, right: 2, bottom: 3, left: 4 };
Magnet.isRect(rect); // false: right < left
rect.right = 5;
Magnet.isRect(rect); // true

rect.x = 3;
Magnet.isRect(rect); // false: x != left
rect.x = rect.left;

rect.width = 2;
Magnet.isRect(rect); // false: width != (right - left)
```

### Standardize Rectangle

#### Magnet.stdRect(rect)

Return a [rectangle object](#rectangle-object) if `rect` is a HTML element or a valid rectangle like object:

| _Property_ | _Rule_ |
| :-: | :- |
| **top** | Inherit from `rect` |
| **right** | Inherit from `rect` |
| **bottom** | Inherit from `rect` |
| **left** | Inherit from `rect` |
| **width** | Inherit from `rect` or set to `right - left` |
| **height** | Inherit from `rect` or set to `bottom - top` |
| **x** | Inherit from `rect` or set to `left` |
| **y** | Inherit from `rect` or set to `top` |

```js
Magnet.stdRect(rect); // get a rectangle object
```

### Measure Distance between Rectangles

#### Magnet.measure(source, target[, options])

Measure distance between 2 elements/rectangles

#### Options

Options of measurement:

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **alignments** | _Array_ | Array of [alignment properties](#alignment-properties). Default is **ALL** alignment properties |
| **absDistance** | _Boolean_ | `false` to allow negative value of distance. Default is `true` |

```javascript
let rectA = { top: 0, right: 3, bottom: 1, left: 2 };
let rectB = { top: 10, right: 13, bottom: 11, left: 12 };
Magnet.measure(rectA, rectB); // MeasureResult object
```

> _Alias_
>
> #### Magnet.diffRect(source, target[, options])
>
> ```js
> Magnet.diffRect(rectA, rectB);
> ```

#### Result of Measurement

> See [measurement result object](#measurement-result-object)

### _DEPRECATED_ Methods

#### Magnet.nearby(...)

> To reduce the usless calculations of measurement, it's recommended to call `Magnet.measure`/`Magnet.diffRect` independently and handle the results handly to get what you really want.

## References

### Magnet Default Values

| _Property_ | _Type_ | _Description_ | _Default_ |
| :-: | :-: | :- | :-: |
| **distance** | _Number_ | Distance to attract | `0` |
| **attractable** | _Boolean_ | Ability to attract | `true` |
| **allowCtrlKey** | _Boolean_ | Ability to use `ctrl` key to unattract | `true` |
| **stayInParent** | _Boolean_ | Stay in parent element | `false` |
| **alignOuter** | _Boolean_ | Align outer edges to that of the others | `true` |
| **alignInner** | _Boolean_ | Align inner edges to that of the others | `true` |
| **alignCenter** | _Boolean_ | Align x/y center to that of the others | `true` |
| **alignParentCenter** | _Boolean_ | Align x/y center to that of parent element | `false` |

### Alignment Properties

| _Value_ | _Description_ |
| :-: | :- |
| **topToTop** | Source `top` to target `top` _(inner)_ |
| **rightToRight** | Source `right` to target `right` _(inner)_ |
| **bottomToBottom** | Source `bottom` to target `bottom` _(inner)_ |
| **leftToLeft** | Source `left` to target `left` _(inner)_ |
| **topToBottom** | Source `top` to target `bottom` _(outer)_ |
| **bottomToTop** | Source `bottom` to target `top` _(outer)_ |
| **rightToLeft** | Source `right` to target `left` _(outer)_ |
| **leftToright** | Source `left` to target `right` _(outer)_ |
| **xCenter** | Source `x` middle to target `x` middle _(center)_ |
| **yCenter** | Source `y` middle to target `y` middle _(center)_ |

### Attract Info

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **type** | _String_ | [Alignment property name](#alignments) |
| **rect** | _Object_ | Rectangle object of element |
| **element** | _DOM_ | HTML element |
| **position** | _Number_ | Absolute offset `px` based on window's top/left |
| **offset** | _Number_ | Offset `px` based on parent element |

### Rectangle Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **top** | _Number_ | The same as `y` |
| **right** | _Number_ | |
| **bottom** | _Number_ | |
| **left** | _Number_ | The same as `x` |
| **width** | _Number_ | The same as `right - left` |
| **height** | _Number_ | The same as `bottom - top` |
| **x** | _Number_ | The same as `left` |
| **y** | _Number_ | The same as `top` |

### Element Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **rect** | _Object_ | [Rectangle object](#rectangle-object) |
| **element** _(optional)_ | _DOM_ | HTML element. `undefined` if the source is a pure rectangle like object |

### Measurement Value Object

> **NOTICE: All the properties inherit from [alignment properties](#alignment-properties)**

| _Value_ | _Type_ |
| :-: | :-: |
| **topToTop** _(optional)_ | _Number_ |
| **rightToRight** _(optional)_ | _Number_ |
| **bottomToBottom** _(optional)_ | _Number_ |
| **leftToLeft** _(optional)_ | _Number_ |
| **topToBottom** _(optional)_ | _Number_ |
| **bottomToTop** _(optional)_ | _Number_ |
| **rightToLeft** _(optional)_ | _Number_ |
| **leftToright** _(optional)_ | _Number_ |
| **xCenter** _(optional)_ | _Number_ |
| **yCenter** _(optional)_ | _Number_ |

### Measurement Result Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| **source** | _Object_ | [Element object](#element-object) |
| **target** | _Object_ | [Element object](#element-object) |
| **results** | _Object_ | [Measurement value object](#measurement-value-object). The properties follow the input [alignment properties](#alignment-properties) of measurement | **ranking** | _Array_ | Array of [alignment properties](#alignment-properties) sorted from near to far |
| **min** | _String_ | [Alignment property](#alignment-properties) with minimum distance |
| **max** | _String_ | [Alignment property](#alignment-properties) with maximum distance |

> **NOTICE: The following properties are DEPRECATED**
>
> | _Property_ | _Type_ | _Replacement_ |
> | :-: | :-: | :-: |
> | topToTop | _Number_ | `results.topToTop` |
> | topToBottom | _Number_ | `results.topToBottom` |
> | rightToRight | _Number_ | `results.rightToRight` |
> | rightToLeft | _Number_ | `results.rightToLeft` |
> | bottomToTop | _Number_ | `results.bottomToTop` |
> | bottomToBottom | _Number_ | `results.bottomToBottom` |
> | xCenter | _Number_ | `results.xCenter` |
> | yCenter | _Number_ | `results.yCenter` |

## License

[MIT](/LICENSE) Copyright @ Wan Wan
