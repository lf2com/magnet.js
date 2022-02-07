import Magnet from '..';
import { defaultAttributeValues } from '../core';
import { AttractionBest, getAttractionOffset } from '../types/Attraction';
import Distance from '../types/Distance';
import {
  AttractedEventDetail, AttractedmoveEventDetail, AttractEventDetail,
  AttractmoveEventDetail, UnattractedEventDetail, UnattractEventDetail,
} from '../types/EventDetail';
import Pack from '../types/Pack';
import createPoint from '../types/Point';
import createRect, { getRect } from '../types/Rect';
import { triggerEvent } from '../utils/eventHandler';
import getOffsetToBeInRect from '../utils/getOffsetToBeInRect';
import { returnFalse, returnTrue } from '../utils/returnTrueFalse';
import Alignment from '../values/alignment';
import AlignTo, { AlignToParent } from '../values/alignTo';
import Attribute from '../values/attribute';
import CrossPrevent from '../values/crossPrevent';
import Event from '../values/event';
import { OnJudgeAttraction } from './judgeAttraction';
import { OnJudgeDistance } from './judgeDistance';
import { OnJudgeDistanceInParent } from './judgeDistanceInParent';
import { OnJudgeMovement } from './judgeMovement';
import multiAttractionsTo from './multiAttractionsTo';
import singleAttractionTo from './singleAttractionTo';

export interface AttractionResultOfPositionOptions {
  ignoreEvent?: boolean;
  unattractable?: boolean;
  attractDistance?: number;
  alignTos?: AlignTo[];
  alignments?: Alignment[];
  alignToParents?: AlignToParent[];
  crossPrevents?: CrossPrevent[];
  parentPack?: Pack;
  lastAttractionBest?: AttractionBest | null;
  onJudgeDistance?: OnJudgeDistance;
  onJudgeDistanceInParent?: OnJudgeDistanceInParent;
  onJudgeAttraction?: OnJudgeAttraction;
  onJudgeMovement?: OnJudgeMovement;
}

interface AttractionResultOfPositionResult {
  position: DOMPoint | null;
  attractionBest: AttractionBest | null;
}

