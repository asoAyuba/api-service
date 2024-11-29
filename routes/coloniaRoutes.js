const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear colonia
router.post('/colonia', (req, res) => {
    const { name, location, protectora_id } = req.body;

    if (!name || !location || !protectora_id) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    db.run(
        `INSERT INTO colonias (name, location, protectora_id) VALUES (?, ?, ?)`,
        [name, location, protectora_id],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'La colonia ya existe.' });
                }
                return res.status(500).json({ message: 'Error al crear la colonia.' });
            }
            res.status(201).json({ message: 'Colonia creada exitosamente.' });
        }
    );
});

// Leer todas las colonias de una protectora
router.get('/colonias/protectora/:protectoraId', (req, res) => {
    const { protectoraId } = req.params;

    db.all(
        `SELECT * FROM colonias WHERE protectora_id = ?`,
        [protectoraId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener las colonias.' });
            }
            res.json(rows);
        }
    );
});

// Leer una colonia por ID
router.get('/colonia/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM colonias WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener la colonia.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Colonia no encontrada.' });
        }
        res.json(row);
    });
});

// Actualizar colonia
router.put('/colonia/:id', (req, res) => {
    const { id } = req.params;
    const { name, location, protectora_id } = req.body;

    db.run(
        `UPDATE colonias SET name = ?, location = ?, protectora_id = ? WHERE id = ?`,
        [name, location, protectora_id, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar la colonia.' });
            }
            res.json({ message: 'Colonia actualizada exitosamente.' });
        }
    );
});

// Eliminar colonia
router.delete('/colonia/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM colonias WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar la colonia.' });
        }
        res.json({ message: 'Colonia eliminada exitosamente.' });
    });
});

// Asociar usuario a colonia
router.post('/colonia/:coloniaId/user/:userId', (req, res) => {
    const { coloniaId, userId } = req.params;

    db.run(
        `INSERT INTO user_colonia (user_id, colonia_id) VALUES (?, ?)`,
        [userId, coloniaId],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'El usuario ya está asociado a esta colonia.' });
                }
                return res.status(500).json({ message: 'Error al asociar usuario a la colonia.' });
            }
            res.json({ message: 'Usuario asociado a la colonia exitosamente.' });
        }
    );
});

// Obtener usuarios asociados a una colonia
router.get('/colonia/:coloniaId/users', (req, res) => {
    const { coloniaId } = req.params;

    db.all(
        `SELECT u.id, u.username FROM users u
         INNER JOIN user_colonia uc ON u.id = uc.user_id
         WHERE uc.colonia_id = ?`,
        [coloniaId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener los usuarios de la colonia.' });
            }
            res.json(rows);
        }
    );
});

module.exports = router;
