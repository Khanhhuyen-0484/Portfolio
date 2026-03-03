// Mobile Navigation
(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      // Toggle hamburger animation
      this.classList.toggle('active');
      
      // Toggle overlay
      if (mobileOverlay) {
        mobileOverlay.classList.toggle('active');
      }
      
      // Toggle drawer
      if (mobileDrawer) {
        mobileDrawer.classList.toggle('active');
      }
      
      // Toggle body scroll
      document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking overlay
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        this.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    }
    
    // Close menu when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }
})();

// Basic scroll reveal using Intersection Observer
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Lightweight fake submit for contact form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      alert('Cảm ơn bạn đã chia sẻ dự án! Mình sẽ phản hồi sớm nhất có thể.');
    });
  }
})();

