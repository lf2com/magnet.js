(($) => { 'use strict';

  const { isset, objForEach } = require('./libs/stdlib');
  const { default: Magnet, MAGNET_DEFAULTS } = require('./libs/magnet');
  const { isRect, stdRect, diffRect } = require('./libs/rect');

  $.magnet = function(options = {}) {
    const magnet = new Magnet();

    objForEach(MAGNET_DEFAULTS, (_, prop) => {
      const value = options[prop];
      (isset(value)&&isset(magnet[prop])&&magnet[prop](value));
    });
    
    [
      'add', 'remove', 'removeFull', 'clear', 'clearFull',
      'distance', 'attractable', 'allowCtrlKey', 'allowDrag', 'useRelativeUnit',
      'stayInParent', 'alignOuter', 'alignInner', 'alignCenter', 'alignParentCenter',
      'check', 'handle', 'setMemberRectangle',
      'on', 'off',
    ].forEach((prop) => {
      this[prop] = (...args) => {
        const result = magnet[prop](...args);
        if (result || !args.length) {
          return result;
        } else {
          return this;
        }
      };
    });

    ['beforeAttract', 'afterAttract', 'doAttract'].forEach((prop) => {
      const value = options[prop];
      if (isset(value)) {
        magnet[prop] = value;
      }
      
      this[prop] = (arg) => {
        if (!isset(arg)) {
          return magnet[prop];
        }
        magnet[prop] = arg;
        return this;
      };
    });

    return this;
  };
  $.magnet.isRect = (rect) => isRect(rect);
  $.magnet.stdRect = (rect) => stdRect(rect);
  $.magnet.measure = 
  $.magnet.diffRect = (source, target, ...args) => diffRect(source, target, ...args);

  $.fn.magnet = function(...args) {
    const $magnet = $.magnet(...args);

    this.each(function() {
      $magnet.add(this);
    });

    return this;
  };
})(jQuery);