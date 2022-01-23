import Magnet from '..';
import { OnJudgeAttraction } from '../methods/judgeAttraction';
import { OnJudgeDistance } from '../methods/judgeDistance';
import { OnJudgeDistanceInParent } from '../methods/judgeDistanceInParent';
import { AttractionBest, getAttractionOffset } from '../types/Attraction';
import Distance from '../types/Distance';
import {
  AttractedEventDetail, AttractedmoveEventDetail, AttractEventDetail,
  AttractmoveEventDetail, MoveEventDetail, StartEventDetail,
  UnattractedEventDetail, UnattractEventDetail,
} from '../types/EventDetail';
import Pack from '../types/Pack';
import { createPoint } from '../types/Point';
import createRect, { getRect } from '../types/Rect';
import CrossPrevent from '../values/crossPrevent';
import Event from '../values/event';
import {
  addEventListeners, removeEventListeners, triggerEvent,
} from './eventHandler';
import getEventXY from './getEventXY';
import getOffsetToKeepInRect from './getOffsetToKeepInRect';

const EVENT_DRAG_START = ['mousedown', 'touchstart'];
const EVENT_DRAG_MOVE = ['mousemove', 'touchmove'];
const EVENT_DRAG_END = ['mouseup', 'touchend'];

export type DragEvent = MouseEvent | TouchEvent;

/**
 * Returns false for unattractable magnet.
 */
const judgeOnUnattractable = () => false;

/**
 * Handles dragstart event binded with mousedown/touchstart events.
 */
