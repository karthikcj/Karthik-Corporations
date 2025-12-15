// cart-manager.js
// Handles cart operations: add, remove, update quantity, calculate totals

const CartManager = {
  // Add item to cart
  addItem(product, quantity = 1) {
    const cart = StorageManager.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    this.calculateTotal(cart);
    StorageManager.saveCart(cart);
    this.updateCartUI();
    return cart;
  },

  // Remove item from cart
  removeItem(productId) {
    const cart = StorageManager.getCart();
    cart.items = cart.items.filter(item => item.productId !== productId);
    this.calculateTotal(cart);
    StorageManager.saveCart(cart);
    this.updateCartUI();
    return cart;
  },

  // Update item quantity
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const cart = StorageManager.getCart();
    const item = cart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.calculateTotal(cart);
      StorageManager.saveCart(cart);
      this.updateCartUI();
    }
    return cart;
  },

  // Calculate total price
  calculateTotal(cart) {
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    return cart.total;
  },

  // Get cart item count
  getItemCount() {
    const cart = StorageManager.getCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  },

  // Get cart total
  getTotal() {
    const cart = StorageManager.getCart();
    return cart.total || 0;
  },

  // Clear cart
  clearCart() {
    StorageManager.clearCart();
    this.updateCartUI();
  },

  // Update cart UI (cart icon badge and total)
  updateCartUI() {
    const itemCount = this.getItemCount();
    const total = this.getTotal();
    
    // Update cart badge
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = itemCount;
      cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
    }

    // Update cart total (convert to INR)
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal && typeof CurrencyConverter !== 'undefined') {
      cartTotal.textContent = CurrencyConverter.formatUSDToINR(total);
    } else if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { itemCount, total }
    }));
  }
};

