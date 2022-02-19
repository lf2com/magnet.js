import Magnet from '..';
import attractionResultOfPosition from '../methods/attractionResultOfPosition';
import { OnJudgeMovement } from '../methods/judgeMovement';
import { MoveEventDetail, StartEventDetail } from '../types/EventDetail';
import Pack from '../types/Pack';
import createPoint from '../types/Point';
import createRect from '../types/Rect';
import Event from '../values/event';
import { addEventListeners, removeEventListeners, triggerEvent } from './eventHandler';
import getEventXY from './getEventXY';

const EVENT_DRAG_START = ['pointerdown'];
const EVENT_DRAG_MOVE = ['pointermove'];
const EVENT_DRAG_END = ['pointerup'];

/**
 * Resets magnet caches.
 */
function resetMagnetCaches(magnet: Magnet): void {
  magnet.resetMagnetRect();
  magnet.resetParentPack();
  magnet.resetTargetMagnetPacks();
}

/**
 * Event listener of drag move event.
 */
function moveListener(
  this: Magnet,
  startPoint: DOMPoint,
  startLastOffset: DOMPoint,
  event: PointerEvent,
): void {
  const movePoint = getEventXY(event);
  const {
    magnetRect: sourceRect,
    targetMagnetPacks: targetPacks,
    judgeMagnetMovement,
  } = this;
  const onJudgeMovement: OnJudgeMovement = (nextSourcePack) => {
    if (!judgeMagnetMovement(nextSourcePack)) {
      return false;
    }

    const moveEventDetail: MoveEventDetail = {
      source: nextSourcePack,
      targets: targetPacks,
      startPoint: createPoint(startPoint),
      movePoint: createPoint(movePoint),
    };
    const passMoveEvent = triggerEvent<MoveEventDetail>(
      this,
      Event.magnetmove,
      {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: moveEventDetail,
      },
    );

    return passMoveEvent;
  };
  const { position, attractionBest } = attractionResultOfPosition(
    new Pack(this, createRect(
      sourceRect.x + movePoint.x - startPoint.x,
      sourceRect.y + movePoint.y - startPoint.y,
      sourceRect.width,
      sourceRect.height,
    )),
    targetPacks,
    {
      unattractable: this.unattractable,
      attractDistance: this.attractDistance,
      alignTos: this.alignTos,
      alignToParents: this.alignToParents,
      crossPrevents: this.crossPrevents,
      parentPack: this.parentPack,
      lastAttractionBest: this.lastAttractionBest,
      onJudgeDistance: this.judgeMagnetDistance,
      onJudgeDistanceInParent: this.judgeMagnetDistanceInParent,
      onJudgeAttraction: this.judgeMagnetAttraction,
      onJudgeMovement,
    },
  );
  this.setMagnetOffset(
    (position?.x ?? sourceRect.x) - sourceRect.x + startLastOffset.x,
    (position?.y ?? sourceRect.y) - sourceRect.y + startLastOffset.y,
  );
  this.lastAttractionBest = attractionBest;
}

/**
 * Event listener of drag start event.
 */
function startListener(
  this: Magnet,
  event: PointerEvent,
): void {
  if (this.disabled || this.unmovable) {
    return;
  }

  const startPoint = getEventXY(event);

  this.isMoving = false;
  resetMagnetCaches(this);

  const {
    magnetRect: sourceRect,
    targetMagnetPacks: targetPacks,
  } = this;
  const sourcePack = new Pack(this, sourceRect);
  const startEventDetail: StartEventDetail = {
    source: sourcePack,
    targets: targetPacks,
    startPoint: createPoint(startPoint),
  };
  const passStartEvent = triggerEvent<StartEventDetail>(
    this,
    Event.magnetstart,
    {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: startEventDetail,
    },
  );

  if (!passStartEvent) {
    return;
  }

  const dragMoveListener = moveListener.bind(this, startPoint, this.lastOffset);
  const dragEndListener = () => {
    this.isMoving = false;
    this.style.removeProperty('z-index');
    removeEventListeners(document, EVENT_DRAG_MOVE, dragMoveListener);
    removeEventListeners(document, EVENT_DRAG_END, dragEndListener);
    resetMagnetCaches(this);
    triggerEvent(this, Event.magnetend, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  };

  this.isMoving = true;
  this.style.setProperty('z-index', `${Date.now()}`);
  event.preventDefault();
  addEventListeners(document, EVENT_DRAG_MOVE, dragMoveListener);
  addEventListeners(document, EVENT_DRAG_END, dragEndListener);
}

/**
 * Adds basic drag event listeners of magnet.
 */
function addBasicDragListeners(magnet: Magnet): void {
  addEventListeners(magnet, EVENT_DRAG_START, startListener);
}

/**
 * Removes basic drag event listeners of magnet.
 */
function removeBasicDragListeners(magnet: Magnet): void {
  removeEventListeners(magnet, EVENT_DRAG_START, startListener);
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

export default startListener;
