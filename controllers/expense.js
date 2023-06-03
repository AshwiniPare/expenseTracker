const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.getExpenses = async(req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: {userId: req.user.id}});
       //const expenses = await req.user.getExpenses();
        res.status(200).json({allExpenses: expenses});;

    } catch(error) {
        console.log('Get Expenses is failing '+ JSON.stringify(error));
        res.status(500).json({ error: error});
    }
};

exports.postExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const amount = req.body.amount;
        const desc = req.body.desc;
        const category = req.body.category;
        const userId = req.user.id;

        if(amount === undefined || stringInvalid(desc) || stringInvalid(category)) {
            return res.status(400).json({success: false, message:'Input missing'});
        }
       const data = await Expense.create( {amount: amount, desc: desc, category: category, userId: userId}, {transaction: t});
       const totalExpenses = Number(req.user.totalExpenses) + Number(amount)
       console.log("totalExpenses is...."+totalExpenses);
       await User.update({ totalExpenses: totalExpenses}, { where: {id: req.user.id}, transaction: t});
       await t.commit();
        res.status(201).json({newExpenseDetail: data, success: true});
    } catch(err) {
        await t.rollback();
        res.status(500).json({error: err, success: false})
    }
};

exports.deleteExpense = async(req, res, next) => {
    const t = await sequelize.transaction();
    try {
        console.log('inside delete');
        if(req.params.id == 'undefined') {
            console.log('Id is missing');
            return res.status(404).json({err: 'Id is missing'});
        }
        const expenseId = req.params.id;
        const expense = await Expense.findByPk(expenseId);
        const totalExpenses = Number(req.user.totalExpenses) -Number(expense.amount);
   
        const noOfRows = await Expense.destroy({where: {id: expenseId, userId: req.user.id},transaction: t});
        
       const result = await User.update({ totalExpenses: totalExpenses}, { 
        where: {
            id: req.user.id
        }, transaction: t
        });


       console.log(result);
        if(noOfRows === 0)
            return res.status(404).json({success: false, message: 'Expense does not belong to the user'});
        await t.commit();
        res.sendStatus(200);
    } catch(error) {
        await t.rollback();
        console.log('Delete user is failing '+ JSON.stringify(error));
        res.status(500).json({success: false, message: 'Failed'});
    }
};