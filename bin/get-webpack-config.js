const path = require('path');
const webpack = require('webpack');

// Plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.join(__dirname, '..');

module.exports = () => ({
  devtool: 'source-map',
  entry: {
    ['app']: (
      ['webpack-hot-middleware/client']
    ).concat(path.join(rootPath, 'app', 'index.ts'))
  },
  output: {
    path: path.join(rootPath, 'dist'),
    filename: '[name].js',
    publicPath: ''
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new HtmlWebpackPlugin({
      minify: {},
      template: path.join(rootPath, 'app', 'index.html'),
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2']
            }
          }
        ]
      }, {
        test: /\.html$/,
        issuer: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './template/[hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.html$/,
        issuer: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'to-string-loader'
          }
        ]
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader' // translates CSS into CommonJS
            }, {
              loader: 'resolve-url-loader'
            }, {
              loader: 'sass-loader' // compiles Sass to CSS
            }
          ],
          fallback: 'style-loader'
        })
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader'
            }
          ],
          fallback: 'style-loader'
        })
      }, {
        test: /\.woff(2)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './font/[hash].[ext]',
              mimetype: 'application/font-woff'
            }
          }
        ]
      }, {
        test: /\.(ttf|eot|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './font/[hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.(gif|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './asset/[hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.ts(x?)$/,
        use: [{
          loader: 'ts-loader'
        }]
      }
    ]
  },
  resolve: {
    modules: [
      rootPath,
      path.join(rootPath, 'node_modules')
    ],
    extensions: ['.ts', '.js', '.json']
  }
});
