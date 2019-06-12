(($) => { 'use strict';

  const { isset, objForEach } = require('./libs/stdlib');
  const { default: Magnet, MAGNET_DEFAULTS } = require('./libs/magnet');

  $.magnet = function(options = {}) {
    const magnet = new Magnet();

    objForEach(MAGNET_DEFAULTS, (_, prop) => {
      const value = options[prop];
      (isset(value)&&isset(magnet[prop])&&magnet[prop](value));
    });
    
    [
      'add', 'remove', 'removeFull', 'clear', 'clearFull',
      'distance', 'attractable', 'allowCtrlKey', 'allowDrag', 'stayInParent',
      'alignOuter', 'alignInner', 'alignCenter', 'alignParentCenter',
      'check', 'handle',
      'on', 'off',
    ].forEach((prop) => {
      this[prop] = (...args) => {
        const result = magnet[prop](...args);
        return (args.length ?this :result);
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

  $.fn.magnet = function(...args) {
    const $magnet = $.magnet(...args);

    this.each(function() {
      $magnet.add(this);
    });

    return this;
  };
})(jQuery);