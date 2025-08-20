/**
 * auth.js - Handle authentication for AIHS
 * Manages user authentication, login, and session management
 */

class Auth {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.baseUrl = 'http://localhost:5000/api';
    
    this.setupEventListeners();
    this.checkAuthStatus();
  }

  // Initialize event listeners
  setupEventListeners() {
    // Auth modal elements
    this.modal = document.getElementById('authModal');
    this.loginForm = document.getElementById('loginFormElement');
    this.registerForm = document.getElementById('registerFormElement');
    this.forgotPasswordForm = document.getElementById('forgotPasswordFormElement');
    this.tabButtons = document.querySelectorAll('.tab-btn');
    
    // Add event listeners
    this.tabButtons.forEach(button => {
      button.addEventListener('click', () => this.switchTab(button.dataset.tab));
    });

    this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
    this.forgotPasswordForm?.addEventListener('submit', (e) => this.handleForgotPassword(e));
    
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showForgotPasswordForm();
    });

    document.getElementById('backToLogin')?.addEventListener('click', () => {
      this.switchTab('login');
    });

    document.getElementById('resendVerification')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.resendVerificationEmail();
    });

    // Auth buttons in navigation
    document.getElementById('loginButton')?.addEventListener('click', () => {
      this.openModal('login');
    });

    document.getElementById('registerButton')?.addEventListener('click', () => {
      this.openModal('register');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Handle form submissions
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await this.login(email, password);
      this.showToast('Login successful!', 'success');
      this.closeModal();
      this.checkAuthStatus();
    } catch (error) {
      this.showToast(error.message || 'Login failed', 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    try {
      await this.register(data);
      document.getElementById('verificationMessage').style.display = 'flex';
      this.closeModal();
    } catch (error) {
      this.showToast(error.message || 'Registration failed', 'error');
    }
  }

  async handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    try {
      await this.requestPasswordReset(email);
      this.showToast('Password reset link sent to your email', 'success');
      this.switchTab('login');
    } catch (error) {
      this.showToast(error.message || 'Failed to send reset link', 'error');
    }
  }

  // API calls
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));

      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset link');
    }
  }

  async resendVerificationEmail() {
    if (!this.user?.email) {
      this.showToast('No email address found', 'error');
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: this.user.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      this.showToast('Verification email sent!', 'success');
    } catch (error) {
      this.showToast(error.message || 'Failed to resend verification email', 'error');
    }
  }

  // UI helpers
  switchTab(tabName) {
    const forms = document.querySelectorAll('.auth-form');
    const buttons = document.querySelectorAll('.tab-btn');

    forms.forEach(form => form.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}Form`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  showForgotPasswordForm() {
    this.switchTab('forgotPassword');
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
      setTimeout(() => {
        this.modal.style.display = 'none';
      }, 300);
    }
  }

  openModal(tab = 'login') {
    if (this.modal) {
      this.modal.style.display = 'flex';
      setTimeout(() => {
        this.modal.classList.add('show');
        this.switchTab(tab);
      }, 10);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  // Utility methods
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
    this.checkAuthStatus();
    window.location.href = '/';
  }

  // API helpers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : ''
    };
  }

  // Check authentication status and update UI
  checkAuthStatus() {
    const authButtons = document.querySelectorAll('.auth-button');
    const userMenus = document.querySelectorAll('.user-menu');
    
    if (this.isAuthenticated()) {
      authButtons.forEach(btn => btn.style.display = 'none');
      userMenus.forEach(menu => {
        menu.style.display = 'block';
        const userNameElement = menu.querySelector('.user-name');
        if (userNameElement && this.user) {
          userNameElement.textContent = `${this.user.firstName} ${this.user.lastName}`;
        }
      });
    } else {
      authButtons.forEach(btn => btn.style.display = 'block');
      userMenus.forEach(menu => menu.style.display = 'none');
    }
  }
}

// Create and export auth instance
const auth = new Auth();
export default auth;
