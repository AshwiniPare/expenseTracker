const Expense = require('../models/expense');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.getExpenses = async(req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({allExpenses: expenses});;

    } catch(error) {
        console.log('Get Expenses is failing '+ JSON.stringify(error));
        res.status(500).json({ error: error});
    }
};

exports.postExpense = async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const desc = req.body.desc;
        const category = req.body.category;

        if(amount === undefined || stringInvalid(desc) || stringInvalid(category)) {
            return res.status(400).json({success: false, message:'Input missing'});
        }

        const data = await Expense.create( {amount: amount, desc: desc, category: category});
        res.status(201).json({newExpenseDetail: data, success: true});
    } catch(err) {
        res.status(500).json({error: err, success: false})
    }
};

exports.deleteExpense = async(req, res, next) => {
    try {
        console.log('inside delete');
        if(req.params.id == 'undefined') {
            console.log('Id is missing');
            return res.status(404).json({err: 'Id is missing'});
        }
        const expenseId = req.params.id;
        await Expense.destroy({where: {id: expenseId}});
        res.sendStatus(200);
    } catch(error) {
        console.log('Delete user is failing '+ JSON.stringify(error));
        res.status(500).json({ error: error});
    }
};