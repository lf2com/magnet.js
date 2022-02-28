(() => {
  const domStyle = document.createElement('style');
  const domDialogPool = document.createElement('div');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    #dialog-pool {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      overflow: hidden;
      pointer-events: none;

      .dialog {
        --head-bg-color: #39a;
        --head-color: #fff;

        position: absolute;
        width: fit-content;
        height: fit-content;
        max-width: 80%;
        max-height: 50%;
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
        pointer-events: all;

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
    }
  `;
  document.head.append(domStyle);

  function createDialog(options = {}) {
    const { id, head, body } = options;
    const domDialog = document.createElement('div');
    const domDialogHead = document.createElement('div');
    const domDialogBody = document.createElement('div');

    domDialogHead.addEventListener('pointerdown', (event) => {
      const {
        clientX: startX,
        clientY: startY,
      } = event;
      const {
        x: originX,
        y: originY,
      } = domDialog.getBoundingClientRect();
      const onPointerMove = (evt) => {
        const {
          clientX: moveX,
          clientY: moveY,
        } = evt;
        const nextX = moveX - startX + originX;
        const nextY = moveY - startY + originY;

        domDialog.style.setProperty('top', `${nextY}px`);
        domDialog.style.setProperty('left', `${nextX}px`);
      };
      const onPointerUp = () => {
        domDialog.style.removeProperty('z-index');
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      domDialog.style.setProperty('z-index', Date.now());
      event.preventDefault();
      event.stopPropagation();
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });

    domDialogBody.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    if (id) {
      domDialog.id = id;
    }
    if (head !== undefined) {
      domDialogHead.append(head);
    }
    if (body !== undefined) {
      domDialogBody.append(body);
    }

    domDialog.classList.add('dialog');
    domDialogHead.classList.add('head');
    domDialogBody.classList.add('body');
    domDialog.append(domDialogHead);
    domDialog.append(domDialogBody);
    domDialogPool.append(domDialog);

    const { innerWidth, innerHeight } = window;
    const { width, height } = domDialog.getBoundingClientRect();
    const top = (innerHeight - height) / 2;
    const left = (innerWidth - width) / 2;

    domDialog.style.setProperty('top', `${top}px`);
    domDialog.style.setProperty('left', `${left}px`);

    return domDialog;
  }

  domDialogPool.id = 'dialog-pool';
  document.body.append(domDialogPool);
  window.createDialog = createDialog;
})();
