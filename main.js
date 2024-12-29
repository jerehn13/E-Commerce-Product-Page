// Cart Data and Functions
let cart = [];

// Fetch and display products
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

// Add item to the cart
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }
  updateCartDisplay();
  saveCartToLocalStorage();
}

// Remove item from the cart
function removeFromCart(product) {
  cart = cart.filter(item => item.id !== product.id);
  updateCartDisplay();
  saveCartToLocalStorage();
}

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  cartItems.innerHTML = '';
  
  cart.forEach(product => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const productTitle = document.createElement('h4');
    productTitle.textContent = product.title;

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

  const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
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

// Toggle cart dropdown visibility
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-dropdown').classList.toggle('visible');
});

// Initialize the page
displayProducts();
loadCartFromLocalStorage();
