let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../src/middleware');


describe('Get user last login', () => {
    it('it should GET all the users last login', (done) => {
        chai.request(server)
            .get('/user/user1')
            .end((err, res) => {
                console.log(res.body);
                (res).should.have.status(200);
                (res.body).should.be.a('object');
                done();
            });
    });
});