(() => {
  /* eslint-disable no-console */
  // const URL_TS = 'https://raw.githubusercontent.com/microsoft/TypeScript/main/lib/typescriptServices.js';
  const thisScript = document.head.lastChild;
  const styleLoading = document.createElement('style');

  styleLoading.innerHTML = `
    body::before {
      content: 'Loading .ts files';
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

  window.addEventListener('load', async () => {
    try {
      const TS = await new Promise((resolve, reject) => {
        if (window.ts) {
          resolve(window.ts);
          return;
        }

        const tsJsName = 'typescriptServices.js';
        const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
        const tsJsPath = `${rootPath}/${tsJsName}`;
        // const tsJsPath = URL_TS;
        const tsScript = document.createElement('script');

        tsScript.src = tsJsPath;
        document.head.appendChild(tsScript);
        tsScript.addEventListener('error', () => {
          reject(new Error('Loading TypeScript JS failed'));
        });
        tsScript.addEventListener('load', () => {
          console.info('Loaded TypeScript JS');
          resolve(window.ts);
        });
        console.log(`Loading TypeScript JS: ${tsJsPath}`);
      });

      if (!TS) {
        throw new ReferenceError(
          'ts is not defined. Not going to load .ts files',
        );
      }

      const tsDoms = Array.from(document.querySelectorAll('script'))
        .filter((domScript) => (
          /^text\/(typescript|ts)$/i.test(domScript.getAttribute('type'))
          || /\.ts$/i.test(domScript.getAttribute('src'))
        ));

      /**
       * Returns ts text.
       */
      const getTsText = async (domTs) => {
        switch (domTs.nodeName.toLowerCase()) {
          default:
            throw new TypeError(`Invalid DOM: ${domTs.nodeName}`);

          case 'script': {
            const { innerHTML } = domTs;

            if (innerHTML.length > 0) {
              return innerHTML;
            }

            const path = domTs.getAttribute('src');
            const response = await fetch(path, {
              method: 'GET',
            });

            if (!response.ok) {
              throw new ReferenceError(`TypeScript file does not exist: ${path}`);
            }

            const text = await response.text();

            return text;
          }
        }
      };

      /**
       * Loads ts file.
       */
      const loadNextTs = async (index) => {
        const domTs = tsDoms[index];

        if (!domTs) {
          return;
        }

        const path = domTs.getAttribute('src') ?? `index[${index}]`;
        const text = await getTsText(domTs);

        await new Promise((resolve) => {
          console.log(`Compiling TypeScript: ${path}`);

          const js = TS.transpile(text);
          const domJs = document.createElement('script');

          domJs.innerHTML = js;
          domTs.replaceWith(domJs);
          console.log(' `- Succeeded');
          resolve();
        });
        await loadNextTs(index + 1);
      };

      await loadNextTs(0);
      console.log('All TypeScript files done');
    } catch (error) {
      console.warn(error.message);
    }

    styleLoading.remove();
  });
})();
