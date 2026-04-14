const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Testando a conexão ao iniciar
pool.connect()
    .then(() => console.log('Conectado ao PostgreSQL com sucesso! 🐘'))
    .catch(err => console.error('Erro ao conectar ao banco de dados:', err.stack));

module.exports = pool;