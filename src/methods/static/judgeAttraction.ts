import Magnet from '../..';
import { SingleAttraction } from './calcSingleAttraction';

export interface JudgeAttractionOptions {
  onXYAxes?: boolean;
}

/**
 * Returns true if the attraction passes the judgement. Otherwise the
 * attraction would not be on the result list of attractions.
 */
function judgeAttraction(
  this: Magnet | void,
  attraction: SingleAttraction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: JudgeAttractionOptions | Magnet,
): boolean {
  const standOptinos = (options ?? {}) as JudgeAttractionOptions;
  const {
    onXYAxes = false,
  } = standOptinos;

  return Boolean((onXYAxes
    ? attraction.best.x && attraction.best.y
    : attraction.best.x ?? attraction.best.y
  ));
}

export type OnJudgeAttraction = typeof judgeAttraction;

export default judgeAttraction;
