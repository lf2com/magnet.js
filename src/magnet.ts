import MagnetPack from './core';
import setOffsetWithAttraction, { SetOffsetWithAttractionOptions } from './methods/instance/setOffsetWithAttraction';
import distanceTo from './methods/static/distanceTo';
import rawDistanceTo from './methods/static/rawDistanceTo';
import multiAttractionsTo, { StandardCalcMultiAttractionsOptions } from './methods/static/multiAttractionsTo';
import singleAttractionTo, { SingleAttractionToOptions, StandardCalcSingleAttractionOptions } from './methods/static/singleAttractionTo';
import judgeAttraction from './methods/static/judgeAttraction';
import judgeDistance from './methods/static/judgeDistance';
import judgeDistanceInParent from './methods/static/judgeDistanceInParent';
import judgeMovement from './methods/static/judgeMovement';
import { AttractionBest } from './types/Attraction';
import Pack, { getPack, Rectable } from './types/Pack';
import { createPoint } from './types/Point';
import createRect, { getRect } from './types/Rect';
import { checkDragListeners } from './utils/dragListener';
import registerElement from './utils/registerElement';
import Alignment from './values/alignment';
import Attribute from './values/attribute';
import OffsetUnit from './values/offsetUnit';
import Style from './values/style';

const nodeName = 'magnet-block';
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      --x: var(${Style.offsetX}, 0);
      --y: var(${Style.offsetY}, 0);

      position: relative;
      top: var(--y);
      left: var(--x);
      touch-action: none;
      display: inline-block;
    }
  </style>
  <slot>
  </slot>
