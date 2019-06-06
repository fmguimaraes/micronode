var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server').app;

let should = chai.should();
let expect = chai.expect;

let Annotation = require('../../models/annotation');

chai.use(chaiHttp);

describe('Annotations', function() {
    it('should add a SINGLE annotation on /annotation POST', function(done) {
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

    /*
    it('should read a SINGLE annotation on /annotation/:id GET', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab2" }/* TODO : add JSON depend on annotation structure /)
            .end(function(err, data) {
                var newAnnotationId = data.body.SUCCESS._id;
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
    

    it('should update a SINGLE annotation on /annotation/<id> PUT', function(done) {
        var annotationId = "TODO ADD AN ID WHO EXIST ON TEST DATABASE";
        chai.request(server)
            .put('/blob/'+annotationId)
            .send({/* TODO : add JSON depend on annotation structure./})
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('UPDATED');
                response.body.UPDATED.should.be.a('object');
                response.body.UPDATED.should.have.property('name');
                response.body.UPDATED.should.have.property('_id');
                // TODO : add tests depend on annotation structure.
                done();
            });
        });
        */

    it('should delete a SINGLE annotation on /annotation/<id> DELETE', function(done) {
        chai.request(server)
            .post('/annotations')
            .send({ test: "dab2" }/* TODO : add JSON depend on annotation structure */)
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
});
