const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app/index.tsx',
    //worker: './src/app/js/worker.ts',
  },
  output: {
    path: path.resolve('./dist/app/'), //XXX path.join(__dirname, config.staticPath || 'static'),
    //publicPath: (config.basePath || '') + '/static',
    filename: '[name].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js', '.json', '.scss', '.sass', '.css' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package.title || package.name,
      template: 'src/app/index.ejs',
      chunksSortMode: 'dependency'
    }),
    new ExtractTextPlugin('style.css')
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'sass-loader']
        })/*,
        options: {
          plugins: function() {
            return [autoprefixer, precss];
          }
        }*/
      },
      {
        test: /\.(png|svg|woff(2)?)$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      }/*,
      {
        svg-loader
      }*/
    ]
  }
}
