(async () => {
  /* eslint-disable no-console */
  const thisScript = document.head.lastChild;
  const { scriptLoader } = window;
  const { loadScript } = scriptLoader;
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const sassJsPath = `${rootPath}/sass.js`;

  scriptLoader.push(async () => {
    try {
      await loadScript(sassJsPath);

      if (!window.Sass) {
        throw new ReferenceError(
          'Sass is not defined. Not going to load .scss files',
        );
      }

      const sass = new window.Sass();
      const selector = '[type="text/scss"]';
      const scssDoms = document.querySelectorAll(selector);

      /**
       * Returns scss text.
       */
      const getScssText = async (domScss) => {
        switch (domScss.nodeName.toLowerCase()) {
          default:
            throw new TypeError(`Invalid DOM: ${domScss.nodeName}`);

          case 'style':
            return domScss.innerHTML;

          case 'link': {
            const path = domScss.getAttribute('href');
            const response = await fetch(path, {
              method: 'GET',
            });

            if (!response.ok) {
              throw new ReferenceError(`SCSS file does not exist: ${path}`);
            }

            const text = await response.text();

            return text;
          }
        }
      };

      /**
       * Loads scss file.
       */
      const loadNextScss = async (index) => {
        const domScss = scssDoms[index];

        if (!domScss) {
          return;
        }

        const path = domScss.getAttribute('href') ?? `index[${index}]`;

        try {
          const text = await getScssText(domScss);

          await new Promise((resolve) => {
            console.log(`Compiling Sass: ${path}`);
            sass.compile(text, (result) => {
              const { status } = result;

              if (status > 0) {
                const { column, line, message } = result;
                console.warn(` \`- Failed: ${message}`);
                console.warn(` \`- at line ${line}:${column}`);
                resolve();
              }

              const css = result.text;
              const domCss = document.createElement('style');

              domCss.innerHTML = css;
              domScss.replaceWith(domCss);
              console.log(' `- Succeeded');
              resolve();
            });
          });
        } catch (err) {
          console.warn(`Loading scss file failed: ${err.message}`);
        }

        await loadNextScss(index + 1);
      };

      scriptLoader.insert(async () => {
        await loadNextScss(0);
        console.log('All Sass files done');
      });
    } catch (error) {
      console.warn(error.message);
    }
  });
})();
