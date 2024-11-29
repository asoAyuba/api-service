const express = require('express');
const config = require('./config/config');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const protectoraRoutes = require('./routes/protectoraRoutes');
const utilsRoutes = require('./routes/utilsRoutes');
const coloniaRoutes = require('./routes/coloniaRoutes');
const gatoRoutes = require('./routes/gatoRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', protectoraRoutes);
app.use('/api', utilsRoutes);
app.use('/api', coloniaRoutes);
app.use('/api', gatoRoutes);
app.use('/api', voluntarioRoutes);

// Puerto y entorno
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${config.baseURL}`);
});