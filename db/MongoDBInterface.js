"use strict"

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
  } = process.env;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

class MongoDBInterface {
    constructor(settings) {
        this.settings = settings;
    }
    
    init(collection, schema) {
        this.model = null;
        this.options = { useNewUrlParser: true };

        const environment = process.env.NODE_ENV;
        const Database = this.settings.Database[environment];
        var DatabaseHost = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

        mongoose.connect(url, {useNewUrlParser: true});


        var db = mongoose.createConnection(DatabaseHost, this.options);
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback() {
            
        });

        var someModelSchema = new Schema(schema);
        this.model = db.model(collection, someModelSchema, collection);
    }

    getModel() {
        return this.model;
    }

    getSchema() {
        return Schema;
    }

    close() {
        return mongoose.connection.close();
    }
}

module.exports = MongoDBInterface