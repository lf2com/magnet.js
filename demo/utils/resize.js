(() => {
  const domStyle = document.createElement('style');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    magnet-block {
      overflow: auto;

      > * {
        min-width: 1em;
        min-height: 1em;
        resize: both;
        overflow: hidden;
      }
    }
  `;
  document.head.append(domStyle);

  window.addEventListener('ready', () => {
    const Magnet = customElements.get('magnet-block');

    /**
     * Setups magnet resize event.
     */
    function initMagnetResizeHandler(magnet) {
      Array.from(magnet.children).forEach((child) => {
        ['mousedown', 'touchstart'].forEach((type) => {
          child.addEventListener(type, (event) => {
            const {
              target,
              clientX,
              clientY,
              touches: [
                {
                  clientX: x = clientX,
                  clientY: y = clientY,
                } = {},
              ] = [],
            } = event;
            const {
              top, left, width, height,
            } = target.getBoundingClientRect();

            if (
              x < (left + 0.75 * width) || y < (top + 0.75 * height)) {
              return;
            }

            event.stopPropagation();
          });
        });
      });
    }

    const observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((mutation) => {
        const { target } = mutation;

        if (!(target instanceof Magnet)) {
          return;
        }

        initMagnetResizeHandler(target);
      });
    });

    document.querySelectorAll('magnet-block').forEach((magnet) => {
      initMagnetResizeHandler(magnet);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();
