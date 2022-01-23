import Distance from '../types/Distance';
import Pack, { getPack, Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import Alignment from '../values/alignment';
import calcDistanceOfAlignment from './calcDistanceOfAlignment';

const { abs } = Math;

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
