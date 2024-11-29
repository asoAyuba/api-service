const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// SECRET KEY para JWT
const SECRET_KEY = 'supersecretkey';

// Crear usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'Usuario ya existe.' });
                }
                return res.status(500).json({ message: 'Error al crear usuario.' });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente.' });
        }
    );
});

// Login de usuario
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error en la base de datos.' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta.' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: 'Login exitoso.', token });
        }
    );
});

// Leer usuarios (solo para pruebas, en producción ocúltalos)
router.get('/users', (req, res) => {
    db.all(`SELECT id, username FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error en la base de datos.' });
        }
        res.json(rows);
    });
});

// Actualizar usuario
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    db.run(
        `UPDATE users SET username = ?, password = ? WHERE id = ?`,
        [username, password, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error actualizando usuario.' });
            }
            res.json({ message: 'Usuario actualizado exitosamente.' });
        }
    );
});

// Eliminar usuario
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error eliminando usuario.' });
        }
        res.json({ message: 'Usuario eliminado exitosamente.' });
    });
});

module.exports = router;
