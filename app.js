const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Expense = require('./models/expense');
const User = require('./models/user');
const cors = require('cors');

const app = express();

app.use(cors());

//app.set('views', 'views');

const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/expense', expenseRoutes);
app.use('/user', userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

app.use(errorController.get404);

sequelize.sync().then(result => {
    console.log(result);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

