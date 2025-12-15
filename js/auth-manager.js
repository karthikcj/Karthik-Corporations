// auth-manager.js
// Handles admin authentication with MongoDB and localStorage fallback

const AuthManager = {
  API_URL: 'http://localhost:5000/api/admin',
  AUTH_KEY: 'karthik_admin_auth',
  ADMIN_KEY: 'karthik_admin_users',

  // Login with userid and password
  async login(userid, password) {
    try {
      // Try server first
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Save auth to localStorage
        this.saveAuth({ userid, isAuthenticated: true, timestamp: Date.now() });
        return { success: true, message: data.message };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Login failed' };
      }
    } catch (error) {
      console.log('Server unavailable, checking localStorage:', error);
      // Fallback to localStorage
      return this.loginLocalStorage(userid, password);
    }
  },

  // Login from localStorage
  loginLocalStorage(userid, password) {
    const admins = this.getLocalAdmins();
    const admin = admins.find(a => a.userid === userid && a.password === password);
    
    if (admin) {
      this.saveAuth({ userid, isAuthenticated: true, timestamp: Date.now() });
      return { success: true, message: 'Login successful (offline mode)' };
    }
    
    return { success: false, message: 'Invalid credentials' };
  },

  // Register admin (for initial setup)
  async register(userid, password) {
    try {
      const response = await fetch(`${this.API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid, password })
      });

      if (response.ok) {
        const data = await response.json();
        // Also save to localStorage
        this.addLocalAdmin(userid, password);
        return { success: true, message: data.message };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Registration failed' };
      }
    } catch (error) {
      console.log('Server unavailable, saving to localStorage:', error);
      // Fallback to localStorage
      this.addLocalAdmin(userid, password);
      return { success: true, message: 'Admin registered (offline mode)' };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const auth = this.getAuth();
    if (!auth || !auth.isAuthenticated) return false;
    
    // Check if session is still valid (24 hours)
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - auth.timestamp > sessionTimeout) {
      this.logout();
      return false;
    }
    
    return true;
  },

  // Get current auth
  getAuth() {
    try {
      const authData = localStorage.getItem(this.AUTH_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      return null;
    }
  },

  // Save auth
  saveAuth(auth) {
    try {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
      return true;
    } catch (error) {
      return false;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  },

  // Get local admins
  getLocalAdmins() {
    try {
      const adminsData = localStorage.getItem(this.ADMIN_KEY);
      return adminsData ? JSON.parse(adminsData) : [];
    } catch (error) {
      return [];
    }
  },

  // Add local admin
  addLocalAdmin(userid, password) {
    const admins = this.getLocalAdmins();
    if (!admins.find(a => a.userid === userid)) {
      admins.push({ userid, password });
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admins));
    }
  }
};

