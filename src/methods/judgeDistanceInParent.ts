import Magnet from '..';
import Distance from '../types/Distance';
import Pack, { Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import judgeDistance, { OnJudgeDistance } from './judgeDistance';

export interface JudgeDistanceInParentOptions {
  parent?: Pack | Rectable;
  onJudgeDistance?: OnJudgeDistance;
}

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
function judgeDistanceInParent(
  distance: Distance,
  options: JudgeDistanceInParentOptions | Magnet = {},
): ReturnType<OnJudgeDistance> {
  const magnetOptions = options as Magnet;
  const standOptions = options as JudgeDistanceInParentOptions;
  const {
    onJudgeDistance = magnetOptions.judgeMagnetDistance ?? judgeDistance,
  } = standOptions;

  if (!onJudgeDistance(distance)) {
    return false;
  }

  const {
    parent = magnetOptions.parentMagnetPack ?? document.body,
  } = standOptions;
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
}

export type OnJudgeDistanceInParent = typeof judgeDistanceInParent;

export default judgeDistanceInParent;
