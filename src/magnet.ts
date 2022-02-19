import MagnetPack from './core';
import distanceTo from './methods/distanceTo';
import rawDistanceTo from './methods/rawDistanceTo';
import multiAttractionsTo, { MultiAttractionsToOptions } from './methods/multiAttractionsTo';
import singleAttractionTo, { SingleAttractionToOptions } from './methods/singleAttractionTo';
import judgeAttraction from './methods/judgeAttraction';
import judgeDistance from './methods/judgeDistance';
import judgeDistanceInParent from './methods/judgeDistanceInParent';
import judgeMovement from './methods/judgeMovement';
import { AttractionBest } from './types/Attraction';
import Pack, { getPack, Rectable } from './types/Pack';
import createPoint from './types/Point';
import createRect, { getRect } from './types/Rect';
import { checkDragListeners } from './utils/dragListener';
import registerElement from './utils/registerElement';
import Alignment from './values/alignment';
import Attribute from './values/attribute';
import OffsetUnit from './values/offsetUnit';
import Style from './values/style';
import { AlignToParent } from './values/alignTo';
import attractionResultOfPosition, { AttractionResultOfPositionOptions } from './methods/attractionResultOfPosition';

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
  protected rectCache: DOMRect | null = null;

  protected parentPackCache: Pack | null = null;

  protected targetMagnetPacksCache: Pack[] | null = null;

  protected isMoving: boolean = false;

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
    if (!this.rectCache) {
      this.rectCache = getRect(this);
    }

    return this.rectCache;
  }

  /**
   * Resets the rect object of this magnet.
   */
  resetMagnetRect(): void {
    if (!this.isMoving) {
      this.rectCache = null;
    }
  }

  /**
   * Returns pack object of parent if existing.
   */
  get parentPack(): Pack {
    const parent = this.parentElement ?? document.body;

    if (!this.parentPackCache) {
      this.parentPackCache = getPack(parent);
    }

    return this.parentPackCache;
  }

  /**
   * Resets the pack object of the parent of magnet.
   */
  resetParentPack(): void {
    if (!this.isMoving) {
      this.parentPackCache = null;
    }
  }

  /**
   * Returns pack objects of target magnets.
   */
  get targetMagnetPacks(): Pack[] {
    if (!this.targetMagnetPacksCache) {
      this.targetMagnetPacksCache = this.getAttractableMagnets()
        .map((target) => getPack(target));
    }

    return this.targetMagnetPacksCache;
  }

  /**
   * Resets the pack objects of target magnets.
   */
  resetTargetMagnetPacks(): void {
    if (!this.isMoving) {
      this.targetMagnetPacksCache = null;
    }
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
  judgeMagnetDistance(...[
    distance,
    options = {},
  ]: Parameters<typeof judgeDistance>) {
    const {
      attractDistance = this.attractDistance,
      alignTos = this.alignTos,
    } = options;

    return judgeDistance(distance, {
      attractDistance,
      alignTos,
    });
  }

  /**
   * The same as .judgeMagnetDisance but consider a wrapper element.
   */
  judgeMagnetDistanceInParent(...[
    distance,
    options = {},
  ]: Parameters<typeof judgeDistanceInParent>) {
    const {
      attractDistance = this.attractDistance,
      alignTos = this.alignTos,
      onJudgeDistance = this.judgeMagnetDistance,
    } = options;
    const parent = options.parent ?? this.parentPack;

    return judgeDistanceInParent(distance, {
      attractDistance,
      alignTos,
      parent,
      onJudgeDistance,
    });
  }

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
    const {
      attractDistance = this.attractDistance,
      alignTos = this.alignTos,
      alignments,
      onJudgeDistance = this.judgeMagnetDistance,
    } = options;

    return singleAttractionTo(
      this,
      target,
      {
        attractDistance,
        alignTos,
        alignments,
        onJudgeDistance,
      },
    );
  }

  /**
   * Returns result of attractions to parent on alignments.
   */
  attractionToParent(
    options: SingleAttractionToOptions = {},
  ) {
    const {
      attractDistance = this.attractDistance,
      alignTos = this.alignToParents,
      alignments,
      onJudgeDistance = this.judgeMagnetDistance,
    } = options;

    return singleAttractionTo(
      this,
      this.parentPack,
      {
        attractDistance,
        alignTos,
        alignments,
        onJudgeDistance,
      },
    );
  }

  /**
   * Returns result of attractions from source to targets on alignments.
   */
  multiAttractionsTo(
    targets: (Rectable | Pack)[],
    options: MultiAttractionsToOptions & {
      alignToParents?: AlignToParent[];
    } = {},
  ) {
    const {
      attractDistance = this.attractDistance,
      alignTos = this.alignTos,
      alignToParents = this.alignToParents,
      alignments,
      onJudgeDistance = this.judgeMagnetDistance,
      attractionBest,
      onJudgeAttraction = this.judgeMagnetAttraction,
    } = options;
    const parentAttraction = Magnet.prototype.attractionToParent.call(
      this,
      {
        attractDistance,
        alignTos: alignToParents,
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
        alignTos,
        alignments,
        onJudgeDistance,
        onJudgeAttraction,
        attractionBest: parentAttraction?.best,
      },
    );
  }

  /**
   * Returns final available position and attraction on specific position.
   */
  getMagnetAttractionResultOfPosition(
    position: DOMPoint,
    options?: AttractionResultOfPositionOptions,
  ): ReturnType<typeof attractionResultOfPosition>

  getMagnetAttractionResultOfPosition(
    x: number,
    y: number,
    options?: AttractionResultOfPositionOptions,
  ): ReturnType<typeof attractionResultOfPosition>

  getMagnetAttractionResultOfPosition<A0 extends DOMPoint | number>(
    arg0: A0,
    arg1?: A0 extends DOMPoint ? AttractionResultOfPositionOptions : number,
    arg2?: A0 extends DOMPoint ? undefined : AttractionResultOfPositionOptions,
  ) {
    const position = createPoint(arg0 as number, arg1 as number);
    const options = (
      (arg0 instanceof DOMPoint ? arg1 : arg2) ?? {}
    ) as AttractionResultOfPositionOptions;
    const { width, height } = this.magnetRect;
    const sourceRect = createRect(
      position.x,
      position.y,
      width,
      height,
    );
    const sourcePack = new Pack(this, sourceRect);
    const {
      ignoreEvent,
      unattractable = this.unattractable,
      attractDistance = this.attractDistance,
      alignTos = this.alignTos,
      alignments,
      alignToParents = this.alignToParents,
      crossPrevents = this.crossPrevents,
      parentPack = this.parentPack,
      lastAttractionBest = this.lastAttractionBest,
      onJudgeDistance = this.judgeMagnetDistance,
      onJudgeDistanceInParent = this.judgeMagnetDistanceInParent,
      onJudgeAttraction = this.judgeMagnetAttraction,
      onJudgeMovement = this.judgeMagnetMovement,
    } = options;
    const result = attractionResultOfPosition(
      sourcePack,
      this.targetMagnetPacks,
      {
        ignoreEvent,
        unattractable,
        attractDistance,
        alignTos,
        alignments,
        alignToParents,
        crossPrevents,
        parentPack,
        lastAttractionBest,
        onJudgeDistance,
        onJudgeDistanceInParent,
        onJudgeAttraction,
        onJudgeMovement,
      },
    );

    this.resetMagnetRect();
    this.resetParentPack();
    this.resetTargetMagnetPacks();

    return result;
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
   * Offsets magnet movement with (dx, dy).
   */
  setMagnetOffset(dx: number, dy: number): void

  setMagnetOffset(offset?: DOMPoint): void

  setMagnetOffset<DX extends DOMPoint | number>(
    dx: DX = this.lastOffset as DX,
    dy?: DX extends DOMPoint ? undefined : number,
  ): void {
    const offset = createPoint(dx as number, dy as number);
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

    this.lastOffset = createPoint(offset);
  }

  /**
   * Moves magnet movement to (x, y).
   */
  setMagnetPosition(x: number, y: number): void

  setMagnetPosition(position?: DOMPoint): void

  setMagnetPosition<X extends DOMPoint | number>(
    x: X = createPoint(this.magnetRect) as X,
    y?: X extends DOMPoint ? undefined : number,
  ) {
    const position = createPoint(x as number, y as number);
    const {
      lastOffset,
      magnetRect: sourceRect,
    } = this;
    const origin = createPoint(
      sourceRect.x - lastOffset.x,
      sourceRect.y - lastOffset.y,
    );

    this.setMagnetOffset(
      position.x - origin.x,
      position.y - origin.y,
    );
    this.resetMagnetRect();
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
