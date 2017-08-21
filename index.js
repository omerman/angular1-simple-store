const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const request = require('request');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const getWebpackConfig = require('./bin/get-webpack-config.js');

const app = express();
const PORT = 8080;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({ secret: 'my secret secret session you never guess. sure i will. no.', cookie: { maxAge: 60000 } }));

const pushState = (req, res, next) => {
  const availablePages = ['/main', '/description'];
  if (req.method === 'GET' && availablePages.indexOf(req.path) !== -1) {
    request.get({ url: `http://127.0.0.1:${PORT}`, headers: req.headers }, (error, response, body) => {
      res.send(body);
    });
  } else {
    next();
  }
};
app.use(pushState);

// WEBPACK
const webpackConfig = getWebpackConfig({ isWebpackDevServer: true });
const webpackCompiler = webpack(webpackConfig);
const webpackDevMiddlewareInstance = webpackMiddleware(webpackCompiler,
  {
    publicPath: '',
    noInfo: false,
    quiet: false
  }
);

app.use(webpackDevMiddlewareInstance);
app.use(webpackHotMiddleware(webpackCompiler));

const start = () => {
  app.listen(PORT, () => {
      console.log(`App started successfully on port ${PORT}!`);
  });
};
// start as soon as middleware ready.
webpackDevMiddlewareInstance.waitUntilValid(start);
