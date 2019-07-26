const express = require('express');
const router = express.Router();
const db = require('./movementQueries');

router.get('/', db.getMovements);
router.get('/:id', db.getMovementById);
router.post('/', db.createMovement);
router.delete('/:id', db.deleteMovement);
router.put('/:id', db.updateMovement);

module.exports = router;
