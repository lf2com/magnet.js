import { createPoint } from '../types/Point';

/**
 * Returns (x, y) of moust/touch event.
 */
function getEventXY(event: MouseEvent | TouchEvent): DOMPoint {
  if (event instanceof MouseEvent) {
    return createPoint(event.clientX, event.clientY);
  }

  if (event instanceof TouchEvent) {
    const { touches } = event;
    const [touch] = Array.from(touches);

    return createPoint(touch.clientX, touch.clientY);
  }

  throw new ReferenceError(`Illegal event: ${event}`);
}

export default getEventXY;
