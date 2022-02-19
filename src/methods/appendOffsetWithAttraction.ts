import Magnet from '..';
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
import getOffsetToKeepInRect from '../utils/getOffsetToKeepInRect';
import Alignment from '../values/alignment';
import { AlignToParent } from '../values/alignTo';
import CrossPrevent from '../values/crossPrevent';
import Event from '../values/event';
import { CalcMultiAttractionsOptions } from './calcMultiAttractions';

export interface SetOffsetWithAttractionOptions extends CalcMultiAttractionsOptions {
  alignToParents?: AlignToParent[];
  parentAlignments?: Alignment[];
  crossPrevents?: CrossPrevent[];
  crossPreventParent?: boolean;
}

/**
 * Moves magnet element to (x, y) with attraction options.
 */
function appendOffsetWithAttraction<
  A0 extends DOMPoint | number,
  A1 extends A0 extends number ? number : SetOffsetWithAttractionOptions,
  A2 extends A0 extends number ? undefined : SetOffsetWithAttractionOptions,
>(
  this: Magnet,
  arg0: A0,
  arg1: A1,
  arg2?: A2,
): AttractionBest | null {
  const offset = createPoint(arg0, arg1 as number);
  const options = ((arg0 instanceof DOMPoint
    ? arg1
    : arg2
  ) ?? {}) as SetOffsetWithAttractionOptions;
  const {
    attractDistance = this.attractDistance,
    alignTos,
    alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignTos),
    alignToParents,
    parentAlignments = Magnet.getAlignmentsFromAlignTo(alignToParents ?? this.alignToParents),
    crossPrevents,
    crossPreventParent = (crossPrevents ?? this.crossPrevents).includes(CrossPrevent.parent),
    onJudgeDistance = this.judgeMagnetDistance.bind(this),
    onJudgeAttraction = this.judgeMagnetAttraction.bind(this),
    attractionBest,
  } = options;
  const targetPacks = this.targetMagnetPacks;
  const alignToParent = parentAlignments.length > 0;
  const needParent = alignToParent || crossPreventParent;
  const {
    lastAttractionBest,
    unattractable,
  } = this;
  const sourceRect = this.magnetRect;
  const parentPack = needParent ? this.parentMagnetPack : null;
  const nextKeepInParentOffset = (crossPreventParent && parentPack
    ? getOffsetToKeepInRect(
      createRect(
        sourceRect.x + offset.x,
        sourceRect.y + offset.y,
        sourceRect.width,
        sourceRect.height,
      ),
      getRect(parentPack),
    )
    : createPoint(0, 0)
  );
  const nextSourceRect = createRect(
    sourceRect.x + offset.x + nextKeepInParentOffset.x,
    sourceRect.y + offset.y + nextKeepInParentOffset.y,
    sourceRect.width,
    sourceRect.height,
  );
  const nextSourcePack = new Pack(this, nextSourceRect);
  const nextOffset = createPoint(
    offset.x + nextKeepInParentOffset.x,
    offset.y + nextKeepInParentOffset.y,
  );

  if (unattractable) {
    this.setMagnetOffset(nextOffset);

    return null;
  }

  const nextAttractionBest: AttractionBest = {
    x: attractionBest?.x,
    y: attractionBest?.y,
  };

  if (alignToParent && parentPack) {
    const { best } = Magnet.calcMagnetAttraction(
      nextSourcePack,
      parentPack,
      {
        attractDistance,
        alignments: parentAlignments,
        onJudgeDistance,
      },
    );

    nextAttractionBest.x = best.x;
    nextAttractionBest.y = best.y;
  }

  const attraction = Magnet.calcMultiMagnetAttractions(
    nextSourcePack,
    targetPacks,
    {
      attractDistance,
      alignments,
      onJudgeDistance,
      onJudgeAttraction,
      attractionBest: nextAttractionBest,
    },
  );
  const attractionOffset = getAttractionOffset(attraction);
  const attractKeepInParentOffset = (crossPreventParent && parentPack
    ? getOffsetToKeepInRect(
      createRect(
        nextSourceRect.x + attractionOffset.x,
        nextSourceRect.y + attractionOffset.y,
        nextSourceRect.width,
        nextSourceRect.height,
      ),
      getRect(parentPack),
    )
    : createPoint(0, 0)
  );

  if (attractKeepInParentOffset.x !== 0) {
    attraction.best.x = undefined;
  }
  if (attractKeepInParentOffset.y !== 0) {
    attraction.best.y = undefined;
  }

  const nextSourceOffsetRect = createRect(
    nextSourceRect.x + attractionOffset.x + attractKeepInParentOffset.x,
    nextSourceRect.y + attractionOffset.y + attractKeepInParentOffset.y,
    nextSourceRect.width,
    nextSourceRect.height,
  );
  const attractEventDetail: AttractEventDetail = {
    source: nextSourcePack,
    nextRect: nextSourceOffsetRect,
    attraction: {
      ...attraction,
      best: {
        x: attraction.best.x,
        y: attraction.best.y,
      },
    },
  };
  const attractEventPassed = triggerEvent<AttractEventDetail>(
    this,
    Event.attract,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: attractEventDetail,
    },
  );

  if (!attractEventPassed) {
    this.setMagnetOffset(nextOffset);

    return null;
  }

  const {
    best: {
      x: currentBestX,
      y: currentBestY,
    },
  } = attraction;
  const lastBestX = lastAttractionBest?.x;
  const lastBestY = lastAttractionBest?.y;
  const lastTargetX = lastBestX?.target;
  const lastTargetY = lastBestY?.target;
  const currentTargetX = currentBestX?.target;
  const currentTargetY = currentBestY?.target;
  const diffTargetX = currentTargetX !== lastTargetX;
  const diffTargetY = currentTargetY !== lastTargetY;

  if (diffTargetX || diffTargetY) {
    if (lastTargetX || lastTargetY) { // unattract
      const unattractEventDetail: UnattractEventDetail = {
        source: nextSourcePack,
        nextRect: nextSourceOffsetRect,
        attraction,
      };

      triggerEvent<UnattractEventDetail>(
        this,
        Event.unattract,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: unattractEventDetail,
        },
      );
    }

    if (diffTargetX) {
      if (lastTargetX) { // unattracted the last target
        const unattractedEventDetail: UnattractedEventDetail = {
          source: nextSourcePack,
          target: lastTargetX,
          sourceNextRect: nextSourceOffsetRect,
          nextTarget: currentTargetX ?? null,
        };

        triggerEvent<UnattractedEventDetail>(
          lastTargetX.raw as Magnet,
          Event.unattracted,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: unattractedEventDetail,
          },
        );
      }

      if (currentTargetX) { // attracted the new target
        const attractedEventDetail: AttractedEventDetail = {
          source: nextSourcePack,
          target: currentTargetX,
          sourceNextRect: nextSourceOffsetRect,
          distance: currentBestX,
        };

        triggerEvent(
          currentTargetX.raw as Magnet,
          Event.attracted,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: attractedEventDetail,
          },
        );
      }
    }

    if (diffTargetY) {
      if (lastTargetY) { // unattracted the last target
        const unattractedEventDetail: UnattractedEventDetail = {
          source: nextSourcePack,
          target: lastTargetY,
          sourceNextRect: nextSourceOffsetRect,
          nextTarget: currentTargetY ?? null,
        };

        triggerEvent<UnattractedEventDetail>(
          lastTargetY.raw as Magnet,
          Event.unattracted,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: unattractedEventDetail,
          },
        );
      }

      if (currentTargetY) { // attracted the new target
        const attractedEventDetail: AttractedEventDetail = {
          source: nextSourcePack,
          target: currentTargetY,
          sourceNextRect: nextSourceOffsetRect,
          distance: currentBestY,
        };

        triggerEvent(
          currentTargetY.raw as Magnet,
          Event.attracted,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: attractedEventDetail,
          },
        );
      }
    }
  }

  if (!diffTargetX || !diffTargetY) {
    const diffX = (
      !diffTargetX
      && currentTargetX
      && (lastBestX as Distance).alignment !== currentBestX.alignment
    );
    const diffY = (
      !diffTargetY
      && currentTargetY
      && (lastBestY as Distance).alignment !== currentBestY.alignment
    );

    if (diffX || diffY) { // attractmove
      const attractmoveEventDetail: AttractmoveEventDetail = {
        source: nextSourcePack,
        nextRect: nextSourceOffsetRect,
        attraction,
      };

      triggerEvent<AttractmoveEventDetail>(
        this,
        Event.attractmove,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: attractmoveEventDetail,
        },
      );

      if (diffX) { // attractedmove
        const attractedmoveEventDetail: AttractedmoveEventDetail = {
          source: nextSourcePack,
          target: currentTargetX,
          sourceNextRect: nextSourceOffsetRect,
          distance: currentBestX,
        };

        triggerEvent<AttractedmoveEventDetail>(
          currentTargetX.raw as Magnet,
          Event.attractedmove,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: attractedmoveEventDetail,
          },
        );
      }

      if (diffY) { // attractedmove
        const attractedmoveEventDetail: AttractedmoveEventDetail = {
          source: nextSourcePack,
          target: currentTargetY,
          sourceNextRect: nextSourceOffsetRect,
          distance: currentBestY,
        };

        triggerEvent<AttractedmoveEventDetail>(
          currentTargetY.raw as Magnet,
          Event.attractedmove,
          {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: attractedmoveEventDetail,
          },
        );
      }
    }
  }

  this.setMagnetOffset(
    nextOffset.x + attractionOffset.x + attractKeepInParentOffset.x,
    nextOffset.y + attractionOffset.y + attractKeepInParentOffset.y,
  );
  this.resetMagnetRect();
  this.resetParentMagnetPack();
  this.resetTargetMagnets();

  return attraction.best;
}

export default appendOffsetWithAttraction;
