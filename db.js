const sqlite3 = require('sqlite3').verbose();
const config = require('./config/config');

const db = new sqlite3.Database(config.dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log(`Conectado a la base de datos en: ${config.dbPath}`);
        // Tabla de usuarios
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                }
            }
        );

        // Tabla de protectoras
        db.run(
            `CREATE TABLE IF NOT EXISTS protectoras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                address TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating protectoras table:', err.message);
                }
            }
        );

        // Relación usuarios-protectoras
        db.run(
            `CREATE TABLE IF NOT EXISTS user_protectora (
                user_id INTEGER,
                protectora_id INTEGER,
                PRIMARY KEY (user_id, protectora_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (protectora_id) REFERENCES protectoras(id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating user_protectora table:', err.message);
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS colonias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                location TEXT,
                protectora_id INTEGER,
                FOREIGN KEY (protectora_id) REFERENCES protectoras(id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating colonias table:', err.message);
                }
            }
        );

        // Relación usuarios-colonias
        db.run(
            `CREATE TABLE IF NOT EXISTS user_colonia (
                user_id INTEGER,
                colonia_id INTEGER,
                PRIMARY KEY (user_id, colonia_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (colonia_id) REFERENCES colonias(id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating user_colonia table:', err.message);
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS gatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER,
                description TEXT,
                colonia_id INTEGER,
                adopted_date TEXT,
                adopted INTEGER DEFAULT 0,
                adoptable INTEGER DEFAULT 0,
                FOREIGN KEY (colonia_id) REFERENCES colonias(id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating gatos table:', err.message);
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS voluntarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                address TEXT NOT NULL,
                role TEXT CHECK(role IN ('casa de acogida', 'voluntario')) NOT NULL,
                nif TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                protectora_id INTEGER NOT NULL,
                FOREIGN KEY (protectora_id) REFERENCES protectoras(id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating voluntarios table:', err.message);
                }
            }
        );
    }
});

module.exports = db;

