(() => {
  const groups = {
    A: '#fcc',
    B: '#cfc',
    C: '#ccf',
  };
  const groupNames = Object.keys(groups);

  window.addEventListener('ready', () => {
    const domMagnetPack = document.getElementById('magnet-panel');

    // init group list
    const { getGroupIndex } = ((domGroupList) => {
      const createItem = (name) => {
        const domItem = document.createElement('span');
        const domRadio = document.createElement('input');
        const domName = document.createElement('span');
        const group = groups[name];

        domRadio.type = 'radio';
        domRadio.name = 'group';
        domRadio.value = name;
        domName.innerHTML = name;
        domItem.addEventListener('pointerdown', () => {
          domRadio.click();
        });
        domItem.append(domRadio);
        domItem.append(domName);
        domGroupList.append(domItem);

        if (group) {
          domName.style.setProperty('padding', '0 0.25em');
          domName.style.setProperty('background-color', groups[name]);
        }

        return domItem;
      };
      const domRandom = createItem('random');

      domRandom.querySelector('input').setAttribute('checked', '');
      groupNames.forEach((name) => {
        createItem(name);
      });

      return {
        getGroupIndex: () => {
          const group = domGroupList.querySelector('input:checked').value;
          const index = groupNames.indexOf(group);

          return (index > -1
            ? index
            : Math.floor(Math.random() * groupNames.length)
          );
        },
      };
    })(document.getElementById('group-list'));

    // init add button
    ((buttonAddMagnet) => {
      buttonAddMagnet.addEventListener('click', () => {
        const newMagnet = document.createElement('magnet-block');
        const { clientWidth, clientHeight } = domMagnetPack;
        const width = 50 + Math.round(Math.random() * 200);
        const height = 50 + Math.round(Math.random() * 200);
        const x = Math.round(Math.random() * (clientWidth - width));
        const y = Math.round(Math.random() * (clientHeight - height));
        const group = groupNames[getGroupIndex()];
        const backgroundColor = groups[group];
        const attractDistance = 5 + Math.round(Math.random() * 20);

        newMagnet.style.setProperty('position', 'absolute');
        newMagnet.style.setProperty('top', `${y}px`);
        newMagnet.style.setProperty('left', `${x}px`);
        newMagnet.style.setProperty('width', `${width}px`);
        newMagnet.style.setProperty('height', `${height}px`);
        newMagnet.style.setProperty('background-color', backgroundColor);
        newMagnet.setAttribute('attract-distance', attractDistance);
        newMagnet.setAttribute('group', group);
        domMagnetPack.append(newMagnet);
      });

      new Array(5).fill(0).forEach(() => {
        buttonAddMagnet.click();
      });
    })(document.getElementById('add'));

    // init clean button
    ((buttonCleanMagnets) => {
      buttonCleanMagnets.addEventListener('click', () => {
        document.querySelectorAll('magnet-block').forEach((magnet) => {
          magnet.remove();
        });
      });

      const checkMagnets = () => {
        const hasMagnet = domMagnetPack.childNodes.length > 0;

        if (hasMagnet) {
          buttonCleanMagnets.removeAttribute('disabled');
        } else {
          buttonCleanMagnets.setAttribute('disabled', '');
        }
      };
      const observer = new MutationObserver(() => {
        checkMagnets();
      });
      observer.observe(domMagnetPack, {
        childList: true,
      });
      checkMagnets();
    })(document.getElementById('clean'));

    // init control panel
    ((domControlPanelBody) => {
      const { createDialog } = window;

      createDialog({
        id: 'control-panel',
        head: 'Control Panel',
        body: domControlPanelBody,
      });
    })(document.getElementById('control-panel-body'));
  });
})();
