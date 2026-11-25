
const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById
} = require('../controllers/orderController');

// Registrar un pedido
router.post('/', createOrder);

// Consultar todos los pedidos
router.get('/', getOrders);

// Consultar un pedido específico
router.get('/:id', getOrderById);

module.exports = router;
