'use strict';

import { tostr, isnum, iselem, objKeys, objMap, objReduce, objValues, getStyle, isset } from './stdlib';
import ALIGNMENT_PROPS from './alignment-props';

export const isRect = (rect, e = 0.0000000001) => {
  if (!isset(rect)) return false;
  const { x, y, top: t = y, right: r, bottom: b, left: l = x, width: w, height: h } = rect;
  const isain = (n) => !(isset(n)&&!isnum(n)); // is set and is num
  if (!isain(t)||!isain(r)||!isain(b)||!isain(l)||!isain(w)||!isain(h)||!isain(x)||!isain(y)) {
    return false;
  }
  if (isset(w)) {
    if (w < 0) return false;
    if (isset(l)) {
      if (isset(r)&&e<Math.abs(w-(r-l))) return false;
    } else if (!isset(r)) return false;
  } else if (!isset(l)||!isset(r)||r<l) return false;
  if (isset(h)) {
    if (h < 0) return false;
    if (isset(t)) {
      if (isset(b)&&e<Math.abs(h-(b-t))) return false;
    } else if (!isset(b)) return false;
  } else if (!isset(t)||!isset(b)||b<t) return false;
  return true;
};

export const stdRect = (r) => {
  if (isRect(r)) {
    const {
      x, y, right, bottom, width, height,
      top = (isset(y) ?y :(bottom-height)),
      left = (isset(x) ?x :(right-width)),
    } = r;
    return {
      top, left,
      x: (isset(x) ?x :left),
      y: (isset(y) ?y :top),
      right: (isset(right) ?right :(left+width)),
      bottom: (isset(bottom) ?bottom :(top+height)),
      width: (isset(width) ?width :(right-left)),
      height: (isset(height) ?height :(bottom-top)),
    };
  } else if (iselem(r)) {
    const { rect, border } = (r instanceof Element ?{
      rect: r.getBoundingClientRect(),
      border: (({ borderTopWidth: t, borderRightWidth: r, borderBottomWidth: b, borderLeftWidth: l }) => ({ t, r, b, l }))(getStyle(r)),
    } :{
      rect: { top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0 },
      border: { t: 0, r: 0, b: 0, l: 0 },
    });
    const top = (rect.top+parseFloat(border.t));
    const right = (rect.right-parseFloat(border.r));
    const bottom = (rect.bottom-parseFloat(border.b));
    const left = (rect.left+parseFloat(border.l));
    return {
      top, right, bottom, left,
      width: (right-left),
      height: (bottom-top),
      x: left,
      y: top
    };
  } else {
    throw new Error(`Invalid element to rectangle: ${tostr(r)}`);
  }
};

export const diffRect = (refA, refB, {
  alignments = objValues(ALIGNMENT_PROPS),
  absDistance = true
} = {}) => {
  const rectA = stdRect(refA);
  const rectB = stdRect(refB);
  const source = { rect: rectA };
  const target = { rect: rectB };
  const calc = (absDistance ?Math.abs :((n)=>n));
  const results = objMap(objReduce(ALIGNMENT_PROPS, (results, prop) => {
    return (alignments.includes(prop) ?{ ...results, [prop]: NaN } :results);
  }, {}), (_, prop) => {
    switch (prop) {
      case ALIGNMENT_PROPS.tt: return calc(rectA.top-rectB.top);
      case ALIGNMENT_PROPS.bb: return calc(rectB.bottom-rectA.bottom);
      case ALIGNMENT_PROPS.rr: return calc(rectB.right-rectA.right);
      case ALIGNMENT_PROPS.ll: return calc(rectA.left-rectB.left);
      case ALIGNMENT_PROPS.tb: return calc(rectA.top-rectB.bottom);
      case ALIGNMENT_PROPS.bt: return calc(rectB.top-rectA.bottom);
      case ALIGNMENT_PROPS.rl: return calc(rectB.left-rectA.right);
      case ALIGNMENT_PROPS.lr: return calc(rectA.left-rectB.right);
      case ALIGNMENT_PROPS.xx: return calc(((rectA.right-rectB.right)+(rectA.left-rectB.left))/2);
      case ALIGNMENT_PROPS.yy: return calc(((rectA.top-rectB.top)+(rectA.bottom-rectB.bottom))/2);
    }
  });
  const ranking = objKeys(results).sort((a, b) => (results[a]-results[b]));
  (iselem(refA)&&(source.element=refA));
  (iselem(refB)&&(target.element=refB));
  return {
    source,
    target,
    results,
    ranking,
    min: ranking[0],
    max: ranking[results.length-1],
  };
};

function Rect(src) {
  if (!this instanceof Rect) {
    return new Rect(...arguments);
  }
  objForEach(stdRect(src), (value, prop) => (this[prop]=value));
}
Rect.stdRect = stdRect;
Rect.diffRect = diffRect;
Rect.prototype.diff = function(target, ...args) { return diffRect(this, target, ...args); };
