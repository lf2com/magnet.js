import Magnet from '..';
import Distance from '../types/Distance';
import Alignment from '../values/alignment';
import AlignTo from '../values/alignTo';

export interface JudgeDistanceOptions {
  attractDistance?: number;
  alignTos?: AlignTo[];
}

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
function judgeDistance(
  distance: Distance,
  options: JudgeDistanceOptions | Magnet = {},
): boolean {
  const magnetOptions = options as Magnet;
  const standOptions = options as JudgeDistanceOptions;
  const {
    attractDistance = magnetOptions.attractDistance ?? 0,
  } = standOptions;

  if (distance.absDistance > attractDistance) {
    // too far, no consider
    return false;
  }

  const {
    alignTos = magnetOptions.alignTos ?? Object.values(AlignTo),
  } = standOptions;

  if (alignTos.includes(AlignTo.extend)) {
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

export type OnJudgeDistance = typeof judgeDistance;

export default judgeDistance;
