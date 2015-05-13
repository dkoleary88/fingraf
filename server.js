var express = require('express');
var	app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

// config db

mongoose.connect('mongodb://localhost');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

// require routes

require('./app/routes.js')(app);

// start the app

app.listen(3000);
console.log('App is listening on port 3000');


