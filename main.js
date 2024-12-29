// Cart array
let cart = [];

// Function to update the cart notification count on the icon
function updateCartNotification() {
    const notification = document.getElementById('cart-notification');
    notification.textContent = cart.reduce((acc, product) => acc + product.quantity, 0); // Update notification with total items in the cart
    if (cart.length === 0 || notification.textContent === '0') {
        notification.style.display = 'none'; // Hide notification if cart is empty
    } else {
        notification.style.display = 'block'; // Show notification if there are items in the cart
    }
}

// Add product to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        product.quantity = 1; // Add new product with quantity 1
        cart.push(product);
    }

    updateCartDisplay();
    saveCartToLocalStorage();
    updateCartNotification(); // Update the notification after adding an item
}

// Update the cart display in the dropdown
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; // Clear the existing cart items

    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const productTitle = document.createElement('h4');
        productTitle.textContent = `${product.title} (x${product.quantity})`;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$${(product.price * product.quantity).toFixed(2)}`;

        // Create a quantity selector
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('quantity-btn');
        decreaseButton.addEventListener('click', () => updateQuantity(product, -1));

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = product.quantity;
        quantityInput.classList.add('quantity-input');
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value, 10);
            if (newQuantity > 0) {
                updateQuantity(product, 0, newQuantity); // Update directly to the new quantity
            }
        });

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('quantity-btn');
        increaseButton.addEventListener('click', () => updateQuantity(product, 1));

        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(quantityInput);
        quantityContainer.appendChild(increaseButton);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeFromCart(product));

        cartItem.appendChild(productTitle);
        cartItem.appendChild(productPrice);
        cartItem.appendChild(quantityContainer);
        cartItem.appendChild(removeButton);
        cartItems.appendChild(cartItem);
    });

    // Update the total price
    const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Update product quantity
function updateQuantity(product, change, newQuantity = null) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        if (newQuantity !== null) {
            existingProduct.quantity = newQuantity;
        } else {
            existingProduct.quantity += change;
        }

        if (existingProduct.quantity <= 0) {
            removeFromCart(product); // Remove if quantity is zero
        } else {
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }
}

// Remove product from the cart
function removeFromCart(product) {
    cart = cart.filter(item => item.id !== product.id); // Remove the product
    updateCartDisplay();
    saveCartToLocalStorage();
    updateCartNotification(); // Update the notification after removing an item
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
        updateCartNotification(); // Update the notification after loading from localStorage
    }
}

// Force a page refresh to ensure the cart notification is properly updated
function refreshCartNotification() {
    updateCartNotification(); // Refresh the cart notification
}

// Toggle the visibility of the cart dropdown
document.querySelector('.cart-icon').addEventListener('click', () => {
    const cartDropdown = document.querySelector('.cart-dropdown');
    cartDropdown.classList.toggle('visible'); // Toggle the dropdown visibility
});

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

// Initialize the application
displayProducts();
loadCartFromLocalStorage();
