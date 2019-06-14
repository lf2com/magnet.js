'use strict';

import { isset, tobool, tonum, tostr, isarray, objForEach, objMap, getStyle, stdDoms, isbool, iselem, isfunc } from './stdlib';
import EventHandler from './event-handler';
import { isRect, stdRect, diffRect } from './rect';
import ALIGNMENT_PROPS from './alignment-props';

const ALIGNMENT_OUTER = [ALIGNMENT_PROPS.tb, ALIGNMENT_PROPS.rl, ALIGNMENT_PROPS.bt, ALIGNMENT_PROPS.lr];
const ALIGNMENT_INNER = [ALIGNMENT_PROPS.tt, ALIGNMENT_PROPS.rr, ALIGNMENT_PROPS.bb, ALIGNMENT_PROPS.ll];
const ALIGNMENT_CENTER = [ALIGNMENT_PROPS.xx, ALIGNMENT_PROPS.yy];
const EVENT = {
  append: 'magnet',
  attract: 'attract',
  unattract: 'unattract',
  attracted: 'attracted',
  unattracted: 'unattracted',
  attractStart: 'attractstart',
  attractMove: 'attractmove',
  attractEnd: 'attractend',
  magnetStart: ['magnetenter', 'magnetstart', 'enter', 'start'],
  magnetChange: ['magnetchange', 'change'],
  magnetEnd: ['magnetend', 'magnetleave', 'end', 'leave'],
  mouseDown: ['mousedown', 'touchstart'],
  mouseMove: ['mousemove', 'touchmove'],
  mouseUp: ['mouseup', 'mouseleave', 'touchend'],
  keyDown: 'keydown',
  keyUp: 'keyup',
};

const toPx = (p) => `${p}px`;
const toPreg = (p) => `${100*p}%`;
const getEventXY = ({ clientX, clientY, touches: [{ clientX: x = clientX, clientY: y = clientY } = {}] = []}) => ({ x, y });
const bindEventNames = (self, ...names) => {
  const { [MAGNET_PROPS.id]: id } = self;
  return names.reduce((arr, name) => (isarray(name)
    ?arr.concat(bindEventNames(self, ...name))
    :arr.concat(name.split(' ').map((name) => `${name}.${id}`))
  ), []);
};
const getParent = (d) => {
  for (let r=d.parentElement; r; r=r.parentElement) {
    if ('static' !== getStyle(r).position) {
      return r;
    }
  }
  return document;
};


// ===================================================================
//  Magnet start

const MAGNET_PROPS = {
  id: '_id',
  temp: '_temp',
  targets: '_targets',
  eventHandler: '_eventHandler',
  manualHandler: '_manualHandler',
  distance: '_distance',
  attractable: '_attractable',
  allowCtrlKey: '_allowCtrlKey',
  allowDrag: '_allowDrag',
  useRelativeUnit: '_useRelativeUnit',
  stayInParent: '_stayInParent',
  alignOuter: '_alignOuter',
  alignInner: '_alignInner',
  alignCenter: '_alignCenter',
  alignParentCenter: '_alignParentCenter',
};

export const MAGNET_DEFAULTS = {
  distance: 0,
  attractable: true,
  allowCtrlKey: true,
  allowDrag: true,
  useRelativeUnit: false,
  stayInParent: false,
  alignOuter: true,
  alignInner: true,
  alignCenter: true,
  alignParentCenter: false,
};

