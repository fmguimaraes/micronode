const tus = require('tus-node-server');
const uploadApp = express();

class HTTPServer {
	constructor(httpServer) {
        this.node = node;
        this.server = new tus.Server();
        this.server.datastore = new tus.FileStore({
            path: '/machtwo/files'
        });

        uploadApp.all('*', server.handle.bind(server));

        app.use('/uploads', uploadApp);
	}
}