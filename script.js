
    // 1) ORDER TRACK PATH: animate the "moving" group along SVG path
    (function () {
      const path = document.getElementById('trackPath');
      const moving = document.getElementById('moving');

      if (path && moving) {
        const pathLen = path.getTotalLength();
        let start = null;
        let duration = 7000; // ms to complete one pass
        // ping-pong effect and sync steps highlight
        let direction = 1;

        function step(ts) {
          if (!start) start = ts;
          let t = (ts - start) % duration;
          let progress = t / duration;
          // ping-pong progress
          let p = direction === 1 ? progress : 1 - progress;
          let pointAt = path.getPointAtLength(p * pathLen);

          moving.setAttribute('transform', `translate(${pointAt.x}, ${pointAt.y - 10})`);
          // pulse active step based on progress
          const steps = document.querySelectorAll('.track-steps .step');
          steps.forEach((s, i) => s.classList.remove('active'));
          let idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          steps[idx].classList.add('active');

          // at ends reverse direction
          if ((progress >= 0.999 && direction === 1) || (progress >= 0.999 && direction === -1)) {
            direction *= -1;
          }
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    })();

    // 2) Floating shapes: small parallax on mouse move
    (function () {
      const shapes = document.querySelectorAll('.floating-shapes .shape');
      if (!shapes.length) return;
      document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        shapes.forEach((el, i) => {
          const depth = (i + 1) * 6;
          el.style.transform = `translate3d(${dx * depth}px, ${dy * depth}px, 0) rotate(${dx * depth}deg)`;
        });
      });
    })();

    // 3) Tabs filter for courses (simple)
    (function () {
      const tabs = document.querySelectorAll('.courses .tab');
      const cards = document.querySelectorAll('.course-card');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.dataset.cat;
          cards.forEach(c => {
            if (cat === 'all' || c.dataset.cat === cat) {
              c.style.display = 'block';
            } else {
              c.style.display = 'none';
            }
          });
          // small layout adjustment
          setTimeout(()=> window.dispatchEvent(new Event('resize')), 350);
        });
      });
    })();

    // 4) FAQ accordion behavior



    
    // 5) small reveal animations for sections (on-scroll)
    (function () {
      const sections = document.querySelectorAll('section, .course-card, .testimonial');
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.transform = 'translateY(0)'; entry.target.style.opacity = 1;
            entry.target.style.transition = 'all 700ms cubic-bezier(.2,.9,.2,1)';
          } else {
            entry.target.style.transform = 'translateY(6px)'; entry.target.style.opacity = 0.98;
          }
        });
      }, {threshold: 0.08});
      sections.forEach(s => { s.style.transform = 'translateY(6px)'; s.style.opacity = 0.98; io.observe(s); });
    })();

    // 6) keyboard focus outline improvements for accessibility
    (function () {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
      });
      document.addEventListener('mousedown', () => document.documentElement.classList.remove('show-focus'));
    })();

    // 7) micro interaction: CTA scroll
    document.getElementById('ctaEnroll').addEventListener('click', function () {
      document.getElementById('courses').scrollIntoView({behavior: 'smooth'});
    });

    // 8) ensure moving dot reposition on resize for SVG scaling
    window.addEventListener('resize', () => {
      // noop for now - path animation uses getPointAtLength which adapts to SVG scaling
    });

  const profileBtn = document.getElementById('profileBtn');
  const authOverlay = document.getElementById('authOverlay');

  profileBtn.addEventListener('click', () => {
    authOverlay.classList.add('active');
  });

  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) {
      authOverlay.classList.remove('active');
    }
  });
// 9) Hero entry animation trigger
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Trigger after first paint
  requestAnimationFrame(() => {
    hero.classList.add('animate');
  });
})();

/* =====================================================
   COURSE PAGINATION (RESPONSIVE)
   ===================================================== */

