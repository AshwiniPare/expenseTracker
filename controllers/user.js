const User = require('../models/user');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.postUser = async (req, res, next) => {
    try {
        console.log('inside post');
  
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(stringInvalid(name) || stringInvalid(email) || stringInvalid(password))
            return res.status(400).json({err: "Bad parameters. Some details are missing"});

        const data = await User.create( {name: name, email: email, password: password});
        res.status(201).json({messsage: 'Successfully created new user'});
    } catch(err) {
        res.status(500).json({
            error: err
        })
    }
};