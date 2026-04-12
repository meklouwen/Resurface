// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll effect
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // Tab switching (diensten page)
  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // Home page tab switching (interieur / merk)
  const homeTabBtns = document.querySelectorAll('[data-home-tab]');
  if (homeTabBtns.length) {
    homeTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.homeTab;

        // Update buttons
        homeTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide service cards with fade
        document.querySelectorAll('[data-home-panel]').forEach(card => {
          if (card.dataset.homePanel === target) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide info text with fade
        document.querySelectorAll('[data-home-text]').forEach(card => {
          if (card.dataset.homeText === target) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Diensten page category/subcategory switching
  const mainCatBtns = document.querySelectorAll('[data-main-cat]');
  const subCatBtns = document.querySelectorAll('[data-sub-cat]');
  const dienstenPanels = document.querySelectorAll('.diensten-panel');

  if (mainCatBtns.length) {
    mainCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.mainCat;

        // Toggle main category buttons
        mainCatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide subcategory rows
        document.querySelectorAll('[data-main-sub]').forEach(row => {
          row.style.display = row.dataset.mainSub === cat ? '' : 'none';
        });

        // Find first active sub-btn in this category, or first sub-btn
        const subRow = document.querySelector(`[data-main-sub="${cat}"]`);
        const activeSub = subRow.querySelector('.diensten-sub-btn.active') || subRow.querySelector('.diensten-sub-btn');
        if (activeSub) {
          // Reset all sub buttons in this row to active on first one
          subRow.querySelectorAll('.diensten-sub-btn').forEach(s => s.classList.remove('active'));
          activeSub.classList.add('active');

          // Show the corresponding panel
          const targetPanel = activeSub.dataset.subCat;
          dienstenPanels.forEach(p => p.classList.remove('active'));
          document.getElementById('panel-' + targetPanel)?.classList.add('active');
        }
      });
    });

    subCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.subCat;

        // Find parent sub-row and deactivate siblings
        const parentRow = btn.closest('[data-main-sub]');
        parentRow.querySelectorAll('.diensten-sub-btn').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');

        // Show panel
        dienstenPanels.forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('panel-' + target);
        if (panel) {
          panel.classList.add('active');
          panel.style.animation = 'fadeIn 0.4s ease';
        }
      });
    });
  }

  // Contact form handling
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const obj = Object.fromEntries(data);

      // Show simple success message
      const btn = form.querySelector('.btn-primary');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Verstuurd! &#10003;';
      btn.style.background = '#27ae60';

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // Lightbox for service images
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.service-icon img');
        const title = card.querySelector('h3');
        if (img) {
          lbImg.src = img.src;
          lbImg.alt = img.alt;
          lbCaption.textContent = title ? title.textContent : '';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Scroll reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .animate-in, .services-grid, .reviews-grid, .project-gallery').forEach(el => {
    revealObserver.observe(el);
  });

  // Hero image slow zoom-out on load
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero-bg').forEach(bg => {
      bg.classList.add('loaded');
    });
    // Page transition
    document.body.classList.add('page-transition');
  });

  // Scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // Smooth parallax + progress bar on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${(scrolled / docH) * 100}%`;

        const hero = document.querySelector('.hero');
        if (hero) {
          const heroH = hero.offsetHeight;
          if (scrolled < heroH) {
            const bg = hero.querySelector('.hero-bg img');
            if (bg) {
              bg.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
            }
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Glow cursor effect on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    const glow = document.createElement('div');
    glow.className = 'hero-glow';
    hero.appendChild(glow);
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  // Trust logos infinite marquee
  const trustLogos = document.querySelector('.trust-logos');
  if (trustLogos && !trustLogos.querySelector('.trust-logos-track')) {
    const imgs = [...trustLogos.querySelectorAll('img')];
    if (imgs.length) {
      const track = document.createElement('div');
      track.className = 'trust-logos-track';
      // Clone logos twice for seamless loop
      imgs.forEach(img => track.appendChild(img.cloneNode(true)));
      imgs.forEach(img => track.appendChild(img.cloneNode(true)));
      trustLogos.innerHTML = '';
      trustLogos.appendChild(track);
    }
  }

  // 3D tilt effect on service cards and project images
  document.querySelectorAll('.service-card, .projects-bento-img, .home-service-card.small').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  // Animated counter for Google rating
  const ratingNum = document.querySelector('.google-rating-number');
  if (ratingNum) {
    const target = parseFloat(ratingNum.textContent);
    let counted = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          let current = 0;
          const duration = 1500;
          const steps = 60;
          const increment = target / steps;
          const interval = duration / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              ratingNum.textContent = target.toFixed(1);
              clearInterval(timer);
            } else {
              ratingNum.textContent = current.toFixed(1);
            }
          }, interval);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(ratingNum);
  }

  // Magnetic hover effect on buttons (desktop only)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-primary:not(.form-submit), .floating-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Smooth text reveal on hero highlight words
  document.querySelectorAll('.hero h1 .highlight').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 800 + i * 300);
  });
});
