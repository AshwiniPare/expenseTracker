const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number
  },
  desc: {
    type: String
  },
  category: {
    type: String
  }
 
});
module.exports = mongoose.model('Expense', expenseSchema);
