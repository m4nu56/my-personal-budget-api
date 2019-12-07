const moment = require('moment');

const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

function buildQueryGetAllFromMovements () {
    return 'SELECT M.id::integer, year, month, date, amount, label, C.id::integer AS category_id, C.name as category_name, C.id_parent::integer AS category_id_parent '
           + 'FROM t_movement M '
           + 'JOIN t_category C ON C.id=M.id_category';
}

/**
 * Constructor pattern to create a new Movement()
 * @param id
 * @param year
 * @param month
 * @param date
 * @param amount
 * @param label
 * @param category_id
 * @param category_name
 * @param category_id_parent
 */
function movement ({id, year, month, date, amount, label, category_id, name: category_name, id_parent: category_id_parent}) {
    this.id = id;
    this.year = year;
    this.month = month;
    this.date = date;
    this.amount = amount;
    this.label = label;
    this.category = {
        id: category_id,
        name: category_name,
        id_parent: category_id_parent
    };
}

const getMovements = (request, response) => {
    let query = buildQueryGetAllFromMovements();
    let requestParameters = null;
    if (request.query.category
        !== undefined) {
        query += ' WHERE id_category = $1';
        requestParameters = [request.query.category];
    }
    query += ' ORDER BY M.id ASC';
    pool.query(query, requestParameters, (error, results) => {
        if (error) {
            throw error;
        }
        let movements = [];
        results.rows.forEach(m => movements.push(new movement(m)));
        response.status(200).json(movements);
    });
};

const getMovementById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query(buildQueryGetAllFromMovements()
               + ' WHERE M.id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(new movement(results.rows[0]));
    });
};

const createMovement = (request, response) => {
    const {date, amount, label, category} = request.body;

    console.log(date, moment(date), moment(date).format('D'), moment(date).format('M'));

    pool.query('INSERT INTO t_movement (year, month, date, amount, label, id_category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [
        Number(moment(date).format('YYYY')),
        Number(moment(date).format('M')),
        date,
        amount,
        label,
        category.id
    ], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`{"id": ${results.rows[0].id}}`);
    });
};

const updateMovement = (request, response) => {
    const id = parseInt(request.params.id);
    const {date, amount, label, category} = request.body;

    pool.query('UPDATE t_movement SET year = $2, month = $3, date= $4, amount= $5, label= $6, id_category = $7 WHERE id = $1', [
        id,
        moment(date, 'X').format('DD'),
        moment(date, 'X').format('MM'),
        date,
        amount,
        label,
        category.id
    ], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`{"id": ${id}}`);
    });
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
    const query = 'select year, month, id_category, round(sum(amount)::numeric, 2) as total\n'
                  + 'from t_movement\n'
                  + 'group by year, month, id_category\n'
                  + 'order by year, month, id_category\n';

    return pool.query(query);
};

module.exports = {
    getMovements,
    getMovementById,
    createMovement,
    updateMovement,
    deleteMovement,
    analyzeMovementByMonthByCategory
};
