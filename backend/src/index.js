
const express = require('express');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();

const PORT = process.env.PORT || 3000;

// Configuración de métricas Prometheus
const register = new client.Registry();

client.collectDefaultMetrics({
    register,
    prefix: 'sazon_urbano_'
});

// Contador de solicitudes HTTP
const httpRequests = new client.Counter({
    name: 'sazon_urbano_http_requests_total',
    help: 'Total de solicitudes HTTP recibidas',
    labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequests);

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.charset = 'utf-8';

    res.on('finish', () => {
        httpRequests.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode
        });
    });

    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API de Sazon Urbano funcionando correctamente',
        status: 'OK'
    });
});

// Estado del servidor
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'sazon-urbano-backend'
    });
});

// Métricas para Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Rutas de la API
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sazon Urbano API ejecutandose en el puerto ${PORT}`);
});
