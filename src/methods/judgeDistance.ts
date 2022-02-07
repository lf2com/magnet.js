import { defaultAttributeValues } from '../core';
import Distance from '../types/Distance';
import Alignment from '../values/alignment';
import AlignTo, { AlignToParent } from '../values/alignTo';
import Attribute from '../values/attribute';

export interface JudgeDistanceOptions {
  attractDistance?: number;
  alignTos?: (AlignTo | AlignToParent)[];
}

export type OnJudgeDistance = (
  distance: Distance,
  options?: JudgeDistanceOptions,
) => boolean;

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
const judgeDistance: OnJudgeDistance = function judgeDistance(
  distance,
  options = {},
): boolean {
  const {
    attractDistance = defaultAttributeValues[Attribute.attractDistance],
  } = options;

  if (distance.absDistance > attractDistance) {
    // too far, no consider
    return false;
  }

  const {
    alignTos = defaultAttributeValues[Attribute.alignTo],
  } = options;

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
};

export default judgeDistance;