(function () {
  const allCards = Array.from(document.querySelectorAll('.course-card'));
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');

  let currentPage = 1;
  let activeCards = [...allCards];

  function cardsPerPage() {
    return window.innerWidth <= 480 ? 3 : 6;
  }

  function render() {
    const perPage = cardsPerPage();
    const totalPages = Math.ceil(activeCards.length / perPage) || 1;

    activeCards.forEach((card, index) => {
      card.style.display =
        index >= (currentPage - 1) * perPage &&
        index < currentPage * perPage
          ? 'block'
          : 'none';
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function applyFilter(category) {
    activeCards = allCards.filter(card =>
      category === 'all' || card.dataset.cat === category
    );
    currentPage = 1;
    render();
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(activeCards.length / cardsPerPage());
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  });

  /* Hook into your existing tabs */
  document.querySelectorAll('.courses .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      applyFilter(tab.dataset.cat);
    });
  });

  window.addEventListener('resize', () => {
    currentPage = 1;
    render();
  });

  render();
})();

 


function openFaqModal(title, body) {
  document.getElementById('faqModalTitle').innerText = title;
  document.getElementById('faqModalBody').innerText = body;

  const modal = new bootstrap.Modal(document.getElementById('faqModal'));
  modal.show();
}


function openFaqModal(title, body) {
  const modalEl = document.getElementById('faqModal');
  const modalTitle = document.getElementById('faqModalTitle');
  const modalBody = document.getElementById('faqModalBody');

  modalTitle.textContent = title;
  modalBody.textContent = body;

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;
  
  function nextSlide() {
    // Mark current slide as exiting
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('exiting');
    
    // Move to next slide
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Show new slide
    setTimeout(() => {
      // Remove exiting class from all slides
      slides.forEach(slide => {
        slide.classList.remove('exiting');
      });
      
      // Show new active slide
      slides[currentSlide].classList.add('active');
    }, 800); // Match CSS transition time
  }
  
  // Auto slide every 3 seconds for mobile
  if (window.innerWidth <= 820) {
    // Start with first slide active
    slides[0].classList.add('active');
    
    // Auto rotate slides
    setInterval(nextSlide, 3000);
  }
  
  // Handle resize
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 820) {
      // Mobile - use single slide transition
      slides.forEach(slide => {
        slide.style.position = 'absolute';
        slide.classList.remove('exiting');
      });
      slides[currentSlide].classList.add('active');
    } else {
      // Desktop/Tablet - use continuous animation
      slides.forEach(slide => {
        slide.style.position = 'relative';
        slide.classList.remove('active', 'exiting');
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;
  let slideInterval;
  
  function setupCarousel() {
    if (window.innerWidth <= 820) {
      // MOBILE: Single slide transition
      clearInterval(slideInterval);
      
      // Set all slides to absolute positioning
      slides.forEach(slide => {
        slide.style.position = 'absolute';
        slide.classList.remove('active', 'exiting');
      });
      
      // Show first slide
      slides[0].classList.add('active');
      currentSlide = 0;
      
      // Auto slide every 3 seconds
      slideInterval = setInterval(() => {
        // Mark current slide as exiting
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('exiting');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % 3; // Only cycle through first 3 slides
        
        // Show new slide
        setTimeout(() => {
          slides.forEach(slide => {
            slide.classList.remove('exiting');
          });
          slides[currentSlide].classList.add('active');
        }, 800);
      }, 3000);
      
    } else {
      // DESKTOP/TABLET: Continuous animation
      clearInterval(slideInterval);
      
      // Set all slides to relative positioning for flexbox
      slides.forEach(slide => {
        slide.style.position = 'relative';
        slide.classList.remove('active', 'exiting');
      });
      
      // Enable CSS animation
      carouselTrack.style.animationPlayState = 'running';
    }
  }
  
  // Initial setup
  setupCarousel();
  
  // Handle window resize
  window.addEventListener('resize', setupCarousel);
});
// Mobile Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Toggle mobile dropdown
  mobileMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileDropdown.classList.toggle('active');
  });
  
  // Close dropdown when clicking on links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileDropdown.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileDropdown.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // Close dropdown on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileDropdown.classList.contains('active')) {
      mobileDropdown.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
