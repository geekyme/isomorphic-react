/* jshint node:true, es3:false */

'use strict';

var webpack = require('webpack');
var path = require('path')

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:5001',
		'webpack/hot/dev-server', 
    './client.js'
  ],
	plugins: [
    new webpack.HotModuleReplacementPlugin()
	],
  output: {
		path: __dirname + '/resources/', 
    filename: 'bundle.js',
    publicPath: 'http://localhost:5001/resources/'
  },
	module: {
		loaders: [
      { test: /\.jsx$/, loaders: ['react-hot', 'jsx'] }
		]
	},
	devtool: '#eval'
};
