"use strict"
var mongoose = require('mongoose');
var Settings = require('../../settings');
var Schema = mongoose.Schema;

class MongoDBInterface {
    init(collection, schema) {
        this.model = null;
        this.options = { useNewUrlParser: true };

        var db = mongoose.createConnection(`mongodb://${Settings.Database.user}:${Settings.Database.password}@${Settings.Database.host}${Settings.Database.name}`,  this.options);
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback() {
        });


        var someModelSchema = new Schema(schema);
        this.model = db.model(collection, someModelSchema, collection );
    }
    
    getModel() {
        return this.model;
    }

    close() {
        //console.log('MongoDBInterface.close');
        return mongoose.connection.close();
    }
}

module.exports  = MongoDBInterface