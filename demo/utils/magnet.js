(() => {
  /* eslint-disable no-console */
  /* eslint-disable no-alert */
  const thisScript = document.head.lastChild;
  const rootPath = thisScript.getAttribute('src').replace(/\/[^/]+?$/, '');
  const modules = (thisScript.getAttribute('module') ?? '').split(/[|;,\s]/);

  window.scriptLoader.push(async (scriptLoader) => {
    const { loadScript } = scriptLoader;

    if (!customElements.get('magnet-block')) {
      try {
        const magnetJsPath = `${rootPath}/../../dist/magnet.min.js`;

        console.log('Loading magnet');
        await loadScript(magnetJsPath);
      } catch (error) {
        console.warn(error.message);
        alert(error.message);
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
