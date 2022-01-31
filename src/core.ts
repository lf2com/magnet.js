import { getAttractionOffset } from './types/Attraction';
import { getArrayFromAttributeValue, getAttributeValueFromArray } from './utils/multiAttributeValues';
import registerElement from './utils/registerElement';
import Alignment from './values/alignment';
import AlignTo, { AlignToParent } from './values/alignTo';
import Attribute from './values/attribute';
import CrossPrevent from './values/crossPrevent';
import Event from './values/event';
import OffsetUnit from './values/offsetUnit';
import { isNaN } from './utils/numeric';

const nodeName = 'magnet-pack';
const template = document.createElement('template');
const defaultValues = {
  [Attribute.disabled]: false,
  [Attribute.group]: undefined,
  [Attribute.attractDistance]: 10,
  [Attribute.unattractable]: false,
  [Attribute.unmovable]: false,
  get [Attribute.alignTo]() {
    return [
      AlignTo.outer,
      AlignTo.inner,
      AlignTo.center,
      AlignTo.extend,
    ];
  },
  get [Attribute.alignToParent]() {
    return [];
  },
  get [Attribute.crossPrevent]() {
    return [
      // CrossPrevents.parent,
    ];
  },
  [Attribute.offsetUnit]: OffsetUnit.pixel,
};

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
    }
  </style>
  <slot>
  </slot>
