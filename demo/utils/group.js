(() => {
  const domStyle = document.createElement('style');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    magnet {
      &-block {
        &.same-group {
          outline: 0.1em solid rgba(0, 0, 0, 0.25);
        }
      }

      &-block,
      &-pack {
        position: relative;

        &[group] {
          &::before {
            content: attr(group);
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.1em 0.2em;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 0.5rem;
            line-height: 1.5em;
            text-align: start;
            z-index: 1;
          }
        }
      }
    }
  `;
  document.head.append(domStyle);

  window.addEventListener('load', () => {
    const Magnet = customElements.get('magnet-block');

    /**
     * Setups magnet group.
     */
    function initMagnetGroup(magnet) {
      magnet.addEventListener('mouseenter', ({ target }) => {
        const { group } = target;
        const magnets = Array.from(document.querySelectorAll('magnet-block'))
          .filter((dom) => (
            dom !== magnet
            && (group ? dom.group === group : true)
          ));

        magnets.forEach((dom) => {
          dom.classList.add('same-group');
        });
        target.addEventListener('mouseleave', () => {
          magnets.forEach((dom) => {
            dom.classList.remove('same-group');
          });
        }, { once: true });
      });
    }

    const observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((mutation) => {
        const { target } = mutation;

        if (!(target instanceof Magnet)) {
          return;
        }

        initMagnetGroup(target);
      });
    });

    document.querySelectorAll('magnet-block').forEach((magnet) => {
      initMagnetGroup(magnet);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
})();
