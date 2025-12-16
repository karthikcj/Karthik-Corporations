// user-manager.js
// Handles user authentication and profile management

const UserManager = {
  API_URL: '/api/users',
  AUTH_KEY: 'karthik_user_auth',

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'register',
          ...userData
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Save auth to localStorage
        this.saveAuth({ username: userData.username, isAuthenticated: true, timestamp: Date.now() });
        return { success: true, message: data.message, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  // Login user
  async login(username, password) {
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'login',
          username,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Save auth to localStorage
        this.saveAuth({ username, isAuthenticated: true, timestamp: Date.now(), user: data.user });
        return { success: true, message: data.message, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
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

  // Get current user
  getCurrentUser() {
    const auth = this.getAuth();
    return auth?.user || null;
  },

  // Get current username
  getCurrentUsername() {
    const auth = this.getAuth();
    return auth?.username || null;
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

  // Get user profile
  async getProfile(username) {
    try {
      const response = await fetch(`${this.API_URL}?username=${encodeURIComponent(username)}`);
      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(username, profileData) {
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          ...profileData
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update auth if updating current user
        const auth = this.getAuth();
        if (auth && auth.username === username) {
          auth.user = data.user;
          this.saveAuth(auth);
        }
        return { success: true, message: data.message, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Update failed' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Update failed. Please try again.' };
    }
  },

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await fetch(`${this.API_URL}?all=true`);
      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // Delete user (admin only)
  async deleteUser(username) {
    try {
      const response = await fetch(`${this.API_URL}?username=${encodeURIComponent(username)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Delete failed' };
      }
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, message: 'Delete failed. Please try again.' };
    }
  }
};