function Magnet(...doms) {
  if (!this instanceof Magnet) {
    return new Magnet(...arguments);
  }
  Object.defineProperties(this, {
    [MAGNET_PROPS.id]: { value: `magnet_${Date.now()}` },
    [MAGNET_PROPS.temp]: { value: [], writable: true },
    [MAGNET_PROPS.targets]: { value: [], writable: true },
    [MAGNET_PROPS.eventHandler]: { value: new EventHandler(this) },
    [MAGNET_PROPS.manualHandler]: { value: {}, writable: true },
    [MAGNET_PROPS.distance]: { value: MAGNET_DEFAULTS.distance, writable: true },
    [MAGNET_PROPS.attractable]: { value: MAGNET_DEFAULTS.attractable, writable: true },
    [MAGNET_PROPS.allowCtrlKey]: { value: MAGNET_DEFAULTS.allowCtrlKey, writable: true },
    [MAGNET_PROPS.allowDrag]: { value: MAGNET_DEFAULTS.allowDrag, writable: true },
    [MAGNET_PROPS.useRelativeUnit]: { value: MAGNET_DEFAULTS.useRelativeUnit, writable: true },
    [MAGNET_PROPS.stayInParent]: { value: MAGNET_DEFAULTS.stayInParent, writable: true },
    [MAGNET_PROPS.alignOuter]: { value: MAGNET_DEFAULTS.alignOuter, writable: true },
    [MAGNET_PROPS.alignInner]: { value: MAGNET_DEFAULTS.alignInner, writable: true },
    [MAGNET_PROPS.alignCenter]: { value: MAGNET_DEFAULTS.alignCenter, writable: true },
    [MAGNET_PROPS.alignParentCenter]: { value: MAGNET_DEFAULTS.alignParentCenter, writable: true },
  });
  objForEach(MAGNET_DEFAULTS, (value, prop) => (isset(this[prop])&&this[prop](value)));
  if (doms.length) {
    this.add(doms);
  }
}

// distance
Magnet.prototype.getDistance = function() {
  return this[MAGNET_PROPS.distance];
};
Magnet.prototype.setDistance = function(distance) {
  if (isNaN(distance)) {
    throw new Error(`Invalid distance: ${tostr(distance)}`);
  } else if (distance < 0) {
    throw new Error(`Illegal distance: ${distance}`);
  }
  this[MAGNET_PROPS.distance] = tonum(distance);
  return this;
};
Magnet.prototype.distance = function(distance) {
  return (isset(distance) ?this.setDistance(distance) :this.getDistance());
};

// attractable
Magnet.prototype.getAttractable = function() {
  return this[MAGNET_PROPS.attractable];
};
Magnet.prototype.setAttractable = function(enabled) {
  this[MAGNET_PROPS.attractable] = tobool(enabled);
  return this;
};
Magnet.prototype.attractable = function(enabled) {
  return (isset(enabled) ?this.setAttractable(enabled) :this.getAttractable());
};

// allow ctrl key
Magnet.prototype.getAllowCtrlKey = function() {
  return this[MAGNET_PROPS.allowCtrlKey];
};
Magnet.prototype.setAllowCtrlKey = function(enabled) {
  this[MAGNET_PROPS.allowCtrlKey] = tobool(enabled);
  return this;
};
Magnet.prototype.allowCtrlKey = function(enabled) {
  return (isset(enabled) ?this.setAllowCtrlKey(enabled) :this.getAllowCtrlKey());
};

// allow drag
Magnet.prototype.getAllowDrag = function() {
  return this[MAGNET_PROPS.allowDrag];
};
Magnet.prototype.setAllowDrag = function(enabled) {
  this[MAGNET_PROPS.allowDrag] = tobool(enabled);
  return this;
};
Magnet.prototype.allowDrag = function(enabled) {
  return (isset(enabled) ?this.setAllowDrag(enabled) :this.getAllowDrag());
};

// use relative unit
Magnet.prototype.getUseRelativeUnit = function() {
  return this[MAGNET_PROPS.useRelativeUnit];
};
Magnet.prototype.setUseRelativeUnit = function(enabled) {
  enabled = tobool(enabled);
  if (this[MAGNET_PROPS.useRelativeUnit] !== enabled) {
    stdDoms(this[MAGNET_PROPS.targets]).forEach((dom) => this.setMemberRectangle(dom));
    this[MAGNET_PROPS.useRelativeUnit] = enabled;
  }
  return this;
};
Magnet.prototype.useRelativeUnit = function(enabled) {
  return (isset(enabled) ?this.setUseRelativeUnit(enabled) :this.getUseRelativeUnit());
};


