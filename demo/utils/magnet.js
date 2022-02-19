(() => {
  /* eslint-disable no-console */
  /* eslint-disable no-alert */
  const thisScript = document.head.lastChild;
  const { scriptLoader } = window;
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const modules = (thisScript.getAttribute('module') ?? '')
    .split(/[|;,\s]/)
    .map((s) => s.trim());

  scriptLoader.push(async () => {
    const { loadScript } = scriptLoader;

    if (!customElements.get('magnet-block')) {
      console.log('Loading magnet');

      try {
        // try to load development .js
        const magnetJsPath = '/magnet.dev.js';

        await loadScript(magnetJsPath);
      } catch (error) {
        try {
          const magnetJsPath = `${rootPath}/../../dist/magnet.min.js`;

          console.log('Loading magnet');
          await loadScript(magnetJsPath);
        } catch (err) {
          const detail = `Failed to load magnet: ${err.message}`;

          console.warn(detail);
          alert(detail);
        }
      }
    }

    console.info('`- Magnet ready');
    await modules.reduce(async (prevPromise, module) => {
      await prevPromise;
      console.log(`Loading magnet module: ${module}`);
      await loadScript(`${rootPath}/${module}.js`);
      console.log(`\`- Loaded: ${module}`);
    }, Promise.resolve());
  });
})();
