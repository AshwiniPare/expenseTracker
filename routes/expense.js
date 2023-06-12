const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');
const expenseFileController = require('../controllers/expenseFileController');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/get-expenses', userAuthentication.authenticate,expenseController.getExpenses);

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpense);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downloadExpenses)

module.exports = router;