const moment = require('moment');

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'budget',
    password: 'MxM64B7FEM8ReBigg1',
    port: 5439
});

function buildQueryGetAllFromMovements() {
    return 'SELECT id::integer, year, month, date, amount, label, category FROM t_movement';
}

const getMovements = (request, response) => {
    let query = buildQueryGetAllFromMovements();
    let requestParameters = null;
    if (request.query.category !== undefined) {
        query += ' WHERE category = $1';
        requestParameters = [request.query.category];
    }
    query += ' ORDER BY id ASC';
    pool.query(query, requestParameters, (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results.rows);
        response.status(200).json(results.rows);
    });
};

const getMovementById = (request, response) => {
    console.log(request.query);
    console.log(request.params);
    const id = parseInt(request.params.id);

    pool.query(buildQueryGetAllFromMovements() + ' WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createMovement = (request, response) => {
    const {date, amount, label, category} = request.body;

    console.log(date, moment(date), moment(date).format('D'), moment(date).format('M'));

    pool.query(
        'INSERT INTO t_movement (year, month, date, amount, label, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [Number(moment(date).format('YYYY')), Number(moment(date).format('M')), date, amount, label, category],
        (error, results) => {
            if (error) {
                throw error;
            }
            console.log(results.rows);
            response.status(201).send(`{
                "id": ${results.rows[0].id}
            }`);
        }
    );
};

const updateMovement = (request, response) => {
    const id = parseInt(request.params.id);
    const {date, amount, label, category} = request.body;

    pool.query(
        'UPDATE t_movement SET year = $2, month = $3, date= $4, amount= $5, label= $6, category = $7 WHERE id = $1',
        [id, moment(date, 'X').format('DD'), moment(date, 'X').format('MM'), date, amount, label, category],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`{
                "id": ${id}
            }`);
        }
    );
};

const deleteMovement = (request, response) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        console.error('Erreur impossible de supprimer le mouvement avec un id NaN');
        return;
    }

    pool.query('DELETE FROM t_movement WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`{"id": ${id}}`);
    });
};

/**
 * Retourne les totaux par année/mois/category de tous les mouvements en base
 * @param request
 * @param response
 */
const analyzeMovementByMonthByCategory = (request, response) => {
    const query = 'select year, month, category, round(sum(amount)::numeric, 2) as total\n' +
        'from t_movement\n' +
        'group by year, month, category\n' +
        'order by year, month, category\n';

    pool.query(query, (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).send(result.rows);
    });
};

module.exports = {
    getMovements,
    getMovementById,
    createMovement,
    updateMovement,
    deleteMovement,
    analyzeMovementByMonthByCategory
};
