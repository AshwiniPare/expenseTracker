const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/get-expenses', userAuthentication.authenticate,expenseController.getExpenses);

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

module.exports = router;