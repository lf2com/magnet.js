import Alignment from '../values/alignment';
import Pack from './Pack';

interface Distance {
  source: Pack;
  target: Pack;
  alignment: Alignment;
  rawDistance: number;
  absDistance: number;
}

export default Distance;
