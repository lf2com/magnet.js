import Magnet from '../..';
import Distance from '../../types/Distance';
import Pack, { Rectable } from '../../types/Pack';
import { getRect } from '../../types/Rect';
import judgeDistance, { JudgeDistanceOptions, MagnetJudgeDistanceOptionKeys, OnJudgeDistance } from './judgeDistance';

export interface JudgeDistanceInParentOptions extends JudgeDistanceOptions {
  parent?: Pack | Rectable;
  onJudgeDistance?: OnJudgeDistance;
}

type MagnetJudgeDistanceInParentOptionKeys = (
  MagnetJudgeDistanceOptionKeys
  & 'parentMagnetPack' | 'judgeMagnetDistance' | 'offsetParent'
);

export type OnJudgeDistanceInParent = (
  distance: Distance,
  options?: (
    JudgeDistanceInParentOptions
    | Pick<Magnet, MagnetJudgeDistanceInParentOptionKeys>
  ),
) => boolean;

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
const judgeDistanceInParent: OnJudgeDistanceInParent = function judgeDistanceInParent(
  this: Magnet,
  distance,
  options,
) {
  const magnetOptions = (options ?? this) as Magnet;
  const standOptions = (options ?? {}) as JudgeDistanceInParentOptions;
  const {
    attractDistance,
    alignTos,
    onJudgeDistance = magnetOptions.judgeMagnetDistance ?? judgeDistance,
  } = standOptions;
  const passJudgeDistance = onJudgeDistance(distance, {
    attractDistance,
    alignTos,
  });

  if (!passJudgeDistance) {
    return false;
  }

  const {
    parent = (
      magnetOptions.parentMagnetPack
      ?? magnetOptions.offsetParent
      ?? document.body
    ),
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
};

export default judgeDistanceInParent;
