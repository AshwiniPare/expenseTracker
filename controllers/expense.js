const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const s3Services=require('../services/s3services');
const converter= require('json-2-csv');

function stringInvalid(string) {
    if( string == undefined || string.length === 0 )
     return true;
     
    return false;
}

exports.getExpenses = async(req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const ITEMS_PER_PAGE = +req.query.limit || 2;

        let totalItems = await Expense.count({where: {userId: req.user.id}});
        const expenses = await Expense.findAll({ 
            where: {userId: req.user.id}, 
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
       //const expenses = await req.user.getExpenses();
        res.status(200).json({
            allExpenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });

    } catch(error) {
        console.log('Get Expenses is failing '+ JSON.stringify(error));
        res.status(500).json({ error: error});
    }
}

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

exports.downloadExpenses=async(req,res,next)=>{
    try {
        const user=req.user;
        const expenseResponse=await user.getExpenses();
        const expenses=[]

        expenseResponse.forEach(expense => {
         const {date,month,year,...rest}=expense.dataValues;
         const formattedMonth=new Date(year,month).toLocaleString('en-Us',{month:'long'});
         expenses.push({month:formattedMonth,date,year,...rest});
        });
       
      const csv=await converter.json2csv(expenses);
      const fileName=`Expense/${user.name}/${new Date()}.csv`;
      console.log('filename is ........', fileName);
      console.log('csv file is....',csv);
      const fileUrl=await s3Services.uploadTos3(csv,fileName);
     console.log('expenses is......');
      console.log(expenses);

      await user.createExpensefile({
        fileUrl:fileUrl
      })
      res.status(200).send({fileUrl:fileUrl});

    } catch (error) {
        console.log(error);
         res.status(500).send(error)
    }
}