// stay in parent
Magnet.prototype.getStayInParent = function() {
  return this[MAGNET_PROPS.stayInParent];
};
Magnet.prototype.setStayInParent = function(enabled) {
  this[MAGNET_PROPS.stayInParent] = tobool(enabled);
  return this;
};
Magnet.prototype.stayInParent = 
Magnet.prototype.stayInParentEdge = 
Magnet.prototype.stayInParentElem = function(enabled) {
  return (isset(enabled) ?this.setStayInParent(enabled) :this.getStayInParent());
};


// align
['Outer', 'Inner', 'Center', 'ParentCenter'].forEach((name) => {
  const propName = `align${name}`;
  const funcName = `Align${name}`;
  Magnet.prototype[`get${funcName}`] = function() {
    return this[MAGNET_PROPS[propName]];
  };
  Magnet.prototype[`set${funcName}`] = function(enabled) {
    this[MAGNET_PROPS[propName]] = tobool(enabled);
    return this;
  };
  Magnet.prototype[propName] = 
    Magnet.prototype[`enabled${funcName}`] = function(enabled) {
    return (isset(enabled) ?this[`set${funcName}`](enabled) :this[`get${funcName}`]());
  };
});


// on/off
['on', 'off'].forEach((prop) => {
  Magnet.prototype[prop] = function(...args) {
    this[MAGNET_PROPS.eventHandler][prop](...args);
    return this;
  };
});


// check
Magnet.prototype.check = function(
  refDom,
  refRect = stdRect(refDom),
  alignmentProps = [].concat(
    (this.getAlignOuter() ?ALIGNMENT_OUTER :[]),
    (this.getAlignInner() ?ALIGNMENT_INNER :[]),
    (this.getAlignCenter() ?ALIGNMENT_CENTER :[]),
  )
) {
  if (!iselem(refDom)) {
    throw new Error(`Invalid DOM: ${tostr(refDom)}`);
  }
  if (isarray(refRect)) {
    alignmentProps = refRect;
    refRect = stdRect(refDom);
  }
  const parentDom = getParent(refDom);
  const parentRect = stdRect(parentDom);
  const targets = this[MAGNET_PROPS.targets]
    .filter((dom) => (dom!==refDom))
    .map((dom) => diffRect(refRect, dom, { alignments: alignmentProps, }));
  const results = targets.reduce((results, diff) => {
    objForEach(diff.results, (_, prop) => {
      results[prop] = (results[prop]||[]);
      results[prop].push(diff);
    });
    return results;
  }, {});
  const rankings = objMap(results, (arr, prop) => arr.concat().sort((a, b) => (a.results[prop]-b.results[prop])));
  return {
    source: { rect: refRect, element: refDom },
    parent: { rect: parentRect, element: parentDom },
    targets,
    results,
    rankings,
    mins: objMap(rankings, (arr) => arr[0]),
    maxs: objMap(rankings, (arr) => arr[arr.length-1]),
  };
};


