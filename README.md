# Magnet.js

Magnet.js is a JavaScript library making HTML elements attractable to each other.

---

## Demo

[url-demo-basic]: https://lf2com.github.io/magnet.js/demo/basic/index.html
[url-demo-basic-js]: https://lf2com.github.io/magnet.js/demo/basic/javascript.html
[url-demo-basic-jquery]: https://lf2com.github.io/magnet.js/demo/basic/jquery.html
[url-demo-basic-react]: https://lf2com.github.io/magnet.js/demo/basic/react.html

### [Basic][url-demo-basic]

Samples of using magnet.js:

- [HTML][url-demo-basic]
- [JavaScript][url-demo-basic-js]
- [jQuery][url-demo-basic-jquery]
- [React][url-demo-basic-react].

[url-demo-groups]: https://lf2com.github.io/magnet.js/demo/groups/index.html

### [Groups][url-demo-groups]

Creates magnet blocks of different groups.

## Get Started

:warning: _**Since `v2.0.0`, magnet.js has become a HTML element for us to wrap other elements or directly use it as a attractable block.**_

Add magnet.js to your HTML file:

```html
<script defer src="https://unpkg.com/@lf2com/magnet.js@latest/dist/magnet.min.js"></script>
<!-- or -->
<script defer src="https://cdn.jsdelivr.net/gh/lf2com/magnet.js@latest/dist/magnet.min.js"></script>
```

We can use magnets directly in HTML:

```html
<magnet-block
  style="width: 100px; height: 50px; background: #fcc;"
  attract-distance="10"
  align-to="outer|center"
>
  foo
</magnet-block>

<magnet-block attract-distance="10" align-to="outer|center">
  <div style="width: 100px; height: 50px; background: #fcc;">
    bar
  </div>
</magnet-block>
```

Or in JavaScript code:

```js
const magnet = document.createElement('magnet-block');

magnet.setAttribute('attract-distance', '10');
magnet.setAttribute('align-to', 'outer|center');
// or
magnet.attractDistance = 10;
magnet.alignTos = ['outer', 'center'];

magnet.style.setProperty('width', '100px');
magnet.style.setProperty('height', '50px');
magnet.style.setProperty('background', '#fcc');
magnet.innerText = 'foo';
document.body.append(magnet);
```

Since magnet.js is an element, we can handle it with jQuery:


```jq
$('<magnet-block>')
  .attr({
    'attract-distance': '10',
    'align-to': 'outer|center',
  })
  .css({
    width: '100px',
    height: '50px',
    background: '#fcc',
  })
  .html('foo')
  .appendTo($('body'));
```

Of course we can use it in React:

```jsx
const Magnet = () => (
  <magnet-block
    style={{
      width: '100px',
      height: '50px',
      background: '#fcc',
    }}
    attract-distance="10"
    align-to="outer|center"
  >
    foo
  </magnet-block>
);
```

## Build

Build magnet.js with the command:

```sh
npm run build
```

The built would be at `./dist/magnet.min.js`.

## Nodes of Magnet.js

