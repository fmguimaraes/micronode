"use strict"

var Express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var Config = require('../config.js');

class HTTPServer {
	constructor() {
		this.app = Express();
		this.bodyParser = bodyParser;
		this.http = http;
		this.config = new Config();

		this.configureHeaderAccess(this.app);
		this.createHealthCheck(this.app);
	}

	createHealthCheck(app) {
		console.log('[HTTPServer] health check created');
		app.get('/health-check', function (req, res) {
			res.send('my heart is beating')
		})
	}

	configureHeaderAccess(expressApp) {
		expressApp.use(bodyParser.json({ extended: false, limit: 1024102420, type: 'application/json' }));
		expressApp.use(bodyParser.urlencoded({ extended: true }))
		expressApp.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
		expressApp.use(bodyParser.text({ type: 'text/html' }))

		expressApp.use(function (req, response, next) {
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
			response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, tus-resumable, upload-length, upload-metadata");
			next();
		});
	}

	start() {
		var self = this;
		this.server = http.createServer(this.app).listen(this.config.port, this.config.host, function () {
			console.log('Auth service running with Express server listening on:' + self.config.host + ':' + self.config.port);
		});

		http.createServer(this.app).listen(this.config.port, 'localhost');
	}

	getConfig() {
		return this.config;
	}

	use(router) {
		this.app.use(router);
	}

	createRouter() {
		return Express.Router();
	}
};

module.exports = HTTPServer;
