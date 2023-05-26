const User = require('../models/user');

exports.postUser = async (req, res, next) => {
    try {
        console.log('inside post');
        if(!req.body.name) {
            throw new Error('Name is mandatory');
        }
        if(!req.body.email) {
            throw new Error('Email is mandatory');
        }
        if(!req.body.password) {
            throw new Error('Password is mandatory');
        }
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create( {name: name, email: email, password: password});
        res.status(201).json({newUserDetail: data});
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
};