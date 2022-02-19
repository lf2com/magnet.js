(() => {
  const domStyle = document.createElement('style');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    .window {
      --head-bg-color: #39a;
      --head-color: #fff;

      position: absolute;
      box-shadow: 0 0 0.75em #666;
      background-color: #fff;
      line-height: 1.5em;
      font-size: 0.85rem;
      display: grid;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "head"
        "body"
      ;
      z-index: 1;

      > .head {
        padding: 0.15em 0.25em;
        background-color: var(--head-bg-color);
        font-weight: bold;
        color: var(--head-color);
        text-align: center;
        grid-area: head;
        cursor: move;
        user-select: none;
        touch-action: none;
      }
      
      > .body {
        padding: 0.5em;
        text-align: center;
        grid-area: body;
      }
    }
  `;
  document.head.append(domStyle);

  function createDialog(options = {}) {
    const { id, head, body } = options;
    const domWindow = document.createElement('div');
    const domWindowHead = document.createElement('div');
    const domWindowBody = document.createElement('div');

    domWindowHead.addEventListener('pointerdown', (event) => {
      const {
        clientX: startX,
        clientY: startY,
      } = event;
      const {
        x: originX,
        y: originY,
      } = domWindow.getBoundingClientRect();
      const onPointerMove = (evt) => {
        const {
          clientX: moveX,
          clientY: moveY,
        } = evt;
        const nextX = moveX - startX + originX;
        const nextY = moveY - startY + originY;

        domWindow.style.setProperty('top', `${nextY}px`);
        domWindow.style.setProperty('left', `${nextX}px`);
      };
      const onPointerUp = () => {
        domWindow.style.removeProperty('z-index');
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      domWindow.style.setProperty('z-index', Date.now());
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });

    domWindowBody.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    if (id) {
      domWindow.id = id;
    }
    if (head !== undefined) {
      domWindowHead.append(head);
    }
    if (body !== undefined) {
      domWindowBody.append(body);
    }

    domWindow.classList.add('window');
    domWindowHead.classList.add('head');
    domWindowBody.classList.add('body');
    domWindow.append(domWindowHead);
    domWindow.append(domWindowBody);
    document.body.append(domWindow);

    const { innerWidth, innerHeight } = window;
    const { width, height } = domWindow.getBoundingClientRect();
    const windowX = (innerWidth - width) / 2;
    const windowY = (innerHeight - height) / 2;

    domWindow.style.setProperty('top', `${windowY}px`);
    domWindow.style.setProperty('left', `${windowX}px`);

    return domWindow;
  }

  window.createDialog = createDialog;
})();
