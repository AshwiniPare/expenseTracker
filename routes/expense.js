const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.get('/get-expenses', expenseController.getExpenses);

router.post('/add-expense', expenseController.postExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

module.exports = router;