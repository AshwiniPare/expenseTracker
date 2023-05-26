const User = require('../models/user');
const bcrypt = require('bcrypt');

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
            return res.status(400).json({success: false, message: "Bad parameters. Some details are missing"});

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            console.log(err);
            await User.create( {name: name, email: email, password: hash});
            res.status(201).json({success: true, message: "Successfully created new user"});
        })
    } catch(err) {
        return res.status(500).json({message: err})
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        console.log('inside post');
 
        const email = req.body.email;
        const password = req.body.password;

        if(stringInvalid(email) || stringInvalid(password))
            return res.status(400).json({message: "Email id or password is  missing", success: false});

        const user = await User.findAll({ where: { email: email }})
        if( user.length > 0 ) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err)
                    throw new Error ('Something went wrong')
                if(result === true)
                    return res.status(200).json({success: true, message: "User logged in successfully"})
                else    
                    return res.status(400).json({success: false, message: "Password is incorrect"})
            })
        } else {
            return res.status(404).json({success: false, message: "User does not exist"})   
        }
       
    } catch(err) {
        return res.status(500).json({success: false, message: err})
    }
};