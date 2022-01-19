(() => {
  const Magnet = customElements.get('magnet-block')!;

  /**
   * Setups magnet control.
   */
  function initMagnetControl(magnet) {
    magnet.addEventListener('magnetstart', () => {
      const originAttractable = !magnet.getAttribute('unattractable');
      const onKeyChange = (event) => {
        const { ctrlKey } = event;

        if (ctrlKey) {
          magnet.setAttribute('unattractable', '');
        } else if (originAttractable) {
          magnet.removeAttribute('unattractable');
          magnet.calcMagnetMultiAttractions
        }
      };

      document.addEventListener('keydown', onKeyChange);
      document.addEventListener('keyup', onKeyChange);
      magnet.addEventListener('magnetend', () => {
        document.removeEventListener('keydown', onKeyChange);

        if (originAttractable) {
          magnet.removeAttribute('unattractable');
        }
      });
    });
  }

  const observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach((mutation) => {
      const { target } = mutation;

      if (!(target instanceof Magnet)) {
        return;
      }

      initMagnetControl(target);
    });
  });

  document.querySelectorAll('magnet-block').forEach((magnet) => {
    initMagnetControl(magnet);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
