const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async(req, res) => {
    try {
        console.log('inside showleaderboard');
        const leaderBoardUsers = await User.findAll({
           order:[['totalExpenses', 'DESC']]
        });
        res.status(200).json( leaderBoardUsers);
    } catch(error) {
        console.log(error);
        res.status(500).json(error)
    }
}