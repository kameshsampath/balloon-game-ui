const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Phaser webpack config
var phaser;
const testMode = process.env.testmode || '0';
switch (testMode) {
  case '0':
    var phaserModule = path.join(__dirname, '/node_modules/phaser/'); // Official released phaser
    phaser = path.join(phaserModule, 'src/phaser.js');
    break;
  case '1':
    var phaserModule = path.join(__dirname, '/../rex-phaser/'); // My tested phaser
    phaser = path.join(phaserModule, 'src/phaser.js');
    break;
  case '2':
    var phaserModule = path.join(__dirname, '/../phaser/'); // Lastest phaser
    phaser = path.join(phaserModule, 'src/phaser.js');
    break;
  default:
    phaser = path.join(__dirname, testMode); // Other phaser path
    break;
}

console.log('Phaser path:' + phaser);

const projectMain = './src/game.js';
console.log('Porject Main:' + projectMain);
const assetsFolder = process.env.assets || './assets';
const htmlTemplate = process.env.htmltemplate || './templates/index.tmpl';

module.exports = {
  mode: 'production',
  entry: {
    app: [
      '@babel/polyfill',
      projectMain
    ],
    vendor: ['phaser']
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: htmlTemplate,
      chunks: ['vendor', 'app'],
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /phaser-split\.js$/,
        use: ['expose-loader?Phaser']
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      // 'rexPlugins': path.resolve(__dirname, 'plugins/'),
      // 'rexTemplates': path.resolve(__dirname, 'templates/'),
    }
  }
}