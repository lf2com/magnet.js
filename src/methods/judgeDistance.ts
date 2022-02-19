import Magnet from '..';
import Alignment from '../values/alignment';
import AlignTo from '../values/alignTo';
import { OnJudgeDistance } from './calcSingleAttraction';

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
function judgeDistance(
  this: Magnet,
  ...[distance]: Parameters<OnJudgeDistance>
): ReturnType<OnJudgeDistance> {
  const { attractDistance } = this;

  if (distance.absDistance > attractDistance) {
    // too far, no consider
    return false;
  }

  if (this.alignTos.includes(AlignTo.extend)) {
    // align to extended edges
    return true;
  }

  const {
    source: {
      rect: sourceRect,
    },
    target: {
      rect: targetRect,
    },
  } = distance;

  // only pass when source overlaps target
  switch (distance.alignment) {
    default:
      return false;

    case Alignment.topToTop:
    case Alignment.topToBottom:
    case Alignment.bottomToTop:
    case Alignment.bottomToBottom:
    case Alignment.yCenterToYCenter:
      if (
        (sourceRect.right + attractDistance) < targetRect.left
        || (sourceRect.left - attractDistance) > targetRect.right
      ) {
        return false;
      }

      return true;

    case Alignment.rightToRight:
    case Alignment.rightToLeft:
    case Alignment.leftToRight:
    case Alignment.leftToLeft:
    case Alignment.xCenterToXCenter:
      if (
        (sourceRect.top - attractDistance) > targetRect.bottom
        || (sourceRect.bottom + attractDistance) < targetRect.top
      ) {
        return false;
      }

      return true;
  }
}

export default judgeDistance;
