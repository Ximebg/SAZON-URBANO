
// ==========================================
// SAZÓN URBANO POS
// Sistema de punto de venta para restaurante
// ==========================================

// CATÁLOGO DE PRODUCTOS
// Los productos se cargarán desde la API
let products = [];

// ESTADO DEL SISTEMA
let cart = [];
let selectedCategory = "Todos";

// ELEMENTOS HTML
const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const searchInput = document.getElementById("search-input");
const checkoutButton = document.getElementById("checkout-button");
const clearCartButton = document.getElementById("clear-cart");
const notification = document.getElementById("notification");

// FORMATO DE PRECIOS COLOMBIANOS
function formatPrice(value) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);
}

// CARGAR PRODUCTOS DESDE EL BACKEND
async function loadProducts() {
    try {
        productsGrid.innerHTML = `
            <div class="no-products">
                Cargando productos...
            </div>
        `;

        const response = await fetch(
            "/api/products"
        );

        if (!response.ok) {
            throw new Error("No fue posible consultar los productos.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error("La API no pudo cargar los productos.");
        }

        // Adaptar los campos de MySQL al formato del frontend
        products = data.products.map(product => ({
            id: Number(product.id),
            name: product.nombre,
            category: product.categoria,
            description: product.descripcion,
            price: Number(product.precio),
            emoji: product.emoji
        }));

        renderProducts();

    } catch (error) {
        console.error("Error al cargar productos:", error);

        productsGrid.innerHTML = `
            <div class="no-products">
                No se pudieron cargar los productos.
                Verifica que el backend esté funcionando.
            </div>
        `;
    }
}

// FECHA ACTUAL
function showDate() {
    const date = new Date();

    document.getElementById("current-date").textContent =
        date.toLocaleDateString("es-CO", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}

// MOSTRAR NOTIFICACIONES
let notificationTimer;

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

// MOSTRAR PRODUCTOS
function renderProducts() {
    const search = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                No se encontraron productos.
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image">
                ${product.emoji}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-id="${product.id}"
                    >
                        + Agregar
                    </button>

                </div>
            </div>
        </article>
    `).join("");
}

// AGREGAR PRODUCTOS AL CARRITO
function addToCart(productId) {
    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();

    showNotification(`${product.name} agregado al pedido.`);
}

// CAMBIAR CANTIDADES
function updateQuantity(productId, change) {
    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(
            product => product.id !== productId
        );
    }

    renderCart();
}

// MOSTRAR CARRITO
function renderCart() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Para esta demostración se utiliza una tasa de 0%.
    // El tratamiento tributario real se configurará después.
    const tax = 0;

    const total = subtotal + tax;

    cartCount.textContent =
        `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`;

    subtotalElement.textContent = formatPrice(subtotal);
    taxElement.textContent = formatPrice(tax);
    totalElement.textContent = formatPrice(total);

    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div>🛍️</div>
                <h3>Tu carrito está vacío</h3>
                <p>Selecciona productos del menú para comenzar.</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">

            <div class="cart-item-emoji">
                ${item.emoji}
            </div>

            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${formatPrice(item.price)} unidad</span>
            </div>

            <div class="cart-item-price">
                <strong>
                    ${formatPrice(item.price * item.quantity)}
                </strong>

                <div class="quantity-controls">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Disminuir cantidad"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Aumentar cantidad"
                    >+</button>

                </div>
            </div>

        </div>
    `).join("");
}

// FILTRAR POR CATEGORÍAS
document.querySelectorAll(".category").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        renderProducts();
    });

});

// BUSCADOR
searchInput.addEventListener("input", renderProducts);

// EVENTOS DE PRODUCTOS
productsGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-button");

    if (!button) return;

    addToCart(Number(button.dataset.id));

});

// EVENTOS DEL CARRITO
cartItems.addEventListener("click", event => {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.id);

    if (button.dataset.action === "increase") {
        updateQuantity(productId, 1);
    }

    if (button.dataset.action === "decrease") {
        updateQuantity(productId, -1);
    }

});

// VACIAR CARRITO
clearCartButton.addEventListener("click", () => {

    if (cart.length === 0) {
        showNotification("El carrito ya está vacío.");
        return;
    }

    cart = [];

    renderCart();

    showNotification("Se vació el carrito.");

});

// REGISTRAR PEDIDO EN MYSQL
checkoutButton.addEventListener("click", async () => {

    if (cart.length === 0) return;

    checkoutButton.disabled = true;

    try {

        const items = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const response = await fetch(
            "/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "No se pudo registrar el pedido."
            );
        }

        cart = [];

        renderCart();

        showNotification(
            `¡Pedido ${data.order.number} registrado correctamente!`
        );

        console.log("Pedido registrado:", data.order);

    } catch (error) {

        console.error("Error al registrar pedido:", error);

        showNotification(
            error.message || "Error al registrar el pedido."
        );

    } finally {

        checkoutButton.disabled = cart.length === 0;

    }

});

// INICIALIZAR APLICACIÓN
showDate();
loadProducts();
renderCart();
