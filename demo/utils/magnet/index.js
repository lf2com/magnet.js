(() => {
  /* eslint-disable no-console */
  /* eslint-disable no-alert */
  const { currentScript } = document;
  const { loadScript } = window;
  const rootPath = currentScript.getAttribute('src').replace(/\w+\.\w+$/, '');
  const modules = (currentScript.getAttribute('module') ?? '')
    .split(/[|;,\s]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  (async () => {
    if (!customElements.get('magnet-block')) {
      console.log('Loading magnet');

      try {
        // try to load development .js
        const magnetJsPath = '/magnet.dev.js';

        await loadScript(magnetJsPath);
      } catch (error) {
        try {
          const magnetJsPath = '../../dist/magnet.min.js';

          console.log('Loading magnet');
          await loadScript(magnetJsPath);
        } catch (err) {
          const detail = `Failed to load magnet: ${err.message}`;

          console.warn(detail);
          alert(detail);
          return;
        }
      }
    }

    console.info('`- Magnet ready');
    await modules.reduce(async (prevPromise, module) => {
      await prevPromise;
      console.log(`Loading magnet module: ${module}`);
      await loadScript(`${rootPath}/${module}.js`, true);
      console.log(`\`- Loaded: ${module}`);
    }, Promise.resolve());
  })();
})();
