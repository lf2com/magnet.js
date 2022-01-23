import MagnetPack from './core';
import setOffsetWithAttraction, { SetOffsetWithAttractionOptions } from './methods/instance/setOffsetWithAttraction';
import { CalcMultiAttractionsOptions } from './methods/static/calcMultiAttractions';
import { CalcSingleAttractionOptions } from './methods/static/calcSingleAttraction';
import judgeAttraction from './methods/static/judgeAttraction';
import judgeDistance from './methods/static/judgeDistance';
import judgeDistanceInParent from './methods/static/judgeDistanceInParent';
import { AttractionBest } from './types/Attraction';
import Pack, { getPack, Rectable } from './types/Pack';
import { createPoint } from './types/Point';
import createRect, { getRect } from './types/Rect';
import { checkDragListeners, DragEvent } from './utils/dragListener';
import registerElement from './utils/registerElement';
import Attribute from './values/attribute';
import OffsetUnit from './values/offsetUnit';
import Style from './values/style';

const nodeName = 'magnet-block';

class Magnet extends MagnetPack {
  #rect: DOMRect | null = null;

  #parentPack: Pack | null = null;

  #targetMagnetPacks: Pack[] | null = null;

  protected lastOffset: DOMPoint = createPoint(0, 0);

  protected lastAttractionBest: AttractionBest | null = null;

  constructor() {
    super();

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
   * distance would not be on the result list of attraction.
   */
  judgeMagnetDistance = judgeDistance

  /**
   * The same as .judgeMagnetDisance but consider a wrapper element.
   */
  judgeMagnetDistanceInParent = judgeDistanceInParent

  /**
   * Returns true if the attraction passes the judgement. Otherwise the
   * attraction would not be on the result list of attractions.
   */
  judgeMagnetAttraction = judgeAttraction

  /**
   * Returns result of attractions from source to parent on alignments.
   */
  calcMagnetParentAttraction(
    options: CalcSingleAttractionOptions = {},
  ): ReturnType<typeof Magnet['calcMagnetAttraction']> | null {
    const {
      attractDistance = this.attractDistance,
      alignTos,
      alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignToParents),
      onJudgeDistance = this.judgeMagnetDistance,
      attractionBest = {},
    } = options;

    if (alignments.length === 0 || !this.parentMagnetPack) {
      return null;
    }

    const parentAttraction = Magnet.calcMagnetAttraction(
      this,
      this.parentMagnetPack,
      {
        attractDistance,
        alignments,
        onJudgeDistance,
      },
    );

    if (attractionBest.x !== undefined
      && (parentAttraction.best.x?.absDistance as number) > attractionBest.x.absDistance
    ) {
      parentAttraction.best.x = attractionBest.x;
    }

    if (attractionBest.y !== undefined
      && (parentAttraction.best.y?.absDistance as number) > attractionBest.y.absDistance
    ) {
      parentAttraction.best.y = attractionBest.y;
    }

    return parentAttraction;
  }

  /**
   * Returns result of attractions from source to target on alignments.
   */
  calcMagnetAttraction(
    target: Rectable | Pack,
    options: CalcSingleAttractionOptions = {},
  ): ReturnType<typeof Magnet['calcMagnetAttraction']> {
    const {
      attractDistance = this.attractDistance,
      alignTos,
      alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignTos),
      onJudgeDistance = this.judgeMagnetDistance,
      attractionBest,
    } = options;
    const parentAttraction = this.calcMagnetParentAttraction({
      onJudgeDistance,
      attractionBest,
    });

    return Magnet.calcMagnetAttraction(this, target, {
      attractDistance,
      alignments,
      onJudgeDistance,
      attractionBest: parentAttraction?.best,
    });
  }

  /**
   * Returns result of attractions from source to targets on alignments.
   */
  calcMagnetMultiAttractions(
    targets: (Rectable | Pack)[],
    options: CalcMultiAttractionsOptions = {},
  ): ReturnType<typeof Magnet['calcMultiMagnetAttractions']> {
    const targetPacks = targets.map((target) => getPack(target));
    const {
      alignTos,
      alignments = Magnet.getAlignmentsFromAlignTo(alignTos ?? this.alignTos),
      onJudgeDistance = this.judgeMagnetDistance,
      onJudgeAttraction = this.judgeMagnetAttraction,
      attractionBest,
    } = options;
    const parentAttraction = this.calcMagnetParentAttraction({
      onJudgeDistance,
      attractionBest,
    });

    return Magnet.calcMultiMagnetAttractions(
      this,
      targetPacks,
      {
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
  setMagnetOffsetWithAttraction = setOffsetWithAttraction

  /**
   * Appends the offset of magnet with (dx, dy) with checking the attraction.
   */
  appendMagnetOffsetWithAttraction(
    point: DOMPoint,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  appendMagnetOffsetWithAttraction(
    dx: number,
    dy: number,
    options?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction>

  appendMagnetOffsetWithAttraction(
    arg0: DOMPoint | number,
    arg1?: number | SetOffsetWithAttractionOptions,
    arg2?: SetOffsetWithAttractionOptions,
  ): ReturnType<typeof setOffsetWithAttraction> {
    const offset = createPoint(arg0 as number, arg1 as number);
    const options = (arg0 instanceof DOMPoint
      ? arg1
      : arg2
    ) as SetOffsetWithAttractionOptions;
    const { lastOffset } = this;

    return setOffsetWithAttraction.call(
      this,
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

  setMagnetOffset(point: DOMPoint): void

  setMagnetOffset(x: DOMPoint | number, y?: number): void {
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

  /**
   * Handles dragstart event.
   */
  handleDragStart(event: DragEvent): void {
    if (event) {
      this.style.setProperty('z-index', '1');
    }
  }

  /**
   * Handles dragmove event.
   */
  handleDragMove(event: DragEvent): void {
    if (!event) {
      this.resetMagnetRect();
      this.resetParentMagnetPack();
      this.resetTargetMagnets();
    }
  }

  /**
   * Handles dragend event.
   */
  handleDragEnd(event: DragEvent): void {
    if (event) {
      this.resetMagnetRect();
      this.resetParentMagnetPack();
      this.resetTargetMagnets();
      this.style.removeProperty('z-index');
    }
  }
}

registerElement(Magnet, nodeName);

export default Magnet;