`;

class MagnetPack extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    (this.shadowRoot as ShadowRoot).append(template.content.cloneNode(true));
  }

  static get ALIGNMENT() {
    return { ...Alignment };
  }

  static get ALIGN_TO() {
    return { ...AlignTo };
  }

  static get ALIGN_TO_PARENT() {
    return { ...AlignToParent };
  }

  static get CROSS_PREVENT() {
    return { ...CrossPrevent };
  }

  static get EVENT() {
    return { ...Event };
  }

  /**
   * Returns alignment values converted from sides of aligning.
   */
  static getAlignmentsFromAlignTo(source: string[]): Alignment[] {
    const alignTos = Array.isArray(source) ? source : [source];
    const alignments: Alignment[] = [];

    if (alignTos.includes(AlignTo.outer)) {
      alignments.push(
        Alignment.topToBottom,
        Alignment.rightToLeft,
        Alignment.bottomToTop,
        Alignment.leftToRight,
      );
    }
    if (alignTos.includes(AlignTo.inner)) {
      alignments.push(
        Alignment.topToTop,
        Alignment.rightToRight,
        Alignment.bottomToBottom,
        Alignment.leftToLeft,
      );
    }
    if (alignTos.includes(AlignTo.center)) {
      alignments.push(
        Alignment.xCenterToXCenter,
        Alignment.yCenterToYCenter,
      );
    }

    return alignments;
  }

  /**
   * Returns the offset of attraction result.
   */
  static getMagnetAttractionOffset = getAttractionOffset

  /**
   * Returns true if magnet is disabled.
   */
  get disabled(): boolean {
    return this.traceMagnetAttributeValue(Attribute.disabled) !== null;
  }

  /**
   * Sets disabled of magnet.
   */
  set disabled(disabled: boolean) {
    if (disabled) {
      this.setAttribute(Attribute.disabled, '');
    } else {
      this.removeAttribute(Attribute.disabled);
    }
  }

  /**
   * Returns magnet group.
   */
  get group(): string | null {
    return this.traceMagnetAttributeValue(Attribute.group);
  }

  /**
   * Sets magnet group.
   */
  set group(group: string | null) {
    if (group === null || group.length === 0) {
      this.removeAttribute(Attribute.group);
    } else {
      this.setAttribute(Attribute.group, group);
    }
  }

  /**
   * Returns the nearest parent magnet element.
   */
  get parentMagnet(): MagnetPack | null {
    const group = this.getAttribute(Attribute.group);

    let parent = this.parentElement;

    while (parent) {
      if (parent instanceof MagnetPack) {
        const parentGroup = parent.getAttribute(Attribute.group);

        if (group === null
          || parentGroup === null
          || group === parentGroup
        ) {
          return parent;
        }
      }

      parent = parent.parentElement;
    }

    return null;
  }

  /**
   * Returns true if the magnet has no attraction.
   */
  get unattractable(): boolean {
    return this.traceMagnetAttributeValue(Attribute.unattractable) !== null;
  }

  /**
   * Sets unattractable of magnet.
   */
  set unattractable(unattractable: boolean) {
    if (unattractable) {
      this.setAttribute(Attribute.unattractable, '');
    } else {
      this.removeAttribute(Attribute.unattractable);
    }
  }

  /**
   * Returns true if the magnet is unable to be dragged.
   */
  get unmovable(): boolean {
    return this.traceMagnetAttributeValue(Attribute.unmovable) !== null;
  }

  /**
   * Sets unmovable of magnet.
   */
  set unmovable(unmovable: boolean) {
    if (unmovable) {
      this.setAttribute(Attribute.unmovable, '');
    } else {
      this.removeAttribute(Attribute.unmovable);
    }
  }

  /**
   * Returns the distance of attraction.
   */
  get attractDistance(): number {
    const value = this.traceMagnetAttributeValue(Attribute.attractDistance);

    return (value === null
      ? defaultValues[Attribute.attractDistance]
      : Number(value)
    );
  }

  /**
   * Sets the distance of attraction.
   */
  set attractDistance(attractDistance: number | null) {
    if (attractDistance === null) {
      this.removeAttribute(Attribute.attractDistance);
    } else if (isNaN(attractDistance)) {
      throw new TypeError(`Invalid attraction distance: ${attractDistance}`);
    } else if (attractDistance < 0) {
      throw new RangeError(`Attraction distance should be greater than 0: ${attractDistance}`);
    } else if (attractDistance !== this.attractDistance) {
      this.setAttribute(Attribute.attractDistance, `${attractDistance}`);
    }
  }

  /**
   * Returns magnet attraction sides.
   */
  get alignTos(): AlignTo[] {
    const value = this.traceMagnetAttributeValue(Attribute.alignTo);

    return (value === null
      ? defaultValues[Attribute.alignTo]
      : getArrayFromAttributeValue(value, AlignTo)
    );
  }

  /**
   * Sets magnet attraction sides.
   */
  set alignTos(alignTos: string | string[]) {
    this.setAttribute(
      Attribute.alignTo,
      getAttributeValueFromArray((Array.isArray(alignTos)
        ? alignTos
        : getArrayFromAttributeValue(alignTos, AlignTo)
      )),
    );
  }

  /**
   * Returns the attraction sides for its parent element.
   */
  get alignToParents(): AlignToParent[] {
    const value = this.traceMagnetAttributeValue(Attribute.alignToParent);

    return (value === null
      ? defaultValues[Attribute.alignToParent]
      : getArrayFromAttributeValue(value, AlignToParent)
    );
  }

  /**
   * Sets the attraction sides for its parent element.
   */
  set alignToParents(alignToParents: string | string[]) {
    this.setAttribute(
      Attribute.alignToParent,
      getAttributeValueFromArray((Array.isArray(alignToParents)
        ? alignToParents
        : getArrayFromAttributeValue(alignToParents, AlignToParent)
      )),
    );
  }

  /**
   * Returns magnet alignments for attraction.
   */
  get alignments(): Alignment[] {
    return MagnetPack.getAlignmentsFromAlignTo(this.alignTos);
  }

  /**
   * Returns magnet alignments for parent attraction.
   */
  get parentAlignments(): Alignment[] {
    return MagnetPack.getAlignmentsFromAlignTo(this.alignToParents);
  }

  /**
   * Returns targets that the magnet would prevent from crossing.
   */
  get crossPrevents(): CrossPrevent[] {
    const value = this.traceMagnetAttributeValue(Attribute.crossPrevent);

    return (value === null
      ? defaultValues[Attribute.crossPrevent]
      : getArrayFromAttributeValue(value, CrossPrevent)
    );
  }

  /**
   * Sets targets that the magnet would prevent from crossing.
   */
  set crossPrevents(crossPrevents: string | string[]) {
    this.setAttribute(
      Attribute.crossPrevent,
      getAttributeValueFromArray((Array.isArray(crossPrevents)
        ? crossPrevents
        : getArrayFromAttributeValue(crossPrevents, CrossPrevent)
      )),
    );
  }

  /**
   * Returns unit of offset.
   */
  get offsetUnit(): string {
    const value = this.traceMagnetAttributeValue(Attribute.offsetUnit);

    return (value === null
      ? defaultValues[Attribute.offsetUnit]
      : value
    );
  }

  /**
   * Sets the unit of offset.
   */
  set offsetUnit(offsetUnit: string | null) {
    if (offsetUnit === null) {
      this.removeAttribute(Attribute.offsetUnit);
    } else if (!Object.values(OffsetUnit).includes(offsetUnit as OffsetUnit)) {
      throw new Error(`Invalid offset unit: ${offsetUnit}`);
    } else if (offsetUnit !== this.offsetUnit) {
      this.setAttribute(Attribute.offsetUnit, offsetUnit);
    }
  }

  /**
   * Returns the value of specific attribute name.
   */
  traceMagnetAttributeValue(attrName: string): string | null {
    const value = this.getAttribute(attrName);

    if (value !== null) {
      return value;
    }

    const { parentMagnet } = this;

    return (parentMagnet
      ? parentMagnet.traceMagnetAttributeValue(attrName)
      : null
    );
  }
}

registerElement(MagnetPack, nodeName);

export default MagnetPack;
