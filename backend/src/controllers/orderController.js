
const db = require('../config/database');

// ======================================
// REGISTRAR UN PEDIDO
// ======================================
async function createOrder(req, res) {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'El pedido debe contener productos.'
        });
    }

    const normalizedItems = new Map();

    for (const item of items) {
        const productId = Number(item.productId);
        const quantity = Number(item.quantity);

        if (
            !Number.isSafeInteger(productId) ||
            productId <= 0 ||
            !Number.isSafeInteger(quantity) ||
            quantity <= 0 ||
            quantity > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Producto o cantidad no válidos.'
            });
        }

        normalizedItems.set(
            productId,
            (normalizedItems.get(productId) || 0) + quantity
        );
    }

    if ([...normalizedItems.values()].some(q => q > 100)) {
        return res.status(400).json({
            success: false,
            message: 'La cantidad máxima por producto es 100.'
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        let total = 0;
        const details = [];

        // Consultar precios directamente en MySQL
        for (const [productId, quantity] of normalizedItems) {
            const [products] = await connection.execute(
                `SELECT id, nombre, precio
                 FROM productos
                 WHERE id = ? AND activo = TRUE
                 FOR UPDATE`,
                [productId]
            );

            if (products.length === 0) {
                throw new Error(
                    `El producto ${productId} no está disponible.`
                );
            }

            const product = products[0];
            const price = Number(product.precio);
            const subtotal = price * quantity;

            total += subtotal;

            details.push({
                productId: product.id,
                quantity,
                price,
                subtotal
            });
        }

        // Crear el encabezado del pedido
        const orderNumber =
            `PED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [orderResult] = await connection.execute(
            `INSERT INTO pedidos (numero_pedido, total)
             VALUES (?, ?)`,
            [orderNumber, total]
        );

        const orderId = orderResult.insertId;

        // Guardar los productos del pedido
        for (const detail of details) {
            await connection.execute(
                `INSERT INTO detalle_pedidos
                 (pedido_id, producto_id, cantidad,
                  precio_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    orderId,
                    detail.productId,
                    detail.quantity,
                    detail.price,
                    detail.subtotal
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Pedido registrado correctamente.',
            order: {
                id: orderId,
                number: orderNumber,
                total: total,
                status: 'PENDIENTE'
            }
        });

    } catch (error) {
        await connection.rollback();

        console.error('Error registrando pedido:', error.message);

        res.status(400).json({
            success: false,
            message: 'No se pudo registrar el pedido.'
        });

    } finally {
        connection.release();
    }
}

// ======================================
// CONSULTAR TODOS LOS PEDIDOS
// ======================================
async function getOrders(req, res) {
    try {
        const [orders] = await db.execute(
            `SELECT
                p.id,
                p.numero_pedido,
                p.fecha,
                p.total,
                p.estado,
                COUNT(d.id) AS lineas_productos
             FROM pedidos p
             LEFT JOIN detalle_pedidos d
                ON p.id = d.pedido_id
             GROUP BY p.id
             ORDER BY p.fecha DESC`
        );

        res.json({
            success: true,
            total: orders.length,
            orders: orders
        });

    } catch (error) {
        console.error('Error consultando pedidos:', error.message);

        res.status(500).json({
            success: false,
            message: 'No fue posible consultar los pedidos.'
        });
    }
}

// ======================================
// CONSULTAR UN PEDIDO Y SUS PRODUCTOS
// ======================================
async function getOrderById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Identificador no válido.'
            });
        }

        const [orders] = await db.execute(
            `SELECT id, numero_pedido, fecha, total, estado
             FROM pedidos
             WHERE id = ?`,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado.'
            });
        }

        const [details] = await db.execute(
            `SELECT
                d.producto_id,
                pr.nombre,
                d.cantidad,
                d.precio_unitario,
                d.subtotal
             FROM detalle_pedidos d
             INNER JOIN productos pr
                ON d.producto_id = pr.id
             WHERE d.pedido_id = ?`,
            [id]
        );

        res.json({
            success: true,
            order: orders[0],
            details: details
        });

    } catch (error) {
        console.error('Error consultando pedido:', error.message);

        res.status(500).json({
            success: false,
            message: 'No fue posible consultar el pedido.'
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};
