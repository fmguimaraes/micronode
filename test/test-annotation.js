var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server').app;
var ObjectID = require('mongodb').ObjectID;

let should = chai.should();
let expect = chai.expect;

let Annotation = require('../../models/annotation');

chai.use(chaiHttp);

describe('Annotations', function() {
    it('should add a SINGLE annotation on /annotations POST', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab" }/* TODO : add JSON depend on annotation structure */)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('test');
                res.body.SUCCESS.test.should.equal('dab');
                // TODO : add SUCESS depend on annotation structure.
                done();
            });
    });

    it('shouldn\'t add a SINGLE annotation on /annotations POST if duplicate', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab" }/* TODO : add JSON depend on annotation structure */)
            .end(function(err, res) {
                res.should.have.status(409);
                res.should.be.json;
                res.body.should.have.property('message');
                res.body.message.should.equal('annotation already exists');
                done();
            });
    });

    it('should read a SINGLE annotation on /annotation/:id GET', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab2" }/* TODO : add JSON depend on annotation structure */)
            .end(function(err, data) {
                var newAnnotationId = data.body.SUCCESS._id;
                console.log(newAnnotationId);
                chai.request(server)
                    .get('/annotation/'+newAnnotationId)
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('test');
                        res.body.test.should.equal('dab2');
                        // TODO : add tests depend on annotation structure.
                        res.body._id.should.equal(newAnnotationId);
                        done();
                    });
            });
    });

    it('shouldn\'t read a SINGLE annotation on /annotation/:id GET if annotation doesn\'t exist', function(done) {
        var annotationId = new ObjectID("000000000001");
        chai.request(server)
            .get('/annotation/'+annotationId)
            .end(function(err, res){
                res.should.have.status(404);
                res.should.be.json;
                done();
            });
    });

    it('should update a SINGLE annotation on /annotation/<id> PUT', function(done) {
        var updatedField = "updated";
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab3" }/* TODO : add JSON depend on annotation structure */)
            .end(function(err, data) {
                var newAnnotationId = data.body.SUCCESS._id;
                chai.request(server)
                    .put('/annotation/'+newAnnotationId)
                    .send({ test: updatedField })/* TODO : add JSON depend on annotation structure */
                    .end(function(error, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('test');
                        res.body._id.should.equal(newAnnotationId);
                        res.body.test.should.equal(updatedField);
                        done();
            });
        });
    });

    it('shouldn\'t update a SINGLE annotation on /annotation/:id PUT if annotation doesn\'t exist', function(done) {
        var annotationId = new ObjectID("000000000001");
        chai.request(server)
            .put('/annotation/'+annotationId)
            .end(function(err, res){
                res.should.have.status(404);
                res.should.be.json;
                done();
            });
    });
        
    it('should delete a SINGLE annotation on /annotation/<id> DELETE', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab4" }/* TODO : add JSON depend on annotation structure */)
            .end(function(err, data) {
                var newAnnotationId = data.body.SUCCESS._id;
                chai.request(server)
                    .delete('/annotation/'+newAnnotationId)
                    .end(function(error, res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('error');
                        res.body.should.have.property('message');
                        res.body._id.should.equal(newAnnotationId);
                        res.body.error.should.equal(false);
                        res.body.message.should.equal('Delete success.');
                        done();
            });
        });
    });

    it('shouldn\'t delete a SINGLE annotation on /annotation/:id DELTE if annotation doesn\'t exist', function(done) {
        var annotationId = new ObjectID("000000000001");
        chai.request(server)
            .delete('/annotation/'+annotationId)
            .end(function(err, res){
                res.should.have.status(404);
                res.should.be.json;
                done();
            });
    });
});
