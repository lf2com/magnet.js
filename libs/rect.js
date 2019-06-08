'use strict';

import { isrect, tostr, iselem, objKeys, objMap, objReduce, objValues, getStyle } from './stdlib';
import ALIGNMENT_PROPS from './alignment-props';

export const stdRect = (r) => {
  if (isrect(r)) {
    const {
      top, right, bottom, left,
      width = (right-left),
      height = (bottom-top),
      x = left,
      y = top
    } = r;
    return { top, right, bottom, left, width, height, x, y };
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
