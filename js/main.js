// ===================================================
// LUXURY INTERACTIVE SCRIPTS & MOTION CONTROLLER (2026)
// ===================================================

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

// 2. Sticky Header Blur Shadow on Scroll
(function() {
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }
})();

// 3. Number Counting Animation on Scroll
(function() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const animateCount = (el) => {
    const text = el.textContent.trim();
    // Parse target number and suffix (e.g. "10+", "08+", "100%", "02")
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const isZeroPadded = match[1].startsWith('0') && match[1].length > 1;
    const duration = 1600; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      
      let displayNum = current.toString();
      if (isZeroPadded && current < 10) {
        displayNum = '0' + displayNum;
      }
      el.textContent = displayNum + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = text; // exact final text
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(num => animateCount(num));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsBox = document.querySelector('.stats-banner-box');
  if (statsBox) {
    observer.observe(statsBox);
  }
})();

// 4. Staggered Scroll Reveal Observer
(function() {
  const initScrollReveals = () => {
    const revealElements = document.querySelectorAll('.reveal, section, .featured-card, .capability-item, .process-step-item, .contact-card, .case-card, .wann-screen-card, .sen-screen-card, .ai-screen-card, .ultra-screen-card');
    
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('reveal-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 60px 0px'
    });

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If already in initial viewport, display immediately without delay
      if (rect.top < windowHeight + 50 && rect.bottom > -50) {
        el.classList.add('reveal-visible');
      } else {
        el.classList.add('reveal-init');
        revealObserver.observe(el);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveals);
  } else {
    initScrollReveals();
  }
})();

// 5. Project Filter Chips with Smooth Animation
(function() {
  const filterButtons = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;
          
          if (shouldShow) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (card.style.opacity === '0') {
                card.style.display = 'none';
              }
            }, 250);
          }
        });
      });
    });
  }
})();

// 6. Interactive 3D Cursor Spotlight on Cards
(function() {
  const cards = document.querySelectorAll('.featured-card, .hero-showcase-card, .portrait-frame, .metallic-badge-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

// 7. Dynamic Starry Cosmos Background & Mouse Parallax
(function() {
  const gradient = document.querySelector('.gradient');
  if (!gradient) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  gradient.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const stars = [];
  const starCount = Math.min(Math.floor((width * height) / 12000), 85);

  const colors = ['#ffffff', '#f8fafc', '#e2e8f0', '#38bdf8', '#a855f7', '#c084fc'];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      pulseFactor: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    });
  }

  // Cross stars
  const crossStars = [
    { x: width * 0.12, y: height * 0.18, size: 14 },
    { x: width * 0.88, y: height * 0.25, size: 18 },
    { x: width * 0.78, y: height * 0.72, size: 13 },
    { x: width * 0.18, y: height * 0.82, size: 16 },
    { x: width * 0.92, y: height * 0.55, size: 12 }
  ];

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  let time = 0;
  const render = () => {
    time += 0.02;
    ctx.clearRect(0, 0, width, height);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    const offsetX = (mouseX - width / 2) * 0.025;
    const offsetY = (mouseY - height / 2) * 0.025;

    // Draw twinkling dust stars
    stars.forEach(star => {
      star.pulseFactor += star.speed;
      const currentAlpha = Math.abs(Math.sin(star.pulseFactor)) * 0.6 + 0.2;
      
      star.x += star.vx;
      star.y += star.vy;
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      const px = star.x - offsetX * (star.radius * 1.5);
      const py = star.y - offsetY * (star.radius * 1.5);

      ctx.beginPath();
      ctx.arc(px, py, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    // Draw elegant 4-point cross stars (✦)
    crossStars.forEach((cs, idx) => {
      const pulse = Math.sin(time * 1.5 + idx) * 0.35 + 0.65;
      const px = cs.x - offsetX * 2;
      const py = cs.y - offsetY * 2;
      const size = cs.size * pulse;

      ctx.save();
      ctx.translate(px, py);
      ctx.globalAlpha = pulse * 0.7;
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';

      ctx.beginPath();
      // Draw 4-point diamond star
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size * 0.3, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fill();

      // Horizontal ray
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size * 0.3);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size * 0.3);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.fill();

      ctx.restore();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
})();

// 8. Direct Card Click Handler & Absolute Navigation
(function() {
  const initCardNavigation = () => {
    const cards = document.querySelectorAll('a.featured-card, a.project-card, a.hero-showcase-card, .featured-card, .project-card, .hero-showcase-card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        const href = this.getAttribute('href') || (this.querySelector('a') ? this.querySelector('a').getAttribute('href') : null);
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          // Guaranteed instant navigation
          window.location.href = href;
        }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardNavigation);
  } else {
    initCardNavigation();
  }
})();


// 9. Interactive Luxury Lightbox Zoom Modal
(function() {
  const initLightbox = () => {
    // Create Lightbox DOM if not exists
    let lightbox = document.getElementById('luxury-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'luxury-lightbox';
      lightbox.className = 'luxury-lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close-btn" aria-label="Close Preview">&times;</button>
        <div class="lightbox-content-wrapper">
          <img src="" alt="Enlarged Preview" class="lightbox-img" id="lightbox-img">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Preview';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!lightbox.classList.contains('is-open')) {
          lightboxImg.src = '';
        }
      }, 300);
    };

    // Attach click to all zoomable images & browser bodies
    document.querySelectorAll('.zoomable-img, .browser-window-body, .wann-screen-card img, .sen-screen-card img, .ai-screen-card img, .ultra-screen-card img').forEach(target => {
      target.style.cursor = 'zoom-in';
      target.addEventListener('click', (e) => {
        const img = target.tagName === 'IMG' ? target : target.querySelector('img');
        if (img && img.src) {
          e.stopPropagation();
          openLightbox(img.src, img.alt);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
