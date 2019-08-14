"use strict"

const Express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const serveIndex = require('serve-index')
const UploadServer = require('./uploadServer');

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
		let AllowedHeaders = this.settings.Authentication.headerTokenName + ", Location, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, tus-resumable, upload-length, upload-metadata";
		
		expressApp.use(bodyParser.urlencoded({ extended: false }));
		expressApp.use(bodyParser.json());

		expressApp.use(function (req, response, next) {
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE, PATCH");
			response.setHeader("Access-Control-Expose-Headers", "Location, Upload-Offset, Upload-Checksum");
			response.setHeader("Access-Control-Allow-Headers", AllowedHeaders);
			next();
		});
	}

	start() {
		var self = this;
		this.server = http.createServer(this.app).listen(this.settings.Server.port, this.settings.Server.host , function () {
			console.log(self.settings.Server.name  + ' service running with Express server listening on:' + self.settings.Server.host + ':' + self.settings.Server.port);
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
