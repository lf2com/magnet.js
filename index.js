'use strict';

import Magnet from './libs/magnet';

if (self && self instanceof Object && self === self.self) {
  self.Magnet = Magnet;
}

export default Magnet;
