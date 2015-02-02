'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var createAsyncHandler = require('./utils/createAsyncHandler.jsx');

if(typeof window !== 'undefined'){
  var App = require('promise?bluebird!./components/routeHandlers/app.jsx');
  var ViewTrack = require('promise?bluebird!./components/routeHandlers/ViewTrack.jsx');
  var SearchTrack = require('promise?bluebird!./components/routeHandlers/SearchTrack.jsx');

  module.exports = (
    <Route path="" handler={createAsyncHandler(App)}>
      <DefaultRoute handler={createAsyncHandler(ViewTrack)}/>
      <Route path="track/:id" name="track" handler={createAsyncHandler(SearchTrack)}/>
    </Route>
  );

} else {
  var App = require('./components/routeHandlers/app.jsx');
  var ViewTrack = require('./components/routeHandlers/ViewTrack.jsx');
  var SearchTrack = require('./components/routeHandlers/SearchTrack.jsx');

  module.exports = (
    <Route path="" handler={App}>
      <DefaultRoute handler={ViewTrack}/>
      <Route path="track/:id" name="track" handler={SearchTrack}/>
    </Route>
  );
}

