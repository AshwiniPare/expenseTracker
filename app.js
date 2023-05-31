require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/orders')
const cors = require('cors');

const app = express();

app.use(cors());

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);
app.use('/purchase', purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use(errorController.get404);

sequelize.sync().then(result => {
    console.log(result);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

