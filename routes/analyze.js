const express = require('express');
const db = require('../queries/movementQueries');
const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const result = await db.analyzeMovementByMonthByCategory();
        response.status(200).send(result.rows);
    } catch (e) {
        throw e;
    }
});

router.get('/summary', async (request, response) => {
    try {
        const result = await db.analyzeMovementByMonthByCategory();

        let summary = [];
        result.rows.forEach(row => {

            if (!summary.find(s => s.category === row.id_category)) {
                summary.push({
                    category: row.id_category,
                    data: []
                });
            }
            summary
            .find(s => s.category === row.id_category)
            .data
            .push(row);
        });

        // let body = JSON.stringify(Array.from(summary.entries()));
        console.log(summary);
        response.status(200).json(summary);

    } catch (e) {
        throw e;
    }

});

module.exports = router;
