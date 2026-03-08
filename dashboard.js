
/**
 * BYULOGISTICS - Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Set current date
    setCurrentDate();
    
    // Initialize functions
    initSidebar();
    initMobileMenu();
    initShipmentModal();
    initMenuItems();
    initLogout();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
        // Not logged in, redirect to index
        window.location.href = 'index.html';
    }
}

// Set current date
function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('id-ID', options);
    }
    
    // Set default date for shipment form
    const shipDateInput = document.getElementById('shipDate');
    if (shipDateInput) {
        const today = new Date().toISOString().split('T')[0];
        shipDateInput.value = today;
    }
}

// Sidebar toggle
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-collapsed');
        });
    }
}

// Mobile menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Shipment Modal
function initShipmentModal() {
    const newShipmentBtn = document.getElementById('newShipmentBtn');
    const shipmentModal = document.getElementById('shipmentModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCancel = document.querySelector('.modal-cancel');
    const shipmentForm = document.getElementById('shipmentForm');
    
    // Open modal
    if (newShipmentBtn && shipmentModal) {
        newShipmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            shipmentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal functions
    function closeModal() {
        if (shipmentModal) {
            shipmentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Close on button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && shipmentModal && shipmentModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Form submit
    if (shipmentForm) {
        shipmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success notification
            showNotification('Pengiriman berhasil dibuat!', 'success');
            
            // Reset and close modal
            shipmentForm.reset();
            
            // Set default date again
            const shipDateInput = document.getElementById('shipDate');
            if (shipDateInput) {
                const today = new Date().toISOString().split('T')[0];
                shipDateInput.value = today;
            }
            
            setTimeout(closeModal, 1000);
        });
    }
}

// Menu items
function initMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            // Get the href attribute
            const href = this.getAttribute('href');
            
            // If href is a real page (not "#"), allow default navigation
            if (href && href !== '#' && !href.startsWith('data:')) {
                // Remove active class from all
                menuItems.forEach(function(mi) {
                    mi.classList.remove('active');
                });
                // Add active to clicked
                this.classList.add('active');
                // Let the default navigation happen
                return;
            }
            
            // For placeholder links, prevent default
            e.preventDefault();
            
            // Remove active class from all
            menuItems.forEach(function(mi) {
                mi.classList.remove('active');
            });
            
            // Add active to clicked
            this.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('active');
            }
        });
    });
}

// Logout function
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear session (localStorage)
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            
            // Show notification
            showNotification('Logout berhasil!', 'success');
            
            // Redirect to login page after delay
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Notification function
function showNotification(message, type) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

console.log('BYULOGISTICS Dashboard loaded successfully!');

