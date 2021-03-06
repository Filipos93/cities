var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({extended : false});

app.use('/', express.static('public'));

var redis = require('redis');
var client = redis.createClient();

client.select((process.env.NODE_ENV || 'development').length);

app.get('/cities', function(req, res){
	client.hkeys('cities', function(error, names){
		if(error) throw error;
		res.json(names);
	});
});

app.post('/cities', urlencode, function(req, res){
	
	var newCity = req.body;
	
	if(newCity.name && newCity.description){
		
		client.hset('cities', newCity.name, newCity.description, function(error){
			if(error) throw error;
			res.status(201).json(newCity.name);
		});
	}else{
		res.sendStatus(400);
	}
	
});

app.delete('/cities/:name', function(req, res){
	client.hdel('cities', req.params.name, function(err){
		if(err) throw err;
		res.sendStatus(204);
	});
});

module.exports = app;