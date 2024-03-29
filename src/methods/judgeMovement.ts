import Pack from '../types/Pack';

export type OnJudgeMovement = (pack: Pack) => boolean;

/**
 * Returns true if the distance passes the judgement. Otherwise the
 * distance would not be on the result list of attraction.
 */
const judgeMovement: OnJudgeMovement = function judgeMovement(): boolean {
  return true;
};

export default judgeMovement;
