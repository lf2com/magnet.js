import Alignment from '../../values/alignment';

/**
 * Returns distance between source to target on specific alignment.
 */
function rawDistanceTo(
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

export default rawDistanceTo;
