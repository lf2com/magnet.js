(() => { 'use strict';

  const isset = (o) => ('undefined'!==typeof o);
  const isstr = (s) => (isset(s)&&(s instanceof String||'string'===typeof s));
  const isfunc = (f) => (isset(f)&&f instanceof Function);
  const iselem = (e) => (isset(e)&&(e instanceof HTMLElement||e instanceof Window||e instanceof Document));

  function EventHandler(who) {
    if (!(this instanceof EventHandler)) {
      return new EventHandler(who);
    }
    Object.defineProperty(this, '_dom', {
      value: (iselem(who) ?who :document.createElement('eh')),
      enumerable: false
    });
    Object.defineProperty(this, '_who', { value: who, enumerable: false, writable: false });
    Object.defineProperty(this, '_events', { value: {}, enumerable: false, writable: false });
  }

  EventHandler.on = function(elm, types, func) {
    if (elm instanceof EventHandler) {
      elm.on(types, func);
      return EventHandler;
    } else if (!iselem(elm)) {
      throw new Error('Invalid element: '+(typeof elm));
    }
    elm._eventHandler = (elm._eventHandler||new EventHandler(elm)).on(types, func);
    return EventHandler;
  };

  EventHandler.off = function(elm, types) {
    if (elm instanceof EventHandler) {
      elm.on(types, func);
      return EventHandler;
    } else if (!iselem(elm)) {
      throw new Error('Invalid element: '+(typeof elm));
    }
    elm._eventHandler = (elm._eventHandler||new EventHandler(elm)).off(types);
    return EventHandler;
  };

  EventHandler.trigger = function(elm, types, params) {
    if (elm instanceof EventHandler) {
      elm.on(types, func);
      return EventHandler;
    } else if (!iselem(elm)) {
      throw new Error('Invalid element: '+(typeof elm));
    }
    elm._eventHandler = (elm._eventHandler||new EventHandler(elm)).trigger(types, params);
    return EventHandler;
  };

  EventHandler.prototype.on = function(types, func) {
    if (!isstr(types)) {
      throw new Error('Invalid types: '+(typeof types));
    } else if (0 === types.length) {
      throw new Error('Illegal types');
    }
    if (!isfunc(func)) {
      throw new Error('Invalid function: '+(typeof func));
    }
    func = func.bind(this._who);
    types.split(' ').forEach((type) => {
      this._dom.addEventListener(type.replace(/\..*$/, ''), func);
      this._events[type] = (this._events[type]||[]);
      this._events[type].push(func);
    });
    return this;
  };

  EventHandler.prototype.off = function(types) {
    if (!isstr(types)) {
      throw new Error('Invalid types: '+(typeof types));
    } else if (0 === types.length) {
      throw new Error('Illegal types');
    }
    types.split(' ').forEach((type) => {
      let typeProp = type.replace(/\..*$/, '');
      (this._events[type]||[]).forEach((func) => this._dom.removeEventListener(typeProp, func));
      delete this._events[type];
    });
    return this;
  };

  EventHandler.prototype.trigger = function(types, params) {
    if (!isstr(types)) {
      throw new Error('Invalid types: '+(typeof types));
    } else if (0 === types.length) {
      throw new Error('Illegal types');
    }
    types.split(' ').forEach((type) => {
      let typeName = type.replace(/^.*\.?/, '')
      if (typeName) {
        (this._events[type]||[]).forEach((func) => func({ detail: params }));
      } else if (window.CustomEvent) {
        this._dom.dispatchEvent(new CustomEvent(type, { detail: params }));
      } else {
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(type, true, true, params);
        this._dom.dispatchEvent(evt);
      }
    });
  };

  module.exports = EventHandler;
  if (self && (self instanceof Object) && (self.self === self)) {
    self.EventHandler = EventHandler;
  }

})();