const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expense-tracker', process.env.DB_USER_NAME, process.env.DB_USER_PASSWORD, {
    dialect: 'mysql',
     host: 'localhost'
    });

    module.exports = sequelize;