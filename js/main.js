// ============================================
// Modern Linear & Aurora Interactive Scripts
// ============================================

// 1. Mobile Navigation Drawer
(function() {
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      if (mobileOverlay) mobileOverlay.classList.toggle('active');
      if (mobileDrawer) mobileDrawer.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function() {
        hamburger.classList.remove('active');
        this.classList.remove('active');
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    }
    
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

// 2. Linear-Style Cursor Spotlight Tracker
(function() {
  const spotlightSelector = [
    '.project-card',
    '.process-card',
    '.focus-card',
    '.frontend-card',
    '.snapshot-grid article',
    '.about-highlight-item',
    '.contact-card',
    '.skill-category',
    '.contribution-grid article',
    '.wann-highlight-card',
    '.sen-highlight-card',
    '.kid-highlight-card',
    '.ai-highlight-card',
    '.ultra-highlight-card',
    '.elogi-highlight-card',
    '.prank-highlight-card',
    '.kid-process article',
    '.ai-screen-card',
    '.ultra-screen-card',
    '.home-profile-card',
    '.ready-box'
  ].join(', ');

  const updateSpotlight = () => {
    const cards = document.querySelectorAll(spotlightSelector);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSpotlight);
  } else {
    updateSpotlight();
  }
})();

// 3. Scroll Reveal using Intersection Observer
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add('reveal-visible'));
  } else {
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
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // 4. Project Filter Chips with Smooth Transitions
  const filterButtons = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  if (filterButtons.length && projectCards.length) {
    const animateCard = (card, show) => {
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.classList.remove('is-hidden');
          card.classList.add('is-visible');
        });
      } else {
        card.classList.remove('is-visible');
        card.classList.add('is-hidden');
        window.setTimeout(() => {
          if (card.classList.contains('is-hidden')) {
            card.style.display = 'none';
          }
        }, 220);
      }
    };

    const applyFilter = (filter) => {
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        animateCard(card, show);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterButtons.forEach((btn) => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        applyFilter(filter);
      });
    });

    applyFilter('all');
  }

  // 5. Header Scroll Glass Blur Depth
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }
})();
