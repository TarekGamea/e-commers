const API_URL = "http://localhost:3000/api";

// Product Form
const productForm = document.getElementById("productForm");
const productId = document.getElementById("productId");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");

// Search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Buttons
const refreshBtn = document.getElementById("refreshBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const loadOrdersBtn = document.getElementById("loadOrdersBtn");

// Containers
const productsTable = document.getElementById("productsTable");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const ordersContainer = document.getElementById("ordersContainer");

window.addEventListener("DOMContentLoaded", () => {

    loadCategories();
    loadProducts();
    loadCart();
    loadOrders();

});

async function loadCategories() {

    try {

        const response = await fetch(`${API_URL}/categories`);

        const result = await response.json();

        categorySelect.innerHTML =
            `<option value="">Select Category</option>`;

        result.data.forEach(category => {

            categorySelect.innerHTML += `
                <option value="${category._id}">
                    ${category.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

async function loadProducts(search = "") {

    try {

        let url = `${API_URL}/products`;

        if (search !== "") {
            url += `?search=${search}`;
        }

        const response = await fetch(url);

        const result = await response.json();

        displayProducts(result.data);

    } catch (error) {

        console.error(error);

    }

}

function displayProducts(products) {

    productsTable.innerHTML = "";

    products.forEach(product => {

        productsTable.innerHTML += `

        <tr>

            <td>

                <img
                    src="${product.images[0] || 'https://placehold.co/60x60'}"
                    width="60"
                >

            </td>

            <td>${product.name}</td>

            <td>$${product.price}</td>

            <td>${product.stock}</td>

            <td>${product.category.name}</td>

            <td>

                <button onclick="editProduct('${product._id}')">

                    Edit

                </button>

                <button onclick="deleteProduct('${product._id}')">

                    Delete

                </button>

                <button onclick="addToCart('${product._id}')">

                    Cart

                </button>

            </td>

        </tr>

        `;

    });

}

async function loadCart() {

    try {

        const response = await fetch(`${API_URL}/cart`);

        const result = await response.json();

        displayCart(result.data);

    } catch (error) {

        console.error(error);

    }

}

function displayCart(cart) {

    cartItems.innerHTML = "";

    if (cart.items.length === 0) {

        cartItems.innerHTML = "Cart is empty.";

        cartTotal.textContent = "$0";

        return;

    }

    cart.items.forEach(item => {

        cartItems.innerHTML += `

            <p>

                ${item.product.name}

                x${item.quantity}

                - $${item.price * item.quantity}

            </p>

        `;

    });

    cartTotal.textContent = `$${cart.totalPrice}`;

}

async function loadOrders() {

    try {

        const response = await fetch(`${API_URL}/orders`);

        const result = await response.json();

        displayOrders(result.data);

    } catch (error) {

        console.error(error);

    }

}

function displayOrders(orders) {

    ordersContainer.innerHTML = "";

    if (orders.length === 0) {

        ordersContainer.innerHTML = "No orders found.";

        return;

    }

    orders.forEach(order => {

        ordersContainer.innerHTML += `

            <div>

                <h4>

                    Order #${order._id.slice(-6)}

                </h4>

                <p>

                    Status:
                    ${order.status}

                </p>

                <p>

                    Total:
                    $${order.totalPrice}

                </p>

            </div>

            <hr>

        `;

    });

}

refreshBtn.addEventListener("click", () => {
    loadProducts();
});

searchBtn.addEventListener("click", () => {
    loadProducts(searchInput.value);
});

loadOrdersBtn.addEventListener("click", () => {
    loadOrders();
});

// ======================================
// Add Product
// ======================================

async function createProduct(product) {

    try {

        const response = await fetch(`${API_URL}/products`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        if (!response.ok) {
            throw new Error("Failed to create product");
        }

        alert("Product added successfully!");

        clearForm();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ======================================
// Update Product
// ======================================

async function updateProduct(id, product) {

    try {

        const response = await fetch(`${API_URL}/products/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        if (!response.ok) {
            throw new Error("Failed to update product");
        }

        alert("Product updated!");

        clearForm();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ======================================
// Delete Product
// ======================================

async function deleteProduct(id) {

    const confirmed = confirm("Delete this product?");

    if (!confirmed) return;

    try {

        const response = await fetch(`${API_URL}/products/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {
            throw new Error("Failed to delete product");
        }

        alert("Product deleted.");

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ======================================
// Edit Product
// ======================================

async function editProduct(id) {

    try {

        const response = await fetch(`${API_URL}/products/${id}`);

        const result = await response.json();

        const product = result.data;

        productId.value = product._id;
        nameInput.value = product.name;
        descriptionInput.value = product.description;
        priceInput.value = product.price;
        stockInput.value = product.stock;
        categorySelect.value = product.category._id;
        imageInput.value = product.images[0] || "";

        document.getElementById("saveBtn").textContent =
            "Update Product";

    } catch (error) {

        console.error(error);

    }

}

// ======================================
// Clear Form
// ======================================

function clearForm() {

    productForm.reset();

    productId.value = "";

    document.getElementById("saveBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Product
    `;

}

// ======================================
// Product Form
// ======================================

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const product = {

        name: nameInput.value,

        description: descriptionInput.value,

        price: Number(priceInput.value),

        stock: Number(stockInput.value),

        category: categorySelect.value,

        images: [imageInput.value],

        inStock: Number(stockInput.value) > 0

    };

    if (productId.value === "") {

        createProduct(product);

    } else {

        updateProduct(productId.value, product);

    }

});

refreshBtn.addEventListener("click", () => {

    clearForm();

    searchInput.value = "";

    loadProducts();

});