// handle
const pushDomToEvent = (arr, dom) => (!arr.includes(dom)&&arr.push(dom));
const stdMagentEventTarget = (ref) => {
  if (ref) {
    const { prop, target: { rect, element } } = ref;
    const parentRect = stdRect(getParent(element));
    const [position, diff] = (({ top, right, bottom, left }, { top: y, left: x }) => {
      switch (prop) {
        case ALIGNMENT_PROPS.tt:
        case ALIGNMENT_PROPS.bt: return [top, y];
        case ALIGNMENT_PROPS.bb:
        case ALIGNMENT_PROPS.tb: return [bottom, y];
        case ALIGNMENT_PROPS.rr:
        case ALIGNMENT_PROPS.lr: return [right, x];
        case ALIGNMENT_PROPS.ll:
        case ALIGNMENT_PROPS.rl: return [left, x];
        case ALIGNMENT_PROPS.xx: return [((right+left)/2), x];
        case ALIGNMENT_PROPS.yy: return [((top+bottom)/2), y];
      }
    })(rect, parentRect);
    return {
      type: prop,
      rect,
      element,
      position,
      offset: (position-diff),
    };
  } else {
    return null;
  }
};
const cmpAttractedResult = (a, b) => {
  if ((a ?true :false) !== (b ?true :false)) {
    return true;
  } else if ((a ?a.target.element :null) !== (b ?b.target.element :null)) {
    return true;
  }
  return false;
};
Magnet.prototype.handle = function(dom, refRect = stdRect(dom), toAttract = this.getAttractable()) {
  if (!iselem(dom)) {
    throw new Error(`Invalid DOM: ${tostr(dom)}`);
  }
  const domIndex = indexOfMember(this, dom);
  if (-1 === domIndex) {
    throw new Error(`Invalid member: ${tostr(dom)}`);
  }
  if (isbool(refRect)) {
    toAttract = refRect;
    refRect = dom;
  }
  refRect = stdRect(refRect);
  const { _lastAttractedX, _lastAttractedY } = this[MAGNET_PROPS.temp][domIndex];
  const { top, left, width, height } = refRect;
  const distance = (toAttract ?this.getDistance() :0);
  const { parent, targets } = this.check(dom, refRect, (toAttract ?undefined :[]));
  const { rect: parentRect, element: parentElement } = parent;
  const newPosition = { x: left, y: top };
  const { x: attractedX, y: attractedY } = targets
    .concat(
      (this.getStayInParent() ?diffRect(refRect, parentElement, { alignments: ALIGNMENT_INNER, absDistance: false }) :[]),
      (this.getAlignParentCenter() ?diffRect(refRect, parentElement, { alignments: ALIGNMENT_CENTER }) :[]),
    )
    .reduce(({ x, y }, diff) => {
      const { target, results, ranking } = diff;
      return ranking.reduce(({ x, y }, prop) => {
        let value = results[prop];
        if (value <= distance) {
          switch (prop) {
            case ALIGNMENT_PROPS.rr:
            case ALIGNMENT_PROPS.ll:
            case ALIGNMENT_PROPS.rl:
            case ALIGNMENT_PROPS.lr:
            case ALIGNMENT_PROPS.xx:
            if (!x || value < x.value) {
              x = { prop, value, target };
            }
            break;

            case ALIGNMENT_PROPS.tt:
            case ALIGNMENT_PROPS.bb:
            case ALIGNMENT_PROPS.tb:
            case ALIGNMENT_PROPS.bt:
            case ALIGNMENT_PROPS.yy:
            if (!y || value < y.value) {
              y = { prop, value, target };
            }
            break;
          }
        }
        return { x, y };
      }, { x, y });
    }, { x: null, y: null });
    
  // be attracted by nearest target
  const eventsAttracted = [];
  const eventsUnattracted = [];
  if (attractedX) {
    const { prop, target: { rect } } = attractedX;
    switch (prop) {
      case ALIGNMENT_PROPS.rr: newPosition.x = (rect.right-width); break;
      case ALIGNMENT_PROPS.ll: newPosition.x = rect.left; break;
      case ALIGNMENT_PROPS.rl: newPosition.x = (rect.left-width); break;
      case ALIGNMENT_PROPS.lr: newPosition.x = rect.right; break;
      case ALIGNMENT_PROPS.xx: newPosition.x = ((rect.left+rect.right-width)/2); break;
    }
  }
  if (attractedY) {
    const { prop, target: { rect } } = attractedY;
    switch (prop) {
      case ALIGNMENT_PROPS.tt: newPosition.y = rect.top; break;
      case ALIGNMENT_PROPS.bb: newPosition.y = (rect.bottom-height); break;
      case ALIGNMENT_PROPS.tb: newPosition.y = rect.bottom; break;
      case ALIGNMENT_PROPS.bt: newPosition.y = (rect.top-height); break;
      case ALIGNMENT_PROPS.yy: newPosition.y = ((rect.top+rect.bottom-height)/2); break;
    }
  }
  
  // trigger events
  const diffAttractedX = cmpAttractedResult(_lastAttractedX, attractedX);
  const diffAttractedY = cmpAttractedResult(_lastAttractedY, attractedY);
  if (diffAttractedX) {
    (attractedX&&pushDomToEvent(eventsAttracted, attractedX.target.element));
    (_lastAttractedX&&pushDomToEvent(eventsUnattracted, _lastAttractedX.target.element));
  }
  if (diffAttractedY) {
    (attractedY&&pushDomToEvent(eventsAttracted, attractedY.target.element));
    (_lastAttractedY&&pushDomToEvent(eventsUnattracted, _lastAttractedY.target.element));
  }
  eventsAttracted.forEach((element) => EventHandler.trigger(element, EVENT.attracted, dom));
  eventsUnattracted.forEach((element) => EventHandler.trigger(element, EVENT.unattracted, dom));
  
  const currentAttract = (attractedX||attractedY ?true :false);
  const lastAttract = (_lastAttractedX||_lastAttractedY ?true :false);
  const eventHandler = this[MAGNET_PROPS.eventHandler];
  const currData = {
    x: stdMagentEventTarget(attractedX),
    y: stdMagentEventTarget(attractedY),
  };
  const lastData = {
    x: stdMagentEventTarget(_lastAttractedX),
    y: stdMagentEventTarget(_lastAttractedY),
  };

  if (currentAttract) {
    const anyDiff = (diffAttractedX||diffAttractedY);
    if (!lastAttract) {
      // magnet start: start of any attract event
      eventHandler.trigger(EVENT.magnetChange, { source: dom, ...currData });
      eventHandler.trigger(EVENT.magnetStart, { source: dom, ...currData });
      EventHandler.trigger(dom, EVENT.attract, currData);
    } else if (anyDiff ||
      (!diffAttractedX && attractedX && _lastAttractedX && attractedX.prop !== _lastAttractedX.prop) ||
      (!diffAttractedY && attractedY && _lastAttractedY && attractedY.prop !== _lastAttractedY.prop)
    ) {
      // magnet change: change of any attract event
      eventHandler.trigger(EVENT.magnetChange, { source: dom, ...currData });
      EventHandler.trigger(dom, EVENT.attract, currData);
    } else if (anyDiff) {
      eventHandler.trigger(EVENT.magnetChange, { source: dom, ...currData });
    }
    if (anyDiff) {
      EventHandler.trigger(dom, EVENT.unattract, lastData);
    }
  } else if (lastAttract) {
    // magnet end: end of all attract event
    eventHandler.trigger(EVENT.magnetChange, { source: dom, x: null, y: null });
    eventHandler.trigger(EVENT.magnetEnd, { source: dom, ...lastData });
    EventHandler.trigger(dom, EVENT.unattract, lastData);
  }

  const manualHandler = this[MAGNET_PROPS.manualHandler];
  const { beforeAttract, afterAttract, doAttract } = manualHandler;
  let targetRect = ((x, y) => stdRect({
    top: y,
    right: (x+width),
    bottom: (y+height),
    left: x,
    width,
    height,
  }))((newPosition.x-parentRect.left), (newPosition.y-parentRect.top));

  // before attract
  if (isfunc(beforeAttract)) {
    const rect = beforeAttract.bind(this)(dom, {
      origin: stdRect(refRect),
      target: stdRect(targetRect),
    }, {
      current: currData,
      last: lastData,
    });
    if (isRect(rect)) {
      targetRect = rect;
    } else if (isbool(rect) && false === rect) {
      targetRect = refRect;
    } else if (isset(rect)) {
      throw new Error(`Invalid return value: ${tostr(rect)}`);
    }
  }

  // attract move event
  EventHandler.trigger(dom, EVENT.attractMove, {
    rects: {
      origin: stdRect(refRect),
      target: stdRect(targetRect),
    },
    attracts: {
      current: currData,
      last: lastData,
    },
  }, () => {
    targetRect = refRect;
  });

  if (isfunc(doAttract)) {
    // do attract
    doAttract.bind(this)(dom, {
      origin: stdRect(refRect),
      target: stdRect(targetRect),
    }, {
      current: currData,
      last: lastData,
    });
  } else {
    // move dom
    this.setMemberRectangle(dom, targetRect);
  }

  // after attract
  if (isfunc(afterAttract)) {
    afterAttract.bind(this)(dom, {
      origin: stdRect(refRect),
      target: stdRect(targetRect),
    }, {
      current: currData,
      last: lastData,
    });
  }
  
  this[MAGNET_PROPS.temp][domIndex] = {
    _lastAttractedX: attractedX,
    _lastAttractedY: attractedY,
  };

  return this;
};


