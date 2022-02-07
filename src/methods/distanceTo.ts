import Distance from '../types/Distance';
import Pack, { getPack, Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import { abs } from '../utils/numeric';
import Alignment from '../values/alignment';
import rawDistanceTo from './rawDistanceTo';

/**
 * Returns distance object from source to target on alignment.
 */
function distanceTo(
  source: Rectable | Pack,
  target: Rectable | Pack,
  alignment: Alignment,
): Distance {
  const sourcePack = getPack(source);
  const targetPack = getPack(target);
  const sourceRect = getRect(source);
  const targetRect = getRect(target);
  const rawDistance = rawDistanceTo(sourceRect, targetRect, alignment);
  const absDistance = abs(rawDistance);

  return {
    source: sourcePack,
    target: targetPack,
    alignment,
    rawDistance,
    absDistance,
  };
}

export default distanceTo;
