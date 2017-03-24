var express = require('express');
var firebase = require('firebase');
var config = require('./config');
const NodeCache = require( "node-cache" );

const myCache = new NodeCache();
var app = express();
var PORT = 8080;

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, authen');

	next();
}	

app.use(express.bodyParser());
app.use(allowCrossDomain);

firebase.initializeApp(config.firebase);

require('./Controller/TripController.js')(app, firebase, myCache);
require('./Controller/UserController.js')(app, firebase);
require('./Controller/NotificationController.js')(app, firebase);

app.listen(PORT);  