// set member rectangle
Magnet.prototype.setMemberRectangle = function(dom, rect = stdRect(dom), useRelativeUnit = this.getUseRelativeUnit()) {
  if (!iselem(dom)) {
    throw new Error(`Invalid DOM: ${tostr(dom)}`);
  }
  if (!this.hasMember(dom)) {
    throw new Error(`Invalid member: ${tostr(dom)}`);
  }
  if (isbool(rect)) {
    useRelativeUnit = rect;
    rect = stdRect(dom);
  }
  //rect = stdRect(rect);
  rect = stdRect({
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  });
  console.log(rect);
  const { top, left, width, height } = rect;
  if (useRelativeUnit) {
    const { width: parentWidth, height: parentHeight } = stdRect(getParent(dom));
    dom.style.top = toPreg(top/parentHeight);
    dom.style.left = toPreg(left/parentWidth);
    dom.style.width = toPreg(width/parentWidth);
    dom.style.height = toPreg(height/parentHeight);
  } else {
    dom.style.top = toPx(top);
    dom.style.left = toPx(left);
    dom.style.width = toPx(width);
    dom.style.height = toPx(height);
  }
  dom.style.position = 'absolute';
  dom.style.right = 'auto';
  dom.style.bottom = 'auto';
  return this;
};


// manual handler
['before', 'after', 'do'].forEach((prop) => {
  const funcName = `${prop}Attract`;
  Object.defineProperty(Magnet.prototype, funcName, {
    get: function() {
      return this[MAGNET_PROPS.manualHandler][funcName];
    },
    set: function(func) {
      this[MAGNET_PROPS.manualHandler][funcName] = func;
    },
  });
});


