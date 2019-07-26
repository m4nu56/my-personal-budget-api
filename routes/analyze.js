const express = require('express');
const db = require('./movementQueries');
const router = express.Router();

router.get('/', db.analyzeMovementByMonthByCategory);

module.exports = router;
