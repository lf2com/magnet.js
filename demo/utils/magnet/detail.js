(() => {
  const domStyle = document.createElement('style');

  domStyle.setAttribute('type', 'text/scss');
  domStyle.innerHTML = `
    magnet {
      &-block,
      &-pack {
        z-index: 0;
        
        &.focus {
          outline: 0.25em solid rgba(0, 0, 0, 0.25);
        }

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 0 0.25em;
          background-color: rgba(255, 255, 255, 0.5);
          color: #666;
          font-size: 0.5em;
          z-index: -1;
        }
      }

      &-pack::after {
        content: 'pack';
      }

      &-block::after {
        content: 'block';
      }
    }

    #detail {
      position: absolute;
      top: var(--y, 0);
      left: var(--x, 0);
      padding: 0.5em;
      width: max-content;
      box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
      background-color: #fff;
      line-height: 1.5em;
      text-align: start;
      display: none;
      z-index: 1000;
      
      &.show {
        display: block;
      }

      .item {
        .item {
          display: inline-block;
        }
      }

      input {
        margin: 0 0.25em;
        padding: 0 0.25em;
        vertical-align: middle;

        &[type=number] {
          width: 5em;
        }
      }

      .name:not(:empty) {
        margin-inline-end: 0.25em;
        font-weight: bold;

        &::after {
          content: ':';
        }
      }

      .checkbox-item {
        margin-inline-end: 0.25em;
        white-space: nowrap;
      }
    }
  `;
  document.head.append(domStyle);

  window.addEventListener('ready', () => {
    const MagnetPack = customElements.get('magnet-pack');
    const Magnet = customElements.get('magnet-block');
    const domDetail = document.createElement('div');

    domDetail.id = 'detail';

    /**
     * Returns the nearest parent that is magnet-pack or magnet-block.
     */
    function getNearestMagnetParent(dom, onlyBlock = false) {
      if (!dom) {
        return null;
      }
      if (
        dom instanceof Magnet
        || (!onlyBlock && dom instanceof MagnetPack)
      ) {
        return dom;
      }

      return getNearestMagnetParent(dom.parentNode);
    }

    /**
     * Sets visibility of detail.
     */
    function setDetailVisible(visible, position) {
      if (visible) {
        domDetail.classList.add('show');
      } else {
        domDetail.classList.remove('show');
      }

      if (position) {
        const { clientWidth, clientHeight } = domDetail;
        const { innerWidth, innerHeight } = window;
        const x = (position.x + clientWidth <= innerWidth
          ? position.x
          : innerWidth - clientWidth
        );
        const y = (position.y + clientHeight <= innerHeight
          ? position.y
          : innerHeight - clientHeight
        );

        domDetail.style.setProperty('--x', `${x}px`);
        domDetail.style.setProperty('--y', `${y}px`);
      }
    }

    /**
     * Returns detail item.
     */
    function createItem(name, children) {
      const domItem = document.createElement('div');
      const domName = document.createElement('span');

      domItem.classList.add('item');
      domName.classList.add('name');
      domName.innerHTML = name;
      domItem.append(domName);
      (Array.isArray(children) ? children : [children]).forEach((child) => {
        domItem.append(child);
      });

      return domItem;
    }

    /**
     * Returns detail item with checkbox.
     */
    function createCheckboxItem(name, onChange, options = {}) {
      const { defaultChecked } = options;
      const domItem = document.createElement('span');
      const domCheckbox = document.createElement('input');
      const domLabel = document.createElement('label');

      domItem.classList.add('checkbox-item');
      domCheckbox.id = `${name}-${Math.random()}`;
      domCheckbox.setAttribute('type', 'checkbox');
      domLabel.setAttribute('for', domCheckbox.id);
      domLabel.innerHTML = name;

      if (defaultChecked) {
        domCheckbox.setAttribute('checked', '');
      }

      domCheckbox.addEventListener('change', ({ target }) => {
        onChange(target.checked);
      });
      domItem.append(domCheckbox);
      domItem.append(domLabel);

      return domItem;
    }

    /**
     * Returns detail item with input.
     */
    function createInputItem(name, onChange, options = {}) {
      const {
        attributes = {},
        defaultValue,
      } = options;
      const domInput = document.createElement('input');

      Object.keys(attributes).forEach((key) => {
        domInput.setAttribute(key, attributes[key]);
      });

      domInput.setAttribute('autocomplete', 'off');
      domInput.setAttribute('autocorrect', 'off');
      domInput.setAttribute('autocapitalize', 'off');
      domInput.setAttribute('spellcheck', 'false');
      domInput.value = defaultValue;
      domInput.addEventListener('change', ({ target }) => {
        onChange(target.value, target);
      });

      return createItem(name, domInput);
    }

    /**
     * Sets detail of magnet.
     */
    function setDetail(magnet, { x, y }) {
      const domInner = magnet;
      const toggleValues = (allValues, values, targetValue) => (
        allValues.filter((value) => {
          const checked = values.includes(value);

          return value === targetValue ? !checked : checked;
        })
      );

      domDetail.innerHTML = '';

      if (magnet instanceof Magnet) {
        const domSize = createItem(
          'Size',
          [
            createInputItem(
              '',
              (value, input) => {
                const ref = input;

                domInner.style.setProperty('width', `${value}px`);
                ref.value = domInner.clientWidth;
              },
              {
                attributes: {
                  type: 'number',
                  min: 0,
                },
                defaultValue: domInner.clientWidth,
              },
            ),
            'px x ',
            createInputItem(
              '',
              (value, input) => {
                const ref = input;

                domInner.style.setProperty('height', `${value}px`);
                ref.value = domInner.clientHeight;
              },
              {
                attributes: {
                  type: 'number',
                  min: 0,
                },
                defaultValue: domInner.clientHeight,
              },
            ),
            'px',
          ],
        );

        domDetail.append(domSize);
      }

      const domBasic = createItem(
        'Basic',
        [
          createCheckboxItem(
            'disabled',
            (checked) => {
              const ref = magnet;

              ref.disabled = checked;
            },
            {
              defaultChecked: magnet.disabled,
            },
          ),
          createCheckboxItem(
            'unattractable',
            (checked) => {
              const ref = magnet;

              ref.unattractable = checked;
            },
            {
              defaultChecked: magnet.unattractable,
            },
          ),
          createCheckboxItem(
            'unmovable',
            (checked) => {
              const ref = magnet;

              ref.unmovable = checked;
            },
            {
              defaultChecked: magnet.unmovable,
            },
          ),
        ],
      );

      // group
      const domGroup = createInputItem(
        'Group',
        (value) => {
          const ref = magnet;

          ref.group = value;
        },
        {
          defaultValue: magnet.group,
        },
      );

      // attract distance
      const domAttractDistance = createInputItem(
        'Attract distance',
        (value) => {
          const ref = magnet;

          ref.attractDistance = value;
        },
        {
          attributes: {
            type: 'number',
            min: 0,
          },
          defaultValue: magnet.attractDistance,
        },
      );

      // align to
      const domAlignTos = createItem(
        'Align to',
        [
          createCheckboxItem(
            'outer',
            () => {
              const ref = magnet;

              ref.alignTos = toggleValues(
                Object.values(Magnet.ALIGN_TO),
                magnet.alignTos,
                'outer',
              );
            },
            {
              defaultChecked: magnet.alignTos.includes('outer'),
            },
          ),
          createCheckboxItem(
            'inner',
            () => {
              const ref = magnet;

              ref.alignTos = toggleValues(
                Object.values(Magnet.ALIGN_TO),
                magnet.alignTos,
                'inner',
              );
            },
            {
              defaultChecked: magnet.alignTos.includes('inner'),
            },
          ),
          createCheckboxItem(
            'center',
            () => {
              const ref = magnet;

              ref.alignTos = toggleValues(
                Object.values(Magnet.ALIGN_TO),
                magnet.alignTos,
                'center',
              );
            },
            {
              defaultChecked: magnet.alignTos.includes('center'),
            },
          ),
          createCheckboxItem(
            'extend',
            () => {
              const ref = magnet;

              ref.alignTos = toggleValues(
                Object.values(Magnet.ALIGN_TO),
                magnet.alignTos,
                'extend',
              );
            },
            {
              defaultChecked: magnet.alignTos.includes('extend'),
            },
          ),
        ],
      );

      // align to parent
      const domAlignToParents = createItem(
        'Align to parent',
        [
          createCheckboxItem(
            'inner',
            () => {
              const ref = magnet;

              ref.alignToParents = toggleValues(
                Object.values(Magnet.ALIGN_TO_PARENT),
                magnet.alignToParents,
                'inner',
              );
            },
            {
              defaultChecked: magnet.alignToParents.includes('inner'),
            },
          ),
          createCheckboxItem(
            'center',
            () => {
              const ref = magnet;

              ref.alignToParents = toggleValues(
                Object.values(Magnet.ALIGN_TO_PARENT),
                magnet.alignToParents,
                'center',
              );
            },
            {
              defaultChecked: magnet.alignToParents.includes('center'),
            },
          ),
        ],
      );

      // cross prevent
      const domCrossPrevents = createItem(
        'Cross prevent',
        createCheckboxItem(
          'parent',
          () => {
            const ref = magnet;

            ref.crossPrevents = toggleValues(
              Object.values(Magnet.CROSS_PREVENT),
              magnet.crossPrevents,
              'parent',
            );
          },
          {
            defaultChecked: magnet.crossPrevents.includes('parent'),
          },
        ),
      );

      domDetail.append(domBasic);
      domDetail.append(domGroup);
      domDetail.append(domAttractDistance);
      domDetail.append(domAlignTos);
      domDetail.append(domAlignToParents);
      domDetail.append(domCrossPrevents);
      setDetailVisible(true, { x, y });
    }

    document.addEventListener('contextmenu', (event) => {
      const {
        target,
        clientX, clientY,
        touches: [
          {
            clientX: x = clientX,
            clientY: y = clientY,
          } = {},
        ] = [],
      } = event;
      const magnetNode = getNearestMagnetParent(target);

      event.preventDefault();

      if (!magnetNode) {
        return;
      }

      magnetNode.classList.add('focus');
      setDetail(magnetNode, { x, y });
    });

    document.addEventListener('pointerdown', () => {
      document.querySelectorAll('.focus').forEach((dom) => {
        dom.classList.remove('focus');
      });
      setDetailVisible(false);
    });

    domDetail.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });

    document.body.append(domDetail);
  });
})();
