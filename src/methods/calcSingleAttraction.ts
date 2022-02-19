import MagnetPack from '../core';
import Attraction, { AttractionBest } from '../types/Attraction';
import Distance from '../types/Distance';
import Pack, { getPack, Rectable } from '../types/Pack';
import getTrueAnyway from '../utils/getTrueAnyway';
import Alignment, { AlignmentXs, AlignmentYs } from '../values/alignment';
import AlignTo from '../values/alignTo';
import calcDistance from './calcDistance';

export type SingleAttraction = Attraction<Pack>;

export interface CalcSingleAttractionOptions {
  attractDistance?: number;
  alignTos?: AlignTo[];
  alignments?: Alignment[];
  onJudgeDistance?: (distance: Distance) => boolean;
  attractionBest?: AttractionBest;
}

export type OnJudgeDistance = Required<CalcSingleAttractionOptions>['onJudgeDistance'];

/**
 * Returns result of attractions from source to target on alignments.
 */
function calcSingleAttraction(
  source: Rectable | Pack,
  target: Rectable | Pack,
  options: CalcSingleAttractionOptions = {},
): SingleAttraction {
  const sourcePack = getPack(source);
  const targetPack = getPack(target);
  const {
    attractDistance = Infinity,
    alignTos,
    alignments = MagnetPack.getAlignmentsFromAlignTo(alignTos ?? Object.values(AlignTo)),
    onJudgeDistance = getTrueAnyway,
    attractionBest = {},
  } = options;
  const singleAttraction = alignments.reduce<SingleAttraction>(
    (attraction, alignment) => {
      const distance = calcDistance(sourcePack, targetPack, alignment);
      const judgementPassed = onJudgeDistance({
        source: sourcePack,
        target: targetPack,
        alignment,
        rawDistance: distance.rawDistance,
        absDistance: distance.absDistance,
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

export default calcSingleAttraction;
