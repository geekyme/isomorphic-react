/* jshint node:true, es3:false */

'use strict';

module.exports = {
  context: __dirname,
  entry: {
		client: ['./client.js']
	},
	plugins: [
		// new webpack.IgnorePlugin(/^react\//),
	],
  output: {
		path: '/resources/js',
    filename: 'bundle.js'
  },
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: 'jsx-loader' }
		]
	},
	devtool: '#source-map',
  externals: {
		jquery: "jQuery",
		react: "React",
		modernizr: "Modernizr"
	}
};
