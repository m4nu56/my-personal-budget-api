const express = require('express');
const db = require('./movementQueries');
const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const result = await db.analyzeMovementByMonthByCategory(request, response);
        response.status(200).send(result.rows);
    } catch (e) {
        throw e;
    }
});

router.get('/summary', async (request, response) => {
    try {
        const result = await db.analyzeMovementByMonthByCategory(request);

        let summary = new Map();
        result.rows.forEach(row => {

            if (!summary.has(row.category)) {
                summary.set(row.category, []);
            }
            summary.get(row.category).push(row);
        });

        let body = JSON.stringify(Array.from(summary.entries()));
        response.status(200).json(body);

    } catch (e) {
        throw e;
    }

});

module.exports = router;
