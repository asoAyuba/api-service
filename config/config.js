const path = require('path');

const config = {
    development: {
        dbPath: path.resolve(__dirname, '../db/development.sqlite'),
        port: 3000,
        baseURL: 'http://localhost:3000'
    },
    production: {
        dbPath: path.resolve(__dirname, '../db/production.sqlite'),
        port: 8000,
        baseURL: 'https://api.tuservicio.com'
    }
};


// Detectar el entorno actual
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
