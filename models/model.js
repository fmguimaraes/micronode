"use strict"
var MongoDBInterface = require("../db/MongoDBInterface");

class BaseModel {
    constructor(server) {
        this.collection  = '';
        this.initialized = false;
        this.db = new MongoDBInterface(server.settings);
        this.dbSchema = this.db.getSchema();
    }
    
    init() {
		if(!this.initialized) {
		    this.db.init(this.collection, this.schema);
		    this.DBModel = this.db.getModel();
		}

		this.initialized = true;
    }

    updateDBModel(db, data) {
    	for(var name in data) {
    		db[name] = data[name];
    	}

      	db.timestamp = new Date();

        return db;
    }

    sanitizeData(data) {
        delete data._id;
        delete data.timestamp
                
        return Object.assign({},data);
    };

    JSONFlatten(json, current) {
        for(var key in json) {
            var value = json[key];
            var newKey = (current ? current + "." + key : key);
            if(value && value.constructor.name === "Object") {
                this.JSONFlatten(value, newKey);
            } else {
                this.newJson[newKey] = value;
            }
        }
        return this.newJson;
    };

    createQuery(data) {
        var newObject = this.sanitizeData(data);
    
        if(!!data.id) {
          newObject._id = data.id;
          delete newObject.id;
        }

        delete newObject.id;
        return newObject; 
    };

    applyOr(value) {

    }

    async create(data) {
        data = this.sanitizeData(data);
        var self = this;

        return new Promise(function(resolve, reject) {
            self.init();
            var dbModel = new self.DBModel();
            dbModel = self.updateDBModel(dbModel, data);
            dbModel.save(function(err, data){
                if(err) {
                    reject({"error" : true, "message" : "Error saving data", "errorMsg" : err});  
                } else {
                    data =  !!data ? data._doc : data;
                    resolve(Object.assign({}, data));
                }
                self.closeConnection();
            });
        });
    };

    async aggregation(query) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.init();
            self.DBModelDB.get().aggregate(query, function (err, data) {
               if(err) {
                    reject({"error" : true,"message" : "Error retrieving aggregated data", "errorMsg" : err});  
                } else {
                    data =  !!data ? data._doc : data;
                    resolve(Object.assign({}, data));
                }
                self.closeConnection();
            });
        });
    };

    async read(query) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.init(); 
            self.DBModel.find(query,function(err, data) {
                if(err) {
                    reject({"error" : true, "message" : "Error fetching data", "errorMsg" : err});  
                } else {
                    resolve(data);
                }
                self.closeConnection();
            });
        });
    }

    async count(query) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.init(); 
            self.DBModel.countDocuments(query, function(err, c){
                if(err) {
                    reject({"error" : true, "message" : "Error fetching data", "errorMsg" : err});  
                } else {
                    resolve(c);
                }
                self.closeConnection();
            });
        });
    }

    async readOne(query) {
        this.init();
        var self = this;
        return new Promise(function(resolve, reject) { 
                self.DBModel.findOne(query,function(err, data){
                if(err) {
                    reject({"error" : true,"message" : "Error fetching data", "errorMsg" : err});  
                } else {
                    data = !!data && !!data._doc ? data._doc : data;
                    resolve(data);
                }
                self.closeConnection();
            });
        });
    }

    async readById(id) {
        this.init();
        var self = this;
        return new Promise(function(resolve, reject) {
            self.DBModel.findById(id, function (err, data) {
                if(err) {
                    reject({"error" : true,"message" : "Error updating data", "errorMsg" : err});  
                } else {
                    resolve(Object.assign({}, data));
                }
                self.closeConnection();
            });
        });
    }

    async update(query, body) {
        var self = this;
        this.newJson = {};
        
        body = this.sanitizeData(body);
        body = this.JSONFlatten({... body});
        
        this.init();
        return new Promise(function(resolve, reject) {
            self.DBModel.updateOne(query, body, function(err, data) {
                if(err) {
                    if(err.name === "CastError") {
                        reject({"error" : true, "data" : data, "type" : err.name, "path" : err.path});  
                    } else {
                        reject({"error" : true, "data" : data, "type" : err.name}); 
                    }
                } else {
                    resolve({"body" : body, "data" : data});
                }
                self.closeConnection();
            });
        });

    }

    async updateById(id, body) {
        body = this.sanitizeData(body);
        var self = this;
        this.init();
        return new Promise(function(resolve, reject) {
            self.DBModel.findOneAndUpdate(id, body, function(err, data) {
                if(err) {
                    reject({"error" : true, "data": err});  
                } else {
                    resolve(Object.assign({}, body));
                }
                self.closeConnection();
            });
        });
 
     }

     async delete(query, callback) {
        let self = this;
        let response;
        return new Promise(function(resolve, reject) {
            self.init();
            self.DBModel.find(query,function(err, dbModel) {
                if(err) {
                    reject({"error" : true, "message" : "Error fetching data", "errMsg" : err});
                } else {
                    self.DBModel.deleteMany(query, function(err, res){
                        if(err) {
                            reject({"error" : true, "message" : "Error deleting data", "errorMsg" : err});  
                        } else {
                            resolve(Object.assign(query,{"error" : false, "deleteCount": res.deletedCount, "message" : "Delete success."}));
                        }
                    });
                }
                self.closeConnection();
            });
        });
    }

    closeConnection() {
        this.db.close();
    }
};

module.exports = BaseModel;
