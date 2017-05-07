var req = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();


describe('Requests to root path', function(){

	it('Returns a 200 status code', function(done){

		req(app)
		.get('/')
		.expect(200, done);

	});

	it('Returns HTML format', function(done){

		req(app)
		.get('/')
		.expect('Content-Type', /html/, done);

	});

	it('Returns an index file with Cities', function(done){

		req(app)
		.get('/')
		.expect(/cities/i, done);

	});


});

describe('Listing cities on /cities', function(){

	it('Returns a 200 status code', function(done){

		req(app)
		.get('/cities')
		.expect(200, done);

	});

	it('Returns JSON format', function(done){

		req(app)
		.get('/cities')
		.expect('Content-Type', /json/, done);

	});

	it('Returns initial cities', function(done){

		req(app)
		.get('/cities')
		.expect(JSON.stringify([]), done);

	});

});

describe('Creating new cities', function(){

	it('Returns a 201 status code', function(done){
		req(app)
		.post('/cities')
		.send('name=Springfield&description=where+the+simpsons+live')
		.expect(201, done);
	});

	it('Returns city name', function(done){
		req(app)
		.post('/cities')
		.send('name=Springfield&description=where+the+simpsons+live')
		.expect(/Springfield/i, done);
	});

	it('Validates city name and description', function(done){
		req(app)
		.post('/cities')
		.send('name=&description=')
		.expect(400, done);
	});

});

describe('Deleting a city', function(){

	before(function(){
		client.hset('cities', 'Banana', 'a tasty fruit');
	});

	after(function(){
		client.flushdb();
	});

	it('Returns a 204 status code', function(done){

		req(app)
		.delete('/cities/Banana')
		.expect(204, done);

	});

});

