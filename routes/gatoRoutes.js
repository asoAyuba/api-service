const express = require('express');
const db = require('../db');

const router = express.Router();

// Crear gato
router.post('/gato', (req, res) => {
    const { name, age, description, colonia_id } = req.body;

    if (!name || !age || !description || !colonia_id) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    db.run(
        `INSERT INTO gatos (name, age, description, colonia_id) VALUES (?, ?, ?, ?)`,
        [name, age, description, colonia_id],
        (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al crear el gato.', error: err.message });
            }
            res.status(201).json({ message: 'Gato creado exitosamente.' });
        }
    );
});

// Leer todos los gatos
router.get('/gatos', (req, res) => {
    db.all(`SELECT * FROM gatos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los gatos.' });
        }
        res.json(rows);
    });
});

// Leer gatos de una colonia específica
router.get('/gatos/colonia/:coloniaId', (req, res) => {
    const { coloniaId } = req.params;

    db.all(
        `SELECT * FROM gatos WHERE colonia_id = ?`,
        [coloniaId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener los gatos de la colonia.' });
            }
            res.json(rows);
        }
    );
});

// Leer un gato por ID
router.get('/gato/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM gatos WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener el gato.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Gato no encontrado.' });
        }
        res.json(row);
    });
});

// Obtener todos los gatos adoptables
router.get('/gatos/adoptables', (req, res) => {
    db.all(`SELECT * FROM gatos WHERE adoptable = 1`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los gatos adoptables.' });
        }
        res.json(rows);
    });
});

// Obtener todos los gatos adoptados
router.get('/gatos/adoptados', (req, res) => {
    db.all(`SELECT * FROM gatos WHERE adopted_date IS NOT NULL AND adopted = 1` , [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los gatos adoptados.' });
        }
        res.json(rows);
    });
});


// Actualizar un gato
router.put('/gato/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, description, colonia_id } = req.body;

    db.run(
        `UPDATE gatos SET name = ?, age = ?, description = ?, colonia_id = ? WHERE id = ?`,
        [name, age, description, colonia_id, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar el gato.' });
            }
            res.json({ message: 'Gato actualizado exitosamente.' });
        }
    );
});

// Actualizar el estado del gato a adoptable
router.put('/gato/:id/adoptable', (req, res) => {
    const { id } = req.params;

    db.run(
        `UPDATE gatos SET adoptable = 1 WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar el estado del gato.' });
            }
            res.json({ message: 'El estado del gato se ha actualizado a adoptable.' });
        }
    );
});

// Actualizar el estado del gato a adoptado y agregar fecha de adopción
router.put('/gato/:id/adoptado', (req, res) => {
    const { id } = req.params;
    const adoptedDate = new Date().toISOString();

    db.run(
        `UPDATE gatos SET adopted = 1, adopted_date = ? WHERE id = ?`,
        [adoptedDate, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar el estado del gato a adoptado.' });
            }
            res.json({ message: `El gato con ID ${id} se ha marcado como adoptado en la fecha ${adoptedDate}.` });
        }
    );
});


// Eliminar un gato
router.delete('/gato/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM gatos WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el gato.' });
        }
        res.json({ message: 'Gato eliminado exitosamente.' });
    });
});

module.exports = router;
