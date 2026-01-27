
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

//cource


document.addEventListener('DOMContentLoaded', function() {
    // Course data with 30+ courses for pagination
    const coursesData = [
        { id: 1, title: "Full Stack Web Development", category: "software", description: "Master front-end and back-end technologies to build complete web applications from scratch.", duration: "6 Months", level: "Beginner to Advanced", price: "₹24,999", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 2, title: "Machine Learning & AI Engineering", category: "ai", description: "Learn to build intelligent systems and predictive models using Python and TensorFlow.", duration: "8 Months", level: "Intermediate", price: "₹34,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 3, title: "Robotics & Automation", category: "mechanical", description: "Design and program industrial robots and automated systems for manufacturing.", duration: "7 Months", level: "Advanced", price: "₹29,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 4, title: "Data Science & Analytics", category: "software", description: "Master data analysis, visualization, and statistical modeling for business intelligence.", duration: "5 Months", level: "Beginner to Intermediate", price: "₹27,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 5, title: "IoT & Embedded Systems", category: "electrical", description: "Build connected devices and systems using microcontrollers and IoT protocols.", duration: "6 Months", level: "Intermediate", price: "₹26,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 6, title: "Structural Engineering & Design", category: "civil", description: "Learn structural analysis and design principles for buildings and infrastructure.", duration: "9 Months", level: "Advanced", price: "₹31,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 7, title: "Mobile App Development", category: "software", description: "Build native and cross-platform mobile applications for iOS and Android.", duration: "5 Months", level: "Intermediate", price: "₹25,999", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 8, title: "Cloud Computing & DevOps", category: "software", description: "Master cloud platforms and DevOps practices for scalable applications.", duration: "6 Months", level: "Intermediate", price: "₹28,999", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 9, title: "Cybersecurity Engineering", category: "software", description: "Learn to protect systems and networks from cyber threats and attacks.", duration: "7 Months", level: "Advanced", price: "₹32,999", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 10, title: "Blockchain Development", category: "software", description: "Build decentralized applications and smart contracts using blockchain technology.", duration: "6 Months", level: "Advanced", price: "₹35,999", image: "https://images.unsplash.com/photo-1620336655055-bd87c5d1d73f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 11, title: "Automotive Engineering", category: "mechanical", description: "Design and develop automotive systems and vehicle technologies.", duration: "8 Months", level: "Advanced", price: "₹33,999", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 12, title: "Aerospace Engineering", category: "mechanical", description: "Study aircraft and spacecraft design, development, and testing.", duration: "9 Months", level: "Advanced", price: "₹36,999", image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 13, title: "Power Systems Engineering", category: "electrical", description: "Design and analyze electrical power generation and distribution systems.", duration: "7 Months", level: "Intermediate", price: "₹28,999", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 14, title: "Renewable Energy Systems", category: "electrical", description: "Design and implement solar, wind, and other renewable energy solutions.", duration: "6 Months", level: "Intermediate", price: "₹27,999", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 15, title: "Construction Management", category: "civil", description: "Learn project management techniques for construction projects.", duration: "7 Months", level: "Intermediate", price: "₹26,999", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 16, title: "Deep Learning Fundamentals", category: "ai", description: "Master neural networks and deep learning algorithms for AI applications.", duration: "6 Months", level: "Advanced", price: "₹32,999", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 17, title: "Computer Vision Engineering", category: "ai", description: "Build systems that can interpret and understand visual information.", duration: "7 Months", level: "Advanced", price: "₹34,999", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 18, title: "Natural Language Processing", category: "ai", description: "Develop systems that can understand and generate human language.", duration: "6 Months", level: "Advanced", price: "₹33,999", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 19, title: "Game Development", category: "software", description: "Create interactive games using modern game engines and programming.", duration: "8 Months", level: "Intermediate", price: "₹29,999", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 20, title: "Database Engineering", category: "software", description: "Design and optimize database systems for high-performance applications.", duration: "5 Months", level: "Intermediate", price: "₹25,999", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 21, title: "Thermal Engineering", category: "mechanical", description: "Study heat transfer and thermodynamics for engineering applications.", duration: "6 Months", level: "Intermediate", price: "₹26,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 22, title: "Control Systems Engineering", category: "electrical", description: "Design and analyze control systems for automation and robotics.", duration: "7 Months", level: "Advanced", price: "₹30,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 23, title: "Geotechnical Engineering", category: "civil", description: "Study soil mechanics and foundation engineering for construction.", duration: "6 Months", level: "Intermediate", price: "₹27,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 24, title: "UI/UX Design for Engineers", category: "software", description: "Learn user interface and experience design principles for engineering applications.", duration: "4 Months", level: "Beginner", price: "₹22,999", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 25, title: "Quantum Computing Fundamentals", category: "ai", description: "Introduction to quantum computing principles and algorithms.", duration: "8 Months", level: "Advanced", price: "₹39,999", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 26, title: "Biomedical Engineering", category: "mechanical", description: "Apply engineering principles to medical and healthcare solutions.", duration: "9 Months", level: "Advanced", price: "₹35,999", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 27, title: "Network Engineering", category: "software", description: "Design and implement computer networks and communication systems.", duration: "6 Months", level: "Intermediate", price: "₹27,999", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 28, title: "Material Science Engineering", category: "mechanical", description: "Study materials properties and applications in engineering design.", duration: "7 Months", level: "Intermediate", price: "₹28,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 29, title: "Environmental Engineering", category: "civil", description: "Design solutions for environmental protection and sustainability.", duration: "8 Months", level: "Intermediate", price: "₹29,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
        { id: 30, title: "Digital Signal Processing", category: "electrical", description: "Process and analyze digital signals for various applications.", duration: "6 Months", level: "Advanced", price: "₹31,999", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" }
    ];

    // Pagination variables
    let currentPage = 1;
    let currentCategory = 'all';
    let filteredCourses = [...coursesData];
    
    // Items per page based on screen size
    function getItemsPerPage() {
        return window.innerWidth <= 768 ? 6 : 12;
    }
    
    let itemsPerPage = getItemsPerPage();
    
    // DOM Elements
    const courseGrid = document.querySelector('.course-grid');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const paginationContainer = document.querySelector('.pagination-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbersContainer = document.querySelector('.page-numbers');
    const pageInfo = document.querySelector('.page-info');
    const currentRange = document.querySelector('.current-range');
    const totalCourses = document.querySelector('.total-courses');
    
    // Initialize
    function init() {
        // Update items per page based on initial screen size
        itemsPerPage = getItemsPerPage();
        
        // Render initial courses
        renderCourses();
        setupEventListeners();
        updatePaginationInfo();
        
        // Update on window resize
        window.addEventListener('resize', handleResize);
    }
    
    // Handle window resize
    function handleResize() {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1;
            renderCourses();
            updatePaginationInfo();
        }
    }
    
    // Render courses based on current page and category
    function renderCourses() {
        // Clear existing courses
        courseGrid.innerHTML = '';
        
        // Get courses for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const coursesToShow = filteredCourses.slice(startIndex, endIndex);
        
        // Create course cards
        coursesToShow.forEach(course => {
            const courseCard = createCourseCard(course);
            courseGrid.appendChild(courseCard);
        });
        
        // If no courses found
        if (coursesToShow.length === 0) {
            courseGrid.innerHTML = `
                <div class="no-courses" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <h3 style="color: #015383; margin-bottom: 15px;">No courses found</h3>
                    <p style="color: #015383; opacity: 0.8;">Try selecting a different category</p>
                </div>
            `;
        }
    }
    
    // Create a course card element
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-category', course.category);
        
        card.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}" loading="lazy">
            </div>
            <div class="course-content">
                <div class="course-category">${getCategoryName(course.category)}</div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                
                <div class="course-meta">
                    <div class="course-duration">
                        <i class="far fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                    <div class="course-level">
                        <i class="fas fa-signal"></i>
                        <span>${course.level}</span>
                    </div>
                </div>
                
                <div class="course-footer">
                    <div class="course-price">${course.price}</div>
                    <button class="course-cta" data-id="${course.id}">Enroll Now</button>
                </div>
            </div>
        `;
        
        // Add click event to enroll button
        const enrollBtn = card.querySelector('.course-cta');
        enrollBtn.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            const courseTitle = coursesData.find(c => c.id == courseId).title;
            alert(`Thank you for your interest in "${courseTitle}"! Our team will contact you shortly.`);
        });
        
        return card;
    }
    
    // Get category display name
    function getCategoryName(category) {
        const categoryMap = {
            'software': 'Software Engineering',
            'mechanical': 'Mechanical Engineering',
            'electrical': 'Electrical Engineering',
            'civil': 'Civil Engineering',
            'ai': 'AI & Machine Learning'
        };
        return categoryMap[category] || category;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update category filter
                currentCategory = this.getAttribute('data-category');
                currentPage = 1;
                
                // Filter courses
                if (currentCategory === 'all') {
                    filteredCourses = [...coursesData];
                } else {
                    filteredCourses = coursesData.filter(course => course.category === currentCategory);
                }
                
                // Render courses and update pagination
                renderCourses();
                updatePaginationInfo();
            });
        });
        
        // Pagination buttons
        prevBtn.addEventListener('click', goToPrevPage);
        nextBtn.addEventListener('click', goToNextPage);
        
        // CTA buttons
        document.querySelector('.btn-primary').addEventListener('click', function() {
            // Scroll to courses section
            document.querySelector('.courses-categories').scrollIntoView({ behavior: 'smooth' });
        });
        
        document.querySelector('.btn-outline').addEventListener('click', function() {
            alert('Thank you for your interest! Our counselor will contact you within 24 hours.');
        });
        
        // Nav CTA buttons
        document.querySelector('.btn-cta').addEventListener('click', function() {
            alert('Registration portal will open in a new window.');
        });
    }
    
    // Go to previous page
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderCourses();
            updatePaginationInfo();
            scrollToTop();
        }
    }
    
    // Go to next page
    function goToNextPage() {
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCourses();
            updatePaginationInfo();
            scrollToTop();
        }
    }
    
    // Go to specific page
    function goToPage(page) {
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderCourses();
            updatePaginationInfo();
            scrollToTop();
        }
    }
    
    // Scroll to top of courses grid
    function scrollToTop() {
        courseGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update pagination controls and info
    function updatePaginationInfo() {
        const totalCoursesCount = filteredCourses.length;
        const totalPages = Math.ceil(totalCoursesCount / itemsPerPage);
        
        // Update page info
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalCoursesCount);
        currentRange.textContent = `${start}-${end}`;
        totalCourses.textContent = totalCoursesCount;
        
        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        
        // Generate page numbers
        generatePageNumbers(totalPages);
    }
    
    // Generate page number buttons
    function generatePageNumbers(totalPages) {
        pageNumbersContainer.innerHTML = '';
        
        // Show max 5 page numbers
        const maxVisiblePages = 5;
        let startPage, endPage;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // Calculate start and end pages
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
            
            if (currentPage <= maxPagesBeforeCurrent) {
                // Near the beginning
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                // Near the end
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                // Somewhere in the middle
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }
        
        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            pageNumbersContainer.appendChild(pageBtn);
        }
        
        // Add ellipsis if needed
        if (startPage > 1) {
            const ellipsis1 = document.createElement('span');
            ellipsis1.className = 'page-number dots';
            ellipsis1.textContent = '...';
            pageNumbersContainer.insertBefore(ellipsis1, pageNumbersContainer.firstChild);
            
            const firstPageBtn = document.createElement('button');
            firstPageBtn.className = 'page-number';
            firstPageBtn.textContent = '1';
            firstPageBtn.addEventListener('click', () => goToPage(1));
            pageNumbersContainer.insertBefore(firstPageBtn, pageNumbersContainer.firstChild);
        }
        
        if (endPage < totalPages) {
            const ellipsis2 = document.createElement('span');
            ellipsis2.className = 'page-number dots';
            ellipsis2.textContent = '...';
            pageNumbersContainer.appendChild(ellipsis2);
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'page-number';
            lastPageBtn.textContent = totalPages;
            lastPageBtn.addEventListener('click', () => goToPage(totalPages));
            pageNumbersContainer.appendChild(lastPageBtn);
        }
    }
    
    // Initialize the page
    init();
});