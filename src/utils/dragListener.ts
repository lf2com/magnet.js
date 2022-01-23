import Magnet from '..';
import setOffsetWithAttraction from '../methods/instance/setOffsetWithAttraction';
import { MoveEventDetail, StartEventDetail } from '../types/EventDetail';
import Pack from '../types/Pack';
import { createPoint } from '../types/Point';
import Event from '../values/event';
import { addEventListeners, removeEventListeners, triggerEvent } from './eventHandler';
import getEventXY from './getEventXY';

const EVENT_DRAG_START = ['mousedown', 'touchstart'];
const EVENT_DRAG_MOVE = ['mousemove', 'touchmove'];
const EVENT_DRAG_END = ['mouseup', 'touchend'];

export type DragEvent = MouseEvent | TouchEvent;

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
  const dragStartPoint = getEventXY(event);
  const startEventDetail: StartEventDetail = {
    source: sourcePack,
    targets: targetPacks,
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

    const dragMovePoint = getEventXY(evt);
    const dragOffset = createPoint(
      dragMovePoint.x - dragStartPoint.x,
      dragMovePoint.y - dragStartPoint.y,
    );

    setOffsetWithAttraction.call(
      this,
      dragOffset,
      {
        onJudgeMovement: (nextSourcePack, nextOffset) => {
          const moveEventDetail: MoveEventDetail = {
            source: nextSourcePack,
            targets: targetPacks,
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

          return dragMoveEventPassed;
        },
      },
    );
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
