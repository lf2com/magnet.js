import Pack, { Rectable } from './Pack';
import { getRect } from './Rect';

/**
 * Returns point object from a point or (x, y).
 */
export function createPoint(x: DOMPoint | number, y?: number): DOMPoint {
  return (x instanceof DOMPoint
    ? DOMPoint.fromPoint(x)
    : new DOMPoint(x, y)
  );
}

/**
 * Returns point object from source.
 */
export function getPoint(source: Rectable | Pack | DOMPoint): DOMPoint {
  return (source instanceof DOMPoint
    ? source
    : DOMPoint.fromPoint(getRect(source))
  );
}

export default createPoint;
