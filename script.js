/**
 * BYULOGISTICS - Interactive JavaScript
 * Landing page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavbar();
    initScrollAnimations();
    initStatsCounter();
    initSmoothScroll();
    initMobileMenu();
    initContactForm();
    initParallax();
    initLoginModal();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.service-card, .fleet-card');
    
    const revealCallback = function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // DON'T unobserve - keep element visible forever
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(function(el, index) {
        el.classList.add('reveal');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

/**
 * Stats counter animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;
    
    function startCounter() {
        statNumbers.forEach(function(stat) {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            function updateCounter() {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString() + '+';
                }
            }
            
            updateCounter();
        });
    }
    
    const statsSection = document.querySelector('.stats');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !started) {
                started = true;
                startCounter();
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Show success message (simulated)
            showNotification('Terima kasih! Pesan Anda telah terkirim. Tim kami akan menghubungi Anda segera.', 'success');
            
            // Reset form
            form.reset();
        });
    }
}

/**
 * Notification system
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxElements = hero.querySelectorAll('.truck-img, .container-img');
                parallaxElements.forEach(function(el) {
                    const speed = 0.3;
                    el.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
                });
            }
        });
    }
}

/**
 * Add CSS animation keyframes dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

/**
 * Newsletter form handling
 */
document.querySelectorAll('.newsletter-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const email = input.value;
        
        if (email) {
            showNotification('Terima kasih telah berlangganan newsletter kami!', 'success');
            input.value = '';
        }
    });
});

/**
 * Service card hover effect
 */
document.querySelectorAll('.service-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * Fleet card hover effect
 */
document.querySelectorAll('.fleet-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * Form input focus effect
 */
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function(input) {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

/**
 * Button hover sound effect (optional - commented out)
 * Uncomment if you want to add sound effects
 */
// const hoverSound = new Audio('path/to/sound.mp3');
// document.querySelectorAll('.btn').forEach(function(btn) {
//     btn.addEventListener('mouseenter', function() {
//         hoverSound.currentTime = 0;
//         hoverSound.play().catch(() => {});
//     });
// });

/**
 * Lazy loading for images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

/**
 * Scroll to top button
 */
function createScrollTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #f59e0b;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(245, 158, 11, 0.4);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    `;
    
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

createScrollTopButton();

/**
 * Login Modal Functionality
 */
function initLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnMobile = document.getElementById('loginBtnMobile');
    const loginModal = document.getElementById('loginModal');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginClose = document.getElementById('loginClose');
    const loginForm = document.getElementById('loginForm');
    
    // Open modal - desktop
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open modal - mobile
    if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Close mobile menu
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    }
    
    // Close modal - overlay
    if (loginOverlay) {
        loginOverlay.addEventListener('click', function() {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal - button
    if (loginClose) {
        loginClose.addEventListener('click', function() {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal - Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Check credentials (demo: admin@gmail.com / admin123)
            if (email === 'admin@gmail.com' && password === 'admin123') {
                // Save session
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                showNotification('Login berhasil! Mengalihkan ke dashboard...', 'success');
                
                // Redirect to dashboard after delay
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showNotification('Email atau password salah!', 'error');
            }
        });
    }
}

console.log('BYULOGISTICS - Landing page initialized successfully!');