function attractionResultOfPosition(
  sourcePack: Pack,
  targetPacks: Pack[],
  options: AttractionResultOfPositionOptions = {},
): AttractionResultOfPositionResult {
  const sourceRaw = sourcePack.raw as HTMLElement;
  const {
    ignoreEvent = !(sourceRaw instanceof HTMLElement),
    alignToParents = defaultAttributeValues[Attribute.alignToParent],
    crossPrevents = defaultAttributeValues[Attribute.crossPrevent],
    parentPack,
    onJudgeMovement = returnTrue,
  } = options;
  const parentAlignments = Magnet.getAlignmentsFromAlignTo(alignToParents);
  const alignToParent = parentAlignments.length > 0;
  const crossPreventParent = crossPrevents.includes(CrossPrevent.parent);
  const keepInParent = crossPreventParent && parentPack;
  const sourceRect = getRect(sourcePack);
  const {
    width: sourceWidth,
    height: sourceHeight,
  } = sourceRect;
  const parentRect = getRect(
    parentPack
    ?? sourceRect, // hack for tslint because `parentRect` would be needless
  );

  /**
   * Need to consider the dragging force when the magnet is prevented
   * from crossing parent element. The attraction of the near magnets
   * should be ignored if the force is greater than the attracting
   * distances.
   */
  const sourceRawRect = sourceRect;
  const sourceInParentOffset = (keepInParent
    ? getOffsetToBeInRect(sourceRawRect, parentRect)
    : createPoint(0, 0)
  );
  const sourceInParentRect = createRect(
    sourceRawRect.x + sourceInParentOffset.x,
    sourceRawRect.y + sourceInParentOffset.y,
    sourceWidth,
    sourceHeight,
  );
  const sourceInParentPack = new Pack(sourceRaw, sourceInParentRect);
  const passJudgeMovement = onJudgeMovement(sourceInParentPack);

  if (!passJudgeMovement) {
    return {
      position: null,
      attractionBest: null,
    };
  }

  /**
   * Records best attraction result if magnet aligns to parent.
   */
  const attractionBest: AttractionBest = {};

  const {
    unattractable = defaultAttributeValues[Attribute.unattractable],
    attractDistance = defaultAttributeValues[Attribute.attractDistance],
    alignTos = defaultAttributeValues[Attribute.alignTo],
    alignments = Magnet.getAlignmentsFromAlignTo(alignTos),
    lastAttractionBest,
    onJudgeDistanceInParent = returnTrue,
  } = options;
  const sourceRawPack = new Pack(sourceRaw, sourceRawRect);
  const onJudgeDistance = (unattractable
    ? returnFalse
    : (options.onJudgeDistance ?? returnTrue)
  );

  if (alignToParent && parentPack) {
    const { best } = singleAttractionTo(
      sourceRawPack,
      parentPack,
      {
        attractDistance,
        alignTos,
        alignments,
        onJudgeDistance,
      },
    );

    attractionBest.x = best.x;
    attractionBest.y = best.y;
  }

  const onJudgeMultiDistance: OnJudgeDistance = (keepInParent
    ? ((distance) => (
      onJudgeDistanceInParent(distance, {
        attractDistance,
        alignTos,
        parent: parentPack,
        onJudgeDistance,
      })
    ))
    : onJudgeDistance
  );
  const onJudgeAttraction = (unattractable
    ? returnFalse
    : (options.onJudgeAttraction ?? returnTrue)
  );
  const sourceAttraction = multiAttractionsTo(
    sourceRawPack,
    targetPacks,
    {
      attractDistance,
      alignTos,
      alignments,
      onJudgeDistance: onJudgeMultiDistance,
      onJudgeAttraction,
      attractionBest,
    },
  );
  const sourceAttractionBest = sourceAttraction.best;
  const sourceAttractionOffset = getAttractionOffset(sourceAttraction);
  const sourceAttractionRect = createRect(
    sourceRawRect.x + sourceAttractionOffset.x,
    sourceRawRect.y + sourceAttractionOffset.y,
    sourceWidth,
    sourceHeight,
  );
  const sourceAttractionInParentOffset = (keepInParent
    ? getOffsetToBeInRect(sourceAttractionRect, parentRect)
    : createPoint(0, 0)
  );
  const sourceAttractionInParentRect = createRect(
    sourceAttractionRect.x + sourceAttractionInParentOffset.x,
    sourceAttractionRect.y + sourceAttractionInParentOffset.y,
    sourceWidth,
    sourceHeight,
  );

  if (!ignoreEvent) {
    /**
     * Records for those targets need to dispatch event.
     */
    const attractResults: Distance[] = [];
    const unattractResults: Distance[] = [];
    const attractmoveResults: Distance[] = [];

    const {
      x: currentBestX,
      y: currentBestY,
    } = sourceAttractionBest;
    const lastBestX = lastAttractionBest?.x;
    const lastBestY = lastAttractionBest?.y;
    const lastTargetX = lastBestX?.target;
    const lastTargetY = lastBestY?.target;
    const currentTargetX = currentBestX?.target;
    const currentTargetY = currentBestY?.target;
    const diffTargetX = currentTargetX !== lastTargetX;
    const diffTargetY = currentTargetY !== lastTargetY;

    /**
     * Records and dispatches events on x/y packs.
     */
    if (diffTargetX) {
      if (lastTargetX) {
        unattractResults.push(lastBestX);
      }
      if (currentTargetX) {
        attractResults.push(currentBestX);
      }
    } else if (currentTargetX) {
      const lastAlignmentX = lastBestX?.alignment;
      const currentAlignmentX = currentBestX.alignment;

      if (lastAlignmentX !== currentAlignmentX) {
        attractResults.push(currentBestX);
      } else {
        attractmoveResults.push(currentBestX);
      }
    }

    if (diffTargetY) {
      if (lastTargetY) {
        unattractResults.push(lastBestY);
      }
      if (currentTargetY) {
        attractResults.push(currentBestY);
      }
    } else if (currentTargetY) {
      const lastAlignmentY = lastBestY?.alignment;
      const currentAlignmentY = currentBestY.alignment;

      if (lastAlignmentY !== currentAlignmentY) {
        attractResults.push(currentBestY);
      } else {
        attractmoveResults.push(currentBestY);
      }
    }

    /**
     * Attraction happens.
     */
    if (attractResults.length > 0) {
      const attractEventDetail: AttractEventDetail = {
        source: sourceInParentPack,
        nextRect: sourceAttractionInParentRect,
        attraction: sourceAttraction,
      };
      const passAttractEvent = triggerEvent<AttractEventDetail>(
        sourceRaw,
        Event.attract,
        {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: attractEventDetail,
        },
      );

      if (!passAttractEvent) {
        return {
          position: createPoint(
            sourceRawRect.x + sourceInParentOffset.x,
            sourceRawRect.y + sourceInParentOffset.y,
          ),
          attractionBest: null,
        };
      }
    }

    attractResults.forEach((attractResult) => {
      const targetPack = attractResult.target;
      const targetElem = targetPack.raw as HTMLElement;
      const attractedEventDetail: AttractedEventDetail = {
        source: sourceInParentPack,
        target: targetPack,
        sourceNextRect: sourceAttractionInParentRect,
        distance: attractResult,
      };

      triggerEvent<AttractedEventDetail>(
        targetElem,
        Event.attracted,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: attractedEventDetail,
        },
      );
    });

    if (unattractResults.length > 0) {
      const unattractEventDetail: UnattractEventDetail = {
        source: sourceInParentPack,
        nextRect: sourceAttractionInParentRect,
        attraction: sourceAttraction,
      };

      triggerEvent<UnattractEventDetail>(
        sourceRaw,
        Event.unattract,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: unattractEventDetail,
        },
      );
      unattractResults.forEach((unattractResult) => {
        const targetPack = unattractResult.target;
        const targetElem = targetPack.raw as HTMLElement;
        const unattractedEventDetail: UnattractedEventDetail = {
          source: sourceInParentPack,
          target: targetPack,
          sourceNextRect: sourceAttractionInParentRect,
        };

        triggerEvent<UnattractedEventDetail>(
          targetElem,
          Event.unattracted,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: unattractedEventDetail,
          },
        );
      });
    }

    if (attractmoveResults.length > 0) {
      const attractmoveEventDetail: AttractmoveEventDetail = {
        source: sourceInParentPack,
        nextRect: sourceAttractionInParentRect,
        attraction: sourceAttraction,
      };

      triggerEvent<AttractmoveEventDetail>(
        sourceRaw,
        Event.attractmove,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: attractmoveEventDetail,
        },
      );
      attractmoveResults.forEach((attractmoveResult) => {
        const targetPack = attractmoveResult.target;
        const targetElem = targetPack.raw as HTMLElement;
        const attractedmoveEventDetail: AttractedmoveEventDetail = {
          source: sourceInParentPack,
          target: targetPack,
          sourceNextRect: sourceAttractionInParentRect,
          distance: attractmoveResult,
        };

        triggerEvent<AttractedmoveEventDetail>(
          targetElem,
          Event.attractedmove,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: attractedmoveEventDetail,
          },
        );
      });
    }
  }

  return {
    position: createPoint(
      sourceRawRect.x + sourceAttractionOffset.x + sourceAttractionInParentOffset.x,
      sourceRawRect.y + sourceAttractionOffset.y + sourceAttractionInParentOffset.y,
    ),
    attractionBest: sourceAttractionBest,
  };
}

export default attractionResultOfPosition;
