import Magnet from '..';
import { OnJudgeAttraction } from './calcMultiAttractions';

/**
 * Returns true if the attraction passes the judgement. Otherwise the
 * attraction would not be on the result list of attractions.
 */
function judgeAttraction(
  this: Magnet,
  ...[attraction]: Parameters<OnJudgeAttraction>
): ReturnType<OnJudgeAttraction> {
  return Boolean(attraction.best.x ?? attraction.best.y);
}

export default judgeAttraction;
