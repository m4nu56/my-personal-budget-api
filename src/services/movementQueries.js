import moment from 'moment';
import {getPool} from './db-config';

function buildQueryGetAllFromMovements() {
  return (
    'SELECT M.id::integer, year, month, date, amount, label, C.id::integer AS category_id, C.name as category_name, C.id_parent::integer AS category_id_parent ' +
    'FROM t_movement M ' +
    'JOIN t_category C ON C.id=M.id_category'
  );
}

/**
 * Constructor pattern to create a new Movement()
 */
function movement({ id, year, month, date, amount, label, category_id, category_name, category_id_parent }) {
  this.id = id;
  this.year = year;
  this.month = month;
  this.date = date;
  this.amount = amount;
  this.label = label;
  this.category_id = category_id;
}

export const getMovements = (request, response) => {
  let query = buildQueryGetAllFromMovements();
  let requestParameters = null;
  if (request.query.category !== undefined) {
    query += ' WHERE id_category = $1';
    requestParameters = [request.query.category];
  }
  query += ' ORDER BY M.id ASC';
  getPool().query(query, requestParameters, (error, results) => {
    if (error) {
      response.status(400).json(`Error finding movements: ${error.message}`);
      return;
    }
    response.status(200).json({
      total: results.rows.length,
      data: results.rows.map(m => new movement(m)),
    });
  });
};

export const getMovementById = (request, response) => {
  const id = parseInt(request.params.id);

  getPool().query(buildQueryGetAllFromMovements() + ' WHERE M.id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json(`Error finding a movement with ID ${id}: ${error.message}`);
      return;
    }
    if (results.rows.length === 0) {
      response.status(400).json(`Error finding a movement with ID ${id}`);
      return;
    }
    response.status(200).json(new movement(results.rows[0]));
  });
};

export const createMovement = (request, response) => {
  const { date, amount, label, category_id } = request.body;

  getPool().query(
    'INSERT INTO t_movement (year, month, date, amount, label, id_category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [Number(moment(date).format('YYYY')), Number(moment(date).format('M')), date, amount, label, category_id],
    (error, results) => {
      if (error) {
        response.status(400).json('Error creating a new movement: ' + error.message);
        return;
      }
      response.status(201).json(results.rows[0]);
    },
  );
};

export const updateMovement = (request, response) => {
  const id = parseInt(request.params.id);
  const { date, amount, label, category_id } = request.body;

  getPool().query(
    'UPDATE t_movement SET year = $2, month = $3, date= $4, amount= $5, label= $6, id_category = $7 WHERE id = $1',
    [id, moment(date, 'X').format('DD'), moment(date, 'X').format('MM'), date, amount, label, category_id],
    (error, results) => {
      if (error) {
        response.status(400).json('Error updating a movement: ' + error.message);
        return;
      }
      response.status(200).json({ id: id });
    },
  );
};

export const deleteMovement = (request, response) => {
  const id = parseInt(request.params.id);
  if (isNaN(id)) {
    console.error('Erreur impossible de supprimer le mouvement avec un id NaN');
    return;
  }

  getPool().query('DELETE FROM t_movement WHERE id = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json('Error deleting a new movement: ' + error.message);
      return;
    }
    response.status(200).json({ id: id });
  });
};

/**
 * Retourne les totaux par année/mois/category de tous les mouvements en base
 */
export const analyzeMovementByMonthByCategory = () => {
  const query =
    'select year, month, id_category, round(sum(amount)::numeric, 2) as total\n' +
    'from t_movement\n' +
    'group by year, month, id_category\n' +
    'order by year, month, id_category\n';

  return getPool().query(query);
};
