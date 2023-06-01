const path = require('path');

const express = require('express');

const premiumController = require('../controllers/premium');

const authenticateMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticateMiddleware.authenticate, premiumController.getUserLeaderBoard);

module.exports = router;