function dragStartListener(
  this: Magnet,
  event: DragEvent,
): void {
  if (this.disabled || this.unmovable) {
    return;
  }

  this.handleDragStart(event);

  const sourcePack = new Pack(this, this.magnetRect);
  const targetPacks = this.targetMagnetPacks;
  const { lastOffset } = this;
  const needParent = (
    Magnet.getAlignmentsFromAlignTo(this.alignToParents).length > 0
    || this.crossPrevents.includes(CrossPrevent.parent)
  );
  const dragStartPoint = getEventXY(event);
  const startEventDetail: StartEventDetail = {
    source: sourcePack,
    targets: targetPacks,
    parent: needParent ? this.parentMagnetPack : null,
    lastOffset,
    startPoint: dragStartPoint,
  };
  const dragStartEventPassed = triggerEvent<StartEventDetail>(
    this,
    Event.magnetstart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: startEventDetail,
    },
  );

  if (!dragStartEventPassed) {
    this.handleDragEnd(event);

    return;
  }

  /**
   * Handles dragmove event binded with mousemove/touchmove events.
   */
  const dragMoveListener = (evt: DragEvent): void => {
    this.handleDragMove(evt);

    const {
      attractDistance,
      alignTos,
      alignToParents,
      crossPrevents,
      unattractable,
    } = this;
    const alignments = Magnet.getAlignmentsFromAlignTo(alignTos);
    const parentAlignments = Magnet.getAlignmentsFromAlignTo(alignToParents);
    const crossPreventParent = crossPrevents.includes(CrossPrevent.parent);
    const alignToParent = parentAlignments.length > 0;
    const onJudgeDistance = (unattractable
      ? judgeOnUnattractable
      : this.judgeMagnetDistance
    );
    const onJudgeDistanceInParent: OnJudgeDistanceInParent = (unattractable
      ? judgeOnUnattractable
      : this.judgeMagnetDistanceInParent
    );
    const onJudgeAttraction: OnJudgeAttraction = (unattractable
      ? judgeOnUnattractable
      : this.judgeMagnetAttraction
    );
    const dragMovePoint = getEventXY(evt);
    const sourceRect = this.magnetRect;
    const parentPack = needParent ? this.parentMagnetPack : null;
    const keepInParent = crossPreventParent && parentPack;
    const dragOffset = createPoint(
      dragMovePoint.x - dragStartPoint.x,
      dragMovePoint.y - dragStartPoint.y,
    );
    // we need to consider the force of dragging when there is
    // a wall preventing the magnet from going out of its parent
    // and the attraction of the near magnets should be ignored
    // if the force of dragging is larger than the distances.
    const nextSourceRawRect = createRect(
      sourceRect.x + dragOffset.x,
      sourceRect.y + dragOffset.y,
      sourceRect.width,
      sourceRect.height,
    );
    const nextSourceRawPack = new Pack(this, nextSourceRawRect);
    const nextKeepInParentOffset = (keepInParent
      ? getOffsetToKeepInRect(
        createRect(
          sourceRect.x + dragOffset.x,
          sourceRect.y + dragOffset.y,
          sourceRect.width,
          sourceRect.height,
        ),
        getRect(parentPack),
      )
      : createPoint(0, 0)
    );
    const nextSourceRect = createRect(
      sourceRect.x + dragOffset.x + nextKeepInParentOffset.x,
      sourceRect.y + dragOffset.y + nextKeepInParentOffset.y,
      sourceRect.width,
      sourceRect.height,
    );
    const nextSourcePack = new Pack(this, nextSourceRect);
    const nextOffset = createPoint(
      dragOffset.x + nextKeepInParentOffset.x + lastOffset.x,
      dragOffset.y + nextKeepInParentOffset.y + lastOffset.y,
    );
    const moveEventDetail: MoveEventDetail = {
      source: nextSourcePack,
      targets: targetPacks,
      parent: parentPack,
      lastOffset,
      startPoint: dragStartPoint,
      nextOffset,
      movePoint: dragMovePoint,
    };
    const dragMoveEventPassed = triggerEvent<MoveEventDetail>(
      this,
      Event.magnetmove,
      {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: moveEventDetail,
      },
    );

    if (!dragMoveEventPassed) {
      this.lastAttractionBest = null;

      return;
    }

    // if (unattractable) {
    //   this.setMagnetOffset(nextOffset);
    //   this.lastAttractionBest = null;

    //   return;
    // }

    const attractionBest: AttractionBest = {};

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
      ? ((distance) => (
        onJudgeDistanceInParent(
          distance,
          {
            onJudgeDistance,
            parent: parentPack,
          },
        )
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
          nextSourceRawRect.width,
          nextSourceRawRect.height,
        ),
        getRect(parentPack),
      )
      : createPoint(0, 0)
    );
    const nextSourceOffsetRect = createRect(
      nextSourceRawRect.x + attractionOffset.x + attractKeepInParentOffset.x,
      nextSourceRawRect.y + attractionOffset.y + attractKeepInParentOffset.y,
      nextSourceRawRect.width,
      nextSourceRawRect.height,
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
      dragOffset.x + lastOffset.x + attractionOffset.x + attractKeepInParentOffset.x,
      dragOffset.y + lastOffset.y + attractionOffset.y + attractKeepInParentOffset.y,
    );
    this.lastAttractionBest = attraction.best;
  };

  /**
   * Handles dragend event binded with mouseup/touchend events.
   */
  const dragEndListener = (evt: DragEvent): void => {
    this.handleDragEnd(evt);
    triggerEvent(this, Event.magnetend, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    removeEventListeners(document, EVENT_DRAG_MOVE, dragMoveListener);
    removeEventListeners(document, EVENT_DRAG_END, dragEndListener);
  };

  event.preventDefault();
  addEventListeners(document, EVENT_DRAG_MOVE, dragMoveListener);
  addEventListeners(document, EVENT_DRAG_END, dragEndListener);
}

/**
 * Adds basic drag event listeners of magnet.
 */
function addBasicDragListeners(magnet: Magnet): void {
  addEventListeners(magnet, EVENT_DRAG_START, dragStartListener);
}

/**
 * Removes basic drag event listeners of magnet.
 */
function removeBasicDragListeners(magnet: Magnet): void {
  removeEventListeners(magnet, EVENT_DRAG_START, dragStartListener);
}

/**
 * Adds or removes drag event listeners of magnet.
 */
export function checkDragListeners(magnet: Magnet): void {
  if (magnet.disabled || magnet.unmovable) {
    removeBasicDragListeners(magnet);
  } else {
    addBasicDragListeners(magnet);
  }
}

export default dragStartListener;
