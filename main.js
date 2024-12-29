// Fetch products from the API
async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    return products;
}

// Display products on the page
async function displayProducts() {
    const products = await fetchProducts();
    const productGrid = document.getElementById('product-grid');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.title;

        const productTitle = document.createElement('h3');
        productTitle.textContent = product.title;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${product.price}`;

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addToCart(product));

        productCard.appendChild(productImage);
        productCard.appendChild(productTitle);
        productCard.appendChild(productPrice);
        productCard.appendChild(addToCartButton);
        productGrid.appendChild(productCard);
    });
}

// Cart array
let cart = [];

// Add product to the cart
function addToCart(product) {
    // Check if the product already exists in the cart
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++; // Increase the quantity if already in cart
    } else {
        product.quantity = 1; // Add new product with quantity 1
        cart.push(product);
    }
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Update the cart display in the dropdown
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; // Clear the existing cart items

    // Loop through the cart and display each item
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const productTitle = document.createElement('h4');
        productTitle.textContent = `${product.title} (x${product.quantity})`;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${(product.price * product.quantity).toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFromCart(product));

        cartItem.appendChild(productTitle);
        cartItem.appendChild(productPrice);
        cartItem.appendChild(removeButton);
        cartItems.appendChild(cartItem);
    });

    // Calculate the total price of the cart
    const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Remove product from the cart
function removeFromCart(product) {
    cart = cart.filter(item => item.id !== product.id); // Remove the product
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
}

// Toggle the visibility of the cart dropdown
document.querySelector('.cart-icon').addEventListener('click', () => {
    const cartDropdown = document.querySelector('.cart-dropdown');
    cartDropdown.classList.toggle('visible'); // Toggle the dropdown visibility
});

// Initialize the application
displayProducts();
loadCartFromLocalStorage();
