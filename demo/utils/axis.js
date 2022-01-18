(() => {
  const domStyle = document.createElement('style');
  const domAxes = document.createElement('div');
  const domAxisHori = document.createElement('div');
  const domAxisVert = document.createElement('div');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    #axes {
      --color: rgba(0, 0, 0, 0.25);

      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      pointer-events: none;

      > * {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        
        &.show {
          opacity: 1;
        }
        
        &.hori {
          right: 0;
          border-top: 1px solid var(--color);
          transform: translateY(-50%);
        }
        
        &.vert {
          bottom: 0;
          border-left: 1px solid var(--color);
          transform: translateX(-50%);
        }
      }
    }
  `;
  document.head.append(domStyle);

  domAxes.id = 'axes';
  domAxisHori.classList.add('hori');
  domAxisVert.classList.add('vert');
  document.addEventListener('attract', (event) => {
    const {
      detail: {
        nextRect: rect,
        attraction: {
          best: { x, y },
        },
      },
    } = event;

    if (x) {
      switch (x.alignment) {
        default:
          break;

        case 'rightToRight':
        case 'rightToLeft':
          domAxisVert.style.setProperty('left', `${rect.right}px`);
          break;

        case 'leftToRight':
        case 'leftToLeft':
          domAxisVert.style.setProperty('left', `${rect.left}px`);
          break;

        case 'xCenterToXCenter':
          domAxisVert.style.setProperty(
            'left',
            `${(rect.right + rect.left) / 2}px`,
          );
          break;
      }
      domAxisVert.classList.add('show');
    }

    if (y) {
      switch (y.alignment) {
        default:
          break;

        case 'topToTop':
        case 'topToBottom':
          domAxisHori.style.setProperty('top', `${rect.top}px`);
          break;

        case 'bottomToTop':
        case 'bottomToBottom':
          domAxisHori.style.setProperty('top', `${rect.bottom}px`);
          break;

        case 'yCenterToYCenter':
          domAxisHori.style.setProperty(
            'top',
            `${(rect.top + rect.bottom) / 2}px`,
          );
          break;
      }
      domAxisHori.classList.add('show');
    }
  });
  document.addEventListener('attractmove', (event) => {
    const {
      detail: {
        attraction: {
          best: { x, y },
        },
      },
    } = event;

    if (x) {
      domAxisVert.classList.add('show');
    }
    if (y) {
      domAxisHori.classList.add('show');
    }
  });
  document.addEventListener('unattracted', () => {
    domAxisHori.classList.remove('show');
    domAxisVert.classList.remove('show');
  });
  document.addEventListener('magnetend', () => {
    domAxisHori.classList.remove('show');
    domAxisVert.classList.remove('show');
  });

  window.addEventListener('load', () => {
    domAxes.append(domAxisHori);
    domAxes.append(domAxisVert);
    document.body.append(domAxes);
  });
})();
