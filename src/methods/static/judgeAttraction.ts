import Magnet from '../..';
import { SingleAttraction } from './singleAttractionTo';

export type OnJudgeAttraction = (
  attraction: SingleAttraction,
) => boolean;

/**
 * Returns true if the attraction passes the judgement. Otherwise the
 * attraction would not be on the result list of attractions.
 */
const judgeAttraction: OnJudgeAttraction = function judgeAttraction(
  this: Magnet,
  attraction,
): boolean {
  return Boolean(attraction.best.x ?? attraction.best.y);
};

export default judgeAttraction;
