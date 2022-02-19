import MagnetPack from '../core';
import Attraction from '../types/Attraction';
import Pack, { getPack, Rectable } from '../types/Pack';
import { getRect } from '../types/Rect';
import getTrueAnyway from '../utils/getTrueAnyway';
import Alignment from '../values/alignment';
import AlignTo from '../values/alignTo';
import calcSingleAttraction, {
  CalcSingleAttractionOptions, SingleAttraction,
} from './calcSingleAttraction';

export type MultiAttraction = Attraction<Pack[]>;

export interface CalcMultiAttractionsOptions extends CalcSingleAttractionOptions {
  onJudgeAttraction?: (attraction: SingleAttraction) => boolean;
}

export type OnJudgeAttraction = Required<CalcMultiAttractionsOptions>['onJudgeAttraction'];

const { abs } = Math;

/**
 * Returns result of attractions from source to targets on alignments.
 */
function calcMultiAttractions(
  source: Rectable | Pack,
  targets: (Rectable | Pack)[],
  options: CalcMultiAttractionsOptions = {},
): MultiAttraction {
  const sourcePack = getPack(source);
  const targetPacks = targets.map((target) => getPack(target));
  const {
    attractDistance = Infinity,
    alignTos,
    alignments = MagnetPack.getAlignmentsFromAlignTo(alignTos ?? Object.values(AlignTo)),
    onJudgeDistance = getTrueAnyway,
    onJudgeAttraction = getTrueAnyway,
    attractionBest = {},
  } = options;
  const singleOptions = {
    attractDistance,
    alignments,
    onJudgeDistance,
    attractionBest,
  };
  const multiAttraction = targetPacks.reduce<MultiAttraction>(
    (attraction, targetPack) => {
      const singleAttraction = calcSingleAttraction(sourcePack, targetPack, singleOptions);
      const {
        best: currentBest,
        results: currentResults,
      } = singleAttraction;
      const judgementPassed = onJudgeAttraction({
        source: sourcePack,
        target: targetPack,
        results: currentResults.concat(),
        best: {
          x: currentBest.x,
          y: currentBest.y,
        },
      });

      attraction.target.push(targetPack);

      if (judgementPassed) {
        const { results, best } = attraction;

        results.push(...currentResults);

        if (currentBest.x) {
          if (best.x === undefined || currentBest.x.absDistance < best.x.absDistance
          ) {
            best.x = currentBest.x;
          } else if (best.x.absDistance === currentBest.x.absDistance) {
            const sourceRect = getRect(sourcePack);
            const currentDiffY = abs(currentBest.x.target.rect.y - sourceRect.y);
            const diffY = abs(best.x.target.rect.y - sourceRect.y);

            if (currentDiffY < diffY) {
              best.x = currentBest.x;
            } else if (currentDiffY === diffY) {
              const gap = attractDistance / 3;

              if (currentBest.x.rawDistance > gap) {
                if (currentBest.x.alignment === Alignment.leftToLeft) {
                  best.x = currentBest.x;
                }
              } else if (currentBest.x.rawDistance < -gap) {
                if (currentBest.x.alignment === Alignment.rightToRight) {
                  best.x = currentBest.x;
                }
              } else if (currentBest.x.alignment === Alignment.xCenterToXCenter) {
                const lastRect = currentBest.x.target.rect;
                const currentRect = best.x.target.rect;
                const lastYBase = lastRect.top + lastRect.bottom;
                const currentYBase = currentRect.top + currentRect.bottom;
                const sourceYBase = sourceRect.top + sourceRect.bottom;
                const lastYDistance = abs(lastYBase - sourceYBase);
                const currentYDistance = abs(currentYBase - sourceYBase);

                if (currentYDistance < lastYDistance) {
                  best.x = currentBest.x;
                }
              }
            }
          }
        }

        if (currentBest.y) {
          if (best.y === undefined || currentBest.y.absDistance < best.y.absDistance
          ) {
            best.y = currentBest.y;
          } else if (best.y.absDistance === currentBest.y.absDistance) {
            const sourceRect = getRect(sourcePack);
            const currentDiffX = abs(currentBest.y.target.rect.x - sourceRect.x);
            const diffX = abs(best.y.target.rect.x - sourceRect.x);

            if (currentDiffX < diffX) {
              best.y = currentBest.y;
            } else if (currentDiffX === diffX) {
              const gap = attractDistance / 3;

              if (currentBest.y.rawDistance < -gap) {
                if (currentBest.y.alignment === Alignment.bottomToBottom) {
                  best.y = currentBest.y;
                }
              } else if (currentBest.y.rawDistance > gap) {
                if (currentBest.y.alignment === Alignment.topToTop) {
                  best.y = currentBest.y;
                }
              } else if (currentBest.y.alignment === Alignment.yCenterToYCenter) {
                const lastRect = currentBest.y.target.rect;
                const currentRect = best.y.target.rect;
                const lastXBase = lastRect.right + lastRect.left;
                const currentXBase = currentRect.right + currentRect.left;
                const sourceXBase = sourceRect.right + sourceRect.left;
                const lastXDistance = abs(lastXBase - sourceXBase);
                const currentXDistance = abs(currentXBase - sourceXBase);

                if (currentXDistance < lastXDistance) {
                  best.y = currentBest.y;
                }
              }
            }
          }
        }
      }

      return attraction;
    },
    {
      source: sourcePack,
      target: [],
      results: [],
      best: {},
    },
  );

  return multiAttraction;
}

export default calcMultiAttractions;
