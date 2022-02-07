import Distance from '../types/Distance';
import Pack, { Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import { returnTrue } from '../utils/returnTrueFalse';
import { JudgeDistanceOptions, OnJudgeDistance } from './judgeDistance';

export interface JudgeDistanceInParentOptions extends JudgeDistanceOptions {
  parent?: Pack | Rectable | null;
  onJudgeDistance?: OnJudgeDistance;
}

export type OnJudgeDistanceInParent = (
  distance: Distance,
  options?: JudgeDistanceInParentOptions,
) => boolean;

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
const judgeDistanceInParent: OnJudgeDistanceInParent = function judgeDistanceInParent(
  distance,
  options = {},
) {
  const {
    onJudgeDistance = returnTrue,
    ...judgeDistanceOptions
  } = options;
  const passJudgeDistance = onJudgeDistance(distance, judgeDistanceOptions);

  if (!passJudgeDistance) {
    return false;
  }

  /**
   * If options.parent is `null`, use `document.body` instead.
   */
  const parent = options.parent ?? document.body;

  const parentRect = getRect(parent);
  const { alignment, rawDistance, source } = distance;
  const {
    rect: sourceRect,
  } = source;

  switch (alignment) {
    default:
      return true;

    case 'topToTop':
    case 'topToBottom':
    case 'bottomToTop':
    case 'bottomToBottom':
      return (
        sourceRect.top + rawDistance >= parentRect.top
        && sourceRect.bottom + rawDistance <= parentRect.bottom
      );

    case 'rightToRight':
    case 'rightToLeft':
    case 'leftToRight':
    case 'leftToLeft':
      return (
        sourceRect.right + rawDistance <= parentRect.right
        && sourceRect.left + rawDistance >= parentRect.left
      );

    case 'xCenterToXCenter':
      return (
        sourceRect.right + rawDistance <= parentRect.right
        && sourceRect.left + rawDistance >= parentRect.left
      );

    case 'yCenterToYCenter':
      return (
        sourceRect.top + rawDistance >= parentRect.top
        && sourceRect.bottom + rawDistance <= parentRect.bottom
      );
  }
};

export default judgeDistanceInParent;
