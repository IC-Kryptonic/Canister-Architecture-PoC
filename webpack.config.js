const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');
const dfxJson = require('./dfx.json');
const isDevelopment = process.env.NODE_ENV === 'development';

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "@dfinity/ic/canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters).reduce(
  (acc, [name, _value]) => {
    // Get the network name, or `local` by default.
    const networkName = process.env['DFX_NETWORK'] || 'local';
    const outputRoot = path.join(
      __dirname,
      '.dfx',
      networkName,
      'canisters',
      name
    );

    return {
      ...acc,
      ['dfx-generated/' + name]: path.join(outputRoot),
    };
  },
  {}
);

/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== 'object') {
    return;
  }

  // set env variables
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      // The frontend.entrypoint points to the HTML file for this build, so we need
      // to replace the extension to `.js`.
      index: path
        .join(__dirname, info.frontend.entrypoint)
        .replace(/\.html$/, '.tsx'),
    },
    devtool: isDevelopment ? 'cheap-module-source-map' : 'source-map',
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin()],
    },
    resolve: {
      alias: aliases,
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      fallback: {
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
        stream: require.resolve('stream-browserify/'),
        util: require.resolve('util/'),
      },
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist', name),
      publicPath: '/',
    },

    // Depending in the language or framework you are using for
    // front-end development, add module loaders to the default
    // webpack configuration. For example, if you are using React
    // modules and CSS as described in the "Adding a stylesheet"
    // tutorial, uncomment the following lines:
    module: {
      rules: [
        { test: /\.(ts|tsx|jsx)$/, loader: 'ts-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, info.frontend.entrypoint),
        filename: 'index.html',
        chunks: ['index'],
      }),
      new webpack.DefinePlugin(envKeys),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: require.resolve('process/browser'),
      }),
    ],
    devServer: {
      proxy: {
        '/api': `http://${dfxJson.networks.local.bind}`,
      },
      historyApiFallback: true,
    },
  };
}

// If you have additional webpack configurations you want to build
//  as part of this configuration, add them to the section below.
module.exports = [
  ...Object.entries(dfxJson.canisters)
    .map(([name, info]) => {
      return generateWebpackConfigForCanister(name, info);
    })
    .filter((x) => !!x),
];
