var express = require('express');
var app = express();

app.use('/', express.static('public'));

var cities = ["Lotopia", "Caspiana", "Indigo"];

app.get('/cities', function(req, res){
	res.json(cities);
});

module.exports = app;