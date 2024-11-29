const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear protectora
router.post('/protectora', (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    db.run(
        `INSERT INTO protectoras (name, address) VALUES (?, ?)`,
        [name, address],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'La protectora ya existe.' });
                }
                return res.status(500).json({ message: 'Error al crear la protectora.' });
            }
            res.status(201).json({ message: 'Protectora creada exitosamente.' });
        }
    );
});

// Leer todas las protectoras
router.get('/protectoras', (req, res) => {
    db.all(`SELECT * FROM protectoras`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener las protectoras.' });
        }
        res.json(rows);
    });
});

// Leer una protectora por ID
router.get('/protectora/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM protectoras WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener la protectora.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Protectora no encontrada.' });
        }
        res.json(row);
    });
});

// Actualizar protectora
router.put('/protectora/:id', (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;

    db.run(
        `UPDATE protectoras SET name = ?, address = ? WHERE id = ?`,
        [name, address, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar la protectora.' });
            }
            res.json({ message: 'Protectora actualizada exitosamente.' });
        }
    );
});

// Eliminar protectora
router.delete('/protectora/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM protectoras WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar la protectora.' });
        }
        res.json({ message: 'Protectora eliminada exitosamente.' });
    });
});

// Vincular usuario a protectora
router.post('/protectora/:protectoraId/user/:userId', (req, res) => {
    const { protectoraId, userId } = req.params;

    db.run(
        `INSERT INTO user_protectora (user_id, protectora_id) VALUES (?, ?)`,
        [userId, protectoraId],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'El usuario ya está vinculado a esta protectora.' });
                }
                return res.status(500).json({ message: 'Error al vincular usuario con protectora.' });
            }
            res.json({ message: 'Usuario vinculado a la protectora exitosamente.' });
        }
    );
});

// Obtener usuarios de una protectora
router.get('/protectora/:protectoraId/users', (req, res) => {
    const { protectoraId } = req.params;

    db.all(
        `SELECT u.id, u.username FROM users u
         INNER JOIN user_protectora up ON u.id = up.user_id
         WHERE up.protectora_id = ?`,
        [protectoraId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener usuarios de la protectora.' });
            }
            res.json(rows);
        }
    );
});


module.exports = router;
