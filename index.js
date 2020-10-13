var express    = require('express');
var http       = require('http');
var bodyParser = require("body-parser");
const cors     = require('cors')
var https      = require('https')
var fs = require('fs')

var app    = require('express')();
var server = require('http').Server(app);
var port   = 2043;

app.set('trust proxy',true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

server.listen(port);
//---  Global Variable ----
exports = module.exports = {};

//---  Load Route ----
app.use('/',require('./controller/route'));

server.on('listening', onListening);

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);
	console.log('=============================\n');
}


