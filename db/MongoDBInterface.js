"use strict"
var mongoose = require('mongoose');
var Settings = require('../../settings');
var Schema = mongoose.Schema;

class MongoDBInterface {
    init(collection, schema) {
        this.model = null;
        this.options = { useNewUrlParser: true };

        const environment = process.env.NODE_ENV;
        const Database = Settings.Database[environment];
        var DatabaseHost = `mongodb://${Database.user}:${Database.password}@${Database.host}${Database.name}`;
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

    close() {
        return mongoose.connection.close();
    }
}

module.exports = MongoDBInterface