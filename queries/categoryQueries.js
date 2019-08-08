const Pool = require('pg').Pool;
const pool = new Pool({
                          user: 'postgres',
                          host: 'localhost',
                          database: 'budget',
                          password: 'MxM64B7FEM8ReBigg1',
                          port: 5439
                      });

const getCategories = (request, response) => {
    pool.query('SELECT * FROM t_category', (error, results) => {
        if (error) {
            throw error;
        }
        console.log(results.rows);
        response.status(200).json(results.rows);
    });
};

const createCategory = (request, response) => {
    const {name, parentId} = request.body;
    console.log(request.body);

    pool.query('INSERT INTO t_category (name, id_parent) VALUES ($1, $2) RETURNING id', [
        name,
        parentId
    ], (error, results) => {
        if (error) {
            response.status(400).send();
            return;
        }
        response.status(201).json(`{"id": ${results.rows[0].id}}`);
    });
};

const deleteCategory = (request, response) => {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        console.error('Erreur impossible de supprimer la categorie avec un id NaN');
        return;
    }

    pool.query('DELETE FROM t_category WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).send();
            throw error;
        }
        response.status(200).send(`{"id": ${id}}`);
    });
};

const updateCategory = (request, response) => {
    const id = parseInt(request.params.id);
    const {name, parentId} = request.body;
    console.log(name, parentId);

    pool.query('UPDATE t_category SET name = $2, id_parent = $3 WHERE id = $1', [
        id,
        name,
        parentId
    ], (error, results) => {
        if (error) {
            response.status(400).send();
            throw error;
        }
        response.status(200).send(`{"id": ${id}}`);
    });
};

const getCategoryById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM t_category WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).send();
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    getCategoryById
};