There are 2 magnet elements: [\<magnet-block\>](#magnet-block) and [\<magnet-pack\>](#magnet-pack).

### \<magnet-block\>

**Magnet block** can be dragged and attracted by other magnets.

```html
<magnet-block>
  <div style="padding: 1em; background-color: #eee;">
    magnet
  </div>
</magnet-block>

<!-- or directly use <magnet-block> -->
<magnet-block style="padding: 1em; background-color: #eee;">
  magnet
</magnet-block>
```

### \<magnet-pack\>

**Magnet pack** is unable to be dragged but it defines the default values for it's sub magnets. The sub manget blocks would reference to the nearest parent magnet pack for the attribute value if it doesn't have assigned the corresponding values.

```html
<magnet-pack attract-distance="20">
  <!-- distance of attraction is 10 -->
  <magnet-block attract-distance="10">
    10
  </magnet-block>

  <!-- distance of attraction is 20 -->
  <magnet-block>
    default
  </magnet-block>
</magnet-pack>
```

## Properties

Settable properties are defined as the configuration values of magnet element. If the magnet has no some magnet settings, it would reference to the nearest [parent magnet](#parentmagnet) having the value. Otherwise the value would be the default one.

### Multiple Values

If a property accepts multiple values. Use any of the following character as separator: `|`, `,`, `;`, or **space**.

### .disabled

> Type of value: _`boolean`_
>
> Default: _`false`_

If set, the magnet would be unable to be dragging and attracted.

```html
<!-- disabled magnet -->
<magnet-block disabled>
  magnet
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

> Type of value: _`string` | `null`_
>
> Default: _`null`_ as ungrouped

The group of magnet element. Once we assign a group for a magnet, it would only attract magnets in the same group. If no group is assigned, the magnet can attract all magnets including grouped ones.

```html
<!-- set group -->
<magnet-block group="alpha">
  alpha
</magnet-block>
<magnet-block group="beta">
  beta
</magnet-block>
<magnet-block>
  ungrouped
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

> Type of value: [_`Magnet`_](#magnet-nodes)

Returns the nearest parent [magnet node](#magnet-nodes).

> **The `.parentMagnet` of grouped magnet would be the nearest parent magnet in the same group or ungrouped one.**

```js
// get parent magnet
console.log('Nearest parent magnet:', magnet.parentMagnet);
```

### .unattractable

> Type of value: _`boolean`_
>
> Default: _`false`_

If set, the magnet would not be attracted.

```html
<!-- set unattractable -->
<magnet-block unattractable>
  magnet
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

> Type of value: _`boolean`_
>
> Default: _`false`_

If set, the magnet would not be dragged.

```html
<!-- set unmovable -->
<magnet-block unmovable>
  magnet
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

> Type of value: _`number`_
>
> Default: _`10`_

Distance for magnet being dragged to attract other magnets.

> **We don't define the distance for magnet to be attracted.**

```html
<!-- set distance of attraction -->
<magnet-block attract-distance="20">
  magnet 20
</magnet-block>

<!-- default distance of attraction -->
<magnet-block>
  magnet default
</magnet-block>
```

```js
// set distance of attraction
magnet.attractDistance = 20;
// or
magnet.setAttribute('attract-distance', '20');

// get distance of attracion in number
console.log('Attraction distance:', magnet.attractDistance);
// or in string
console.log('Attraction distance:', magnet.getAttribute('attract-distance'));
```

### .alignTos

> Type of value: _`string[]`_
>
> Default: `['outer', 'center', 'extend']`
>
> Accepts [multiple values](#multiple-values).

Sides of rectangle that can be converted to [alignments](#alignments) for magnet aligning to other magnets:

| Name | Description |
| -: | :- |
| outer | Align to the outer sides of target |
| inner | Align to the inner sides of target |
| center | Align to the center lines of target |
| extend | Align to extended line of assigned alignment including `outer`, `inner` and `center` |

```html
<!-- set align to -->
<magnet-block align-to="outer|extend">
  magnet
</magnet-block>
```

```js
// set align to
magnet.alignTos = ['outer', 'extend'];
// or
magnet.alignTos = 'outer|extend';
// oe
magnet.setAttribute('align-to', 'outer|extend');

// get align-to in array
console.log('Align to:', magnet.alignTos);
// or in string
console.log('Align to:', magnet.getAttribute('align-to'));
```

### .alignToParents

> Type of value: _`string[]`_
>
> Default: `[]`
>
> Accepts [multiple values](#multiple-values).

Sides of rectangle that can be converted to [alignments](#alignments) for magnet aligning to it's parent element.

| Name | Description |
| -: | :- |
| inner | Align to the inner sides of target |
| center | Align to the center lines of target |

```html
<!-- set align to parent -->
<magnet-block align-to-parent="inner|center">
  magnet
</magnet-block>
```

```js
// set align to parent
magnet.alignToParents = ['inner', 'center'];
// or
magnet.alignToParents = 'inner|center';
// oe
magnet.setAttribute('align-to-parent', 'inner|center');

// get align-to-parent in array
console.log('Align to parent:', magnet.alignToParents);
// or in string
console.log('Align to parent:', magnet.getAttribute('align-to-parent'));
```

### .alignments

> Type of value: _`string[]`_

Returns the side-to-side alignments from magnet to other magnets. The values are converted from [`.alignTos`](#aligntos).

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

```js
// get alignments
console.log('Alignments:', magnet.alignments);
```

### .parentAlignments

> Type of value: _`string[]`_

Returns the side-to-side alignments from magnet to it's parent element. The values are converted from [`.alignToParents`](#aligntoparents).

```js
// get alignments to parent
console.log('Alignments to parent:', magnet.parentAlignments);
```

### .crossPrevents

> Type of value: _`string[]`_
>
> Default: `[]`
>
> Accepts [multiple values](#multiple-values).

Prevents magnet from crossing specific targets such as `parent`:

| Name | Description |
| -: | :- |
| parent | The parent element of magnet |

```html
<!-- set cross prevent -->
<magnet-block cross-prevent="parent">
  magnet
</magnet-block>
```

```js
// set cross prevent
magnet.crossPrevents = ['parent'];
// or
magnet.crossPrevents = 'parent';
// or
magnet.setAttribute('cross-prevent', 'parent');

// get cross-prevent in array
console.log('Cross prevent:', magnet.crossPrevents);
// or in string
console.log('Cross prevent:', magnet.getAttribute('cross-prevent'));
```

### .magnetRect

Returns temporarily created [rectangle](#rectangle) of magnet.

> **`.magnetRect` would not be updated util calling [`.resetMagnetRect`](#resetmagnetrect)**

```js
// get rectangle
console.log('Magnet rect:', magnet.magnetRect);
```

### .parentPack

Returns temporarily created [pack](#pack) of the parent element of magnet.

> **`.parentPack` would not be updated util calling [`.resetParentPack`](#resetparentpack)**

```js
const parentPack = magnet.parentPack;

// get parent element
console.log('Parent element:', parentPack.raw);
// get parent rectangle
console.log('Parent rect:', parentPack.rect);
```

### .targetMagnetPacks

Returns temporarily created [packs](#pack) of [attractable magnets](#getattractablemagnets).

> **`.targetMagnetPacks` would not be updated util calling [`.resetTargetMagnetPacks`](#resettargetmagnetpacks)**

```js
// get target magnet packs
console.log('Attractable magnet packs:', magnet.targetMagnetPacks);
```

### .lastMagnetOffset

Returns the last offset in [point](#point) of magnet.

```js
const { x, y } = magnet.lastMagnetOffset;

// get last offset
console.log(`Last offset: (${x}, ${y})`);
```

### .bestAttraction

Returns the [best attraction](#bestattraction) in the last attraction.

```js
const { x, y } = magnet.bestAttraction;

// get best attraction result
console.log('Best attraction on x-axis:', x);
console.log('Best attraction on y-axis:', y);
```

## Methods

Magnet methods handle stuffs related to magnet such as alignment, distance, attraction, and position.

### Static

#### Magnet.getAlignmentsFromAlignTo(_alignTo_)

| Argument | Type | Description |
| -: | :-: | :- |
| alignTo | _string \| string[]_ | Value(s) of sides to align |

Returns the array of [alignments](#alignments) converted from [`alignTo`](#aligntos) values.

```js
// get alignments of align-to
console.log('Alignments:', Magnet.getAlignmentsFromAlignTo('inner'));

// get alignments of align-tos
console.log('Alignments:', Magnet.getAlignmentsFromAlignTo(['outer', 'inner']));
```

#### Magnet.getMagnetAttractionOffset(_attraction_)

| Argument | Type | Description |
| -: | :-: | :- |
| attraction | _[Attraction](#attraction)_ | Result of magnet attraction |

Returns the offset in [point](#point) from `attraction` result.

### Instance

#### .traceMagnetAttributeValue(_attrName_)

| Argument | Type | Description |
| -: | :-: | :- |
| attrName | _string_ | Attribute name |

Returns the value of specific attribute name of magnet. If the magnet doesn't have the value, it would reference to the nearest [parent magnet](#parentmagnet) having the value. Or return _`null`_ rather than global default value.

```js
// get group
const group = magnet.traceMagnetAttributeValue('group');
// equals to (due to the default value is `null` too)
const group = magnet.group;
```

```html
<!-- custom attribute -->
<magnet-pack some-attr="some-value">
  <magnet-block id="magnet">
    magnet
  </magnet-block>
</magnet-pack>

<script>
  const magnet = document.getElementById('magnet');

  // trace the custom attribute
  magnet.traceMagnetAttributeValue('some-attr'); // 'some-value'
</script>
```

#### .resetMagnetRect()

Removes the temporarily created [rectangle](#rectangle) of the magnet.

#### .resetparentPack()

Removes the temporarily created [pack](#pack) of the magnet parent element.

#### .resetTargetMagnetPacks()

Removes the temporarily created [packs](#pack) of the magnet attractable targets.

#### .getOtherMagnets()

Returns all other [magnet nodes](#magnet-nodes) except [magnet packs](#magnet-pack) and the magnet caller.

#### .getAttractableMagnets()

Returns all magnet elements attractable to the magnet caller.

Consideration:

| Property | Description |
| -: | :- |
| [disabled](#disabled) | Should be _`false`_ |
| [unattractable](#unattractable) | Should be _`false`_ |
| [group](#group) | Should be seen as attractable group magnet as the magnet caller |

#### .judgeMagnetDistance(_distance_, _options?_)

| Argument | Type | Description |
| -: | :-: | :- |
| distance | _[Distance](#distance)_ | Result of distance from `distance.source` to `distance.target` on `distance.alignment` |
| options? | _object_ | Options for judgement |

Returns _`true`_ if `distance` passes the judgement.

> **This method would be called for judging distance result on any method related to attraction.**

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| attractDistance? | _number_ | Distance of attraction. _(Default [`.attractDistance`](#attractdistance))_ |
| alignTos? | [_AlignTo_](#aligntos) | The target alignment sides. _(Default [`.alignTos`](#aligntos))_ |

#### .judgeMagnetDistanceInParent(_distance_, _options?_)

The same as [`.judgeMagnetDistance`](#judgemagnetdistancedistance) but also consider a wrapper as the parent.

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| parent? | [_Pack_](#pack) \| _Rectable_ \| _null_ | Wrapper as the parent. If `parent` is _`null`_ or _`undefined`_, it would be default as [`.parentPack`](#parentpack) |
| onJudgeDistance? | [`.judgeMagnetDistance`](#judgemagnetdistancedistance) | Function for judging the distance result. _(Default [`.judgeMagnetDistance`](#judgemagnetdistancedistance))_ |

#### .judgeMagnetAttraction(_attraction_)

| Argument | Type | Description |
| -: | :-: | :- |
| attraction | _[Attraction](#attraction)_ | Result of attraction from `attraction.source` to `attraction.target` |

Returns `true` if `attraction` passes the judgement.

#### .judgeMagnetMovement(_pack_)

| Argument | Type | Description |
| -: | :-: | :- |
| pack | _[Pack](#pack)_ | Pack with the next movement as `pack.rect` for `pack.raw` |

Returns _`true`_ if the movement of `pack` passes the judgement.

#### .rawDistanceTo(_target_, _alignment_)

| Argument | Type | Description |
| -: | :-: | :- |
| target | _[Rectable](#rectable) \| [Pack](#pack)_ | Target for calculating the distance from magnet caller |
| alignment | _[Alignment](#alignments)_ | Alignment of distance |

Returns the value of distance from magnet caller to `target` on specific `alignment`.

#### .distanceTo(_target_, _alignment_)

| Argument | Type | Description |
| -: | :-: | :- |
| target | _[Rectable](#rectable) \| [Pack](#pack)_ | Target for calculating the distance from magnet caller |
| alignment | _[Alignment](#alignments)_ | Alignment of distance |

Returns the result of distance from magnet caller to `target` on specific `alignment`.

#### .attractionTo(_target_, _options?_)

| Argument | Type | Description |
| -: | :-: | :- |
| target | _[Rectable](#rectable) \| [Pack](#pack)_ | Target for calculating the attraction from magnet caller |
| options? | _object_ | Options for attraction |

Returns the result of attraction from magnet caller to `target`.

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| attractDistance? | _number_ | Distance of attraction. _(Default [`.attractDistance`](#attractdistance))_ |
| alignTos? | [_AlignTo_](#aligntos) | Target alignment sides. _(Default [`.alignTos`](#aligntos))_ |
| alignments? | [_Alignment_](#alignments) | Alignments of attraction. _(Default [`Magnet.getAlignmentsFromAlignTo(alignTos)`](#magnetgetalignmentsfromaligntoalignto))_ |
| onJudgeDistance? | [`.judgeMagnetDistance`](#judgemagnetdistancedistance) | Function for judging the distance result. _(Default [`.judgeMagnetDistance`](#judgemagnetdistancedistance))_ |

#### .attractionToParent(_options?_)

The same as [`.attractionTo`](#attractiontotarget-options) but `target` is [the parent of magnet caller](#parentpack).

Different default values of `options`:

| Name | Default Value |
| -: | :- |
| alignTos | [`.alignToParents`](#aligntoparents) |

#### .multiAttractionsTo(_targets_, _options?_)

| Argument | Type | Description |
| -: | :-: | :- |
| targets | _([Rectable](#rectable) \| [Pack](#pack))[]_ | Targets for calculating the attraction from magnet caller |
| options? | _object_ | Options for attraction |

Returns the results of attractions from magnet caller to `targets`.

The properties of `options` extends that of [`.attractionTo`](#attractiontotarget-options):

| Name | Type | Description |
| -: | :-: | :- |
| alignToParents? | _[AlignToParent](#aligntoparents)[]_ | Target alignment sides to the parent of magnet caller. _(Default [`.alignToParents`](#aligntoparents))_ |
| attractionBest? | [_AttractionBest_](#attractionbest) | Initial result of attraction joining the comparison of other attraction results |
| onJudgeAttraction? | [`.judgeMagnetAttraction`](#judgemagnetattractionattraction) | Function for judging the attraction result. _(Default [`.judgeMagnetAttraction`](#judgemagnetattractionattraction))_ |

#### .getMagnetAttractionResultOfPosition(_position_, _options?_)

| Argument | Type | Description |
| -: | :-: | :- |
| position | _[Point](#point)_ | Target position for magnet caller to move to |
| options? | _object_ | Options for attraction |

Returns the result of final position and attraction after considering `position` and `options`:

| Name | Type | Description |
| -: | :-: | :- |
| position | _[Point](#point) \| null_ | Final position of magnet caller. If the movement doesn't pass the judgement, the value would be _`null`_ |
| attractionBest | _[AttractionBest](#attractionbest) \| null_ | Attraction result. If the attraction doesn't pass the judgement, the value would be _`null`_ |

Properties of `options`:

| Name | Type | Description |
| -: | :-: | :- |
| ignoreEvent? | _boolean_ | Set _`true`_ to ignore dispatching [attraction related events](#events) to magnets. _(Default `true` only if magnet caller is **HTMLElement**)_ |
| unattractable? | _boolean_ | Set _`true`_ to disallow attraction but consider `options.crossPrevents`. _(Default [`.unattractable`](#unattractable))_ |
| attractDistance? | _number_ | Distance of attraction. _(Default [`.attractDistance`](#attractdistance))_ |
| alignTos? | [_AlignTo_](#aligntos) | Target alignment sides. _(Default [`.alignTos`](#aligntos))_ |
| alignments? | [_Alignment_](#alignments) | Alignments of attraction. _(Default the alignments converted from `alignTos`)_ |
| alignToParents? | _[AlignToParent](#aligntoparents)[]_ | Target alignment sides to the parent of magnet caller. _(Default [`.alignToParents`](#aligntoparents))_ |
| crossPrevents? | _[CrossPrevent](#crossprevents)[]_ | Prevent from crossing specific objectives. _(Default [`.crossPrevents](#crossprevents))_ |
| parentPack? | _[Pack](#pack)_ | Parent of magnet caller. _(Default [`.parentPack`](#parentpack))_ |
| lastAttractionBest? | _[AttractionBest](#attractionbest)_ | Reference result of attraction for [attraction related events](#events) |
| onJudgeDistance? | [`.judgeMagnetDistance`](#judgemagnetdistancedistance) | Function for judging the distance result. _(Default [`.judgeMagnetDistance`](#judgemagnetdistancedistance))_ |
| onJudgeDistanceInParent? | [`.judgeMagnetDistanceInParent`](#judgemagnetdistanceinparentdistance-options) | Function for judging the distance result to the parent of magnet caller. _(Default [`.judgeMagnetDistanceInParent`](#judgemagnetdistanceinparentdistance-options))_ |
| onJudgeAttraction? | [`.judgeMagnetAttraction`](#judgemagnetattractionattraction) | Function for judging the attraction result. _(Default [`.judgeMagnetAttraction`](#judgemagnetattractionattraction))_ |
| onJudgeMovement? | [`.judgeMagnetMovement`](#judgemagnetmovementpack) | Function for judging the movement result. _(Default [`.judgeMagnetAttraction`](#judgemagnetattractionattraction))_ |

#### .getMagnetAttractionResultOfPosition(_x_, _y_, _options?_)

| Argument | Type | Description |
| -: | :-: | :- |
| x | _number_ | Value on x-axis |
| y | _number_ | Value on y-axis |
| options? | _object_ | Options for attraction |

The same as [`.getMagnetAttractionResultOfPosition(point, options?)`](#getmagnetattractionresultofpositionposition-options) but the input is (`x`, `y`).

#### .resetMagnetOffset()

Resets the offset of magnet to (_`0`_, _`0`_).

#### .setMagnetOffset(_dx_, _dy_)

| Argument | Type | Description |
| -: | :-: | :- |
| dx | _number_ | Offset value on x-axis |
| dy | _number_ | Offset value on y-axis |

Sets the offset of magnet to (`dx`, `dy`).

#### .setMagnetOffset(_offset_)

| Argument | Type | Description |
| -: | :-: | :- |
| offset | _[Point](#point)_ | Offset of magnet |

The same as [.setMagnetOffset](#setmagnetoffsetdx-dy) but the input is [_Point_](#point).

#### .setMagnetPosition(_x_, _y_)

| Argument | Type | Description |
| -: | :-: | :- |
| x | _number_ | Value on x-axis |
| y | _number_ | Value on y-axis |

Sets the position of magnet to (`x`, `y`) without any judgement.

#### .setMagnetPosition(_point_)

| Argument | Type | Description |
| -: | :-: | :- |
| point | _[Point](#point)_ | Position of magnet |

The same as [.setMagnetPosition](#setmagnetpositionx-y) but the input is [_Point_](#point).

## Events

Events for magnet elements.

### magnetstart

> **Cancelable: `true`**
>
> Magnet would not be dragged if the event is canceled.

Dispatches on starting to drag a magnet.

Properties of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Current magnet info |
| targets | _[Pack](#pack)[]_ | Attractable magnets |
| startPoint | [_Point_](#point) | The start point of dragging |

### magnetmove

> **Cancelable: `true`**
>
> Magnet would not move at that step if the event is canceled.

Dispatches on dragging a magnet.

Properties of `event.detail` extend those of [magnetstart](#magnetstart):

| Name | Type | Description |
| -: | :-: | :- |
| movePoint | [_Point_](#point) | The move point of dragging |

### magnetend

> **Cancelable: `false`**

Dispatches on the end of dragging a magnet.

### attract

> **Cancelable: `true`**
>
> The magnet would not attract the target magnet if the event is canceled.

Dispatches on the magnet attracting other magnet.

Properties of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Current magnet info |
| nextRect | [_Rect_](#rect) | The rectangle of magnet after attracting |
| attraction | [_Attraction_](#attraction) | Attraction result from `source` to targets |

### attracted

> **Cancelable: `false`**

Dispatches on the magnet being attracted by other magnet.

Properties of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The info of magnet attracting `target` |
| target | [_Pack_](#pack) | the info of magnet being attracted by `source` |
| sourceNextRect | [_Rect_](#rect) | The rectangle of `source` after attracting |
| distance | [_Distance_](#distance) | Distance detail from `source` to `target` |

### attractmove

> **Cancelable: `false`**

Dispatches on the magnet already attracting a magnet and still on moving.

Properties of `event.detail` are the same as [attract](#attract).

### attractedmove

> **Cancelable: `false`**

Dispatches on the magnet being attracted by other magnet and it's still on moving.

Properties of `event.detail` are the same as [attract](#attract).

### unattract

> **Cancelable: `false`**

Dispatches on the magnet unattracting a magnet.

Properties of `event.detail` are the same as [attract](#attract).

### unattracted

> **Cancelable: `false`**

Dispatches on the magnet being unattracted by other magnet.

Properties of `event.detail`:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | The info of magnet attracting `target` |
| target | [_Pack_](#pack) | the info of magnet being attracted by `source` |
| sourceNextRect | [_Rect_](#rect) | The rectangle of `source` after attracting |

## Types

[url-dompoint]: https://www.w3.org/TR/geometry-1/#DOMPoint
[url-domrect]: https://www.w3.org/TR/geometry-1/#DOMRect
[url-htmlelement]: https://www.w3.org/TR/2012/WD-html-markup-20121025/elements.html

### Rectable

Defines objects that are able to be converted to [rectangle](#rectangle):

* _[DOMRect][url-domrect]_
* _[HTMLElement][url-htmlelement]_
* `document`
* `window`

### Point

Uses [_DOMPoint_][url-dompoint] as the type of point (`x`, `y`).

Properties of point:

| Name | Type | Description |
| -: | :-: | :- |
| x | _number_ | Value on x-axis |
| y | _number_ | Value on y-axis |

### Rectangle

Uses [_DOMRect_][url-domrect] as the type of rectangle.

Properties of rectangle:

| Name | Type | Description |
| -: | :-: | :- |
| top | _number_ | Value on y-axis. Always greater than or equal to `bottom` |
| right | _number_ | Value on x-axis. Always greater than or equal to `left` |
| bottom | _number_ | Value on y-axis. Always lesser than or equal to `top` |
| right | _number_ | Value on x-axis. Always lesser than or equal to `right` |
| x | _number_ | The same as `left` |
| y | _number_ | The same as `top` |
| width | _number_ | Value of `right` minuses `left` |
| height | _number_ | Value of `bottom` minuses `top` |

### Pack

Wraps the source and its rectangle.

#### new Pack(_source_, _rect_?)

`rect` represents the rectangle of `source` since the rectangle may not be the same as the current one of `source`.

> **If `rect` is _`undefined`_, `source` must be [rectable](#rectable) so that the `rect` could be generated from `source`.**

Properties of pack object:

| Name | Type | Description |
| -: | :-: | :- |
| raw | _any_ | Returns `source` |
| rect | [_Rectangle_](#rectangle) | Returns `rect` of the stage on creation. Default is the rectangle based on `source` |

### Distance

Wraps the info from source to target.

Properties of distance object:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Source info |
| target | [_Pack_](#pack) | Target info |
| alignment | [_Alignment_](#alignments) | Alignment from source to target |
| rawDistance | _number_ | Distance from source to target |
| absDistance | _number_ | Absolute distance from source to target |

### Attraction

Wraps the result(s) of source attracting to target(s).

Properties of attraction object:

| Name | Type | Description |
| -: | :-: | :- |
| source | [_Pack_](#pack) | Source info |
| target | [_Pack_](#pack) \| _[Pack](#pack)[]_ | Target info for [`.attractionTo`](#attractiontotarget-options). Targets infos in array for [`.multiAttractionsTo`](#multiattractiontotargets-options) |
| results | _[Distance](#distance)[]_ | Distance results from source to target on alignments |
| best | [_AttractionBest_](#attractionbest) | The best attraction result |

### AttractionBest

Wraps the best distance results on axes of x and y.

Properties of best attraction object:

| Name | Type | Description |
| -: | :-: | :- |
| x? | [_Distance_](#distance) | The best result on x-axis |
| y? | [_Distance_](#distance) | The best result on y-axis |

## License

[MIT](/LICENSE) Copyright @ Wan Wan
