var express = require('express');

var app = express();
var PORT = 8080;

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');

	next();
}

app.use(express.bodyParser());
app.use(allowCrossDomain);

require('./Controller/SearchController.js')(app);

app.listen(PORT);  