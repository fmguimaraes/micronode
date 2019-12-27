"use strict"

let Express = require('express');
let bodyParser = require('body-parser');
let http = require('http');
let serveIndex = require('serve-index')
let UploadServer = require('./uploadServer');

const {
	SERVER_NAME,
	SERVER_HOST,
	SERVER_PORT,
  } = process.env;

class HTTPServer {
	constructor(node) {
		this.node = node;
		this.settings =  node.settings;
		this.app = Express();
		this.bodyParser = bodyParser;
		this.http = http;


		this.configureHeaderAccess(this.app);
		this.createHealthCheck(this.app);
		this.configureUploadServer(this.app);
		this.configureStaticServer(this.app);
	}
	configureStaticServer(app) {
		if (!!this.settings.Folders && !!this.settings.Folders.static) {
			this.settings.Folders.static.forEach((staticFolder) => {
				console.log(`[Router] static ${staticFolder.alias} location:${staticFolder.location} `);

				let folder = __dirname + '/../../../../' + staticFolder.location;
				app.use(staticFolder.alias, Express.static(folder), serveIndex(folder, { 'icons': true }))
			})
		}
	};

	configureUploadServer(app) {
		if (!!this.settings.Features && !!this.settings.Features.upload) {
			this.uploadServer = new UploadServer(this.settings);
		}
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
		this.server = http.createServer(this.app).listen(SERVER_PORT, SERVER_HOST , function () {
			console.log(SERVER_NAME + ' service running with Express server listening on:' + SERVER_HOST + ':' + SERVER_PORT);
		});
		
		this.node.socket.init();
	}

	getConfig() {
		return this.config;
	}

	use(router, routerInfo) {
		if (!!routerInfo.onUploaded && !!this.settings.Folders.tmp) {
			this.uploadServer.use(router, routerInfo, this.app);
		}
		this.app.use(router);
	}

	createRouter() {
		return Express.Router();
	}
};

module.exports = HTTPServer;
