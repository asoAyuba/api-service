const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear voluntario
router.post('/voluntario', (req, res) => {
    const { first_name, last_name, address, role, nif, email, protectora_id } = req.body;

    if (!first_name || !last_name || !address || !role || !nif || !email || !protectora_id) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    db.run(
        `INSERT INTO voluntarios (first_name, last_name, address, role, nif, email, protectora_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, address, role, nif, email, protectora_id],
        (err) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ message: 'El NIF o el email ya están registrados.' });
                }
                return res.status(500).json({ message: 'Error al crear el voluntario.', error: err.message });
            }
            res.status(201).json({ message: 'Voluntario creado exitosamente.' });
        }
    );
});

// Leer todos los voluntarios
router.get('/voluntarios', (req, res) => {
    db.all(`SELECT * FROM voluntarios`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los voluntarios.' });
        }
        res.json(rows);
    });
});

// Leer voluntarios de una protectora específica
router.get('/voluntarios/protectora/:protectoraId', (req, res) => {
    const { protectoraId } = req.params;

    db.all(
        `SELECT * FROM voluntarios WHERE protectora_id = ?`,
        [protectoraId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener los voluntarios de la protectora.' });
            }
            res.json(rows);
        }
    );
});

// Leer un voluntario por ID
router.get('/voluntario/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM voluntarios WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el voluntario.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Voluntario no encontrado.' });
        }
        res.json(row);
    });
});

// Actualizar voluntario
router.put('/voluntario/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, address, role, nif, email, protectora_id } = req.body;

    db.run(
        `UPDATE voluntarios 
         SET first_name = ?, last_name = ?, address = ?, role = ?, nif = ?, email = ?, protectora_id = ?
         WHERE id = ?`,
        [first_name, last_name, address, role, nif, email, protectora_id, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar el voluntario.' });
            }
            res.json({ message: 'Voluntario actualizado exitosamente.' });
        }
    );
});

// Eliminar voluntario
router.delete('/voluntario/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM voluntarios WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el voluntario.' });
        }
        res.json({ message: 'Voluntario eliminado exitosamente.' });
    });
});

module.exports = router;
