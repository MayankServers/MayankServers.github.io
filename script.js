// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
});

// Prevent menu close when clicking inside menu
navMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Close mobile menu if open
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      
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
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  // Close mobile menu on upward swipe
  if (diff > swipeThreshold && navMenu.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
}

// Optimize form submission for mobile
// Form submission handler with loading state
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  
  // Re-enable button after a delay (form will redirect via Formspree)
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }, 3000);
});

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

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  // Delay to allow for orientation change to complete
  setTimeout(() => {
    // Recalculate viewport height
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    
    // Close mobile menu on orientation change
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }, 100);
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
  }
  
  .nav-link.active::after {
    width: 100%;
  }
`;