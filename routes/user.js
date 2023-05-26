const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

//router.get('/get-expenses', expenseController.getExpenses);

router.post('/add-user', userController.postUser);

//router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;