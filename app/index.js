
'use strict';

var FluxibleApp = require('fluxible');
var app = new FluxibleApp({
	appComponent: require('./routes.jsx')
});

// this sets the namespace for context variables used in dehydration & rehydration
app.uid = '__example';

app.registerStore(require('./stores/DataStore'));

app.plug(require('./plugins/EnvPlugin'));
app.plug(require('./plugins/ServicePlugin'));

module.exports = app;

