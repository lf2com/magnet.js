'use strict';

import { objMap, objValues } from './stdlib';

const ALIGNMENT_PROPS = {
  tt: 'topToTop',
  rr: 'rightToRight',
  bb: 'bottomToBottom',
  ll: 'leftToLeft',
  tb: 'topToBottom',
  bt: 'bottomToTop',
  rl: 'rightToLeft',
  lr: 'leftToRight',
  xx: 'xCenter',
  yy: 'yCenter',
};

export default Object.create(null, objMap(ALIGNMENT_PROPS, (_, prop) => ({
  get: () => ALIGNMENT_PROPS[prop],
  set: (v) => {
    if (objValues(ALIGNMENT_PROPS).includes(v)) {
      throw new Error(`Already assign property name: ${v}`);
    }
    ALIGNMENT_PROPS[prop] = v;
  },
  enumerable: true,
})));