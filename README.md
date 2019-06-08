# Magnet.js
Magnet.js is a JavaScript library for grouping HTML elements then make them draggable and attractable each other.

# Demo
[Basic demo](https://lf2com.github.io/magnet.js/demo/demo_types.html)

- Configure magnet attract distance
- Stay in parent element
- Align to outside/inside edge of the others
- Align to the others x/y center
- Align to the parent element's x/y center

[Group demo](https://lf2com.github.io/magnet.js/demo/demo_groups.html)

4 magnet groups that can attract the others in their own groups or all the other group members.

# Install
### NodeJS
```nodejs
npm install https://github.com/lf2com/magnet.js
```

#### Build
The required codes are `./index.js` and `./libs/*.js`. All dependencies in `./package.json` are only used for building a packaged and minified `./magnet.min.js`. It is easy to build a browser-used **`magnet.js`** with your own ways.

There is a script for building the codes into `./magnet.min.js`:
```nodejs
npm run build
```
Which runs
```nodejs
browserify magnet.js -t [ babelify --presets [ es2015 stage-0 ] ] | uglifyjs -cm > magnet.min.js
```

### Browser
Download [**`./magnet.min.js`**](https://lf2com.github.io/magnet.js/magnet.min.js) from this repository.
```html
<script src="PATH/TO/magnet.min.js"></script>
```

# Usage

## Magnet

### Create
Create a magnet group. All the elements added into the group would be applied the attract behaviors.
```javascript
let magnet = new Magnet();
```

### Add
Add HTML elements into the group
#### .add(...DOMs)
```javascript
magnet.add(document.querySelectorAll('.magnet'));
```
> _Or add HTML element when creating a group_
> ```javascript
> let magnet = new Magnet(document.querySelectorAll('.magnet'));
> ```

> _Flexable ways to add elements_
> ```javascript
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

### Remove
Remove HTML elements from the group
#### .remove(...DOMs)
> _**Keep** the positon changed by the magnet_
> ```javascript
> magnet.remove(document.querySelector('.magnet'));
> ```

#### .removeFull(...DOMs)
> _**Remove** the positions changed by the magnet_
> ```javascript
> magnet.removeFull(document.querySelector('.magnet'))
> ```

> _Flexable ways to remove elements_
> ```javascript
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

### Clear
Remove all the HTML elements from the group
#### .clear()
> _**Keep** the position changed by the magnet_
> ````javascript
> magnet.clear();
> ````

#### .clearFull()
> _**Remove** the position changed by the magnet_
> ```javascript
> magnet.clearFull();
> ```

### Distance
Distance for elements to attract others in the same group

#### .distance(px?)
_Unit `px`; Default is `0`_
> Get/set distance
> ```javascript
> magnet.distance(15); // set: unit px
> magnet.distance(); // get: 15
> ```

##### Alias
> #### .setDistance(px)
> ```javascript
> magnet.setDistance(15); // set to 15
> ```

> #### .getDistance()
> ```javascript
> magnet.getDistance(); // get 15
> ```

### Attractable
Attractable between group members

**Setting to `false` has the same as pressing `ctrl` key**

#### .attractable(enabled?)
_Default is `true`_
> Get/set attractable
> ```javascript
> magnet.attractable(true); // set to attract members
> magnet.attractable(); // get: true
> ```

##### Alias
> #### .setAttractable(enabled)
> ```javascript
> magnet.setAttractable(true); // set to true
> ```

> #### .getAttractable()
> ```javascript
> magnet.getAttractable(); // get true
> ```

### Allow `Ctrl` Key
Allow to press `ctrl` key to be unattractable temporarily

**Pressing `ctrl` key makes group members unattractable, any magnet related event will not be triggered**

#### .allowCtrlKey(enabled?)
_Default is `true`_
> Get/set allow ctrl key
> ```javascript
> magnet.allowCtrlKey(true); // set to allow ctrl key
> magnet.allowCtrlKey(); // get: true
> ```

##### Alias
> #### .setAllowCtrlKey(enabled)
> ```javascript
> magnet.setAllowCtrlKey(true); // set to true
> ```

> #### .getAllowCtrlKey()
> ```javascript
> magnet.getAllowCtrlKey(); // get true
> ```

### Alignment
Magnet supports the following alignments:

| _Type_ | _Description_ | _Default_ |
|-|-|-|
| **outer** | align edges to other edges from outside | `true` |
| **inner** | align edges to other edges from inside | `true` |
| **center** | align middle x/y to other's middle x/y | `true` |
| **parent center** | align middle x/y to parent's middle x/y | `false` |

#### .enabledAlign{prop}(enabled?)
> Get/set enabled of alignment
> ```javascript
> magnet.enabledAlignOuter(true); // set: align to element outside edges. default is true
> magnet.enabledAlignInner(false); // set: align to element inside edges. default is true
> magnet.enabledAlignCenter(true); // set: align to element middle line. default is true
> magnet.enabledAlignParentCenter(false); // set: alien to parent element middle line, default is false
>
> magnet.enabledAlignOuter(); // get: true
> ```

##### Alias
> #### .setEnabledAlign{prop}(enabled)
> ```javascript
> magnet.setEnabledAlignOuter(true); // set to true
> ```

> #### .getEnabledAlign{prop}()
> ```javascript
> magnet.getEnabledAlignOuter(); // get true
> ```

### Parent element
> #### _CAUTION_
> **Parent** may not be the first `parentNode` of the current element.
> 
> **Parent** is the `parentNode` whose `style.position` is not set to `static` from the current element
> 
> All the magnet members `top`/`left` of position is based on the **parent** element

Force elements of group not to be out of the edge of parent element

#### .stayInParentEdge(enabled?)
_Default is `false`_
> Get/set stay inside of the parent
> ```javascript
> magnet.stayInParentEdge(true); // set: not to move outside of the parent element. default is false
> magnet.stayInParentEdge(); // get: true
> ```

##### Alias
> #### .stayInParentElem(enabled?)
> ```javascript
> magnet.stayInParentElem(true); // set to true
> magnet.stayInParentElem(); // get true
> ```

##### Alias
> #### .setStayInParent(enabled)
> ```javascript
> magnet.setStayInParent(true); // set to true
> ```

> #### .getStayInParent()
> ```javascript
> magnet.getStayInParent(); // get true
> ```

### Events of Magnet
Magnet supports the following events:

| _Name_ | _description_ |
|-|-|
| **magnetenter** | when the last result has no any attract but now it does |
| **magnetstart** | the same as `magnetenter` |
| **magnetleave** | when the last result has any attract but now it doesn't |
| **magnetend** | the same as `magnetleave` |
| **magnetchange** | when any change of attract, including start/end and the changes of attracted alignment properties |

#### Parameters of Magnet Event
Each event has the following members in the detail of event object:

| _Property_ | _Type_ | _Description_ |
|-|-|-|
| **source** | _DOM_ | HTML element that is dragged |
| **x** | _Object_ | [Attract info](#attract-info) of x-axis, `null` if no attract |
| **y** | _Object_ | [Attract info](#attract-info) of y-axis, `null` if no attract |

#### .on(eventNames, functions)
Add event listener
```javascript
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

#### .off(eventNames)
Remove event listeners
```javascript
magnet.off('magnetenter magnetleave magnetchange'); // remove event listeners

// the same as above
magnet
  .off('magnetenter')
  .off('magnetleave')
  .off('magnetchange');
```

### Events of magnet members
Magnet members supports the following events:

| _Name_ | _description_ |
|-|-|
| **attract** | when the focused member attract to other members |
| **unattract** | when the focused member unattract from other members |
| **attracted** | when the member is attracted by the focused member |
| **unattracted** | when the member is unattracted by the focused member |

#### Parameters of `attract`/`unattract`
Events of `attract` and `unattract` have the following members in the detail of event object:

| _Property_ | _Type_ | _Description_ |
|-|-|-|
| **x** | _Object_ | [Attract info](#attract-info) of x-axis, `null` if no attract |
| **y** | _Object_ | [Attract info](#attract-info) of y-axis, `null` if no attract |

```javascript
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

// add event listener on DOMs
elem.addEventListener('attract', onAttract);
elem.addEventListener('unattract', onUnattract);

// remove event listener on DOMs
elem.removeEventListener('attract', onAttract);
elem.removeEventListener('unattract', onUnattract);
```

#### Parameters of `attracted`/`unattracted`
Events of `attracted` and `unattracted` have the target member in the detail of event object

```javascript
function onAttracted(evt) {
  let dom = evt.detail;
  console.log('attracted', dom); // be attracted by dom
}
function onUnattracted(evt) {
  let dom = evt.detail;
  console.log('unattracted', dom); // be unattracted by dom
}

// add event listener on DOMs
elem.addEventListener('attracted', onAttracted);
elem.addEventListener('unattracted', onUnattracted);

// remove event listener on DOMs
elem.removeEventListener('attracted', onAttracted);
elem.removeEventListener('unattracted', onUnattracted);
```

### Check
Check the relationship between `source` and all the group members
#### .check(sourceDOM, sourceRect[, alignments])

#### Parameter of Check Result
| _Property_ | _Type_ | _Description_ |
|-|-|-|
| **source** | _Object_ | [Element object](#element-object) |
| **parent** | _Object_ | [Element object](#element-object) |
| **targets** | _Array_ | Array of [measurement result object](#measurement-result-object) |
| **results** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are array of [measurement results](#measurement-result-object) |
| **rankings** | _Object_ | Object as `results` but each property is sorted from near to far |
| **mins** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are the minimum value of distance |
| **maxs** | _Object_ | Object with [alignment properties](#alignment-properties) and the values are the maximum value of distance |

## Rect

### Check Rectangle
#### Magnet.isRect(rect)
Check if `rect` is a rectangle like object with the following object members and rules:

| _Property_ | _Rule_ |
|-|-|
| **top** | `<= bottom` |
| **right** | `>= left` |
| **bottom** | `>= top` |
| **left** | `<= right` |
| **width** | `= right - left` |
| **height** | `= bottom - top` |
| **x** _(optional)_ | `= left` |
| **y** _(optional)_ | `= top` |

> Use `0.0000000001` for bias of calculation

```javascript
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
|-|-|
| **top** | Inherit from `rect` |
| **right** | Inherit from `rect` |
| **bottom** | Inherit from `rect` |
| **left** | Inherit from `rect` |
| **width** | Inherit from `rect` or set to `right - left` |
| **height** | Inherit from `rect` or set to `bottom - top` |
| **x** | Inherit from `rect` or set to `left` |
| **y** | Inherit from `rect` or set to `top` |

```javascript
Magnet.stdRect(rect); // get a rectangle object
```

### Measure Distance between Rectangles
#### Magnet.measure(source, target[, options])
Measure distance between 2 elements/rectangles

#### Options
Options of measurement:

| _Property_ | _Type_ | _Description_ |
|-|-|-|
| **alignments** | _Array_ | Array of [alignment properties](#alignment-properties). Default is **ALL** alignment properties |
| **absDistance** | _Boolean_ | `false` to allow negative value of distance. Default is `true` |

```javascript
let rectA = { top: 0, right: 3, bottom: 1, left: 2 };
let rectB = { top: 10, right: 13, bottom: 11, left: 12 };
Magnet.measure(rectA, rectB); // MeasureResult object
```

##### Alias
> #### Magnet.diffRect(source, target[, options])
> ```javascript
> Magnet.diffRect(rectA, rectB);
> ```

#### Result of Measurement
See [measurement result object](#measurement-result-object)

### _DEPRECATED_ Methods
#### Magnet.nearby(...)
To reduce the usless calculations of measurement, it's recommended to call `Magnet.measure`/`Magnet.diffRect` independently and handle the results handly to get what you really want.

## References

### Alignment Properties
| _Value_ | _Description_ |
|-|-|
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
|-|-|-|
| **type** | _String_ | [Alignment property name](#alignment) |
| **rect** | _Object_ | Rectangle object of element |
| **element** | _DOM_ | HTML element |
| **position** | _Number_ | Absolute offset `px` based on window's top/left |
| **offset** | _Number_ | Offset `px` based on parent element |

### Rectangle Object
| _Property_ | _Type_ | _Description_ |
|-|-|-|
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
|-|-|-|
| **rect** | _Object_ | [Rectangle object](#rectangle-object) |
| **element** _(optional)_ | _DOM_ | HTML element. `undefined` if the source is a pure rectangle like object |

### Measurement Value Object
_**All the properties inherit from [alignment properties](#alignment-properties)**_

| _Value_ | _Type_ |
|-|-|
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
|-|-|-|
| **source** | _Object_ | [Element object](#element-object) |
| **target** | _Object_ | [Element object](#element-object) |
| **results** | _Object_ | [Measurement value object](#measurement-value-object). The properties follow the input [alignment properties](#alignment-properties) of measurement | **ranking** | _Array_ | Array of [alignment properties](#alignment-properties) sorted from near to far |
| **min** | _String_ | [Alignment property](#alignment-properties) with minimum distance |
| **max** | _String_ | [Alignment property](#alignment-properties) with maximum distance |

**The following properties are DEPRECATED**
> | _Property_ | _Type_ | _Replacement_ |
> |-|-|-|
> | topToTop | _Number_ | `results.topToTop` |
> | topToBottom | _Number_ | `results.topToBottom` |
> | rightToRight | _Number_ | `results.rightToRight` |
> | rightToLeft | _Number_ | `results.rightToLeft` |
> | bottomToTop | _Number_ | `results.bottomToTop` |
> | bottomToBottom | _Number_ | `results.bottomToBottom` |
> | xCenter | _Number_ | `results.xCenter` |
> | yCenter | _Number_ | `results.yCenter` |