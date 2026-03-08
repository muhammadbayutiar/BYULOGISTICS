
/**
 * BYULOGISTICS - Login Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initPasswordToggle();
    initFormValidation();
});

/**
 * Initialize login functionality
 */
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Demo credentials - change this to your actual authentication
            const validEmail = 'admin@byulogistics.com';
            const validPassword = 'admin123';
            
            if (email === validEmail && password === validPassword) {
                // Admin login - redirect to admin dashboard
                showNotification('Login berhasil sebagai Admin! Mengalihkan ke dashboard...', 'success');
                
                setTimeout(function() {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userRole', 'admin');
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else if (email === 'customer@byulogistics.com' && password === 'customer123') {
                // Customer login - redirect to customer dashboard
                showNotification('Login berhasil sebagai Customer! Mengalihkan...', 'success');
                setTimeout(function() {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userRole', 'customer');
                    window.location.href = 'customer-dashboard.html';
                }, 1500);
            } else {
                // Login failed
                showNotification('Email atau password salah. Silakan coba lagi.', 'error');
                
                // Add shake animation
                const formWrapper = document.querySelector('.login-form-wrapper');
                formWrapper.classList.add('shake');
                setTimeout(function() {
                    formWrapper.classList.remove('shake');
                }, 500);
            }
        });
    }
}

/**
 * Password visibility toggle
 */
function initPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (toggleButton && passwordInput) {
        toggleButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

/**
 * Form validation
 */
function initFormValidation() {
    const inputs = document.querySelectorAll('.login-form input[required]');
    
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';
    
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            isValid = false;
            message = 'Email harus diisi';
        } else if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Format email tidak valid';
        }
    } else if (input.type === 'password') {
        if (!value) {
            isValid = false;
            message = 'Password harus diisi';
        } else if (value.length < 6) {
            isValid = false;
            message = 'Password minimal 6 karakter';
        }
    }
    
    // Update UI
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            input.classList.add('error');
            const errorDiv = document.createElement('span');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 0.3rem;';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        } else {
            input.classList.remove('error');
        }
    }
    
    return isValid;
}

/**
 * Show notification
 */
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.style.display = 'block';
        
        if (type === 'success') {
            notification.classList.add('success');
            notification.querySelector('i').classList.remove('fa-exclamation-circle');
            notification.querySelector('i').classList.add('fa-check-circle');
        } else {
            notification.classList.remove('success');
            notification.querySelector('i').classList.remove('fa-check-circle');
            notification.querySelector('i').classList.add('fa-exclamation-circle');
        }
        
        // Hide after 5 seconds
        setTimeout(function() {
            notification.style.display = 'none';
        }, 5000);
    }
}

/**
 * Check if already logged in
 */
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Run check on page load
checkLoginStatus();

// Add shake animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    .input-wrapper input.error {
        border-color: #ef4444;
    }
`;
document.head.appendChild(style);

console.log('BYULOGISTICS - Login page initialized!');

