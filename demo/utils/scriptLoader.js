(async () => {
  /* eslint-disable no-console */
  const thisScript = document.head.lastChild;
  const styleLoading = document.createElement('style');
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const modules = (thisScript.getAttribute('module') ?? '')
    .split(/[|;,\s]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

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
  const verifyQueueValue = (target) => {
    if (loadDone) {
      console.warn(target);
      throw new Error('scriptLoader is already done');
    }

    switch (typeof target) {
      case 'string':
      case 'function':
        break;

      default:
        throw new TypeError(`Invalid type: ${typeof target}`);
    }
  };
  const scriptLoader = Object.defineProperties({}, {
    queue: {
      get() { return [...queue]; },
    },
    remains: {
      get() { return queue.length; },
    },
    push: {
      value(target) {
        verifyQueueValue(target);

        switch (typeof target) {
          case 'string':
            queue.push(async () => {
              await this.loadScript(target);
            });
            break;

          case 'function':
            queue.push(target);
            break;

          default:
            break;
        }
      },
    },
    insert: {
      value(target) {
        verifyQueueValue(target);

        switch (typeof target) {
          case 'string':
            queue.unshift(async () => {
              await this.loadScript(target);
            });
            break;

          case 'function':
            queue.unshift(target);
            break;

          default:
            break;
        }
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
            const message = `Loading script failed: ${src}`;

            console.warn(`\`- ${message}`);
            reject(new Error(message));
          });
          document.head.append(script);
        });
      },
    },
  });

  window.addEventListener('load', async () => {
    const runNext = async (index) => {
      if (queue.length === 0) {
        return index;
      }

      console.log(`Initializing script[${index}]`);
      await queue.shift()(scriptLoader);
      console.log(`\`- Initialized script[${index}]`);
      await runNext(index + 1);

      return index + 1;
    };

    const lastIndex = await runNext(0);

    modules.forEach((module) => {
      scriptLoader.push(`${rootPath}/${module}.js`);
    });
    await runNext(lastIndex);
    console.info('Loaded all scripts');
    styleLoading.remove();
    loadDone = true;
    window.dispatchEvent(new CustomEvent('ready'));
  });
  window.scriptLoader = scriptLoader;
})();
