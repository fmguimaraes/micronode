var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
server = server.app;
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('Annotations', function() {
  it('should add a SINGLE annotation on /annotation POST', function(done) {
    chai.request(server)
        .post('/annotations')
        //.type('annotations')
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
    it('should read a SINGLE annotation on /annotation/:id GET', function(done) {
        var newAnnotation = new Annotation({
            // TODO : add SUCESS depend on annotation structure.
        });
        // TODO : save Annonation in Database
        newAnnotation.save(function(err, data) {
          chai.request(server)
            .get('/annotation/'+data.id)
            .end(function(err, res){
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              // TODO : add SUCESS depend on annotation structure.
              res.body._id.should.equal(data.id);
              done();
            });
        });
    });
});
