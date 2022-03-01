const path = require('path');

const BUILD_PATH = './dist';

module.exports = (env, options) => {
  const PRODUCTION_MODE = options.mode === 'production';
  const DEV_PUBLIC = (!PRODUCTION_MODE
    && env.public
    && !/false/.test(env.public)
  );

  return {
    entry: path.resolve(__dirname, './index.ts'),
    output: {
      filename: (PRODUCTION_MODE
        ? 'magnet.min.js'
        : 'magnet.dev.js'
      ),
      path: path.resolve(__dirname, BUILD_PATH),
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
            },
          },
        },
        {
          test: /\.ts$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/typescript',
              ],
            },
          },
        },
      ],
    },
    plugins: [],
    devtool: 'inline-source-map',
    devServer: {
      https: false,
      host: DEV_PUBLIC ? 'local-ip' : 'localhost',
      port: '8080',
      compress: true,
      open: [
        '/demo',
      ],
      hot: true,
      static: {
        directory: path.resolve(__dirname),
        publicPath: '/',
        serveIndex: true,
      },
    },
  };
};
