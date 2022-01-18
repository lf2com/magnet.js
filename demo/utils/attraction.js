(() => {
  const domStyle = document.createElement('style');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    magnet-block {
      --color: rgba(255, 200, 0, 0.25);
      
      &:hover {
        box-sizing: content-box;
        outline: var(--attract-distance, 0) solid var(--color);
      }

      &.attracted {
        outline: 0.1em solid #f66 !important;
      }
    }
  `;
  document.head.append(domStyle);

  window.addEventListener('load', () => {
    const Magnet = customElements.get('magnet-block');

    /**
     * Sets attract distance on mouse entering.
     */
    function onMouseEnter({ target }) {
      target.style.setProperty('--attract-distance', `${target.attractDistance}px`);
    }

    /**
     * Setups magnet style.
     */
    function initMagnetStyle(magnet) {
      magnet.addEventListener('mouseenter', onMouseEnter);
    }

    const observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((mutation) => {
        const { target } = mutation;

        if (!(target instanceof Magnet)) {
          return;
        }

        initMagnetStyle(target);
      });
    });

    document.querySelectorAll('magnet-block').forEach((magnet) => {
      initMagnetStyle(magnet);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    ['attracted', 'attractedmove'].forEach((type) => {
      document.addEventListener(type, (event) => {
        event.target.classList.add('attracted');
      });
    });
    document.addEventListener('unattracted', (event) => {
      event.target.classList.remove('attracted');
    });
    document.addEventListener('magnetend', () => {
      document.querySelectorAll('.attracted').forEach((dom) => {
        dom.classList.remove('attracted');
      });
    });
  });
})();
