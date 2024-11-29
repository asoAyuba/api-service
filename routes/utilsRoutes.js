const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta para eliminar la base de datos
router.delete('/delete-database', (req, res) => {
    const dbPath = path.resolve(__dirname, '../db/database.sqlite');

    fs.unlink(dbPath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'La base de datos no existe.' });
            }
            return res.status(500).json({ message: 'Error al eliminar la base de datos.', error: err.message });
        }

        res.status(200).json({ message: 'Base de datos eliminada exitosamente.' });
    });
});

module.exports = router;
