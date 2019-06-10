(($) => { 'use strict';

  const { isset, objForEach, objMemberProps } = require('./libs/stdlib');
  const { default: Magnet, MAGNET_DEFAULTS } = require('./libs/magnet');

  $.magnet = function(options = {}) {
    const magnet = new Magnet();

    objForEach(MAGNET_DEFAULTS, (_, prop) => {
      const value = options[prop];
      (isset(value)&&isset(magnet[prop])&&magnet[prop](value));
    });
    
    [
      'add', 'remove', 'removeFull', 'clear', 'clearFull',
      'distance', 'attractable', 'allowCtrlKey', 'stayInParent',
      'alignOuter', 'alignInner', 'alignCenter', 'alignParentCenter',
      'check', 'handle',
      'on', 'off',
    ].forEach((prop) => {
      this[prop] = (...args) => {
        const result = magnet[prop](...args);
        return (isset(result) ?result :this);
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