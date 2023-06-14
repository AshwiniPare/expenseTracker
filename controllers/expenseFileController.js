const ExpenseFile=require('../models/expense');
const s3Services=require('../services/s3Services');
const converter= require('json-2-csv');

//require('dotenv').config();

exports.downloadReport=async(req,res,next)=>{
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
      const fileUrl=await s3Services.uploadTos3(csv,fileName);
    //   console.log(fileUrl);
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