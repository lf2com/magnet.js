'use strict';

import { isset, isstr, tostr, isarray, isfunc, iselem,  } from './stdlib';

const stdEventName = (name) => {
  if (!isstr(name)) {
    throw new Error(`Invalid name: ${tostr(name)}`);
  }
  const [major, minor] = name.split('.');
  if (!isset(major)) {
    throw new Error(`Illegal name: ${tostr(name)}`);
  }
  return [major, minor];
};
const stdEventNames = (names) => {
  if (isstr(names)) {
    names = names.split(' ');
  } else if (!isarray(names)) {
    throw new Error(`Invalid names: ${tostr(names)}`);
  }
  return names.map((name) => stdEventName(name));
};
const stdEventFuncs = (funcs) => {
  if (isfunc(funcs)) {
    return [funcs];
  }
  if (!isarray(funcs)) {
    throw new Error(`Invalid funcs: ${tostr(funcs)}`);
  }
  return funcs.map((func) => {
    if (!isfunc(func)) {
      throw new Error(`Invaqlid func: ${tostr(func)}`);
    }
    return func;
  });
};

function EventHandler(ref) {
  if (!this instanceof EventHandler) {
    return new EventHandler(...arguments);
  }
  Object.defineProperties(this, {
    ref: { value: ref },
    dom: { value: (iselem(ref) ?ref :document.createElement('eh')) },
    events: { value: {} }
  });
}

['on', 'off', 'trigger'].forEach((prop) => {
  EventHandler[prop] = (ref, ...args) => {
    if (ref instanceof EventHandler) {
      ref[prop](...args);
    } else if (!iselem(ref)) {
      throw new Error(`Invalid element: ${tostr(ref)}`);
    }
    ref._eventHandler = (ref._eventHandler||new EventHandler(ref))[prop](...args);
    return EventHandler;
  };
});

EventHandler.prototype.on = function(names, funcs) {
  funcs = stdEventFuncs(funcs);
  if (isset(this.ref)) {
    funcs = funcs.map((func) => func.bind(this.ref));
  }
  stdEventNames(names).forEach(([major, minor]) => {
    funcs.forEach((func) => this.dom.addEventListener(major, func));
    this.events[major] = (this.events[major]||[]).concat(funcs.map((func) => ({
      minor,
      func,
    })));
  });
  return this;
};

EventHandler.prototype.off = function(names) {
  stdEventNames(names).forEach(([major, minor]) => {
    const eventList = (this.events[major]||[]);
    const removeList = [];
    if (isset(minor)) {
      for (let i=eventList.length-1; 0<=i; i--) {
        let ref = eventList[i];
        if (minor === ref.minor) {
          removeList.push(ref);
          eventList.splice(i, 1);
        }
      }
    } else {
      eventList.splice(0, eventList.length).forEach((ref) => {
        removeList.push(ref);
      });
    }
    removeList.forEach(({ func }) => {
      this.dom.removeEventListener(major, func);
    });
    if (0 === eventList.length) {
      delete this.events[major];
    }
  });
  return this;
};

EventHandler.prototype.trigger = function(names, detail) {
  stdEventNames(names).forEach(([major, _minor]) => {
    if (isset(_minor)) {
      (this.events[major]||[]).filter(({ minor }) => (minor===_minor)).forEach(({ func }) => {
        func({ detail });
      });
    } else if (window.CustomEvent) {
      this.dom.dispatchEvent(new CustomEvent(major, { detail }));
    } else {
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(major, true, true, detail);
      this.dom.dispatchEvent(evt);
    }
  });
  return this;
};

export default EventHandler;