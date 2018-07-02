(() => { 'use strict';

  const _alignOuter = ['topToBottom', 'rightToLeft', 'bottomToTop', 'leftToRight'];
  const _alignInner = ['topToTop', 'rightToRight', 'bottomToBottom', 'leftToLeft'];
  const _alignCenter = ['xCenter', 'yCenter'];
  const _eventAppend = 'magnet';
  const _eventAttract = 'attract';
  const _eventUnattract = 'unattract';
  const _eventAttracted = 'attracted';
  const _eventUnattracted = 'unattracted';
  const _eventMagnetEnter = 'magnetenter';
  const _eventMagnetLeave = 'magnetleave';
  const _eventMousedown = ['mousedown', 'touchstart'];
  const _eventMousemove = ['mousemove', 'touchmove'];
  const _eventMouseup = ['mouseup', 'mouseleave', 'touchend'];
  const _eventKeydown = 'keydown';
  const _eventKeyup = 'keyup';

  const EventHandler = require('./lib/event-handler');

  const isset = (o) => ('undefined'!==typeof o);
  const isrect = (r) => (
    isset(r)&&
    !isNaN(r.top)&&!isNaN(r.right)&&!isNaN(r.bottom)&&!isNaN(r.left)&&
    (r.top<r.bottom)&&(r.left<r.right)&&
    (isset(r.x) ?(r.x===r.left) :true)&&(isset(r.y) ?(r.y===r.top) :true)&&
    (isset(r.width) ?(r.width===(r.right-r.left)) :true)&&(isset(r.height) ?(r.height===(r.bottom-r.top)) :true)
  );
  const iselem = (e) => (isset(e)&&(e instanceof HTMLElement||e instanceof Document||e instanceof Window));
  const isarray = (a) => (isset(a)&&isset(a.length));
  const objKeys = (o) => Object.keys(o);
  const objForEach = (o, f, t) => objKeys(o).forEach((p) => f.call(t, o[p], p, o));
  const bindEventType = (t, a = _eventAppend) => (isarray(t) ?t :t.split(' ')).map((n) => (n+(a ?('.'+a) :''))).join(' ');
  const getEventXY = (e) => {
    e = ((e.touches||{})[0]||e);
    return { x: e.clientX, y: e.clientY };
  };
  const getDomStyle = (dom) => (dom.currentStyle||getComputedStyle(dom));
  const stdRect = (dom) => new Rect(dom);
  const stdDoms = function() {
    let doms = [];
    let pushDom = (dom) => { if (-1===doms.indexOf(dom)) { doms.push(dom) }; };
    Array.prototype.forEach.call(arguments, (trgs) => {
      if (isarray(trgs)) {
        Array.prototype.forEach.call(trgs, (elm) => {
          if (isarray(elm)) {
            elm = stdDoms(elm);
          } else {
            elm = [elm];
          }
          elm.forEach((el) => {
            if (!iselem(el)) {
              throw new Error('Invalid element');
            }
            pushDom(el);
          });
        });
      } else if (iselem(trgs)) {
        pushDom(trgs);
      } else {
        throw new Error('Invalid element');
      }
    });
    return doms;
  };
  const getRefParentDom = (dom) => {
    let ref = dom.parentElement;
    while (ref) {
      if ('static' !== getDomStyle(ref).position) {
        return ref;
      }
      ref = ref.parentElement;
    }
    return document;
  };

  function Rect(src) {
    let rect = ((src) => {
      if (iselem(src)) {
        let rect = null;
        let border = null;
        if (src instanceof HTMLElement) {
          rect = src.getBoundingClientRect();
          rect = { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
          border = ((style) => ({
            top: parseFloat(style.borderTopWidth),
            right: parseFloat(style.borderRightWidth),
            bottom: parseFloat(style.borderBottomWidth),
            left: parseFloat(style.borderLeftWidth)
          }))(getDomStyle(src));
        } else {
          rect = { top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0 };
          border = { top: 0, right: 0, bottom: 0, left: 0 };
        }
        rect.top += border.top;
        rect.right -= border.right;
        rect.bottom -= border.bottom;
        rect.left += border.left;
        return rect;
      } else if (isrect(src)) {
        return { top: src.top, right: src.right, bottom: src.bottom, left: src.left };
      } else {
        throw new Error('Could NOT get rectangle');
      }
    })(src);
    ['top', 'right', 'bottom', 'left'].forEach((prop) => Object.defineProperty(this, prop, { value: rect[prop] }));
    Object.defineProperty(this, 'x', { value: this.left });
    Object.defineProperty(this, 'y', { value: this.top });
    Object.defineProperty(this, 'width', { value: (this.right-this.left) });
    Object.defineProperty(this, 'height', { value: (this.bottom-this.top) });
  }

  function MearsureResult(src, trg) {
    Object.defineProperty(this, 'source', { value: Object.create(null), enumerable: false });
    Object.defineProperty(this, 'target', { value: Object.create(null), enumerable: false });
    if (iselem(src)) { this.source.element = src; }
    if (iselem(trg)) { this.target.element = trg; }
    this.source.rect = src = stdRect(src);
    this.target.rect = trg = stdRect(trg);
    this.topToTop = Math.abs(src.top-trg.top);
    this.topToBottom = Math.abs(src.top-trg.bottom);
    this.rightToRight = Math.abs(src.right-trg.right);
    this.rightToLeft = Math.abs(src.right-trg.left);
    this.bottomToTop = Math.abs(src.bottom-trg.top);
    this.bottomToBottom = Math.abs(src.bottom-trg.bottom);
    this.leftToRight = Math.abs(src.left-trg.right);
    this.leftToLeft = Math.abs(src.left-trg.left);
    this.xCenter = Math.abs(.5*(src.right+src.left-trg.right-trg.left));
    this.yCenter = Math.abs(.5*(src.top+src.bottom-trg.top-trg.bottom));
    Object.defineProperty(this, 'ranking', { value: objKeys(this).sort((a, b) => (this[a]-this[b])), enumerable: false });
    Object.defineProperty(this, 'min', { value: this.ranking[0], enumerable: false });
    Object.defineProperty(this, 'max', { value: this.ranking[this.ranking.length-1], enumerable: false });
  }

  function NearbyResult(src) {
    let doms = stdDoms(Array.prototype.slice.call(arguments, 1));
    let min = undefined;
    let max = undefined;
    Object.defineProperty(this, 'source', { value: Object.create(null), enumerable: false });
    if (iselem(src)) { this.source.element = src; }
    this.source.rect = src = stdRect(src);
    doms.forEach((elm) => {
      let result = new MearsureResult(src, elm);
      objForEach(result, (val, prop) => {
        if (!this[prop] || result[prop] < this[prop][prop]) {
          this[prop] = result;
        }
      });
      if (!isset(min) || result[result.min] < this[min].min) {
        min = result.min;
      }
      if (!isset(max) || this[max].max < result[result.max]) {
        max = result.max;
      }
    });
    Object.defineProperty(this, 'min', { value: min, enumerable: false });
    Object.defineProperty(this, 'max', { value: max, enumerable: false });
    Object.defineProperty(this, 'ranking', { value: objKeys(this).sort((a, b) => (this[b][b]-this[a][a])), enumerable: false });
  }

  function Magnet() {
    Object.defineProperty(this, '_distance', { value: 0, enumerable: false, writable: true });
    Object.defineProperty(this, '_stayInParentElem', { value: false, enumerable: false, writable: true });
    Object.defineProperty(this, '_enabledAlignOuter', { value: true, enumerable: false, writable: true });
    Object.defineProperty(this, '_enabledAlignInner', { value: true, enumerable: false, writable: true });
    Object.defineProperty(this, '_enabledAlignCenter', { value: true, enumerable: false, writable: true });
    Object.defineProperty(this, '_targets', { value: [], enumerable: false, writable: true });
    Object.defineProperty(this, '_event', { value: new EventHandler(this), enumerable: false, writable: false });
    if (arguments.length) {
      this.add.apply(this, arguments);
    }
  }

  Magnet.prototype.distance = function(dist) {
    if (!isset(dist)) {
      return this._distance;
    } else if (isNaN(dist)) {
      throw new Error('Invalid distance');
    } else if (dist < 0) {
      throw new Error('Illegal distance');
    }
    this._distance = dist;
    return this;
  };

  Magnet.prototype.stayInParentEdge = 
  Magnet.prototype.stayInParentElem = function(enabled) {
    if (!isset(enabled)) {
      return this._stayInParentElem;
    }
    this._stayInParentElem = (enabled ?true :false);
    return this;
  };

  ['enabledAlignOuter', 'enabledAlignInner', 'enabledAlignCenter'].forEach((prop) => {
    Magnet.prototype[prop] = function(enabled) {
      if (!isset(enabled)) {
        return this['_'+prop];
      }
      this['_'+prop] = (enabled ?true :false);
      return this;
    };
  });

  Magnet.prototype.on = function() {
    this._event.on.apply(this._event, arguments);
    return this;
  };
  
  Magnet.prototype.off = function() {
    this._event.off.apply(this._event, arguments);
    return this;
  };

  Magnet.prototype.add = function() {
    let doms = stdDoms(this._targets, arguments);
    [window, document, document.body].forEach((elm) => {
      let inx = doms.indexOf(elm);
      if (-1 !== inx) {
        throw new Error('Illegal element');
      }
    });
    this.clear();
    doms.forEach((elm, inx) => {
      let others = doms.concat();
      let enabledMagnet = true;
      others.splice(inx, 1);
      EventHandler.on(elm, bindEventType(_eventMousedown), (e) => {
        let oriRect = stdRect(elm);
        let xy = getEventXY(e);
        let oriX = xy.x;
        let oriY = xy.y;
        let lastTouched = false;
        let lastEvent = e;
        let lastResultX = null;
        let lastResultY = null;
        let refParentRect = stdRect(getRefParentDom(elm));
        let parentRect = stdRect(elm.parentElement||elm);
        let alignProps = [].concat((this._enabledAlignOuter ?_alignOuter :[]), (this._enabledAlignInner ?_alignInner :[]), (this._enabledAlignCenter ?_alignCenter :[]));
        let checkMagnet = (e) => {
          lastEvent = e;
          let xy = getEventXY(e);
          let diffX = (xy.x-oriX);
          let diffY = (xy.y-oriY);
          let x = (oriRect.x+diffX);
          let y = (oriRect.y+diffY);
          let distance = (e.ctrlKey ?0 :this._distance);
          let resultX = null;
          let resultY = null;
          let nearby = (e.ctrlKey ?{} :Magnet.nearby(stdRect({
            top: y,
            right: (x+oriRect.width),
            bottom: (y+oriRect.height),
            left: x
          }), others)||{});
          (nearby.ranking||[]).reverse().forEach((prop) => {
            if (-1 === alignProps.indexOf(prop)) {
              nearby.ranking.splice(nearby.ranking.indexOf(prop), 1);
              delete nearby[prop];
            } else if (nearby[prop][prop] <= distance) {
              let result = nearby[prop];
              let target = result.target;
              let rect = target.rect;
              let stdResult = () => ({ type: prop, element: target.element, rect: rect });
              let checkX = (tmpX) => {
                if (!this._stayInParentElem || (tmpX+oriRect.width) <= parentRect.right) {
                  x = tmpX;
                  resultX = stdResult();
                }
              };
              let checkY = (tmpY) => {
                if (!this._stayInParentElem || (tmpY+oriRect.height) <= parentRect.bottom) {
                  y = tmpY;
                  resultY = stdResult();
                }
              };
              switch (prop) {
                case 'topToTop':       return checkY(rect.top);
                case 'topToBottom':    return checkY(rect.bottom);
                case 'rightToRight':   return checkX(rect.right-oriRect.width);
                case 'rightToLeft':    return checkX(rect.left-oriRect.width);
                case 'bottomToTop':    return checkY(rect.top-oriRect.height);
                case 'bottomToBottom': return checkY(rect.bottom-oriRect.height);
                case 'leftToRight':    return checkX(rect.right);
                case 'leftToLeft':     return checkX(rect.left);
                case 'xCenter':        return checkX((rect.right+rect.left-oriRect.width)/2);
                case 'yCenter':        return checkY((rect.top+rect.bottom-oriRect.height)/2);
              }
            }
          });
          [resultX, resultY].forEach((res) => {
            if (res) {
              let rect = res.rect;
              switch (res.type) {
                case 'topToTop':
                case 'bottomToTop':
                return res.position = rect.top;
                case 'topToBottom':
                case 'bottomToBottom':
                return res.position = rect.bottom;
                case 'rightToRight':
                case 'leftToRight':
                return res.position = rect.right;
                case 'rightToLeft':
                case 'leftToLeft':
                return res.position = rect.left;
                case 'xCenter':
                return res.position = ((rect.right+rect.left)/2);
                case 'yCenter':
                return res.position = ((rect.top+rect.bottom)/2);
              }
            }
          });
          let touched = (resultX||resultY ?true :false);
          let attract = false;
          let unattract = false;
          let magnetEnter = false;
          let magnetleave = false;
          let attracted = [];
          let unattracted = [];
          let pushArr = (arr, res) => {
            for (let i=0; i<arr.length; i++) {
              if (arr[i] === res.element) {
                return;
              }
            }
            arr.push(res.element);
          };
          if (e.ctrlKey) {
            if (lastTouched) {
              unattract = true;
              if (lastResultX) { pushArr(unattracted, lastResultX); }
              if (lastResultY) { pushArr(unattracted, lastResultY); }
              magnetleave = true;
            }
            lastTouched = false;
          } else if (touched !== lastTouched) {
            if (touched) {
              attract = true;
              if (resultX) { pushArr(attracted, resultX); }
              if (resultY) { pushArr(attracted, resultY); }
              magnetEnter = true;
            } else {
              unattract = true;
              if (lastResultX) { pushArr(unattracted, lastResultX); }
              if (lastResultY) { pushArr(unattracted, lastResultY); }
              magnetleave = true;
            }
          } else if (touched) {
            [{ curr: resultX, last: lastResultX }, { curr: resultY, last: lastResultY }].forEach((res) => {
              let curr = res.curr;
              let last = res.last;
              if (curr && !last) {
                pushArr(attracted, curr);
              } else if (!curr && last) {
                pushArr(unattracted, last);
              } else if (curr && last) {
                if (curr.element !== last.element) {
                  pushArr(attracted, curr);
                  pushArr(unattracted, last);
                } else if (curr.type !== last.type) {
                  pushArr(attracted, curr);
                }
              }
            });
            if (attracted.length || unattracted.length) {
              attract = true;
              magnetEnter = true;
            }
          }
          attracted.forEach((el) => EventHandler.trigger(el, _eventAttracted, elm));
          unattracted.forEach((el) => EventHandler.trigger(el, _eventUnattracted, elm));
          if (attract) { EventHandler.trigger(elm, _eventAttract, { x: resultX, y: resultY }); }
          if (unattract) { EventHandler.trigger(elm, _eventUnattract, { x: lastResultX, y: lastResultY }); }
          if (magnetEnter) { this._event.trigger(_eventMagnetEnter, { source: elm, nearby: nearby, x: resultX, y: resultY }); }
          if (magnetleave) { this._event.trigger(_eventMagnetLeave, { source: elm, nearby: nearby, x: lastResultX, y: lastResultY }); }
          lastResultX = resultX;
          lastResultY = resultY;
          lastTouched = touched;
          if (this._stayInParentElem) {
            x = Math.max(parentRect.left, Math.min((parentRect.right-oriRect.width), x));
            y = Math.max(parentRect.top, Math.min((parentRect.bottom-oriRect.height), y));
          }
          elm.style.top = (y-refParentRect.top+'px');
          elm.style.left = (x-refParentRect.left+'px');
        };
        EventHandler.off(document.body, bindEventType([].concat(_eventMousemove, _eventMouseup, _eventKeydown, _eventKeyup)));
        EventHandler.on(document.body, bindEventType([].concat(_eventKeydown, _eventKeyup)), (e) => {
          if (enabledMagnet !== (!e.ctrlKey)) {
            checkMagnet({
              clientX: lastEvent.clientX,
              clientY: lastEvent.clientY,
              ctrlKey: e.ctrlKey
            });
            enabledMagnet = (!e.ctrlKey);
          }
        }).on(document.body, bindEventType([].concat(_eventMouseup)), () => {
          if (lastResultX) { EventHandler.trigger(lastResultX.element, _eventUnattracted); }
          if (lastResultY) { EventHandler.trigger(lastResultY.element, _eventUnattracted); }
          EventHandler.trigger(elm, _eventUnattract);
          this._event.trigger(_eventMagnetLeave, { source: elm });
          EventHandler.off(document.body, bindEventType([].concat(_eventMousemove, _eventMouseup, _eventKeydown, _eventKeyup)));
        }).on(document.body, bindEventType(_eventMousemove), checkMagnet);
      });
      let refParentRect = stdRect(getRefParentDom(elm));
      let elmRect = stdRect(elm);
      elm.style.position = 'absolute';
      elm.style.top = (elmRect.top-refParentRect.top+'px');
      elm.style.left = (elmRect.left-refParentRect.left+'px');
    });
    this._targets = doms;
    return this;
  };

  Magnet.prototype.remove = function() {
    let inxs = stdDoms(arguments).map((elm) => this._targets.indexOf(elm)).filter((inx) => (-1!==inx)).sort((a, b) => (b-a));
    if (inxs.length) {
      let doms = this._targets.concat();
      inxs.forEach((inx) => doms.splice(inx, 1));
      this.clear().add(doms);
    }
    return this;
  };

  Magnet.prototype.clear = function() {
    this._targets.forEach((elm) => EventHandler.off(elm, bindEventType(_eventMousedown)));
    this._targets = [];
    EventHandler.off(document.body, bindEventType([].concat(_eventMousemove, _eventMouseup, _eventKeydown, _eventKeyup)));
    return this;
  };

  Magnet.prototype.nearby = function(src) {
    return Magnet.nearby(src, this._targets);
  };

  Magnet.isRect = (rect) => isrect(rect);
  Magnet.stdRect = (rect) => stdRect(rect);
  Magnet.measure = (src, trg) => new MearsureResult(src, trg);
  Magnet.nearby = function(src, trgs) { return new NearbyResult(src, trgs); };

  module.exports = Magnet;
  if (self && (self instanceof Object) && (self.self === self)) {
    self.Magnet = Magnet;
  }

})();