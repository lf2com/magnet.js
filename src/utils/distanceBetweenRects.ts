import createPoint from '../types/Point';
import { abs } from './numeric';

/**
 * Returns the distance on x-axis of centers from source to target.
 */
export function distanceBetweenXCentersOfRects(
  sourceRect: DOMRect,
  targetRect: DOMRect,
): number {
  const sourceRectXCenter = sourceRect.right + sourceRect.left;
  const targetRectXCenter = targetRect.right + targetRect.left;

  return abs(sourceRectXCenter - targetRectXCenter) / 2;
}

/**
 * Returns the distance on y-axis of centers from source to target.
 */
export function distanceBetweenYCentersOfRects(
  sourceRect: DOMRect,
  targetRect: DOMRect,
): number {
  const sourceRectYCenter = sourceRect.top + sourceRect.bottom;
  const targetRectYCenter = targetRect.top + targetRect.bottom;

  return abs(sourceRectYCenter - targetRectYCenter) / 2;
}

/**
 * Returns the distance on x-axis of centers from source to target.
 */
function distanceBetweenCentersOfRects(
  sourceRect: DOMRect,
  targetRect: DOMRect,
): DOMPoint {
  return createPoint(
    distanceBetweenXCentersOfRects(sourceRect, targetRect),
    distanceBetweenYCentersOfRects(sourceRect, targetRect),
  );
}

export default distanceBetweenCentersOfRects;
