import Magnet from '..';
import setOffsetWithAttraction from '../methods/instance/setOffsetWithAttraction';
import { MoveEventDetail, StartEventDetail } from '../types/EventDetail';
import Pack from '../types/Pack';
import { createPoint } from '../types/Point';
import Event from '../values/event';
import { addEventListeners, removeEventListeners, triggerEvent } from './eventHandler';
import getEventXY from './getEventXY';

const EVENT_DRAG_START = [
  // 'pointerdown',
  'touchstart',
  'mousedown',
];
const EVENT_DRAG_MOVE = [
  // 'pointermove',
  'touchmove',
  'mousemove',
];
const EVENT_DRAG_END = [
  // 'pointerup',
  'touchend',
  'mouseup',
];

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

  this.resetMagnetRect();
  this.resetParentMagnetPack();
  this.resetTargetMagnets();

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
    return;
  }

  /**
   * Handles dragmove event binded with mousemove/touchmove events.
   */
  const dragMoveListener = (evt: DragEvent): void => {
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
  const dragEndListener = (): void => {
    this.resetMagnetRect();
    this.resetParentMagnetPack();
    this.resetTargetMagnets();
    this.style.removeProperty('z-index');
    triggerEvent(this, Event.magnetend, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    removeEventListeners(document, EVENT_DRAG_MOVE, dragMoveListener);
    removeEventListeners(document, EVENT_DRAG_END, dragEndListener);
  };

  this.style.setProperty('z-index', '1');
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
