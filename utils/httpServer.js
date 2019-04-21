"use strict"

var Express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var Settings = require('../../setting');
var serveIndex = require('serve-index')
var serveStatic = require('serve-static')
let UploadServer = require('./uploadServer');


class HTTPServer {
	constructor(node) {
		this.node = node;
		this.app = Express();
		this.bodyParser = bodyParser;
		this.http = http;


		this.configureHeaderAccess(this.app);
		this.createHealthCheck(this.app);
		this.configureUploadServer(this.app);
		this.configureStaticServer(this.app);
	}
	configureStaticServer(app){
		let folder = (__dirname +  '/../..' + Settings.STATIC_FILES);

		var index = serveIndex(folder, {'icons': true})
		var serve = serveStatic(folder);
		app.use('/static', Express.static(folder), serveIndex(folder, {'icons': true}))
 
		console.log(folder);
	};

	configureUploadServer(app) {
		this.uploadServer = new UploadServer(app);
	}

	createHealthCheck(app) {
		console.log('[HTTPServer] health check created');
		app.get('/health-check', function (req, res) {
			res.send('my heart is beating')
		})
	}

	configureHeaderAccess(expressApp) {
		expressApp.use(bodyParser.urlencoded({ extended: false }))
		expressApp.use(bodyParser.json())

		expressApp.use(function (req, response, next) {
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
			response.setHeader("Access-Control-Expose-Headers", "Location, Upload-Offset, Upload-Checksum");
			response.setHeader("Access-Control-Allow-Headers", "Authorization, Location, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, tus-resumable, upload-length, upload-metadata");
			next();
		});
	}

	start() {
		var self = this;
		this.server = http.createServer(this.app).listen(Settings.PORT, Settings.HOST, function () {
			console.log('Log service running with Express server listening on:' + Settings.HOST + ':' + Settings.PORT);
		});

		this.node.socket.init();
	}

	getConfig() {
		return this.config;
	}

	use(router, routerInfo) {
		if (!!routerInfo.onUploaded) {
			this.uploadServer.use(router, routerInfo, this.app);
		}
		
		this.app.use(router);
	}

	createRouter() {
		return Express.Router();
	}
};

module.exports = HTTPServer;
