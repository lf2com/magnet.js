(async () => {
  /* eslint-disable no-console */
  const thisScript = document.head.lastChild;
  const { scriptLoader } = window;
  const { loadScript } = scriptLoader;
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const tsJsPath = `${rootPath}/babel.js`;

  scriptLoader.push(async () => {
    try {
      await loadScript(tsJsPath);

      if (!window.Babel) {
        throw new ReferenceError(
          'Babel is not defined. Not going to convert js with babel',
        );
      }

      const babelDoms = Array.from(document.querySelectorAll('script'))
        .filter((domScript) => (
          /^text\/(babel|jsx)$/i.test(domScript.getAttribute('type'))
        ));

      /**
       * Returns babel text.
       */
      const getTsText = async (domBabel) => {
        switch (domBabel.nodeName.toLowerCase()) {
          default:
            throw new TypeError(`Invalid DOM: ${domBabel.nodeName}`);

          case 'script': {
            const { innerHTML } = domBabel;

            if (innerHTML.length > 0) {
              return innerHTML;
            }

            const path = domBabel.getAttribute('src');
            const response = await fetch(path, {
              method: 'GET',
            });

            if (!response.ok) {
              throw new ReferenceError(`Babel file does not exist: ${path}`);
            }

            const text = await response.text();

            return text;
          }
        }
      };

      /**
       * Loads babel file.
       */
      const loadNextBabel = async (index) => {
        const domBabel = babelDoms[index];

        if (!domBabel) {
          return;
        }

        const path = domBabel.getAttribute('src') ?? `index[${index}]`;
        const text = await getTsText(domBabel);

        await new Promise((resolve) => {
          console.log(`Compiling Babel: ${path}`);

          const js = window.Babel.transform(
            text,
            {
              presets: ['env', 'react'],
            },
          ).code;
          const domJs = document.createElement('script');

          domJs.innerHTML = js;
          domBabel.replaceWith(domJs);
          console.log(' `- Succeeded');
          resolve();
        });
        await loadNextBabel(index + 1);
      };

      scriptLoader.insert(async () => {
        await loadNextBabel(0);
        console.log('All Babel files done');
      });
    } catch (error) {
      console.warn(error.message);
    }
  });
})();
