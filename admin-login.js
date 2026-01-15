// admin-login.js - Frank Auto Deals Admin Login System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('adminLoginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordBtn = document.getElementById('showPassword');
    const loginBtn = document.querySelector('.login-btn');
    const captchaInput = document.querySelector('.captcha input');
    const backHomeBtn = document.querySelector('.back-home');
    const forgotPasswordBtn = document.querySelector('.forgot-password');
    const captchaCode = document.querySelector('.captcha-code');
    
    // Configuration
    const CONFIG = {
        adminUser: 'frankadmin',
        adminPass: 'FrankAuto2024!',
        captcha: 'FRANK-ADMIN-2024',
        maxAttempts: 5,
        lockoutTime: 15 * 60 * 1000, // 15 minutes in milliseconds
        sessionTimeout: 30 * 60 * 1000 // 30 minutes
    };
    
    // State Management
    let loginAttempts = JSON.parse(localStorage.getItem('loginAttempts')) || 0;
    let lockoutUntil = JSON.parse(localStorage.getItem('lockoutUntil')) || 0;
    
    // Initialize
    init();
    
    function init() {
        checkLockout();
        setupEventListeners();
        generateCaptcha();
        setupParticles();
        startSessionMonitor();
    }
    
    function setupEventListeners() {
        // Form submission
        loginForm.addEventListener('submit', handleLogin);
        
        // Show password toggle
        showPasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Input validation on blur
        usernameInput.addEventListener('blur', validateUsername);
        passwordInput.addEventListener('blur', validatePassword);
        captchaInput.addEventListener('input', validateCaptcha);
        
        // Real-time validation
        usernameInput.addEventListener('input', clearValidation);
        passwordInput.addEventListener('input', clearValidation);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Navigation
        backHomeBtn.addEventListener('click', handleBackHome);
        forgotPasswordBtn.addEventListener('click', handleForgotPassword);
        
        // Form auto-focus
        setTimeout(() => usernameInput.focus(), 500);
    }
    
    function checkLockout() {
        const now = Date.now();
        if (lockoutUntil > now) {
            const minutesLeft = Math.ceil((lockoutUntil - now) / (60 * 1000));
            disableForm(`Too many failed attempts. Try again in ${minutesLeft} minutes.`);
            showNotification(`Account locked. Please wait ${minutesLeft} minutes.`, 'error');
            return true;
        }
        return false;
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        if (checkLockout()) return;
        
        // Validate inputs
        if (!validateForm()) return;
        
        // Show loading state
        setButtonState('loading', 'Verifying...');
        
        // Simulate server delay (remove in production)
        setTimeout(() => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const captcha = captchaInput.value.trim();
            
            // Validate captcha
            if (captcha !== CONFIG.captcha) {
                handleLoginFailure('Invalid security code');
                return;
            }
            
            // Check credentials
            if (username === CONFIG.adminUser && password === CONFIG.adminPass) {
                handleLoginSuccess();
            } else {
                handleLoginFailure('Invalid credentials');
            }
        }, 800);
    }
    
    function handleLoginSuccess() {
        // Reset attempts
        loginAttempts = 0;
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        
        // Save session token
        const sessionToken = generateSessionToken();
        localStorage.setItem('adminSession', sessionToken);
        localStorage.setItem('sessionExpiry', Date.now() + CONFIG.sessionTimeout);
        
        // Success animation
        loginForm.classList.add('success');
        setButtonState('success', 'ACCESS GRANTED');
        
        // Log successful login
        logActivity('Successful login attempt', 'info');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1200);
    }
    
    function handleLoginFailure(message) {
        loginAttempts++;
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        
        // Check if lockout is needed
        if (loginAttempts >= CONFIG.maxAttempts) {
            lockoutUntil = Date.now() + CONFIG.lockoutTime;
            localStorage.setItem('lockoutUntil', JSON.stringify(lockoutUntil));
            disableForm('Account locked due to multiple failed attempts');
            showNotification('Account locked for 15 minutes', 'error');
            logActivity('Account locked due to failed attempts', 'warning');
        } else {
            // Failure animation
            loginForm.classList.add('shake');
            setButtonState('error', `ACCESS DENIED (${loginAttempts}/${CONFIG.maxAttempts})`);
            
            // Generate new captcha
            generateCaptcha();
            
            // Show error message
            showNotification(`${message}. Attempts: ${loginAttempts}/${CONFIG.maxAttempts}`, 'error');
            
            // Clear password field
            passwordInput.value = '';
            captchaInput.value = '';
            passwordInput.focus();
            
            // Log failed attempt
            logActivity(`Failed login attempt: ${usernameInput.value}`, 'warning');
            
            // Remove shake animation after completion
            setTimeout(() => loginForm.classList.remove('shake'), 500);
            
            // Reset button after delay
            setTimeout(() => {
                setButtonState('idle', 'ACCESS ADMIN PANEL');
            }, 2500);
        }
    }
    
    function validateForm() {
        const validations = [
            validateUsername(),
            validatePassword(),
            validateCaptcha()
        ];
        
        return validations.every(v => v);
    }
    
    function validateUsername() {
        const username = usernameInput.value.trim();
        const minLength = 3;
        const maxLength = 20;
        
        if (!username) {
            showInputError(usernameInput, 'Username is required');
            return false;
        }
        
        if (username.length < minLength || username.length > maxLength) {
            showInputError(usernameInput, `Username must be ${minLength}-${maxLength} characters`);
            return false;
        }
        
        clearInputError(usernameInput);
        return true;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            showInputError(passwordInput, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            showInputError(passwordInput, 'Password must be at least 8 characters');
            return false;
        }
        
        clearInputError(passwordInput);
        return true;
    }
    
    function validateCaptcha() {
        const captcha = captchaInput.value.trim();
        
        if (!captcha) {
            showInputError(captchaInput, 'Security code is required');
            return false;
        }
        
        if (captcha !== CONFIG.captcha) {
            showInputError(captchaInput, 'Security code does not match');
            return false;
        }
        
        clearInputError(captchaInput);
        return true;
    }
    
    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        const icon = showPasswordBtn.querySelector('i');
        
        passwordInput.type = type;
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        // Add animation
        showPasswordBtn.classList.add('active');
        setTimeout(() => showPasswordBtn.classList.remove('active'), 300);
    }
    
    function generateCaptcha() {
        // In production, use a server-generated captcha
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        CONFIG.captcha = code;
        captchaCode.textContent = code;
        
        // Add subtle animation
        captchaCode.style.opacity = '0.7';
        setTimeout(() => {
            captchaCode.style.transition = 'opacity 0.3s ease';
            captchaCode.style.opacity = '1';
        }, 50);
    }
    
    function setButtonState(state, text) {
        const iconMap = {
            loading: 'fas fa-spinner fa-spin',
            success: 'fas fa-check',
            error: 'fas fa-times',
            idle: 'fas fa-sign-in-alt'
        };
        
        const colorMap = {
            loading: '#0066ff',
            success: '#00ff9d',
            error: '#ff003c',
            idle: ''
        };
        
        loginBtn.innerHTML = `<i class="${iconMap[state]}"></i> ${text}`;
        loginBtn.style.background = colorMap[state] || '';
        loginBtn.style.color = state === 'success' ? '#000' : '#fff';
        
        if (state === 'loading') {
            loginBtn.classList.add('loading');
        } else {
            loginBtn.classList.remove('loading');
        }
    }
    
    function showInputError(input, message) {
        const group = input.closest('.input-group') || input.closest('.captcha');
        let errorElement = group.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            group.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff003c;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;
        
        input.style.borderColor = '#ff003c';
        input.style.boxShadow = '0 0 10px rgba(255, 0, 60, 0.2)';
    }
    
    function clearInputError(input) {
        const group = input.closest('.input-group') || input.closest('.captcha');
        const errorElement = group.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
    
    function clearValidation() {
        // Clear any existing error messages for this input
        const input = event.target;
        clearInputError(input);
    }
    
    function disableForm(message) {
        const inputs = loginForm.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.6';
            input.style.cursor = 'not-allowed';
        });
        
        // Show lockout message
        const lockoutMessage = document.createElement('div');
        lockoutMessage.className = 'lockout-message';
        lockoutMessage.innerHTML = `
            <i class="fas fa-lock"></i>
            <span>${message}</span>
        `;
        lockoutMessage.style.cssText = `
            text-align: center;
            color: #ff003c;
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 0, 60, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 0, 60, 0.3);
        `;
        
        loginForm.insertBefore(lockoutMessage, loginBtn);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const colors = {
            success: '#00ff9d',
            error: '#ff003c',
            info: '#0066ff',
            warning: '#ff9900'
        };
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 15, 30, 0.95);
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid ${colors[type]};
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function handleKeyboardShortcuts(e) {
        // Ctrl+Enter to submit form
        if (e.ctrlKey && e.key === 'Enter') {
            loginForm.requestSubmit();
        }
        
        // Esc to clear form
        if (e.key === 'Escape') {
            loginForm.reset();
            clearAllErrors();
        }
        
        // Tab to navigate between form elements
        if (e.key === 'Tab') {
            e.preventDefault();
            const focusable = loginForm.querySelectorAll('input, button');
            const current = document.activeElement;
            const currentIndex = Array.from(focusable).indexOf(current);
            const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
            
            if (nextIndex >= 0 && nextIndex < focusable.length) {
                focusable[nextIndex].focus();
            }
        }
    }
    
    function clearAllErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
    }
    
    function handleBackHome(e) {
        e.preventDefault();
        showNotification('Redirecting to home page...', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
    
    function handleForgotPassword(e) {
        e.preventDefault();
        showNotification('Please contact system administrator to reset your password.', 'info');
        
        // In production, this would open a password reset modal
        console.log('Password reset requested for:', usernameInput.value);
    }
    
    function setupParticles() {
        const container = document.getElementById('loginParticles');
        if (!container) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(container);
        }
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 255, 157, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            z-index: 1;
        `;
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        container.appendChild(particle);
        
        // Animate particle
        animateParticle(particle, x, y);
    }
    
    function animateParticle(particle, startX, startY) {
        const duration = Math.random() * 10 + 10;
        const amplitude = Math.random() * 20 + 10;
        
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / (duration * 1000);
            
            if (progress < 1) {
                const x = startX + Math.sin(progress * Math.PI * 2) * amplitude;
                const y = startY + progress * 100;
                
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.opacity = 1 - progress;
                
                requestAnimationFrame(step);
            } else {
                particle.remove();
                createParticle(particle.parentNode);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    function generateSessionToken() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    function startSessionMonitor() {
        // Check for existing expired session
        const expiry = localStorage.getItem('sessionExpiry');
        if (expiry && Date.now() > parseInt(expiry)) {
            localStorage.removeItem('adminSession');
            localStorage.removeItem('sessionExpiry');
        }
    }
    
    function logActivity(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            type,
            message,
            userAgent: navigator.userAgent,
            ip: '127.0.0.1' // In production, get from server
        };
        
        // Get existing logs
        const logs = JSON.parse(localStorage.getItem('adminLogs')) || [];
        logs.unshift(logEntry);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.pop();
        }
        
        localStorage.setItem('adminLogs', JSON.stringify(logs));
        
        // In production, send to server
        console.log(`[ADMIN LOG - ${type.toUpperCase()}] ${timestamp}: ${message}`);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .success .input-group input {
            border-color: #00ff9d !important;
            box-shadow: 0 0 15px rgba(0, 255, 157, 0.3) !important;
        }
        
        .active {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});