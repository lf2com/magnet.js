# Magnet.js
Magnet.js is a JavaScript library for grouping HTML elements then make them draggable and attractable each other.

# Demo
[Basic demo](https://lf2com.github.io/magnet.js/demo/demo_types.html)

Configure magnet attract distance, stay in parent element, align outside/inside edge and align x/y center.

[Group demo](https://lf2com.github.io/magnet.js/demo/demo_groups.html)

4 magnet groups that can be attract in their own groups or configure to attract all the other group members.

# Install
### NodeJS
```nodejs
npm install https://github.com/lf2com/magnet.js
```

##### Build
The required codes are `magnet.js` and `lib/*.js`. All dependencies in `package.json` are only used for building a packaged and minified `magnet.min.js`. It is easy to build a browser-used `magnet.js` with your own ways.

There is a script to build `magnet.min.js`:
```nodejs
npm run build
```
Which runs
```nodejs
browserify magnet.js -t [ babelify --presets [ es2015 ] ] | uglifyjs -cm > magnet.min.js
```

### Browser
Download `magnet.min.js` from this repository.
```html
<script src="PATH/TO/magnet.min.js"></script>
```

# How to use
### Create magnet group
```javascript
let magnet = new Magnet();
```

### Add HTML elements
```javascript
magnet.add(document.querySelectorAll('.magnet'));
```
Or add HTML element when creating magnet group.
```javascript
let magnet = new Magnet(document.querySelectorAll('.magnet'));
```

### Remove HTML elements
```javascript
magnet.remove(document.querySelector('.magnet'));
```

### Clear magnet group
````javascript
magnet.clear();
````

### Set attract distance
**Dragging magnet element with `ctrl` pressed has the same effect as setting `distance` to 0.**
```javascript
magnet.distance(15); // unit px, default is 0
magnet.distance(); // 15
```

### Set alignment types
```javascript
magnet.enabledAlignOuter(true); // align element outside edges, default is true
magnet.enabledAlignInner(true); // align element inside edges, default is true
magnet.enabledAlignCenter(true); // align element middle line, default is true
magnet.enabledAlignOuter(); // true
```

### Set to keep element in the parent element
```javascript
magnet.stayInParentElem(true); // default is false
magnet.stayInParentElem(); // true
```

### Event listener for magnet events
**Magnet enter/leave events would not be triggered if `ctrl` is pressed.**
```javascript
// triggered when elements attract each other
magnet.on('magnetenter', function(e) {
  console.log('magnetenter', e.detail); // detail info
});

// triggered when mouseup or no elements attract each other
magnet.on('magnetleave', function(e) {
  console.log('magnetleave');
});

magnet.off('magnetenter magnetleave'); // remove event listeners
```

### Event listener for magnet group elements
**Magnet element events would not be triggered if `ctrl` is pressed.**
```javascript
let elem = document.querySelector('.block');
magnet.add(elem);

// triggered when element were dragging and attract any other magnet elements
elem.addEventListener('attract', function(e) {
  console.log('attract', e.detail); // detail info
});

// triggered when element mouseup or were dragging and unattract any of other magnet elements
elem.addEventListener('unattract', function(e) {
  console.log('unattract');
});

// triggered when magnet element were attracted by a dragging magnet element
elem.addEventListener('attracted', function(e) {
  console.log('attracted', e.detail); // detail info
});

// triggered when magnet element were no longer attracted by a dragging magnet element
elem.addEventListener('unattracted', function(e) {
  console.log('unattracted');
});
```

### Find the nearby elements from magnet group elements
```javascript
magnet.nearby(document.querySelector('.block')); // NearbyResult object
```

# Magnet methods
### Check if parameter is rect
```javascript
let rect = { top: 1, right: 2, bottom: 3, left: 4 };
Magnet.isRect(rect); // false, rect.right should larger then rect.left
rect.right = 5;
Magnet.isRect(rect); // true

rect.x = 3;
Magnet.isRect(rect); // false, rect.x sould equal to rect.left
rect.x = rect.left;

rect.width = 2;
Magnet.isRect(rect); // false, rect.width should equal to (rect.right - rect.left)
```

### Standardize rect
```javascript
Magnet.stdRect(rect); // Rect object
```

### Measure distance result between 2 elements
```javascript
let rectA = { top: 0, right: 3, bottom: 1, left: 2 };
let rectB = { top: 10, right: 13, bottom: 11, left: 12 };
Magnet.measure(rectA, rectB); // MeasureResult object
```

### Find the nearby elements
```javascript
let rect = { top: 1, right: 4, bottom: 2, left: 3 };
Magnet.nearby(rect, document.querySelectorAll('.magnet')); // NearbyResult object
```

# Object properties
### Rect
| property | type | description |
| - | - | - |
| top | _Number_ | top, inherit from parameter |
| right | _Number_ | right, inherit from parameter |
| bottom | _Number_ | bottom, inherit from parameter |
| left | _Number_ | left, inherit from parameter |
| x | _Number_ | `left` |
| y | _Number_ | `top` |
| width | _Number_ | `right - left` |
| height | _Number_ | `bottom - top` |

### MeasureResult
| property | type | description |
| - | - | - |
| source | _Object_ | `rect` for rect; if source is element, `element` for it |
| target | _Object_ | `rect` for rect; if target is element, `element` for it |
| topToTop | _Number_ | distance between source top and target top **(inside)** |
| topToBottom | _Number_ | distance between source top and target bottom **(outside)** |
| rightToRight | _Number_ | distance between source right and target right **(inside)** |
| rightToLeft | _Number_ | distance between source right and target left **(outside)** |
| bottomToTop | _Number_ | distance between source bottom and target top **(outside)** |
| bottomToBottom | _Number_ | distance between source bottom and target bottom **(inside)** |
| xCenter | _Number_ | distance between source x center and target x center **(middle)** |
| yCenter | _Number_ | distance between source y center and target y center **(middle)** |
| ranking | _Array_ | ascending-order array of above distance properties |
| min | _String_ | minimum distance property |
| max | _String_ | maximum distance property |

### NearbyResult
| property | type | description |
| - | - | - |
| source | _Object_ | `rect` for rect; if source is element, `element` for it |
| topToTop | _[MeasureResult](#measureresult)_ | the nearest top to top measure result **(inside)** |
| topToBottom | _[MeasureResult](#measureresult)_ | the nearest top to bottom measure result **(outside)** |
| rightToRight | _[MeasureResult](#measureresult)_ | the nearest right to right measure result **(inside)** |
| rightToLeft | _[MeasureResult](#measureresult)_ | the nearest right to left measure result **(outside)** |
| bottomToTop | _[MeasureResult](#measureresult)_ | the nearest bottom to top measure result **(outside)** |
| bottomToBottom | _[MeasureResult](#measureresult)_ | the nearest bottom to bottom measure result **(inside)** |
| leftToRight | _[MeasureResult](#measureresult)_ | the nearest left to right measure result **(outside)** |
| leftToLeft | _[MeasureResult](#measureresult)_ | the nearest left to left measure result **(inside)** |
| xCenter | _[MeasureResult](#measureresult)_ | the nearest x centers measure result **(middle)** |
| yCenter | _[MeasureResult](#measureresult)_ | the nearest y centers measure result **(middle)** |
| min | _String_ | minimum distance property |
| max | _String_ | maximum distance property |
| ranking | _Array_ | ascending-order array of above distance properties |
