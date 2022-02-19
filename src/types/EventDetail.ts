import { MultiAttraction } from '../methods/calcMultiAttractions';
import Distance from './Distance';
import Pack from './Pack';

export interface StartEventDetail {
  source: Pack;
  targets: Pack[];
  parent: Pack | null;
  lastOffset: DOMPoint;
  startPoint: DOMPoint;
}

export interface MoveEventDetail extends StartEventDetail {
  nextOffset: DOMPoint;
  movePoint: DOMPoint;
}

export interface EndEventDetail {}

export interface AttractEventDetail {
  source: Pack;
  nextRect: DOMRect;
  attraction: MultiAttraction;
}

export interface AttractedEventDetail {
  source: Pack;
  target: Pack;
  sourceNextRect: DOMRect;
  distance: Distance;
}

export interface AttractmoveEventDetail extends AttractEventDetail {}

export interface AttractedmoveEventDetail extends AttractedEventDetail {}

export interface UnattractEventDetail extends AttractEventDetail {}

export interface UnattractedEventDetail {
  source: Pack;
  target: Pack;
  sourceNextRect: DOMRect;
  nextTarget: Pack | null;
}
