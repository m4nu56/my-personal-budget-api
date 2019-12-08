const express = require('express');
const router = express.Router();
const db = require('../queries/categoryQueries');

router.get('/', db.getCategories);
router.post('/', db.createCategory);
router.delete('/:id', db.deleteCategory);
router.patch('/:id', db.updateCategory);
router.get('/:id', db.getCategoryById);

module.exports = router;
