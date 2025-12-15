// storage-manager.js
// Manages localStorage operations for cart and products

const StorageManager = {
  // Cart storage keys
  CART_KEY: 'karthik_cart',
  PRODUCTS_KEY: 'karthik_products',

  // Cart operations
  getCart() {
    try {
      const cartData = localStorage.getItem(this.CART_KEY);
      return cartData ? JSON.parse(cartData) : { items: [], total: 0, timestamp: Date.now() };
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return { items: [], total: 0, timestamp: Date.now() };
    }
  },

  saveCart(cart) {
    try {
      cart.timestamp = Date.now();
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      return false;
    }
  },

  clearCart() {
    try {
      localStorage.removeItem(this.CART_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  },

  // Product operations
  getProducts() {
    try {
      const productsData = localStorage.getItem(this.PRODUCTS_KEY);
      return productsData ? JSON.parse(productsData) : [];
    } catch (error) {
      console.error('Error reading products from localStorage:', error);
      return [];
    }
  },

  saveProducts(products) {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
      return false;
    }
  },

  addProduct(product) {
    try {
      const products = this.getProducts();
      const newProduct = {
        ...product,
        id: product.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      products.push(newProduct);
      this.saveProducts(products);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },

  updateProduct(productId, updatedProduct) {
    try {
      const products = this.getProducts();
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        this.saveProducts(products);
        return products[index];
      }
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },

  deleteProduct(productId) {
    try {
      const products = this.getProducts();
      const filtered = products.filter(p => p.id !== productId);
      this.saveProducts(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};

