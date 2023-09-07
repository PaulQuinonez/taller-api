const express = require('express');
const cors = require('cors');
const db = require('./src/config/config');
const bodyParser = require('body-parser');

//* Inicialización de express
const app = express();

// TODO: RUTAS
const user_routes = require('./src/routes/user.routes');
const auth_routes = require('./src/routes/auth.routes');
const client_routes = require('./src/routes/client.routes');
const brand_routes = require('./src/routes/brand.routes');
const parts_routes = require('./src/routes/parts.routes');
const maintenance_routes = require('./src/routes/maintenance.routes');

// TODO: CONEXION A BASE DE DATOS
db();

// TODO: HABILITACIÓN DE LAS SOLICITUDES CRUZADAS
app.use(cors());

//* CONFIGURACION ADICIONAL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use((req, res, next) => {
    res.header('Content-Type: application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// TODO: RUTAS PRINCIPALES
app.use('/api/TCApi/user', user_routes);
app.use('/api/TCApi/auth', auth_routes);
app.use('/api/TCApi/client', client_routes);
app.use('/api/TCApi/brand', brand_routes);
app.use('/api/TCApi/parts', parts_routes);
app.use('/api/TCApi/maintenance', maintenance_routes);

module.exports = app;