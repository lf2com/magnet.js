import Pack, { Rectable } from './Pack';

export interface Rectlike extends Partial<DOMRect> {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/**
 * Returns a completed rect object from rectable source.
 */
export function createRect(
  source: Rectable | Pack | number,
  ...args: [number?, number?, number?]
): DOMRect {
  if (source instanceof Window) {
    return new DOMRect(0, 0, source.innerWidth, source.innerHeight);
  }

  if (source instanceof Document) {
    return document.body.getBoundingClientRect();
  }

  if (source instanceof Element) {
    return source.getBoundingClientRect();
  }

  if (Pack.isPack(source)) {
    return DOMRect.fromRect(source.rect);
  }

  if (typeof source !== 'object') {
    const x = source;
    const [y, width, height] = args;

    return new DOMRect(x, y, width, height);
  }

  const {
    top, right, bottom, left,
    x = left as number,
    y = top as number,
    width = (right as number) - x,
    height = (bottom as number) - y,
  } = source;

  return new DOMRect(x, y, width, height);
}

/**
 * Returns rect object from source.
 */
export function getRect(source: Rectable | Pack): DOMRect {
  if (Pack.isPack(source)) {
    return source.rect;
  }

  if (source instanceof DOMRect) {
    return source;
  }

  return createRect(source);
}

export default createRect;
