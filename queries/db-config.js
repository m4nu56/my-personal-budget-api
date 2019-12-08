const dotenv = require('dotenv');
dotenv.config();
const Pool = require('pg').Pool;

// const postgresConfig = {
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     connectionTimeoutMillis: 0,
//     idleTimeoutMillis: 10000,
//     max: 10
// };
const postgresConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL ? process.env.DATABASE_SSL === "true" : true
};
console.log(postgresConfig);

let pool;
const getPool = () => {
    if (!pool) {
        console.log(`initiated new pool`);
        pool = new Pool(postgresConfig);

        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query('SELECT NOW()', (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack);
                }
                console.log(result.rows);
            });
        });

    }
    return pool;
};

const endPool = () => {
    if (!pool) {
        console.log(`endPool but pool is undefined.. `);
        return;
    }
    pool.end(() => {
        console.log(`ended pool`);
        pool = undefined;
    });
};

module.exports = {
    getPool,
    endPool
};
