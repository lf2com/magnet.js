'use strict';

export const isset = (o) => ('undefined'!==typeof o);
export const isbool = (b) => ('boolean'===typeof b);
export const tobool = (b) => (b ?true :false);
export const isnum = (n) => (!isNaN(n));
export const tonum = (n) => parseFloat(n);
export const isint = (n) =>(isnum(n)&&n===(n|0));
export const isstr = (s) => ('string'===typeof s||(isset(s)&&(s instanceof String)));
export const tostr = (s) => (isset(s) ?s.toString() :'');
export const isfunc = (f) => ('function'===typeof f);
export const isarray = (a) => (isset(a)&&Array.isArray(a));
export const arrayable = (a) => (a&&isint(a.length)&&0<=a.length);
export const toarray = (a) => Array.prototype.slice.call(a);
export const objKeys = (o) => Object.keys(o);
export const objForEach = (o, f = (()=>{}), t = this) => objKeys(o).forEach((p) => f.call(t, o[p], p, o));
export const objReduce = (o, f = (()=>{}), r) => objKeys(o).reduce((r, p) => f(r, o[p], p, o), r);
export const objMap = (o, f = (()=>{}), t = this) => objReduce(o, (r, v, p) => ({ ...r, [p]: f.call(t, v, p, o) }), {});
export const objValues = (o) => objReduce(o, (a, v) => a.concat([v]), []);
export const iselem = (e) => (isset(e)&&(e instanceof Element||e instanceof Window||e instanceof Document));
export const isrect = (r, e = 0.0000000001) => (isset(r)&&(({ x, y, top: t, right: r, bottom: b, left: l, width: w, height: h }) => (
  isnum(t)&&isnum(r)&&isnum(b)&&isnum(l)&&
  (t<=b)&&(l<=r)&&(isset(x)&&x===l||true)&&(isset(y)&&y===t||true)&&
  (isset(w)&&Math.abs((w-(r-l)))<e||true)&&(isset(h)&&Math.abs((h-(b-t)))<e||true)
))(r));
export const getStyle = (d) => (d.currentStyle||window.getComputedStyle(d));
export const stdDoms = (...doms) => doms.reduce((arr, dom) => {
  if (iselem(dom)) {
    return (arr.includes(dom) ?arr :arr.concat(dom));
  } else if (isarray(dom)) {
    return dom.reduce((a, d) => a.concat(stdDoms(d)), arr);
  } else if (arrayable(dom)) {
    return arr.concat(stdDoms(toarray(dom)));
  } else {
    throw new Error(`Invalid element: ${tostr(dom)}`);
  }
}, []);