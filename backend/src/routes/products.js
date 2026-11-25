
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Consultar todos los productos activos
router.get('/', async (req, res) => {
    try {
        const [products] = await db.execute(
            `SELECT id, nombre, categoria, descripcion,
                    precio, emoji
             FROM productos
             WHERE activo = TRUE
             ORDER BY categoria, nombre`
        );

        res.json({
            success: true,
            total: products.length,
            products: products
        });

    } catch (error) {
        console.error('Error consultando productos:', error.message);

        res.status(500).json({
            success: false,
            message: 'No fue posible consultar los productos.'
        });
    }
});

// Consultar un producto por su ID
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Identificador no válido.'
            });
        }

        const [products] = await db.execute(
            `SELECT id, nombre, categoria, descripcion,
                    precio, emoji
             FROM productos
             WHERE id = ? AND activo = TRUE`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado.'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });

    } catch (error) {
        console.error('Error consultando producto:', error.message);

        res.status(500).json({
            success: false,
            message: 'No fue posible consultar el producto.'
        });
    }
});

module.exports = router;
