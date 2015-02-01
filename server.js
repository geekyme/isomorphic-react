/* jshint node:true, es3:false */

"use strict";

require('node-jsx').install({ extension: '.jsx' });

var express = require('express'),
		path = require('path'),
		expressState = require('express-state'),
		compression	= require('compression'),
		bodyParser = require('body-parser'),
		debug = require('debug')('server:'),
		logger = require('morgan'),
		React = require('react'),
		Router = require('react-router'),
		async = require('async'),
		server = express(),
		app = require('./app'),
		port = process.env.PORT || 5000,
		devPort = port+1;

if(server.get('env') === 'development'){
	var WebpackDevServer = require("webpack-dev-server"),
			webpack = require('webpack'),
			webpackConfig = require('./webpack.config.js'),
			webpackCompiler = webpack(webpackConfig),
			webpackDevServer = new WebpackDevServer(webpackCompiler, {
			    // webpack-dev-server options
			    contentBase: "http://localhost/",
			    // or: contentBase: "http://localhost/",

			    hot: true,
			    // Enable special support for Hot Module Replacement
			    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
			    // Use "webpack/hot/dev-server" as additional module in your entry point
			        // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does. 

			    // webpack-dev-middleware options
			    quiet: false,
			    // noInfo: false,
			    // lazy: true,
			    watchDelay: 300,
			    publicPath: "/resources/",
			    headers: { "X-Custom-Header": "yes" },
			    stats: { colors: true }
			});
	webpackDevServer.listen(devPort, function(){
		console.log('dev server started');
	});
	server.use(logger('dev'));
}else{
	server.use(logger('tiny'));
}

// exposing some jade locals for templating purposes
server.locals.debug = server.get('env') === 'development';
if(server.locals.debug){
	server.locals.devPort = devPort; 
}

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');
server.set('state namespace', app.uid);

server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies
server.use(compression({ filter: function(args) { return true; } })); // compress all requests and types

server.use('/app', express.static('./app'));
server.use('/node_modules', express.static('./node_modules'));
server.use('/resources', express.static('./resources'));

expressState.extend(server);
	

// middleware to handle server side rendering
server.use(function (req, res, next) {
	var context = app.createContext({
		api: process.env.API || 'https://api.spotify.com/v1',
		env: {
			NODE_ENV: process.env.NODE_ENV
		}
	});
	
	debug('Loading application data');

	Router.run(app.getAppComponent(), req.url, function (Handler, state) {
	
		if(state.routes.length === 0) { 
			// no such route, pass to the next middleware which handles 404
			return next();
		}
		
		async.filterSeries(
			state.routes.filter(function(route) {
				return route.handler.loadAction?true:false;
			}),
			function(route, done) {
				context.getActionContext().executeAction(route.handler.loadAction, {params:state.params, query:state.query}, done);
			},
			function() {
				debug('Rendering application components');
				var markup = React.renderToString(React.createElement(Handler, {context: context.getComponentContext()}));
				res.expose(app.dehydrate(context), app.uid);
				res.render('index', {
					uid: app.uid,
					html: markup
				}, function (err, markup) {
					if (err) {
						next(err);
					}
					res.send(markup);
				});
			}
		);
	});
});

// catch 404 and forward to error handler
server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


server.listen(port, function() {
	console.log("Running in %s and listening on %s", __dirname, port);
});

module.exports = server;
