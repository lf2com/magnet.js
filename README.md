# Magnet.js

Magnet.js is a JavaScript library making HTML elements attractable to other magnet elements.

## Demo



## Usage

[url-github]: https://github.com/lf2com/magnet.js
[url-npmjs]: https://www.npmjs.com/package/@lf2com/magnet.js

Install from [GitHub][url-github] or [npmjs][url-npmjs]:

```sh
npm install @lf2com/magnet.js
# or
npm install https://github.com/lf2com/magnet.js
```

Import to your project:

```js
import '@lf2com/magnet.js';
// or
require('@lf2com/magnet.js');
```

### Browser

We can add the script file to the HTML file and use magnet.js directly:

```html
<script src="PATH/TO/magnet.js"></script>

<!-- create magnet -->
<magnet-block>
  A magnet block
</magnet-block>

<magnet-block>
  <div>
    Or wrap an element
  </div>
</magnet-block>
```

## Build

We can build magnet.js by the command:

```sh
npm run build
```

### Magnet DOMs

There are 2 DOMs of magnet elements: [\<magnet-block\>](#magnet-block) and [\<magnet-pack\>](#magnet-pack).

#### \<magnet-block\>

Wraps element for being dragged and attracted by other magnet elements.

```html
<magnet-block>
  <div style="padding: 1em; background-color: #eee;">
    Draggable element
  </div>
</magnet-block>

<!-- or directly use <magnet-block> -->
<magnet-block style="padding: 1em; background-color: #eee;">
  Draggable element
</magnet-block>
```

#### \<magnet-pack\>

Defines the default settings of children magnet elements if they don't have assigned the corresponding values.

```html
<magnet-pack attract-distance="20">
  <!-- reference to the nearest magnet parent which has the magnet setting -->
  <magnet-block>
    Attract in 20
  </magnet-block>
  
  <!-- apply the magnet setting of itself -->
  <magnet-block attract-distance="10">
    Attract in 10
  </magnet-block>
</magnet-pack>
```

## Properties

Properties are defined as the settings of magnet element. If the magnet in active has no specific magnet setting, it would look up to the nearest magnet parent node which has the value. Or the setting would be the global default one.

### .disabled

Disables to be dragging and attracted. If set, the magnet would be as a normal element.

```html
<!-- disable magnet -->
<magnet-block disabled>
  Disabled magnet
</magnet-block>
```

```js
// disable magnet
magnet.disabled = true;
// or
magnet.setAttribute('disabled', '');

// get disabled
console.log('Disabled:', magnet.disabled);
// or
console.log('Disabled:', magnet.hasAttribute('disabled'));
```

### .group

The group of magnet elemnt. Once the magnet is assigned a group, it would only attract magnets with the same group. If no group is assigned, the magnet can attract any magnets even the target magnet belongs to any group.

```html
<!-- set group -->
<magnet-block group="alpha">
  Attract alpha magnets
</magnet-block>
<magnet-block group="beta">
  Attract beta magnets
</magnet-block>
<magnet-block>
  Attract any magnet
</magnet-block>
```

```js
// set group
magnet.group = 'alpha';
// or
magnet.setAttribute('group', 'alpha');

// get group
console.log('Group:', magnet.group);
// or
console.log('Group:', magnet.getAttribute('group'));
```

### .parentMagnet

Returns the nearest parent magnet node.

> **If the child magnet has group, the result would be the nearest parent magnet without any group or with the same group as child magnet.**

```js
// get parent magnet
console.log('Nearest parent magnet:', magnet.parentMagnet);
```

### .unattractable

Set true to disallow magnet from being attracted.

```html
<!-- set unattractable -->
<magnet-block unattractable>
  Unattractable magnet
</magnet-block>
```

```js
// set unattractable
magnet.unattractable = true;
// or
magnet.setAttribute('unattractable', '');

// get unattractable
console.log('Unattractable:', magnet.unattractable);
// or
console.log('Unattractable:', magnet.hasAttribute('unattractable'));
```

### .unmovable

Set true to disallow magnet from being dragged.

```html
<!-- set unmovable -->
<magnet-block unmovable>
  Unmovable magnet
</magnet-block>
```

```js
// set unmovable
magnet.unmovable = true;
// or
magnet.setAttribute('unmovable', '');

// get unmovable
console.log('Unmovable:', magnet.unmovable);
// or
console.log('Unmovable:', magnet.hasAttribute('unmovable'));
```

### .attractDistance

Attraction distance of dragged magnet.

> **We don't define the distance of how a magnet be attracted. We only define the distance of a magnet attracting others.**

```html
<!-- set distance of attraction -->
<magnet-block attract-distance="20">
  Attract in 20
</magnet-block>
```

```js
// set distance of attraction
magnet.attractDistance = 20;
// or
magnet.setAttribute('attract-distance', '20');

// get distance of attracion
console.log('Attraction distance:', magnet.attractDistance);
// or in string type
console.log('Attraction distance:', magnet.getAttribute('attract-distance'));
```

### .alignTos

The target alignment edge bases such as `outer`, `inner`, `center` and `extend`:

| Name | Description |
| -: | :- |
| outer | Align to target from outer edges |
| inner | Align to target from inner edges |
| center | Align on center lines of target |
| extend | Align to the defined edge bases on extended line. **Align to nothing if only set `extend`** |

> **Use `|` as separator for multiple values when assigning the value with single string.**

```html
<!-- set align to -->
<magnet-block align-to="outer|extend">
  Align on outer anywhere
</magnet-block>
```

```js
// set align to
magnet.alignTos = ['outer', 'extend'];
// or
magnet.alignTos = 'outer|extend';
// oe
magnet.setAttribute('align-to', 'outer|extend');

// get align to
console.log('Align to:', magnet.alignTos);
// or in raw string
console.log('Align to:', magnet.getAttribute('align-to'));
```

### .alignToParents

The target alignment edge bases of parent node of magnet element such as `inner` and `center`:

| Name | Description |
| -: | :- |
| inner | Align to target from inner edges |
| center | Align on center lines of target |

> **Only allow `inner` and `center` due to the magnet aligns to its parent inside.**
>
> **Use `|` as separator for multiple values when assigning the value with single string.**

```html
<!-- set align to parent -->
<magnet-block align-to-parent="inner|center">
  Align on inner
</magnet-block>
```

```js
// set align to parent
magnet.alignToParents = ['inner', 'center'];
// or
magnet.alignToParents = 'inner|center';
// oe
magnet.setAttribute('align-to-parent', 'inner|center');

// get align to
console.log('Align to parent:', magnet.alignToParents);
// or in raw string
console.log('Align to parent:', magnet.getAttribute('align-to-parent'));
```

### .crossPrevents

Prevents magnet from crossing specific targets such as `parent`:

| Name | Description |
| -: | :- |
| parent | The parent node of magnet |

> **Currently only support `parent`.**

```html
<!-- set cross prevent -->
<magnet-block cross-prevent="parent">
  Not across parent
</magnet-block>
```

```js
// set cross prevent
magnet.crossPrevents = ['parent'];
// or
magnet.crossPrevents = 'parent';
// or
magnet.setAttribute('cross-prevent', 'parent');

// get cross prevent
console.log('Cross prevent:', magnet.crossPrevents);
// or in raw string
console.log('Cross prevent:', magnet.getAttribute('cross-prevent'));
```

### .magnetRect

Returns the [rect object](#rect) of temporarily created magnet.

```js
console.log('Magnet rect:', magnet.magnetRect);
```

### .parentMagnetPack

Returns the [pack object](#pack) of the temporarily created parent of magnet.

> **This property only exists on \<magnet-block\> elements.**

```js
const parentPack = magnet.parentMagnetPack;

if (parentPack) {
  console.log('Parent rect:', parentPack.rect);
}
```

### .targetMagnetPacks

Returns the [pack objects](#pack) of the temporarily created target magnets.

```js
console.log('Attractable magnets:', magnet.targetMagnetPacks);
```

### .lastMagnetOffset

Returns the last offset of magnet in [_Point_](#point).

> **This property only exists on \<magnet-block\> elements.**

```js
const lastOffset = magnet.lastMagnetOffset;

console.log(`Last offset: (${lastOffset.x}, ${lastOffset.y})`);
```

### .bestAttraction

Returns the result of best attraction as [_AttractionBest_](#attractionbest) on the last time.

> **This property only exists on \<magnet-block\> elements.**

```js
const bestAttraction = magnet.bestAttraction;

console.log('Best attraction:', bestAttraction);
```

## Methods

There are several methods for magnet elements to handle magnet related stuffs.

### Static

#### Magnet.calcMagnetAttraction(_source_, _target_, _options?_)

Returns the [attraction result](#attraction) of `source` attracting to `target` with `options`. The `source` and `target` should be a DOM or an object that can be converted to rectangle.

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| attractDistance? | _number_ | Distance of attraction. Default is `Infinity` |
| alignTos? | [_AlignTo_](#aligntos) | The target alignment edge bases. Default is all edge bases |
| alignments? | [_Alignment_](#alignments) | Alignment types of attraction. Default is the alignments of _alignTos_ |
| onJudgeDistance? | (disatnce: [_Distance_](#distance)) => _boolean_ | A function returning `true` if the input distance result passed the judgement, then the distance would be added to the result list |
| attractionBest? | [_AttractionBest_](#attractionbest) | An initial best result for comparison of all the alignments of attraction |

#### Magnet.calcMultiMagnetAttraction(_source_, _targets_, _options?_)

Returns the attraction result of `source` attracting `targets` with `options`. The `targets` is an array composed with DOMs or objects that can be converted to rectangles.

The properties of `options` extends those of [`Magnet.calcMagnetAttraction()`](#magnetcalcmagnetattractionsource-target-options):

| Name | Type | Description |
| -: | :-: | :- |
| onJudgeAttraction? | (attraction: [_Attraction_](#attraction)) => _boolean_ | A function returning `true` if the input attraction result passed the judgement, then the distance results of attraction would be added to the result list |

#### Magnet.getMagnetAttractionOffset(_attraction_)

Returns the offset of the attraction result in [_Point_](#point).

### Prototype

#### .traceMagnetAttributeValue(_attrName_)

Returns the specific attribute value for the magnet element. If the magnet doesn't have the value, it would look up to the [parent magnet](#parentmagnet) which has the value. Or return `null`.

> **By default all the above properties of magnet return the traced value.**

```js
// get group
const group = magnet.traceMagnetAttributeValue('group');
// equals to
const group = magnet.group;
```

```html
<!-- or we can define custom attribute -->
<magnet-pack some-attr="some-value">
  <magnet-block id="magnet">
    ...
  </magnet-block>
</magnet-pack>

<script>
  const magnet = document.getElementById('magnet');

  // and trace the custom attribute
  magnet.traceMagnetAttributeValue('some-attr'); // 'some-value'
</script>
```

#### .resetMagnetRect()

Removes the temporarily created [rect object](#rect) of the magnet.

#### .resetParentMagnetPack()

Removes the temporarily created [pack object](#pack) of the parent of magnet.

#### .resetTargetMagnets()

Removes the temporarily created [pack objects](#pack) of the target magnets.

#### .getOtherMagnets()

Returns all magnet elements except the magnet itself.

#### .getAttractableMagnets()

Returns all magnet elements that can be attracted by the magnet. That means the returned magnets are **NOT** [_disabled_](#disabled) or [_unattractable_](#unattractable) and already considered their relationship of [_group_](#group).

#### .judgeMagnetDistance(_distance_)

Returns `true` if the input distance result passed the judgement.

#### .judgeMagnetDistanceInParent(_distance_, _options?_)

The same as [`.judgeMagnetDistance()`](#judgemagnetdistancedistance) but also consider a wrapper element.

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| parent? | [_Pack_](#pack) \| _Rectable_ | Element as the wrapper of magnet. Default is `document.body` |
| onJudgeDistance? | [`.judgeMagnetDistance`](#judgemagnetdistancedistance) |

#### .judgeMagnetAttraction(_attraction_)

Returns `true` if the input attraction result passed the judgement.

#### .calcMagnetParentAttraction(_options?_)

The same as [`.calcMagnetAttraction()`](#calcmagnetattractiontarget-options) but the `target` is assigned to be the parent element of magnet.

#### .calcMagnetAttraction(_target_, _options?_)

The same as [`Magnet.calcMagnetAttraction()`](#magnetcalcmagnetattractionsource-target-options) but the `source` is assigned to be the magnet and the following default values of properties are different:

| Name | Default Value |
| -: | :- |
| attractDistance | [`.attractDistance`](#attractdistance) |
| alignTos | [`.alignTos`](#aligntos) |
| alignments | The alignments of `alignTos` |
| onJudgeDistance | [`.judgeMagnetDistance`](#judgemagnetdistancedistance) |

#### .calcMagnetMultiAttractions(_targets_, _options?_)

The same as [`Magnet.calcMultiMagnetAttraction()`](#magnetcalcmultimagnetattractionsource-targets-options) but the `source` is assigned to be the magnet and the following default values of properties are different:

| Name | Default Value |
| -: | :- |
| onJudgeAttraction | [`.judgeMagnetAttraction`](#judgemagnetattractionattraction) |

#### .appendMagnetOffsetWithAttraction(_x_, _y_, _options?_)

Offsets the magnet to (`x`, `y`) and checking its attraction result with `options`.

The properties of `options` extends those of [`Magnet.calcMultiMagnetAttraction()`](#magnetcalcmultimagnetattractionsource-targets-options):

| Name | Type | Description |
| -: | :-: | :- |
| alignToParents? | [_AlignToParents_](#aligntoparents) | The target alignment edge bases of parent. Default is [`.alignToParents`](#aligntoparents) |
| parentAlignments? | [_Alignment_](#alignments) | Alignment types of attraction to the parent of magnet. Default is the alignments of `alignToParents` |
| crossPrevents? | [_CrossPrevents_](#crossprevents) | Prevents magnet from crossing specific targets. Default is [`.crossPrevents`](#crossprevents) |
| crossPreventParent? | _boolean_ | Set `true` to prevent magnet from crossing parent. Default is the setting for target parent of `crossPrevents` |

#### .appendMagnetOffsetWithAttraction(_point_, _options?_)

The same as [`.appendMagnetOffsetWithAttraction()`](#appendmagnetoffsetwithattractionx-y-options) but the input is a [_Point_](#point).

#### .setMagnetOffsetWithAttraction(_x_, _y_, _options?_)

Sets the magnet to (`x`, `y`) and checking its attracion result with `options`.

The properties of `options` are the same as [`.appendMagnetOffsetWithAttraction()`].

#### .setMagnetOffsetWithAttraction(_point_, _options?_)

The same as [`.setMagnetOffsetWithAttraction()`](#setmagnetoffsetwithattractionx-y-options) but the input is a [_Point_](#point).

#### .resetMagnetOffset()

Removes the offsets of magnet.

#### .setMagnetOffset(_x_, _y_)

Sets the offsets of magnet to (`x`, `y`).

#### .setMagnetOffset(_point_)

The same as [.setMagnetOffset()](#setmagnetoffsetx-y) but the input is a [_Point_](#point).

#### .handleDragStart(_event_)

Handles mousedown/touchstart event before [magnetstart](#magnetstart) event of magnet.

#### .handleDragMove(_event_)

Handles mousemove/touchmove event before [magnetmove](#magnetmove) event of magnet.

#### .handleDragEnd(_event_)

Handles mouseup/touchend event before [magnetend](#magnetend) event of magnet.

## Events

Magnet action events.

### magnetstart

> **Cancelable: `true`**
>
> If we cancel the event, the magnet would not be dragged.

Fires on magnet start to be dragged, always triggers right after mousedown/touchstart event of magnet. Event detail:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The magnet self |
| targets | [_Pack_](#pack)[] | Attractable target magnets |
| parent | [_Pack_](#pack) \| `null` | Parent element of magnet only exists when any of [`alignToParent`](#aligntoparents) or [`crossPrevent`](#crossprevents) = `parent` is set |
| lastOffset | [_Point_](#point) | Last offset of magnet |
| startPoint | [_Point_](#point) | The mousedown/touchstart point of event |

### magnetmove

> **Cancelable: `false`**
>
> If we cancel the event, the magnet would not move at that moment of firing event.

Fires on magnet being dragged and moving, always triggers right after mousemove/touchmove event of magnet. Event detail extended the properties of [magnetstart](#magnetstart):

| Name | Type | Description |
| -: | :-: | :- |
| nextOffset | [_Point_](#point) | The next offset of magnet after moving |
| movePoint | [_Point_](#point) | The mousemove/touchmove point of event |

### magnetend

> **Cancelable: `false`**

Fires on the end of magnet being dragged, always triggers right after mouseup/touchend event of magnet.

### attract

> **Cancelable: `true`**
>
> If we cancel the event, the magnet would not attract the target magnet.

Fires on the magnet attracts other magnet target. Event detail:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The magnet self |
| nextRect | [_Rect_](#rect) | The next rectangle of magnet after attracting |
| attraction | [_Attraction_](#attraction) | Attraction result from `source` to targets |

### attracted

> **Cancelable: `false`**

Fires on the magnet is attracted by other magnet. Event detail:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The other magnet attracting to this magnet |
| target | [_Pack_](#pack) | The magnet self |
| sourceNextRect | [_Rect_](#rect) | The next rectangle of `source` after attracting |
| distance | [_Distance_](#distance) | Distance detail from `source` to `target` |

### attractmove

> **Cancelable: `false`**

Fires on the magnet attracts a magnet and is still on moving. Event detail is the same as [attract](#attract).

### attractedmove

> **Cancelable: `false`**

Fires on the magnet is attracted by another magnet and the source is still on moving. Event detail is the same as [attracted](#attracted).

### unattract

> **Cancelable: `false`**

Fires on the magnet unattracts a magnet, which means the target magnet is out of the distance of the magnet's attraction. Event detail is the same as [attract](#attract).

### unattracted

> **Cancelable: `false`**

Fires on the magnet is unattracted by a magnet. Event detail:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The other magnet attracting to this magnet |
| target | [_Pack_](#pack) | The magnet self |
| sourceNextRect | [_Rect_](#rect) | The next rectangle of `source` after attracting |
| nextTarget | [_Pack_](#pack) \| `null` | The next attracted target magnet of `source` |

## Types

[url-dompoint]: https://developer.mozilla.org/en-US/docs/Web/API/DOMPoint
[url-domrect]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRect

### Point

Here we use [_DOMPoint_][url-dompoint] as the type of point.

> **We only use `.x` and `.y`, `.z` and `.w` are not used in magnet.js.**

### Rectangle

We use [_DOMRect_][url-domrect] as the type of rectangle.

### Pack

Pack is a class used to wrap the source and its rectangle.

#### new Pack(_source_, _rect_?)

Creates a pack object of `source`. `source` should be rectable and `rect` would be the rectangle object for the source. By default `rect` is the rectangle of `source`.

#### .raw

Returns the `source` of the pack object.

#### .rect

Returns the rectangle of the `source` of the pack object.

### Alignment

Alignment describes how the source aligns to the target:

| Name | Align to | Description |
| -: | :-: | :- |
| topToTop | _inner_ | Source top to target top |
| topToBottom | _outer_ | Source top to target bottom |
| rightToRight | _inner_ | Source right to target right |
| rightToLeft | _outer_ | Source right to target left |
| bottomToTop | _outer_ | Source bottom to target top |
| bottomToBottom | _inner_ | Source bottom to target bottom |
| leftToRight | _outer_ | Source left to target right |
| leftToLeft | _inner_ | Source left to target left |
| xCenterToXCenter | _center_ | The center of source left and right to the center of target left and right |
| yCenterToYCenter | _center_ | The center of source top and bottom to the center of target top and bottom |

### Distance

Distance is an object recording the detail from source to target including the following properties:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Source |
| target | [_Pack_](#pack) | Target |
| alignment | [_Alignment_](#alignment) | Alignment from source to target |
| rawDistance | _number_ | Raw distance from source to target |
| absDistance | _number_ | Absolute distance from source to target |

### Attraction

Attraction is an object storing the result of source attracting to target(s) including the following properties:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Source |
| target | [_Pack_](#pack) \| [_Pack_](#pack)[] | Target or targets in array |
| results | [_Distance_](#distance)[] | Distances from source to target on different alignments |
| best | [_AttractionBest_](#attractionbest) | The best attraction result |

### AttractionBest

AttractionBest is an object of the best distance results on axes of x and y:

| Name | Type | Description |
| -: | :-: | :- |
| x? | [_Distance_](#distance) | The best result on x-axis |
| y? | [_Distance_](#distance) | The best result on y-axis |

## License

[MIT](/LICENSE) Copyright @ Wan Wan
