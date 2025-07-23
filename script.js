// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;
let isMenuOpen = false;

// Enhanced mobile menu toggle with animations
function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;
  
  hamburger.classList.toggle('active', isMenuOpen);
  
  if (isMenuOpen) {
    // Open menu
    navMenu.classList.add('mobile-menu');
    setTimeout(() => {
      navMenu.classList.add('active');
    }, 10);
    body.classList.add('menu-open');
    
    // Add swipe to close functionality
    addSwipeToClose();
  } else {
    // Close menu
    navMenu.classList.remove('active');
    body.classList.remove('menu-open');
    
    setTimeout(() => {
      navMenu.classList.remove('mobile-menu');
    }, 400);
    
    // Remove swipe listeners
    removeSwipeToClose();
  }
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  if (isMenuOpen) {
    toggleMobileMenu();
  }
}));

// Enhanced click outside to close
document.addEventListener('click', (e) => {
  if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    toggleMobileMenu();
  }
});

// Prevent menu close when clicking inside menu
navMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Swipe to close functionality
let touchStartY = 0;
let touchEndY = 0;
let swipeListenersAdded = false;

function handleTouchStart(e) {
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipeGesture();
}

function handleSwipeGesture() {
  const swipeThreshold = 50;
  const swipeDistance = touchStartY - touchEndY;
  
  // Swipe up to close menu
  if (swipeDistance > swipeThreshold && isMenuOpen) {
    toggleMobileMenu();
  }
}

function addSwipeToClose() {
  if (!swipeListenersAdded) {
    navMenu.addEventListener('touchstart', handleTouchStart, { passive: true });
    navMenu.addEventListener('touchend', handleTouchEnd, { passive: true });
    swipeListenersAdded = true;
  }
}

function removeSwipeToClose() {
  if (swipeListenersAdded) {
    navMenu.removeEventListener('touchstart', handleTouchStart);
    navMenu.removeEventListener('touchend', handleTouchEnd);
    swipeListenersAdded = false;
  }
}

// Close menu on orientation change
window.addEventListener('orientationchange', () => {
  if (isMenuOpen) {
    setTimeout(() => {
      toggleMobileMenu();
    }, 100);
  }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    toggleMobileMenu();
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Close mobile menu if open (handled by nav-link click listener above)
      
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Optimize scroll performance
let ticking = false;

// Navbar background on scroll
function updateNavbar() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(15, 23, 42, 0.98)';
  } else {
    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});

// Optimize intersection observer for better performance
// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      // Unobserve after animation to improve performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Reduce motion for users who prefer it
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// Observe skill cards and project cards for staggered animation
document.querySelectorAll('.skill-card, .project-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Observe anime items for staggered animation
document.querySelectorAll('.anime-item').forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
  observer.observe(item);
});
}
// Observe GitHub stats elements for staggered animation
document.querySelectorAll('.github-stats, .stats-title, .stat-card, .github-link').forEach((element, index) => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
  observer.observe(element);
});

// Touch-friendly interactions
// Enhanced touch interactions are now handled in the mobile menu section above

// Optimize form submission for mobile
// Form submission handler with loading state
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  const form = this;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  
  // Handle form submission with fetch for better UX
  e.preventDefault();
  
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // Success
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      form.reset();
      
      // Show success message
      showFormMessage('Thank you! Your message has been sent successfully.', 'success');
      
      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 3000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    // Error
    submitBtn.textContent = '✗ Failed to Send';
    submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    
    // Show error message
    showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    
    // Reset button after delay
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }, 3000);
  });
});

// Function to show form messages
function showFormMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  // Insert message after form
  const form = document.querySelector('.contact-form form');
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Optimize hover effects for touch devices
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});
} else {
  // Add touch feedback for mobile devices
  document.querySelectorAll('.project-card, .skill-card, .anime-item').forEach(card => {
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// Optimize button interactions
// Add click effect to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    // Prevent double-tap zoom on mobile
    e.preventDefault();
    
    // Handle actual navigation
    if (this.href) {
      setTimeout(() => {
        window.location.href = this.href;
      }, 100);
    }
    
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Optimize typing effect for mobile
// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  // Faster typing on mobile for better UX
  const mobileSpeed = window.innerWidth < 768 ? speed * 0.7 : speed;
  
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, mobileSpeed);
}

// Optimize parallax for mobile performance
// Initialize typing effect when page loads
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 80);
    }, 500);
  }
});

// Add parallax effect to hero section
function updateParallax() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  // Disable parallax on mobile for better performance
  if (hero && window.innerWidth > 768) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// Optimize active nav highlighting
let activeNavTicking = false;

// Add dynamic year to footer
document.addEventListener('DOMContentLoaded', () => {
  const currentYear = new Date().getFullYear();
  const footerText = document.querySelector('.footer-content p');
  if (footerText) {
    footerText.textContent = `© ${currentYear} Mayank Baswal. All rights reserved.`;
  }
});

// Add active nav link highlighting
function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionHeight = section.clientHeight;
    
    if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
  
  activeNavTicking = false;
}

window.addEventListener('scroll', () => {
  if (!activeNavTicking) {
    requestAnimationFrame(updateActiveNav);
    activeNavTicking = true;
  }
});

// Set initial viewport height
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

// Optimize image loading
document.addEventListener('DOMContentLoaded', () => {
  // Add loading="lazy" to GitHub stats images if not already present
  const statImages = document.querySelectorAll('.stat-card img');
  statImages.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
});

// Add CSS for active nav link
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active {
    color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }
  
  .nav-link.active::after {
    width: 100%;
  }
  
  /* Enhanced mobile menu active states */
  .nav-menu.mobile-menu .nav-link.active {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(139, 92, 246, 0.5);
  }
`;
document.head.appendChild(activeNavStyle);

// Performance optimization: Reduce animations on low-end devices
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

if (isLowEndDevice) {
  const performanceStyle = document.createElement('style');
  performanceStyle.textContent = `
    .hamburger span,
    .nav-menu.mobile-menu,
    .nav-menu.mobile-menu .nav-link {
      transition-duration: 0.2s !important;
    }
    
    .nav-menu.mobile-menu .nav-link::before {
      display: none;
    }
  `;
  document.head.appendChild(performanceStyle);
}

// Preload mobile menu styles for better performance
if (window.innerWidth <= 768) {
  const preloadStyle = document.createElement('style');
  preloadStyle.textContent = `
    .nav-menu.mobile-menu {
      transform: translateZ(0);
      will-change: height;
    }
    
    .nav-menu.mobile-menu .nav-link {
      transform: translateZ(0);
      will-change: transform, opacity;
    }
  `;
  document.head.appendChild(preloadStyle);
}