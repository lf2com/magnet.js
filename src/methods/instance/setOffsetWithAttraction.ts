import Magnet from '../..';
import { getAttractionOffset } from '../../types/Attraction';
import Distance from '../../types/Distance';
import {
  AttractedEventDetail, AttractedmoveEventDetail, AttractEventDetail,
  AttractmoveEventDetail, UnattractedEventDetail, UnattractEventDetail,
} from '../../types/EventDetail';
import Pack from '../../types/Pack';
import createPoint from '../../types/Point';
import createRect, { getRect } from '../../types/Rect';
import { triggerEvent } from '../../utils/eventHandler';
import getOffsetToKeepInRect from '../../utils/getOffsetToKeepInRect';
import Alignment from '../../values/alignment';
import { AlignToParent } from '../../values/alignTo';
import CrossPrevent from '../../values/crossPrevent';
import Event from '../../values/event';
import { CalcMultiAttractionsOptions } from '../static/calcMultiAttractions';
import { OnJudgeDistance } from '../static/judgeDistance';

export type OnJudgeMovement = (pack: Pack, offset: DOMPoint) => boolean

export interface SetOffsetWithAttractionOptions extends CalcMultiAttractionsOptions {
  alignToParents?: AlignToParent[];
  parentAlignments?: Alignment[];
  crossPrevents?: CrossPrevent[];
  crossPreventParent?: boolean;
  onJudgeMovement?: OnJudgeMovement;
}

/**
 * Returns true/false for unattractable magnet.
 */
const getTrue = () => true;
const getFalse = () => false;

interface SetOffsetWithAttraction {
  (
    offset: DOMPoint,
    options?: SetOffsetWithAttractionOptions,
  ): void;
  (
    dx: number,
    dy: number,
    options?: SetOffsetWithAttractionOptions,
  ): void;
}

/**
 * Moves magnet element to (x, y) with attraction options.
 */
