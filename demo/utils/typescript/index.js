(async () => {
  /* eslint-disable no-console */
  const thisScript = document.head.lastChild;
  const { scriptLoader } = window;
  const { loadScript } = scriptLoader;
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const tsJsPath = `${rootPath}/typescriptServices.js`;

  scriptLoader.push(async () => {
    try {
      await loadScript(tsJsPath);

      if (!window.ts) {
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

          const js = window.ts.transpile(text);
          const domJs = document.createElement('script');

          domJs.innerHTML = js;
          domTs.replaceWith(domJs);
          console.log(' `- Succeeded');
          resolve();
        });
        await loadNextTs(index + 1);
      };

      scriptLoader.insert(async () => {
        await loadNextTs(0);
        console.log('All TypeScript files done');
      });
    } catch (error) {
      console.warn(error.message);
    }
  });
})();
