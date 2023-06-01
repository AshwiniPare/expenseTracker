const Expense = require('../models/expense');
const User = require('../models/user');

exports.getUserLeaderBoard = async(req, res) => {
    try {
        console.log('inside showleaderboard');
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId])
                userAggregatedExpenses[expense.userId] += expense.amount;
            else
                userAggregatedExpenses[expense.userId] = expense.amount;
        })

        let userLeaderBoardDetails = [];
        users.forEach((user) => {
            if(!userAggregatedExpenses[user.id])
                userAggregatedExpenses[user.id] = 0;
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] })
        })

        userLeaderBoardDetails.sort((a,b) => b.total_cost  - a.total_cost);
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails);
    } catch(error) {
        console.log(error);
        res.status(500).json(error)
    }
}