// add
Magnet.prototype.add = function(...doms) {
  doms = stdDoms(...doms);
  
  // reject special elements
  [window, document, document.body].forEach((elm) => {
    if (doms.includes(elm)) {
      throw new Error(`Illegal element: ${tostr(src)}`);
    }
  });

  doms.forEach((dom) => {
    if (this[MAGNET_PROPS.targets].includes(dom)) {
      return;
    }
    EventHandler.on(dom, bindEventNames(this, EVENT.mouseDown), (evt) => {
      if (!this.getAllowDrag()) {
        return;
      }
      evt.preventDefault();

      let _toAttract = !evt.ctrlKey;
      let _lastEvent = evt;

      const { left: oriLeft, top: oriTop, width, height } = stdRect(dom);
      const { x: oriX, y: oriY } = getEventXY(evt);
      const handleDom = (evt) => {
        const toAttract = (this.getAttractable()
          ?(this.getAllowCtrlKey() ?_toAttract :true)
          :false
        );
        const { x, y } = getEventXY(evt);
        const diffX = (x-oriX);
        const diffY = (y-oriY);
        const newX = (oriLeft+diffX);
        const newY = (oriTop+diffY);
        const newRect = stdRect({
          top: newY,
          right: (newX+width),
          bottom: (newY+height),
          left: newX,
        });
        this.handle(dom, newRect, toAttract);
      };

      EventHandler.trigger(dom, EVENT.attractStart, stdRect(dom));
      EventHandler.off(document.body, bindEventNames(this, EVENT.mouseMove, EVENT.mouseUp, EVENT.keyDown, EVENT.keyUp));
      EventHandler.on(document.body, bindEventNames(this, EVENT.keyDown, EVENT.keyUp), (evt) => {
        const toAttract = !evt.ctrlKey;
        if (toAttract !== _toAttract) {
          _toAttract = toAttract;
          handleDom(_lastEvent);
        }
      });
      EventHandler.on(document.body, bindEventNames(this, EVENT.mouseUp), () => {
        const eventsUnattracted = [];
        const domIndex = indexOfMember(this, dom);
        const { _lastAttractedX, _lastAttractedY } = this[MAGNET_PROPS.temp][domIndex];
        EventHandler.off(document.body, bindEventNames(this, EVENT.mouseMove, EVENT.mouseUp, EVENT.keyDown, EVENT.keyUp));
        (_lastAttractedX&&pushDomToEvent(eventsUnattracted, _lastAttractedX.target.element));
        (_lastAttractedY&&pushDomToEvent(eventsUnattracted, _lastAttractedY.target.element));
        eventsUnattracted.forEach((element) => EventHandler.trigger(element, EVENT.unattracted, dom));
        EventHandler.trigger(dom, EVENT.attractEnd, stdRect(dom));
        if (_lastAttractedX || _lastAttractedY) {
          const eventHandler = this[MAGNET_PROPS.eventHandler];
          EventHandler.trigger(dom, EVENT.unattract);
          eventHandler.trigger(EVENT.magnetChange, { source: dom, x: null, y: null });
          eventHandler.trigger(EVENT.magnetEnd, { source: dom });
        }
        this[MAGNET_PROPS.temp][domIndex] = {};
      });
      EventHandler.on(document.body, bindEventNames(this, EVENT.mouseMove), (evt) => {
        handleDom(evt);
        _lastEvent = evt;
      });
    });
    this[MAGNET_PROPS.targets].push(dom);
    this[MAGNET_PROPS.temp].push({});
    this.setMemberRectangle(dom);
  });
  return this;
};


