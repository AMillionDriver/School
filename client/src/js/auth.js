/**
 * auth.js - Handle authentication for AIHS
 * Manages user authentication, login, and session management
 */

class Auth {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.baseUrl = 'http://localhost:5000/api';
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get authenticated fetch headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-auth-token': this.token
    };
  }

  // Check if token is still valid
  async validateToken() {
    if (!this.token) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      const data = await response.json();
      this.user = data;
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }
}

// Create and export auth instance
const auth = new Auth();
export default auth;
