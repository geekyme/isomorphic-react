/* jshint node:true, es3:false */

'use strict';

var webpack = require('webpack');
var path = require('path')

module.exports = {
  entry: {
    client: './client.js',
    // test: './test.js'
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('common.[hash].js'),
    function() {
      this.plugin("done", function(stats) {
        require("fs").writeFileSync(
          path.join(__dirname, "build", "stats.json"),
          JSON.stringify(stats.toJson()));
      });
    }
  ],
  output: {
    path: __dirname + '/build/', 
    filename: '[name].[hash].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['jsx'] }
    ]
  }
};
