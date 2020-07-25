let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/middleware');
const User = require('../src/models/user.model');
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);



describe('Testing user auth', () => {
    const user = {
        first_name: 'testone',
        last_name: 'testone',
        username: 'testone',
        email: 'testone@gmail.com',
        password: 'hello1997',
        city: 'Cairo',
        date: '2020-07-16'
    };

    it('should not be able to log in if user does not exist', (done) => {
        agent.post('/login')
            .set('content-type', 'application/json')
            .send({ email: "err@err.com", password: "ay7aga" })
            .end((err, res) => {
                (res).should.have.status(401);
                done();
            });
    });

    // it('should be able to sign in given valid data', (done) => {
    //     User.create()
    //     agent.post('/login')
    //     .set('content-type', 'application/json')
    //     .send({ email: user.email, password: user.password })
    //     .end((err, res) => {
    //         (res).should.have.status(200);
    //         done();
    //     });
    // });

    it('should be able to signup', (done) => {
        agent
            .post("/signup")
            .set('content-type', 'application/json')
            .send(user)
            .end( async function (err, res) {
                await User.findOne({ where: { username: user.username } })
                    .then((addedUser) => {
                        addedUser.username.should.be.equal(user.username);
                        (res).should.have.status(200);
                    });
                // After asserting that user exists after signing up 
                // we delete the user to prevent having unnecessary data
                User.destroy({where: {username: user.username}})
                done();
            });
    });

    // it("should be able to logout", function(done) {
    //     agent.get("/logout").end(function(err, res) {
    //       res.should.have.status(200);
    //       agent.should.not.have.cookie("nToken");
    //       done();
    //     });
    //   });

    after(function () {
        agent.close()
    });
});

describe('Get user last login', () => {
    it('it should not GET last login dates if user does not exist', (done) => {
        chai.request(server)
            .get('/user/user1')     //username 
            .end((err, res) => {
                // console.log(res.body);
                (res).should.have.status(404);
                (res.body).should.be.a('object');
                done();
            });
    });
});