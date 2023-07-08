const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  active: {
    type: Boolean
  },
  expiresBy: {
    type: Date
  }
 
});
module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);