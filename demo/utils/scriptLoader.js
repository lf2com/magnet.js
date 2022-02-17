(() => {
  /* eslint-disable no-console */
  const styleLoading = document.createElement('style');

  styleLoading.innerHTML = `
    body::before {
      content: 'Loading script files';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: arial;
      z-index: 10;
    }

    body::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #fff;
      z-index: 1;
    }
  `;
  document.head.appendChild(styleLoading);

  let loadDone = false;
  const queue = [];
  const currentPath = () => document.head.lastChild.getAttribute('src').replace(/\/[^/]+?$/, '');
  const scriptLoader = Object.defineProperties({}, {
    queue: {
      get() { return [...queue]; },
    },
    remains: {
      get() { return queue.length; },
    },
    push: {
      value(func) {
        if (this.done) {
          throw new Error('scriptLoader is done');
        }
        if (typeof func !== 'function') {
          throw new TypeError(`Invalid type: ${typeof func}`);
        }

        queue.push(func);
      },
    },
    done: {
      get() { return loadDone; },
    },
    currentPath: {
      get() { return currentPath(); },
    },
    loadScript: {
      async value(src) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');

          console.log(`Loading script: ${src}`);
          script.src = src;
          script.addEventListener('load', () => {
            console.info(`\`- Loaded script: ${src}`);
            resolve();
          });
          script.addEventListener('error', () => {
            console.warn(`\`- Loading script failed: ${src}`);
            reject();
          });
          document.head.append(script);
        });
      },
    },
  });

  window.addEventListener('load', async () => {
    const runNext = async (index = 0) => {
      if (queue.length > 0) {
        console.log(`Loading script[${index}]`);
        await queue.shift()(scriptLoader);
        console.log(`\`- Loaded script[${index}]`);
        await runNext(index + 1);
      }
    };

    await runNext(0);
    console.info('Loaded all scripts');
    styleLoading.remove();
    loadDone = true;
    window.dispatchEvent(new CustomEvent('ready'));
  });
  window.scriptLoader = scriptLoader;
})();
