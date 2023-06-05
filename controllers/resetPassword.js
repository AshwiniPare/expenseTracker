/*const Sib = require('sib-api-v3-sdk');

//require('dotenv').config();


exports.forgotpassword = (req, res) => {
    try {
         console.log('inside forgot password '+req.body.email);
         const {email} = req.body.email;
         const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SENGRID_API_KEY
        const tranEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
            email: 'yj.rocks.2411@gmail.com'
        }

        const receivers = [
            {
                email: email,
                name: 'Ashwini'
            },
        ]

        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Subscribed to mail',
            textContent:  `hi from mail`
        }).then(console.log)
        .catch(console.log)
}
catch(err) {

}
}*/

//const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
//const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async (req, res) => {
    try {
        const email=  req.body.email;
        const user = await User.findOne({where : { email }});
        if(user){
           /* const id = uuid.v4();
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })
*/
            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: 'ashwinipbhatt@gmail.com', // Change to your recipient
                from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
              //  html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}