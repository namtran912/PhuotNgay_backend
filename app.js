require('./Model/View.js')();
require('./Controller/ViewController.js')();
    
var express = require('express');
var redis = require('redis')
    
var app = express();
client = redis.createClient(6379, "10.100.2.117");
client.auth("ODIqre95943", function (err) { if (err) throw err; });

var PORT = 8080;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN');

    next();
}

app.use(express.bodyParser());
app.use(allowCrossDomain);

/* ================== VIEW API ========================= */
var viewController = new ViewController()

app.get(viewController.url + '/views', function(req, res) {
    res.json(viewController.getAll());
});
/* ===================================================== */

app.listen(PORT);  
