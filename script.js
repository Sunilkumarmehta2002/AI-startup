// NexusAI Pro - Interactive JavaScript

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const contactForm = document.querySelector('.contact-form form');

// Mobile Menu Toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) return;
    if (!e.target.closest('.hamburger') && !e.target.closest('.nav-menu')) return;
    if (e.target.closest('.hamburger')) return;
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Navbar Scroll Effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scrolling down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scrolling up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Internal Links with Mobile Optimization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            const headerOffset = window.innerWidth <= 991 ? 70 : 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.service-card, .pricing-card, .feature-item, .step, .founder-card, .contact-item');
animateElements.forEach(el => {
    observer.observe(el);
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const businessType = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !phone || !businessType) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Phone validation (Indian format)
        const phonePattern = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        if (!phonePattern.test(cleanPhone)) {
            showNotification('Please enter a valid Indian mobile number', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Thank you! We will contact you soon.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Redirect to WhatsApp with pre-filled message
            const whatsappMessage = `Hi! I'm ${name} from ${businessType}. I'm interested in your AI automation services. My email: ${email}, Phone: ${phone}. ${message ? 'Additional info: ' + message : ''}`;
            const whatsappUrl = `https://wa.me/917297810859?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
        }, 2000);
    });
}

// Notification System with Mobile Optimization
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const isMobile = window.innerWidth <= 767;
    const notificationHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.innerHTML = notificationHTML;
    
    // Add styles with mobile optimization
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 80px; left: 10px; right: 10px;' : 'top: 20px; right: 20px;'}
        z-index: 10000;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(${isMobile ? '0' : '100%'});
        transition: transform 0.3s ease;
        ${isMobile ? 'max-width: calc(100vw - 20px);' : 'max-width: 400px;'}
        word-wrap: break-word;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    if (notification && notification.parentNode) {
        const isMobile = window.innerWidth <= 767;
        notification.style.transform = isMobile ? 'translateX(0)' : 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// WhatsApp Button Click Tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function(e) {
        console.log('WhatsApp button clicked');
        // Ensure it opens in a new tab on mobile
        if (window.innerWidth <= 767) {
            e.preventDefault();
            window.open(this.href, '_blank');
        }
    });
});

// Pricing Card Hover Effects (with touch support)
document.querySelectorAll('.pricing-card').forEach(card => {
    // Desktop hover
    card.addEventListener('mouseenter', function() {
        if (window.innerWidth > 767) {
            this.style.transform = this.classList.contains('featured') ? 'scale(1.05) translateY(-10px)' : 'translateY(-10px)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (window.innerWidth > 767) {
            this.style.transform = this.classList.contains('featured') ? 'scale(1.05)' : '';
        }
    });
    
    // Touch support
    card.addEventListener('touchstart', function() {
        this.style.opacity = '0.9';
    });
    
    card.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
});

// Service Card Click to Learn More
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3').textContent;
        const message = `Hi! I want to learn more about your ${serviceName} service.`;
        const whatsappUrl = `https://wa.me/917297810859?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});

// Pricing Button Actions with Mobile Support
document.querySelectorAll('.pricing-card button, .plan-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const card = this.closest('.pricing-card');
        const planName = card ? card.querySelector('h3')?.textContent : 'Premium Plan';
        const price = card ? card.querySelector('.pricing-price')?.textContent : 'Contact us';
        const message = `Hi! I'm interested in the ${planName} plan (${price}). Can you provide more details?`;
        const whatsappUrl = `https://wa.me/917297810859?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});

// Floating Animation for Hero Cards with Mobile Optimization
function animateFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    if (window.innerWidth <= 767) {
        // Disable complex animations on mobile
        cards.forEach(card => {
            card.style.animation = 'none';
        });
    } else {
        cards.forEach((card, index) => {
            const delay = index * 2000;
            card.style.animationDelay = `${delay}ms`;
        });
    }
}

// Initialize floating cards animation
document.addEventListener('DOMContentLoaded', animateFloatingCards);

// Re-animate on resize
window.addEventListener('resize', animateFloatingCards);

// Parallax Effect for Hero Section (disable on mobile)
window.addEventListener('scroll', () => {
    if (window.innerWidth <= 767) return; // Disable parallax on mobile
    
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Touch Support for Better Mobile Interaction
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, button');
        buttons.forEach(btn => {
            if (e.target === btn || e.target.closest('button')) {
                btn.classList.add('touch-active');
                setTimeout(() => btn.classList.remove('touch-active'), 200);
            }
        });
    }, false);
}

// Dynamic Year Update
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace('2026', currentYear);
    });
});

// Viewport Height Fix for Mobile (address bars)
function updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

updateViewportHeight();
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

// Loading Screen (if needed)
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Testimonials Slider (if added later)
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto play
    setInterval(nextSlide, 5000);
    
    // Initialize
    showSlide(0);
}

// Call testimonials slider if testimonials section exists
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// FAQ Accordion (if added later)
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('open');
                faq.querySelector('.faq-answer').style.maxHeight = '0';
            });
            
            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Call FAQ accordion if FAQ section exists
document.addEventListener('DOMContentLoaded', initFAQAccordion);

// Performance Optimization
if ('IntersectionObserver' in window) {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Console Welcome Message
console.log(`
%c🚀 NexusAI Pro 
%cWebsite loaded successfully!
Founded by: Sunil Kumar Mehta & Himanshu Raj
`, 
'color: #00E5FF; font-size: 20px; font-weight: bold;',
'color: #6C3BFF; font-size: 14px;'
);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        closeNotification,
        initTestimonialsSlider,
        initFAQAccordion
    };
}

// Call FAQ accordion if FAQ section exists
document.addEventListener('DOMContentLoaded', initFAQAccordion);

// Performance Optimization
if ('IntersectionObserver' in window) {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can implement error tracking here
});

// Console Welcome Message
console.log(`
%c🚀 NexusAI Pro 
%cWebsite loaded successfully!
Founded by: Sunil Kumar Mehta & Himanshu Raj
`, 
'color: #00E5FF; font-size: 20px; font-weight: bold;',
'color: #6C3BFF; font-size: 14px;'
);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        closeNotification,
        initTestimonialsSlider,
        initFAQAccordion
    };
}