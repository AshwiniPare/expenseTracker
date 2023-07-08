const Razorpay = require("razorpay");
const Order = require('../models/orders');
const User = require('../models/user');
const userController = require('../controllers/user');

exports.purchasePremium = async(req, res) => {
    try{
        console.log('RAZORPAY_KEY_ID is  '+process.env.RAZORPAY_KEY_ID);
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({ amount:amount, currency: 'INR'}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            
         Order.create({userId: req.user.id, orderId: order.id, status: "PENDING"})
            .then(() => {
                return res.status(201).json({ order_id: order.id, key_id: rzp.key_id});
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    }catch(err) {
        console.log(err);
        res.status(401).json({message: 'Something went wrong', error: err})
    }
}

exports.updatetransactionstatus = async (req, res) => {
    try {
        const {payment_id, order_id} = req.body;
        const promise1 = Order.findOneAndUpdate({orderId: order_id}, {paymentId: payment_id, status: "SUCCESSFUL"} )
        const promise2 = User.findByIdAndUpdate(req.user.id, { isPremiumUser: true})

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: true, message: "Transaction Successful", token: userController.generateAccessToken(req.user.id, req.user.name, true) });
        }).catch((error) => {
            throw new Error(error)
        })
    } catch(error) {
        console.error(error);
        res.status(403).json({ error: error, message: 'Something went wrong in payment update'})
    }
}

exports.updatefailedtransactionstatus = async (req, res) => {
    try {
        const order_id = req.body.order_id;
       await Order.findByIdAndUpdate(order_id, { status: "FAILED"})
        return res.status(202).json({ success: true, message: "Transaction Successful"});
    }catch(err) {
        console.error(err);
        res.status(403).json({ error: err, message: 'Something went wrong in payment update'})
    }
}