const User = require('../models/user.model');
const redis = require('redis');

let client = redis.createClient();

client.on('connect', function () {
    console.log('Connected to Redis...');
});


const validateInput = (body) => {
    let error = {};

    for (let key in body) {
        if (body[key] === "") {
            error[key] = key + " can't be empty";
        }
    }

    if (Object.keys(error).length === 0) {
        return null;
    } else {
        return error;
    }
}

const userController = {};

userController.addUser = (req, res) => {
    console.log(req.body);

    // check that all inputs are not empty
    const validationErr = validateInput(req.body);

    if (validationErr !== null) {
        return res.send({ error: validationErr });
    }

    User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        city: req.body.city,
        date_of_birth: req.body.date,
    })
        .then(user => {
            console.log(user);
            res.redirect('/login');
        })
        .catch(error => {
            console.log(error);
            res.send({ error: error.errors[0] })
        });
}

userController.login = (req, res) => {
    const email = req.body.email,
        password = req.body.password;

    const validationErr = validateInput(req.body);

    if (validationErr !== null) {
        return res.send({ error: validationErr });
    }

    User.findOne({ where: { email: email } }).then(function (user) {
        if (!user) {
            res.send({
                error: "There is no user with that email"
            })
            // res.redirect('/login');
        } else if (!user.validPassword(password)) {
            res.send({
                error: "You entered a wrong password"
            })
            // res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            let username = user.username;

            //Today's date
            let ts = Date.now();
            let date_ob = new Date(ts);
            client.rpush(username, date_ob);

            res.redirect('/home');
        }
    });
}

userController.logout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}

userController.getUserLastLogin = (req, res) => {
    let username = req.params.username;

    User.findOne({ where: { username: username } }).then((user) => {
        if (!user) {
            res.send({
                error: 'This user does not exist'
            })
        }
        else {
            client.lrange(user.username, 0, -1, function (err, reply) {
                if (reply.length === 0) {
                    res.send({
                        error: 'This user has not logged in yet'
                    })
                }
                else {
                    res.send({
                        lastLogin: reply
                    })
                }
            });
        }
    });
}

module.exports = userController;