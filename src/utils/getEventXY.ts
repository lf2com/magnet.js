import { createPoint } from '../types/Point';

/**
 * Returns (x, y) of moust/touch event.
 */
function getEventXY(event: PointerEvent): DOMPoint {
  const { clientX, clientY } = event;

  return createPoint(clientX, clientY);
}

export default getEventXY;
