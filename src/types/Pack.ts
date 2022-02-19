import { getRect, Rectlike } from './Rect';

export type Rectable = Rectlike | DOMRect | Element | Document | Window;

class Pack {
  readonly raw: Rectable;

  readonly rect: DOMRect;

  constructor(source: Rectable | Pack, rect: DOMRect = getRect(source)) {
    const raw = Pack.isPack(source) ? source.raw : source;

    this.raw = raw;
    this.rect = rect;

    Object.freeze(this);
  }

  /**
   * Returns true if source is pack obejct.
   */
  static isPack(source: unknown): source is Pack {
    return source instanceof Pack;
  }
}

/**
 * Returns pack object from source.
 */
export function getPack(source: Rectable | Pack): Pack {
  return Pack.isPack(source) ? source : new Pack(source);
}

export default Pack;
