// product-manager.js
// Handles product CRUD operations with server sync fallback

const ProductManager = {
  API_URL: '/api/products',

  // Load products from server or localStorage
  async loadProducts() {
    try {
      // Try to fetch from server first
      const response = await fetch(this.API_URL);
      if (response.ok) {
        const serverProducts = await response.json();
        // Save to localStorage as backup
        StorageManager.saveProducts(serverProducts);
        return serverProducts;
      }
    } catch (error) {
      console.log('Server unavailable, using localStorage:', error);
    }

    // Fallback to localStorage
    return StorageManager.getProducts();
  },

  // Get default products (static list)
  getDefaultProducts() {
    return [
      {
        id: 'prod_hdd_001',
        name: 'HDD',
        description: 'High-capacity Hard Disk Drive for reliable data storage',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1587831990716-53e7f8c6c77a?w=400&h=300&fit=crop',
        category: 'Storage'
      },
      {
        id: 'prod_ram_001',
        name: 'RAM',
        description: 'High-performance Random Access Memory for faster computing',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
        category: 'Memory'
      },
      {
        id: 'prod_nic_001',
        name: 'Network NIC Cards',
        description: 'Network Interface Card for high-speed network connectivity',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        category: 'Networking'
      },
      {
        id: 'prod_switch_001',
        name: 'Network Switches (10 port)',
        description: '10-port network switch for efficient network management',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        category: 'Networking'
      },
      {
        id: 'prod_cable_3m',
        name: 'Shield Lan-Cables (3M)',
        description: '3-meter shielded LAN cable for reliable network connections',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        category: 'Cables'
      },
      {
        id: 'prod_cable_5m',
        name: 'Shield Lan-Cables (5M)',
        description: '5-meter shielded LAN cable for extended network connections',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        category: 'Cables'
      }
    ];
  },

  // Initialize products (load from server/localStorage or use defaults)
  async initializeProducts() {
    let products = await this.loadProducts();
    
    // If no products found, use defaults
    if (!products || products.length === 0) {
      products = this.getDefaultProducts();
      StorageManager.saveProducts(products);
    }

    return products;
  },

  // Add new product
  async addProduct(productData) {
    // Try to save to server first
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        const savedProduct = await response.json();
        StorageManager.addProduct(savedProduct);
        return savedProduct;
      }
    } catch (error) {
      console.log('Server unavailable, saving to localStorage:', error);
    }

    // Fallback to localStorage
    return StorageManager.addProduct(productData);
  },

  // Update product
  async updateProduct(productId, productData) {
    // Try to update on server first
    try {
      const response = await fetch(`${this.API_URL}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        StorageManager.updateProduct(productId, updatedProduct);
        return updatedProduct;
      }
    } catch (error) {
      console.log('Server unavailable, updating in localStorage:', error);
    }

    // Fallback to localStorage
    return StorageManager.updateProduct(productId, productData);
  },

  // Delete product
  async deleteProduct(productId) {
    // Try to delete from server first
    try {
      const response = await fetch(`${this.API_URL}/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        StorageManager.deleteProduct(productId);
        return true;
      }
    } catch (error) {
      console.log('Server unavailable, deleting from localStorage:', error);
    }

    // Fallback to localStorage
    return StorageManager.deleteProduct(productId);
  }
};