const setOffsetWithAttraction: SetOffsetWithAttraction = function setOffsetWithAttraction(
  this: Magnet,
  arg0: DOMPoint | number,
  arg1?: number | SetOffsetWithAttractionOptions,
  arg2?: SetOffsetWithAttractionOptions,
) {
  const offset = createPoint(arg0 as number, arg1 as number);
  const options = (
    (arg0 instanceof DOMPoint ? arg1 : arg2) ?? {}
  ) as SetOffsetWithAttractionOptions;
  const {
    alignToParents,
    parentAlignments = Magnet.getAlignmentsFromAlignTo(alignToParents ?? this.alignToParents),
    crossPrevents,
    crossPreventParent = (crossPrevents ?? this.crossPrevents).includes(CrossPrevent.parent),
    onJudgeDistance: optionsOnJudgeDistance,
    onJudgeAttraction: optionsOnJudgeAttraction,
    onJudgeMovement = getTrue,
  } = options;
  const sourceRect = this.magnetRect;
  const { width, height } = sourceRect;
  const { unattractable } = this;
  const alignToParent = parentAlignments.length > 0;
  const needParent = alignToParent || crossPreventParent;
  const parentPack = needParent ? this.parentMagnetPack : null;
  const keepInParent = crossPreventParent && parentPack;

  // we need to consider the force of dragging when there is
  // a wall preventing the magnet from going out of its parent
  // and the attraction of the near magnets should be ignored
  // if the force of dragging is larger than the distances.
  const nextSourceRawRect = createRect(
    sourceRect.x + offset.x,
    sourceRect.y + offset.y,
    width,
    height,
  );
  const nextKeepInParentOffset = (keepInParent
    ? getOffsetToKeepInRect(nextSourceRawRect, getRect(parentPack))
    : createPoint(0, 0)
  );
  const nextSourceRect = createRect(
    nextSourceRawRect.x + nextKeepInParentOffset.x,
    nextSourceRawRect.y + nextKeepInParentOffset.y,
    width,
    height,
  );
  const nextSourcePack = new Pack(this, nextSourceRect);
  const nextOffset = createPoint(
    offset.x + nextKeepInParentOffset.x,
    offset.y + nextKeepInParentOffset.y,
  );
  const passJudgeMovement = onJudgeMovement(nextSourcePack, nextOffset);

  if (!passJudgeMovement) {
    this.lastAttractionBest = null;

    return;
  }
  if (unattractable) {
    this.setMagnetOffset(nextOffset);
    this.lastAttractionBest = null;

    return;
  }

  const {
    attractDistance = this.attractDistance,
    alignTos,
    alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignTos),
    attractionBest = {},
  } = options;
  const targetPacks = this.targetMagnetPacks;
  const nextSourceRawPack = new Pack(this, nextSourceRawRect);
  const onJudgeDistance = (unattractable
    ? getFalse
    : optionsOnJudgeDistance ?? this.judgeMagnetDistance
  );
  const onJudgeDistanceInParent = (unattractable
    ? getFalse
    : this.judgeMagnetDistanceInParent
  );
  const onJudgeAttraction = (unattractable
    ? getFalse
    : optionsOnJudgeAttraction ?? this.judgeMagnetAttraction
  );

  if (alignToParent && parentPack) {
    const { best } = Magnet.calcMagnetAttraction(
      nextSourceRawPack,
      parentPack,
      {
        attractDistance,
        alignments: parentAlignments,
        onJudgeDistance,
      },
    );

    attractionBest.x = best.x;
    attractionBest.y = best.y;
  }

  const onJudgeMultiDistance: OnJudgeDistance = (keepInParent
    ? ((distance) => onJudgeDistanceInParent(
      distance,
      {
        onJudgeDistance,
        parent: parentPack,
        attractDistance,
        alignTos,
      },
    ))
    : onJudgeDistance
  );
  const attraction = Magnet.calcMultiMagnetAttractions(
    nextSourceRawPack,
    targetPacks,
    {
      attractDistance,
      alignments,
      onJudgeDistance: onJudgeMultiDistance,
      onJudgeAttraction,
      attractionBest,
    },
  );
  const attractionOffset = getAttractionOffset(attraction);
  const attractKeepInParentOffset = (keepInParent
    ? getOffsetToKeepInRect(
      createRect(
        nextSourceRawRect.x + attractionOffset.x,
        nextSourceRawRect.y + attractionOffset.y,
        width,
        height,
      ),
      getRect(parentPack),
    )
    : createPoint(0, 0)
  );
  const nextSourceOffsetRect = createRect(
    nextSourceRawRect.x + attractionOffset.x + attractKeepInParentOffset.x,
    nextSourceRawRect.y + attractionOffset.y + attractKeepInParentOffset.y,
    width,
    height,
  );
  const {
    best: {
      x: currentBestX,
      y: currentBestY,
    },
  } = attraction;
  const { lastAttractionBest } = this;
  const lastBestX = lastAttractionBest?.x;
  const lastBestY = lastAttractionBest?.y;
  const lastTargetX = lastBestX?.target;
  const lastTargetY = lastBestY?.target;
  const currentTargetX = currentBestX?.target;
  const currentTargetY = currentBestY?.target;
  const diffTargetX = currentTargetX !== lastTargetX;
  const diffTargetY = currentTargetY !== lastTargetY;
  const attracts: Distance[] = [];
  const unattracts: Distance[] = [];
  const attractmoves: Distance[] = [];

  if (diffTargetX) {
    if (lastTargetX) {
      unattracts.push(lastBestX);
    }
    if (currentTargetX) {
      attracts.push(currentBestX);
    }
  } else if (currentTargetX) {
    const lastAlignmentX = (lastBestX as Distance).alignment;
    const currentAlignmentX = currentBestX.alignment;

    if (lastAlignmentX !== currentAlignmentX) {
      attracts.push(currentBestX);
    } else {
      attractmoves.push(currentBestX);
    }
  }

  if (diffTargetY) {
    if (lastTargetY) {
      unattracts.push(lastBestY);
    }
    if (currentTargetY) {
      attracts.push(currentBestY);
    }
  } else if (currentTargetY) {
    const lastAlignmentY = (lastBestY as Distance).alignment;
    const currentAlignmentY = currentBestY.alignment;

    if (lastAlignmentY !== currentAlignmentY) {
      attracts.push(currentBestY);
    } else {
      attractmoves.push(currentBestY);
    }
  }

  if (attracts.length > 0) {
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
      this.lastAttractionBest = null;

      return;
    }

    attracts.forEach((attractedDistance) => {
      const { target } = attractedDistance;
      const attractedEventDetail: AttractedEventDetail = {
        source: nextSourcePack,
        target,
        sourceNextRect: nextSourceOffsetRect,
        distance: attractedDistance,
      };

      triggerEvent<AttractedEventDetail>(
        target.raw as Magnet,
        Event.attracted,
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: attractedEventDetail,
        },
      );
    });
  }

  if (unattracts.length > 0) {
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

    unattracts.forEach((unattractedDistance) => {
      const { target } = unattractedDistance;
      const unattractedEventDetail: UnattractedEventDetail = {
        source: nextSourcePack,
        target,
        sourceNextRect: nextSourceOffsetRect,
        nextTarget: currentTargetX ?? null,
      };

      triggerEvent<UnattractedEventDetail>(
        target.raw as Magnet,
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

  if (attractmoves.length > 0) {
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

    attractmoves.forEach((attractedmoveDistance) => {
      const { target } = attractedmoveDistance;
      const attractedmoveEventDetail: AttractedmoveEventDetail = {
        source: nextSourcePack,
        target,
        sourceNextRect: nextSourceOffsetRect,
        distance: attractedmoveDistance,
      };

      triggerEvent<AttractedmoveEventDetail>(
        target.raw as Magnet,
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

  this.setMagnetOffset(
    offset.x + attractionOffset.x + attractKeepInParentOffset.x,
    offset.y + attractionOffset.y + attractKeepInParentOffset.y,
  );
  this.lastAttractionBest = attraction.best;
};

export default setOffsetWithAttraction;