`;

class Magnet extends MagnetPack {
  #rect: DOMRect | null = null;

  #parentPack: Pack | null = null;

  #targetMagnetPacks: Pack[] | null = null;

  protected lastOffset: DOMPoint = createPoint(0, 0);

  protected lastAttractionBest: AttractionBest | null = null;

  constructor() {
    super();

    (this.shadowRoot as ShadowRoot).append(template.content.cloneNode(true));
    this.setMagnetOffset(0, 0);
    checkDragListeners(this);
  }

  /**
   * Returns true if magnet is disabled.
   */
  get disabled(): boolean {
    return super.disabled;
  }

  /**
   * Sets disabled of magnet.
   */
  set disabled(disabled: boolean) {
    super.disabled = disabled;
    checkDragListeners(this);
  }

  /**
   * Returns true if the magnet is unable to be dragged.
   */
  get unmovable(): boolean {
    return super.unmovable;
  }

  /**
   * Sets unmovable of magnet.
   */
  set unmovable(unmovable: boolean) {
    super.unmovable = unmovable;
    checkDragListeners(this);
  }

  /**
   * Returns rect object of this magnet.
   */
  get magnetRect(): DOMRect {
    if (!this.#rect) {
      this.#rect = getRect(this);
    }

    return this.#rect;
  }

  /**
   * Resets the rect object of this magnet.
   */
  resetMagnetRect(): void {
    this.#rect = null;
  }

  /**
   * Returns pack object of magnet parent if existing.
   */
  get parentMagnetPack(): Pack | null {
    const { parentElement } = this;

    if (parentElement) {
      if (!this.#parentPack) {
        this.#parentPack = getPack(parentElement);
      }
    }

    return this.#parentPack;
  }

  /**
   * Resets the pack object of the parent of magnet.
   */
  resetParentMagnetPack(): void {
    this.#parentPack = null;
  }

  /**
   * Returns pack objects of target magnets.
   */
  get targetMagnetPacks(): Pack[] {
    if (!this.#targetMagnetPacks) {
      this.#targetMagnetPacks = this.getAttractableMagnets()
        .map((target) => getPack(target));
    }

    return this.#targetMagnetPacks;
  }

  /**
   * Resets the pack objects of target magnets.
   */
  resetTargetMagnets(): void {
    this.#targetMagnetPacks = null;
  }

  /**
   * Returns an array of other magnet elements.
   */
  getOtherMagnets(): Magnet[] {
    return (Array.from(document.querySelectorAll(nodeName)) as Magnet[])
      .filter((magnet) => magnet !== this);
  }

  /**
   * Returns an array of attractable magnet elements.
   */
  getAttractableMagnets(): Magnet[] {
    if (this.disabled || this.unattractable) {
      return [];
    }

    const { group } = this;
    const hasGroup = group !== null;
    const nonDisabledSelector = `:not([${Attribute.disabled}])`;
    const nonUnattractableSelector = `:not([${Attribute.unattractable}])`;
    const selector = `${nodeName}${nonDisabledSelector}${nonUnattractableSelector}`;
    const magnets = (Array.from(document.querySelectorAll(selector)) as Magnet[])
      .filter((magnet) => (
        magnet !== this
        && !this.contains(magnet)
        && (hasGroup ? group === magnet.group : true)
      ));

    return magnets;
  }

  /**
   * Returns true if the distance passes the judgement. Otherwise the
   * distance would not be listed on the attraction result.
   */
  judgeMagnetDistance = judgeDistance

  /**
   * The same as .judgeMagnetDisance but consider a wrapper element.
   */
  judgeMagnetDistanceInParent = judgeDistanceInParent

  /**
   * Returns true if the attraction passes the judgement. Otherwise the
   * distance results of attraction would not be listed on the result of
   * attractions.
   */
  judgeMagnetAttraction = judgeAttraction

  /**
  * Returns true if the offset of pack passes the judgement. Otherwise
  * the magnet would not be applied the movement.
  */
  judgeMagnetMovement = judgeMovement

  /**
   * Returns distance value to target on specific alignment.
   */
  rawDistanceTo(
    target: Rectable | Pack,
    alignment: Alignment,
  ) {
    const sourceRect = getRect(this);
    const targetRect = getRect(target);

    return rawDistanceTo(sourceRect, targetRect, alignment);
  }

  /**
   * Returns distance object to target on alignment.
   */
  distanceTo(
    target: Rectable | Pack,
    alignment: Alignment,
  ) {
    return distanceTo(this, target, alignment);
  }

  /**
   * Returns result of attractions to target on alignments.
   */
  attractionTo(
    target: Rectable | Pack,
    options: SingleAttractionToOptions = {},
  ) {
    const parentAttraction = Magnet.prototype.attractionToParent.call(this, options);

    return singleAttractionTo(this, target, {
      ...options,
      attractionBest: parentAttraction?.best,
    });
  }

  /**
   * Returns result of attractions to parent on alignments.
   */
  attractionToParent(
    options: SingleAttractionToOptions = {},
  ) {
    const alignTos = this.alignToParents;
    const {
      alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignToParents),
    } = options as StandardCalcSingleAttractionOptions;
    const parent = (this instanceof Magnet
      ? this.parentMagnetPack
      : (this as HTMLElement).offsetParent
    );

    if (alignments.length === 0 || !parent) {
      return null;
    }

    return singleAttractionTo(
      this,
      parent,
      {
        ...options,
        alignTos,
      },
    );
  }

  /**
   * Returns result of attractions from source to targets on alignments.
   */
  multiAttractionsTo(
    targets: (Rectable | Pack)[],
    options: StandardCalcMultiAttractionsOptions = {},
  ) {
    const {
      attractDistance = this.attractDistance,
      alignTos,
      alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignTos),
      onJudgeDistance = this.judgeMagnetDistance,
      onJudgeAttraction = this.judgeMagnetAttraction,
      attractionBest,
    } = options;
    const parentAttraction = Magnet.prototype.attractionToParent.call(
      this,
      {
        attractDistance,
        alignTos,
        alignments,
        onJudgeDistance,
        attractionBest,
      },
    );

    return multiAttractionsTo(
      this,
      targets,
      {
        attractDistance,
        alignments,
        onJudgeDistance,
        onJudgeAttraction,
        attractionBest: parentAttraction?.best,
      },
    );
  }

  /**
   * Sets the offset of magnet to (dx, dy) with checking the attraction.
   */
  setMagnetOffsetWithAttraction(
    dx: number,
    dy: number,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  setMagnetOffsetWithAttraction(
    offset?: DOMPoint,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  setMagnetOffsetWithAttraction<A0 extends DOMPoint | number>(
    arg0?: A0,
    arg1?: A0 extends DOMPoint ? SetOffsetWithAttractionOptions : number,
    arg2?: A0 extends DOMPoint ? undefined : SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction> {
    const offset = createPoint(arg0 as number, arg1 as number);
    const options = (arg0 instanceof DOMPoint
      ? arg1
      : arg2
    ) as SetOffsetWithAttractionOptions;
    const result = setOffsetWithAttraction.call(this, offset, options);

    this.resetMagnetRect();
    this.resetParentMagnetPack();
    this.resetTargetMagnets();

    return result;
  }

  /**
   * Sets the position of magnet to (x, y) with checking the attraction.
   */
  setMagnetPositionWithAttraction(
    x: number,
    y: number,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  setMagnetPositionWithAttraction(
    position?: DOMPoint,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  setMagnetPositionWithAttraction<A0 extends DOMPoint | number>(
    arg0?: A0,
    arg1?: A0 extends DOMPoint ? SetOffsetWithAttractionOptions : number,
    arg2?: A0 extends DOMPoint ? undefined : SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction> {
    const sourceRect = this.magnetRect;
    const position = createPoint((arg0 ?? sourceRect) as number, arg1 as number);
    const offset = createPoint(
      position.x - sourceRect.x,
      position.y - sourceRect.y,
    );
    const options = (arg0 instanceof DOMPoint
      ? arg1
      : arg2
    ) as SetOffsetWithAttractionOptions;

    return this.setMagnetOffsetWithAttraction(offset, options);
  }

  /**
   * Appends the offset of magnet with (dx, dy) with checking the attraction.
   */
  appendMagnetOffsetWithAttraction(
    dx: number,
    dy: number,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  appendMagnetOffsetWithAttraction(
    point?: DOMPoint,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  appendMagnetOffsetWithAttraction(
    arg0?: DOMPoint | number,
    arg1?: number | SetOffsetWithAttractionOptions,
    arg2?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction> {
    const offset = createPoint(arg0 as number, arg1 as number);
    const options = (arg0 instanceof DOMPoint
      ? arg1
      : arg2
    ) as SetOffsetWithAttractionOptions;
    const { lastOffset } = this;

    return this.setMagnetOffsetWithAttraction(
      lastOffset.x + offset.x,
      lastOffset.y + offset.y,
      options,
    );
  }

  /**
   * Returns a point object of magnet offset.
   */
  get lastMagnetOffset(): DOMPoint {
    const { offsetUnit, lastOffset } = this;

    switch (offsetUnit) {
      default:
      case OffsetUnit.pixel:
        return createPoint(lastOffset);

      case OffsetUnit.percentage: {
        const { offsetParent } = this;
        const parentRect = createRect(offsetParent ?? document);
        const offset = createPoint(
          lastOffset.x / parentRect.width,
          lastOffset.y / parentRect.height,
        );

        return offset;
      }
    }
  }

  /**
   * Resets the offset of magnet movement.
   */
  resetMagnetOffset(): void {
    this.style.removeProperty(Style.offsetX);
    this.style.removeProperty(Style.offsetY);
    this.lastOffset = createPoint(0, 0);
  }

  /**
   * Moves magnet element to (x, y).
   */
  setMagnetOffset(x: number, y: number): void

  setMagnetOffset(point?: DOMPoint): void

  setMagnetOffset(x?: DOMPoint | number, y?: number): void {
    const offset = createPoint(x as number, y as number);
    const { offsetUnit } = this;

    switch (offsetUnit) {
      default:
      case OffsetUnit.pixel:
        this.style.setProperty(Style.offsetX, `${offset.x}px`);
        this.style.setProperty(Style.offsetY, `${offset.y}px`);
        break;

      case OffsetUnit.percentage: {
        const parent = this.offsetParent ?? document.body;
        const styles = globalThis.getComputedStyle(parent);
        const { boxSizing, width, height } = styles;
        let finalWidth = parseFloat(width);
        let finalHeight = parseFloat(height);

        if (boxSizing === 'border-box') {
          const {
            paddingTop, paddingRight, paddingBottom, paddingLeft,
            borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
          } = styles;
          const top = parseFloat(paddingTop);
          const right = parseFloat(paddingRight);
          const bottom = parseFloat(paddingBottom);
          const left = parseFloat(paddingLeft);
          const borderTop = parseFloat(borderTopWidth);
          const borderRight = parseFloat(borderRightWidth);
          const borderBottom = parseFloat(borderBottomWidth);
          const borderLeft = parseFloat(borderLeftWidth);

          finalWidth -= right + left + borderRight + borderLeft;
          finalHeight -= top + bottom + borderTop + borderBottom;
        }

        const relativeOffset = createPoint(
          offset.x / finalWidth,
          offset.y / finalHeight,
        );

        this.style.setProperty(Style.offsetX, `${100 * relativeOffset.x}%`);
        this.style.setProperty(Style.offsetY, `${100 * relativeOffset.y}%`);
        break;
      }
    }

    this.lastOffset = offset;
  }

  /**
   * Returns the best attraction of last move.
   */
  get bestAttraction(): AttractionBest {
    const { lastAttractionBest } = this;
    const x = lastAttractionBest?.x;
    const y = lastAttractionBest?.y;
    const attractionBest: AttractionBest = {};

    if (x) {
      const { source, target } = x;

      attractionBest.x = {
        ...x,
        source: new Pack(source.raw, createRect(source.rect)),
        target: new Pack(target.raw, createRect(target.rect)),
      };
    } else {
      attractionBest.x = undefined;
    }

    if (y) {
      const { source, target } = y;

      attractionBest.y = {
        ...y,
        source: new Pack(source.raw, createRect(source.rect)),
        target: new Pack(target.raw, createRect(target.rect)),
      };
    } else {
      attractionBest.y = undefined;
    }

    return attractionBest;
  }
}

registerElement(Magnet, nodeName);

export default Magnet;
