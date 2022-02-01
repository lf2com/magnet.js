import Pack, { Rectable } from './Pack';
import { getRect } from './Rect';

interface CreatePoint {
  (x: number, y: number): DOMPoint;
  (point: DOMPoint): DOMPoint;
  (rect: DOMRect): DOMPoint;
}

/**
 * Returns point object from a point or (x, y).
 */
export const createPoint: CreatePoint = function createPoint(
  x: number | DOMPoint | DOMRect,
  y?: number,
) {
  if (x instanceof DOMPoint) {
    return DOMPoint.fromPoint(x);
  }
  if (x instanceof DOMRect) {
    return new DOMPoint(x.x, x.y);
  }

  return new DOMPoint(x, y);
};

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
