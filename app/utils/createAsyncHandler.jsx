'use strict';
 
var React = require('react');
 
function createAsyncHandler(getHandlerAsync, displayName) {
  var Handler = null;
 
  return React.createClass({
    displayName: displayName,
 
    statics: {
      willTransitionTo: function(transition, params, query, callback) {
        getHandlerAsync().then(function(resolvedHandler){
          Handler = resolvedHandler;
 
          if (!Handler.willTransitionTo) {
            return callback();
          }
 
          Handler.willTransitionTo(transition, params, query, callback);
          if (Handler.willTransitionTo.length < 4) {
            callback();
          }
        });
      },
 
      willTransitionFrom: function(transition, component, callback) {
        if (!Handler || !Handler.willTransitionFrom) {
          callback();
        }
 
        Handler.willTransitionFrom(transition, component, callback);
        if (Handler.willTransitionFrom.length < 3) {
          callback();
        }
      }
    },
 
    render: function() {
      return <Handler {...this.props} />;
    }
  });
}
 
module.exports = createAsyncHandler;