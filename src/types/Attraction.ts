import Distance from './Distance';
import Pack from './Pack';
import { createPoint } from './Point';

export interface AttractionBest {
  x?: Distance;
  y?: Distance;
}

interface Attraction<T> {
  source: Pack;
  target: T;
  results: Distance[];
  best: AttractionBest;
}

/**
 * Returns the offset of attraction result.
 */
export function getAttractionOffset(attraction: Attraction<unknown>): DOMPoint {
  const { best } = attraction;

  return createPoint(
    best.x?.rawDistance ?? 0,
    best.y?.rawDistance ?? 0,
  );
}

export default Attraction;
