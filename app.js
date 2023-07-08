require('dotenv').config();
const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
//const sequelize = require('./util/database');
const mongoose = require('mongoose');

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders')
const ForgotPassword = require('./models/forgotPassword');
const cors = require('cors');
//const helmet = require('helmet');
//const morgan = require('morgan');

const app = express();

app.use(cors());

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const resetPasswordRoutes = require('./routes/resetPassword');
const { reset } = require('nodemon');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
{
  flags: 'a'
});

//app.use(helmet());
//app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req, res) => {
  console.log('url is....', req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`))
});

/*User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);*/

app.use(errorController.get404);

/*sequelize.sync().then(result => {
    console.log(result);
   // https.createServer({key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
});*/

mongoose
  .connect(
    'mongodb+srv://ashwini:ashwini@cluster0.jqkb0r6.mongodb.net/expenseTracker?retryWrites=true&w=majority'
  )
  .then(result => { 
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });