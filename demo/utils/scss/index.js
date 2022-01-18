(() => {
  /* eslint-disable no-console */
  const thisScript = document.head.lastChild;
  const styleLoading = document.createElement('style');

  styleLoading.innerHTML = `
    body::before {
      content: 'Loading .scss files';
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
      const Sass = await new Promise((resolve, reject) => {
        if (window.Sass) {
          resolve(window.Sass);
          return;
        }

        const sassJsName = 'sass.js';
        const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
        const sassJsPath = `${rootPath}/${sassJsName}`;
        const sassScript = document.createElement('script');

        sassScript.src = sassJsPath;
        document.head.appendChild(sassScript);
        sassScript.addEventListener('error', () => {
          reject(new Error('Loading Sass JS failed'));
        });
        sassScript.addEventListener('load', () => {
          console.info('Loaded Sass JS');
          resolve(window.Sass);
        });
        console.log(`Loading Sass JS: ${sassJsPath}`);
      });

      if (!Sass) {
        throw new ReferenceError(
          'Sass is not defined. Not going to load .scss files',
        );
      }

      const sass = new Sass();
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
        await loadNextScss(index + 1);
      };

      await loadNextScss(0);
      console.log('All Sass files done');
    } catch (error) {
      console.warn(error.message);
    }

    styleLoading.remove();
  });
})();
