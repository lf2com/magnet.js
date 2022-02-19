import Distance from '../types/Distance';
import Pack, { getPack, Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import Alignment from '../values/alignment';

const { abs } = Math;

/**
 * Returns distance between source to target on specific alignment.
 */
function calcDistanceOfAlignment(
  sourceRect: DOMRect,
  targetRect: DOMRect,
  alignment: Alignment,
): number {
  switch (alignment) {
    default:
      return Infinity;

    case Alignment.topToTop:
      return targetRect.top - sourceRect.top;

    case Alignment.topToBottom:
      return targetRect.bottom - sourceRect.top;

    case Alignment.rightToRight:
      return targetRect.right - sourceRect.right;

    case Alignment.rightToLeft:
      return targetRect.left - sourceRect.right;

    case Alignment.bottomToTop:
      return targetRect.top - sourceRect.bottom;

    case Alignment.bottomToBottom:
      return targetRect.bottom - sourceRect.bottom;

    case Alignment.leftToRight:
      return targetRect.right - sourceRect.left;

    case Alignment.leftToLeft:
      return targetRect.left - sourceRect.left;

    case Alignment.xCenterToXCenter:
      return (
        (targetRect.right + targetRect.left) - (sourceRect.right + sourceRect.left)
      ) / 2;

    case Alignment.yCenterToYCenter:
      return (
        (targetRect.top + targetRect.bottom) - (sourceRect.top + sourceRect.bottom)
      ) / 2;
  }
}

/**
 * Returns distance object from source to target on alignment.
 */
function calcDistance(
  source: Rectable | Pack,
  target: Rectable | Pack,
  alignment: Alignment,
): Distance {
  const sourcePack = getPack(source);
  const targetPack = getPack(target);
  const sourceRect = getRect(source);
  const targetRect = getRect(target);
  const rawDistance = calcDistanceOfAlignment(sourceRect, targetRect, alignment);
  const absDistance = abs(rawDistance);

  return {
    source: sourcePack,
    target: targetPack,
    alignment,
    rawDistance,
    absDistance,
  };
}

export default calcDistance;
