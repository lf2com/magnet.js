import MagnetPack from '../../core';
import Attraction, { AttractionBest } from '../../types/Attraction';
import Pack, { getPack, Rectable } from '../../types/Pack';
import Alignment, { AlignmentXs, AlignmentYs } from '../../values/alignment';
import AlignTo, { AlignToParent } from '../../values/alignTo';
import judgeDistance, { OnJudgeDistance } from './judgeDistance';
import Magnet from '../..';

export type SingleAttraction = Attraction<Pack>;

export interface SingleAttractionToOptions {
  attractDistance?: number;
  alignTos?: (AlignTo | AlignToParent)[];
  alignments?: Alignment[];
  onJudgeDistance?: OnJudgeDistance;
  attractionBest?: AttractionBest;
}

/**
 * Returns result of attractions from source to target on alignments.
 */
function singleAttractionTo(
  source: Rectable | Pack,
  target: Rectable | Pack,
  options?: SingleAttractionToOptions,
): SingleAttraction {
  const magnetOptions = (options ?? source) as Magnet;
  const standOptions = (options ?? {}) as SingleAttractionToOptions;
  const sourcePack = getPack(source);
  const targetPack = getPack(target);
  const {
    attractDistance = magnetOptions.attractDistance ?? 0,
    alignTos = magnetOptions.alignTos ?? Object.values(AlignTo),
    alignments = MagnetPack.getAlignmentsFromAlignTo(alignTos),
    onJudgeDistance = magnetOptions.judgeMagnetDistance ?? judgeDistance,
    attractionBest = {},
  } = standOptions;
  const singleAttraction = alignments.reduce<SingleAttraction>(
    (attraction, alignment) => {
      const distance = Magnet.prototype.distanceTo.call(sourcePack, targetPack, alignment);
      const judgementPassed = onJudgeDistance({ ...distance }, {
        attractDistance,
        alignTos,
      });

      if (judgementPassed) {
        const { results, best } = attraction;

        results.push(distance);

        if (AlignmentXs.includes(alignment)) {
          if (best.x === undefined || distance.absDistance < best.x.absDistance) {
            best.x = distance;
          } else if (best.x.absDistance === distance.absDistance) {
            const gap = attractDistance / 3;

            if (distance.rawDistance > gap) {
              if (distance.alignment === Alignment.leftToLeft) {
                best.x = distance;
              }
            } else if (distance.rawDistance < -gap) {
              if (distance.alignment === Alignment.rightToRight) {
                best.x = distance;
              }
            } else if (distance.alignment === Alignment.xCenterToXCenter) {
              best.x = distance;
            }
          }
        } else if (AlignmentYs.includes(alignment)) {
          if (best.y === undefined || distance.absDistance < best.y.absDistance) {
            best.y = distance;
          } else if (best.y.absDistance === distance.absDistance) {
            const gap = attractDistance / 3;

            if (distance.rawDistance < -gap) {
              if (distance.alignment === Alignment.bottomToBottom) {
                best.y = distance;
              }
            } else if (distance.rawDistance > gap) {
              if (distance.alignment === Alignment.topToTop) {
                best.y = distance;
              }
            } else if (distance.alignment === Alignment.yCenterToYCenter) {
              best.y = distance;
            }
          }
        }
      }

      return attraction;
    },
    {
      source: sourcePack,
      target: targetPack,
      results: [],
      best: attractionBest,
    },
  );

  return singleAttraction;
}

export default singleAttractionTo;
