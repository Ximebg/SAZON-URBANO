
USE sazon_urbano;

-- =========================================
-- BASE DE DATOS: SAZON URBANO
-- =========================================

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(12,2) NOT NULL,
    emoji VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL,
    estado ENUM(
        'PENDIENTE',
        'EN_PREPARACION',
        'ENTREGADO',
        'CANCELADO'
    ) DEFAULT 'PENDIENTE'
);

CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id),

    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (producto_id)
        REFERENCES productos(id)
);

-- =========================================
-- PRODUCTOS INICIALES
-- =========================================

INSERT INTO productos
(id, nombre, categoria, descripcion, precio, emoji)
VALUES
(1, 'Hamburguesa clásica', 'Hamburguesas',
 'Carne de res, queso, lechuga y tomate.', 18000, '🍔'),

(2, 'Hamburguesa especial', 'Hamburguesas',
 'Doble carne, queso cheddar y tocineta.', 26000, '🍔'),

(3, 'Pizza personal', 'Pizzas',
 'Salsa de tomate, queso y pepperoni.', 22000, '🍕'),

(4, 'Pizza familiar', 'Pizzas',
 'Pizza familiar de cuatro ingredientes.', 42000, '🍕'),

(5, 'Gaseosa', 'Bebidas',
 'Bebida fría de 400 ml.', 5000, '🥤'),

(6, 'Limonada natural', 'Bebidas',
 'Limonada preparada al momento.', 7000, '🍋'),

(7, 'Papas fritas', 'Acompañamientos',
 'Porción de papas doradas y crocantes.', 9000, '🍟'),

(8, 'Nuggets de pollo', 'Acompañamientos',
 'Seis piezas de pollo apanado.', 12000, '🍗'),

(9, 'Malteada de chocolate', 'Bebidas',
 'Malteada cremosa de chocolate.', 12000, '🥛')

ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    categoria = VALUES(categoria),
    descripcion = VALUES(descripcion),
    precio = VALUES(precio),
    emoji = VALUES(emoji);
