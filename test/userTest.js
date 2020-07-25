let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/middleware');
const User = require('../src/models/user.model');
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);



describe('Testing User Functions', () => {
    const user = {
        first_name: 'testone',
        last_name: 'testone',
        username: 'testone',
        email: 'testone@gmail.com',
        password: 'hello1997',
        city: 'Cairo',
        date: '2020-07-16'
    };

    before((done) => {
        agent
            .post('/signup')
            .set('content-type', 'application/json')
            .send(user)
            .then((res) => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should not be able to log in if user does not exist', (done) => {
        agent.post('/login')
            .set('content-type', 'application/json')
            .send({ email: "err@err.com", password: "ay7aga" })
            .end((err, res) => {
                (res).should.have.status(401);
                done();
            });
    });

    it('should be able to sign in given valid data', (done) => {
        agent.post('/login')
            .set('content-type', 'application/json')
            .send({ email: user.email, password: user.password })
            .end((err, res) => {
                (res).should.have.status(200);
                agent.should.have.cookie("user_sid");
                done();
            });
    });

    it('should be able to signup', (done) => {
        const newUser = {
            first_name: 'test',
            last_name: 'test',
            username: 'test',
            email: 'test@gmail.com',
            password: 'hello1997',
            city: 'Cairo',
            date: '2020-07-16'
        };

        agent
            .post("/signup")
            .set('content-type', 'application/json')
            .send(newUser)
            .end(async (err, res) => {
                await User.findOne({ where: { username: newUser.username } })
                    .then((addedUser) => {
                        addedUser.username.should.be.equal(newUser.username);
                        (res).should.have.status(200);
                    });
                // After asserting that user exists after signing up 
                // we delete the user to prevent having unnecessary data
                User.destroy({ where: { username: newUser.username } })
                done();
            });
    });

    it("should be able to logout", (done) => {
        agent.get("/logout").end((err, res) => {
            res.should.have.status(200);
            agent.should.not.have.cookie("user_sid");
            done();
        });
    });

    it('it should not GET last login dates if user does not exist', (done) => {
        chai.request(server)
            .get('/user/user1')     //username 
            .end((err, res) => {
                (res).should.have.status(404);
                (res.body).should.be.a('object');
                done();
            });
    });

    it('it should GET last login dates for user by username', (done) => {
        chai.request(server)
            .get(`/user/${user.username}`)     //username 
            .end((err, res) => {
                console.log(res.body);
                (res).should.have.status(200);
                (res.body).should.be.a('object');
                done();
            });
    });

    after((done) => {
        agent.close();
        User.destroy({ where: { username: user.username } })
            .then((res) => {
                done()
            }).catch((err) => {
                done(err);
            });
    });
});