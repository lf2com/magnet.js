import createPoint from '../types/Point';

/**
 * Returns offset to keep source rect in target rect.
 */
function getOffsetToKeepInRect(sourceRect: DOMRect, targetRect: DOMRect): DOMPoint {
  let x = 0;
  let y = 0;

  if (sourceRect.left < targetRect.left) {
    x = targetRect.left - sourceRect.left;
  } else if (sourceRect.right > targetRect.right) {
    x = targetRect.right - sourceRect.right;
  }

  if (sourceRect.top < targetRect.top) {
    y = targetRect.top - sourceRect.top;
  } else if (sourceRect.bottom > targetRect.bottom) {
    y = targetRect.bottom - sourceRect.bottom;
  }

  return createPoint(x, y);
}

export default getOffsetToKeepInRect;
