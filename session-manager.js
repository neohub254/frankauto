// session-manager.js - Handles session validation across admin pages

class SessionManager {
    constructor() {
        this.SESSION_KEY = 'adminSession';
        this.SESSION_EXPIRY_KEY = 'sessionExpiry';
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.CREDENTIALS = {
            username: 'frankadmin',
            password: 'FrankAuto2024!'
        };
    }

    // Initialize session check on all admin pages
    init() {
        if (this.isLoginPage()) {
            this.handleLoginPage();
        } else {
            this.handleProtectedPage();
        }
    }

    // Check if current page is login page
    isLoginPage() {
        return window.location.pathname.includes('login') || 
               document.querySelector('.admin-login') !== null;
    }

    // Handle login page logic
    handleLoginPage() {
        // Check if already logged in
        if (this.isLoggedIn()) {
            this.redirectToDashboard();
            return;
        }

        // Setup login form
        this.setupLoginForm();
    }

    // Handle protected pages (like dashboard)
    handleProtectedPage() {
        if (!this.isLoggedIn()) {
            this.redirectToLogin();
            return;
        }

        // Update session expiry on activity
        this.updateSessionExpiry();
        
        // Setup auto-logout timer
        this.setupAutoLogout();
        
        // Setup logout button if exists
        this.setupLogoutButton();
    }

    // Check if user is logged in
    isLoggedIn() {
        const sessionToken = localStorage.getItem(this.SESSION_KEY);
        const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
        
        if (!sessionToken || !expiryTime) {
            return false;
        }

        const now = Date.now();
        if (now > parseInt(expiryTime)) {
            this.clearSession();
            return false;
        }

        return true;
    }

    // Validate credentials
    validateCredentials(username, password) {
        return username === this.CREDENTIALS.username && 
               password === this.CREDENTIALS.password;
    }

    // Create new session
    createSession() {
        const sessionToken = this.generateSessionToken();
        const expiryTime = Date.now() + this.SESSION_TIMEOUT;
        
        localStorage.setItem(this.SESSION_KEY, sessionToken);
        localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
        
        return sessionToken;
    }

    // Clear session (logout)
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.SESSION_EXPIRY_KEY);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');
    }

    // Update session expiry time
    updateSessionExpiry() {
        if (this.isLoggedIn()) {
            const newExpiry = Date.now() + this.SESSION_TIMEOUT;
            localStorage.setItem(this.SESSION_EXPIRY_KEY, newExpiry.toString());
        }
    }

    // Setup login form
    setupLoginForm() {
        const loginForm = document.getElementById('adminLoginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            
            if (this.validateCredentials(username, password)) {
                this.createSession();
                this.redirectToDashboard();
            } else {
                this.showLoginError();
            }
        });
    }

    // Setup logout button
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Setup auto-logout timer
    setupAutoLogout() {
        // Check every minute if session expired
        setInterval(() => {
            if (!this.isLoggedIn()) {
                this.redirectToLogin();
            }
        }, 60000);

        // Reset timer on user activity
        const resetTimer = () => this.updateSessionExpiry();
        
        document.addEventListener('mousemove', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('click', resetTimer);
    }

    // Generate session token
    generateSessionToken() {
        return 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
    }

    // Show login error
    showLoginError() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-times"></i> ACCESS DENIED';
            loginBtn.style.background = '#FF003C';
            loginBtn.style.color = '#FFF';
            
            setTimeout(() => {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ACCESS ADMIN PANEL';
                loginBtn.style.background = '';
                loginBtn.style.color = '';
            }, 2000);
        }
    }

    // Redirect to dashboard
    redirectToDashboard() {
        // Add success animation before redirect
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> ACCESS GRANTED';
            loginBtn.style.background = '#00FF9D';
            loginBtn.style.color = '#000';
        }
        
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1000);
    }

    // Redirect to login page
    redirectToLogin() {
        // Save the current page to return to after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'admin-login.html';
    }

    // Logout user
    logout() {
        this.clearSession();
        this.redirectToLogin();
    }
}

// Initialize session manager
const sessionManager = new SessionManager();
document.addEventListener('DOMContentLoaded', () => sessionManager.init());