// Package data
const packages = {
    basic: {
        name: 'Basic Package',
        amount: '2,450',
        price: '$25',
        currency: 'USDT',
        features: ['Instant Processing', 'Secure Transaction', 'Email Support']
    },
    popular: {
        name: 'Popular Package',
        amount: '4,670',
        price: '$44',
        currency: 'USDT',
        features: ['Instant Processing', 'Secure Transaction', 'Priority Support', 'Transaction Tracking']
    },
    premium: {
        name: 'Premium Package',
        amount: '7,890',
        price: '$35',
        currency: 'USDT',
        discount: 'Special Discount!',
        features: ['Instant Processing', 'Secure Transaction', '24/7 Support', 'Transaction Tracking', 'Priority Processing']
    },
    mega: {
        name: 'Mega Package',
        amount: '13,000',
        price: '$99',
        originalPrice: '$149',
        currency: 'USDT',
        discount: 'Save $50',
        features: ['Instant Processing', 'Secure Transaction', '24/7 Priority Support', 'Transaction Tracking', 'Priority Processing', 'Exclusive Benefits']
    }
};

// DOM Elements
const modal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
const selectedPackageInfo = document.getElementById('selectedPackageInfo');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const selectPackageBtns = document.querySelectorAll('.select-package');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Package selection
selectPackageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const packageType = btn.dataset.package;
        openModal(packageType);
    });
});

// Open modal with package info
function openModal(packageType) {
    const pkg = packages[packageType];
    if (!pkg) return;

    // Create package info HTML
    let packageHTML = `
        <div class="package-summary">
            <h4>${pkg.name}</h4>
            <div class="package-amount">
                <span class="currency">${pkg.currency}</span>
                <span class="amount">${pkg.amount}</span>
            </div>
            <div class="package-price">
                <span class="price">${pkg.price}</span>
                ${pkg.originalPrice ? `<span class="original-price">${pkg.originalPrice}</span>` : ''}
                ${pkg.discount ? `<span class="discount">${pkg.discount}</span>` : ''}
            </div>
        </div>
    `;

    selectedPackageInfo.innerHTML = packageHTML;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Store selected package
    orderForm.dataset.selectedPackage = packageType;
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    orderForm.reset();
}

// Event listeners for modal closing
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Form validation and submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const packageType = orderForm.dataset.selectedPackage;
    const pkg = packages[packageType];
    
    // Get form values
    const walletAddress = formData.get('walletAddress').trim();
    const email = formData.get('email').trim();
    const telegram = formData.get('telegram').trim();
    
    // Validation
    if (!validateForm(walletAddress, email)) {
        return;
    }
    
    // Show loading state
    const submitBtn = orderForm.querySelector('.btn-primary');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    try {
        await processOrder({
            package: pkg,
            walletAddress,
            email,
            telegram
        });
        
        // Show success message
        showSuccessMessage(pkg);
        
        // Reset form
        orderForm.reset();
        closeModal();
        
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        // Restore button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Form validation
function validateForm(walletAddress, email) {
    // Validate ETH wallet address
    if (!walletAddress) {
        showError('Please enter your ETH wallet address');
        return false;
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        showError('Please enter a valid ETH wallet address starting with 0x');
        return false;
    }
    
    // Validate email
    if (!email) {
        showError('Please enter your email address');
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Process order (simulation)
async function processOrder(orderData) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (in real app, this would be an API call)
            if (Math.random() > 0.1) { // 90% success rate for demo
                resolve(orderData);
            } else {
                reject(new Error('Payment processing failed. Please try again.'));
            }
        }, 2000);
    });
}

// Show success message
function showSuccessMessage(pkg) {
    const successHTML = `
        <div class="success-notification">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Order Confirmed!</h3>
            <p>Your ${pkg.name} order has been successfully processed.</p>
            <p>You will receive a confirmation email shortly with your transaction details.</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                Got it!
            </button>
        </div>
    `;
    
    const notification = document.createElement('div');
    notification.className = 'notification-overlay';
    notification.innerHTML = successHTML;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const errorHTML = `
        <div class="error-notification">
            <div class="error-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Order Failed</h3>
            <p>${message}</p>
            <button class="btn-secondary" onclick="this.parentElement.parentElement.remove()">
                Close
            </button>
        </div>
    `;
    
    const notification = document.createElement('div');
    notification.className = 'notification-overlay';
    notification.innerHTML = errorHTML;
    document.body.appendChild(notification);
}

// Show error (inline)
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Insert after the form title
    const modalHeader = document.querySelector('.modal-header');
    modalHeader.after(errorDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.package-card, .step-card, .section-header');
    animateElements.forEach(el => observer.observe(el));
});

// Add animation classes
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        backdrop-filter: blur(5px);
    }
    
    .success-notification,
    .error-notification {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        animation: slideIn 0.3s ease-out;
    }
    
    .success-icon {
        color: #28a745;
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .error-icon {
        color: #dc3545;
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .success-notification h3,
    .error-notification h3 {
        margin-bottom: 1rem;
        color: #1a1a1a;
    }
    
    .success-notification p,
    .error-notification p {
        color: #6c757d;
        margin-bottom: 1.5rem;
    }
    
    .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid #f5c6cb;
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Add floating animation to hero card
const floatingCard = document.querySelector('.floating-card');
if (floatingCard) {
    floatingCard.addEventListener('mouseenter', () => {
        floatingCard.style.animationDuration = '1s';
    });
    
    floatingCard.addEventListener('mouseleave', () => {
        floatingCard.style.animationDuration = '3s';
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 500);
    }
});

// Add hover effects to package cards
document.querySelectorAll('.package-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(0) scale(1)';
        } else {
            this.style.transform = 'translateY(0) scale(1.05)';
        }
    });
});

// Add number counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize counter animations when elements come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.textContent.replace(/,/g, ''));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

// Observe all amount elements
document.querySelectorAll('.amount').forEach(amount => {
    counterObserver.observe(amount);
});

// Add copy to clipboard functionality for wallet addresses
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy to clipboard');
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 4000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add CSS for toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

console.log('Flash USDT website loaded successfully! 🚀');