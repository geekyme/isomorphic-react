var WebpackDevServer = require("webpack-dev-server"),
    webpack = require('webpack'),
    config = require('./webpack.config.js'),
    webpackCompiler = webpack(config),
    webpackDevServer = new WebpackDevServer(webpackCompiler, {
      // webpack-dev-server options
      // contentBase: "http://localhost:5001",
      // or: contentBase: "http://localhost/",

      hot: true,
      // Enable special support for Hot Module Replacement
      // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
      // Use "webpack/hot/dev-server" as additional module in your entry point
          // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does. 

      // webpack-dev-middleware options
      quiet: true,
      // noInfo: true,
      // lazy: true,
      watchDelay: 300,
      publicPath: config.output.publicPath,
      headers: { "Access-Control-Allow-Origin": "*" },
      stats: { colors: true }
    });

webpackDevServer.listen(5001, function(){
  console.log('dev server started');
});