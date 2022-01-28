import Magnet from '../..';
import { SingleAttraction } from './calcSingleAttraction';

/**
 * Returns true if the attraction passes the judgement. Otherwise the
 * attraction would not be on the result list of attractions.
 */
function judgeAttraction(
  this: Magnet | void,
  attraction: SingleAttraction,
): boolean {
  return Boolean(attraction.best.x ?? attraction.best.y);
}

export type OnJudgeAttraction = typeof judgeAttraction;

export default judgeAttraction;
