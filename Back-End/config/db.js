const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
// error handling
pool.connect()
    .then(() => console.log('successful connection to PostgreSQL'))
    .catch(err => console.error('error', err.stack));

module.exports = {
// sql injection protection, parametrised queries
    query: (text, params) => pool.query(text, params),
};