// member in group
const indexOfMember = (self, dom) => self[MAGNET_PROPS.targets].indexOf(dom);
Magnet.prototype.hasMember = function(dom) {
  return (-1!==indexOfMember(this, dom));
};


// remove
const removeMembers = (self, ...doms) => stdDoms(...doms).reduce((arr, dom) => {
  const refDoms = self[MAGNET_PROPS.targets];
  const refTemps = self[MAGNET_PROPS.temp];
  const index = refDoms.indexOf(dom);
  if (-1 !== index) {
    refDoms.splice(index, 1);
    refTemps.splice(index, 1);
    EventHandler.off(dom, bindEventNames(self, EVENT.mouseDown));
    arr.push(dom);
  }
  return arr;
}, []);
Magnet.prototype.remove = function(...doms) {
  removeMembers(this, ...doms);
  return this;
};
Magnet.prototype.removeFull = function(...doms) {
  removeMembers(this, ...doms).forEach((dom) => {
    dom.style.position = '';
    dom.style.top = '';
    dom.style.right = '';
    dom.style.bottom = '';
    dom.style.left = '';
    dom.style.width = '';
    dom.style.height = '';
    dom.style.zIndex = '';
  });
  return this;
};


// clear
const clearMembers = (self) => {
  const refDoms = self[MAGNET_PROPS.targets];
  self[MAGNET_PROPS.temp] = [];
  return refDoms.splice(0, refDoms.length).map((dom) => {
    EventHandler.off(dom, bindEventNames(self, EVENT.mouseDown));
    return dom;
  });
};
Magnet.prototype.clear = function() {
  clearMembers(this);
  return this;
};
Magnet.prototype.clearFull = function() {
  clearMembers(this).forEach((dom) => {
    dom.style.position = '';
    dom.style.top = '';
    dom.style.right = '';
    dom.style.bottom = '';
    dom.style.left = '';
    dom.style.width = '';
    dom.style.height = '';
    dom.style.zIndex = '';
  });
  return this;
};


Magnet.isRect = (rect) => isRect(rect);
Magnet.stdRect = (rect) => stdRect(rect);
Magnet.measure = 
Magnet.diffRect = (source, target, ...args) => diffRect(source, target, ...args);

export default Magnet;