/* ============================================================
   JUNUN ACADEMY SAMASTIPUR — Premium JavaScript v2.0
   Enhanced: Scroll Progress, Animations, Performance
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     0. INTERNATIONALIZATION (i18n) & LANGUAGE SWITCHER
     ────────────────────────────────────────────── */
  var currentLang = localStorage.getItem('junun_lang') || 'en';

  function applyTranslations(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    var dict = translations[lang];

    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // 2. HTML elements
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // 3. Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 4. Update html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // 5. Update active buttons state
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      var isActive = (btnLang === lang);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  function setLanguage(lang, skipAnim) {
    if (lang !== 'en' && lang !== 'hi') return;
    currentLang = lang;
    localStorage.setItem('junun_lang', lang);

    if (skipAnim) {
      applyTranslations(lang);
      return;
    }

    // Smooth fade transition
    document.body.classList.add('lang-fading');
    setTimeout(function () {
      applyTranslations(lang);
      document.body.classList.remove('lang-fading');
      document.body.classList.add('lang-fade-in');
      setTimeout(function () {
        document.body.classList.remove('lang-fade-in');
      }, 250);
    }, 150);
  }

  // Bind click listeners for language switcher buttons
  document.addEventListener('DOMContentLoaded', function () {
    applyTranslations(currentLang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var targetLang = this.getAttribute('data-lang');
        if (targetLang && targetLang !== currentLang) {
          setLanguage(targetLang, false);
        }
      });
    });
  });

  /* ──────────────────────────────────────────────
     1. LOADING SCREEN — Premium Loader
     ────────────────────────────────────────────── */
  const loadingScreen = document.getElementById('loading-screen');

  // On page fully loaded — smoothly dismiss loader
  window.addEventListener('load', function () {
    applyTranslations(currentLang);
    // Small delay so user sees the loader for at least a moment
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';

      // Trigger scroll reveals after loader gone
      setTimeout(revealOnScroll, 150);
      setTimeout(animateCounters, 350);
    }, 600);
  });

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';

  /* ──────────────────────────────────────────────
     2. SCROLL PROGRESS INDICATOR
     ────────────────────────────────────────────── */
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ──────────────────────────────────────────────
     3. NAVBAR — Scroll Behavior & Active State
     ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active link based on scroll position
    var current = '';
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────
     4. MOBILE MENU
     ────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Keyboard activation
    navToggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
      }
    });
  }

  /* ──────────────────────────────────────────────
     5. SMOOTH SCROLL for Anchor Links
     ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = 80;
        var top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     6. ANIMATED COUNTERS
     ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    var firstCounter = counters[0];
    if (!firstCounter) return;

    var rect = firstCounter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersAnimated = true;

      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var duration = 2200;
        var startTime = performance.now();

        function update(currentTime) {
          var elapsed = currentTime - startTime;
          var progress = Math.min(elapsed / duration, 1);

          // Ease-out expo
          var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          var current = Math.floor(ease * target);

          counter.textContent = current.toLocaleString() + '+';

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString() + '+';
          }
        }

        requestAnimationFrame(update);
      });
    }
  }

  /* ──────────────────────────────────────────────
     7. SCROLL REVEAL ANIMATIONS
     ────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  function revealOnScroll() {
    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var triggerPoint = window.innerHeight * 0.88;

      if (rect.top < triggerPoint && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }

  // Initial check
  setTimeout(revealOnScroll, 300);

  /* ──────────────────────────────────────────────
     8. TESTIMONIALS SLIDER
     ────────────────────────────────────────────── */
  var currentSlide = 0;
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('#testimonials-dots button');
  var totalSlides = dots.length;
  var autoSlideInterval;

  function goToSlide(index) {
    currentSlide = index;
    if (track) {
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    }
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  window.nextTestimonial = function () {
    goToSlide((currentSlide + 1) % totalSlides);
    resetAutoSlide();
  };

  window.prevTestimonial = function () {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    resetAutoSlide();
  };

  window.goToTestimonial = function (index) {
    goToSlide(index);
    resetAutoSlide();
  };

  function startAutoSlide() {
    autoSlideInterval = setInterval(function () {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  if (totalSlides > 0) {
    startAutoSlide();
  }

  /* ──────────────────────────────────────────────
     9. FAQ ACCORDION
     ────────────────────────────────────────────── */
  window.toggleFAQ = function (button) {
    var item = button.closest('.faq-item');
    var answer = item.querySelector('.faq-answer');
    var isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(function (faqItem) {
      faqItem.classList.remove('active');
      faqItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    // Toggle current
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  };

  /* ──────────────────────────────────────────────
     10. ADMISSION FORM VALIDATION
     ────────────────────────────────────────────── */
  const form = document.getElementById('admission-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Name validation
      var nameInput = document.getElementById('form-name');
      var nameGroup = document.getElementById('fg-name');
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameGroup.classList.add('error');
        isValid = false;
      } else {
        nameGroup.classList.remove('error');
      }

      // Phone validation
      var phoneInput = document.getElementById('form-phone');
      var phoneGroup = document.getElementById('fg-phone');
      var phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneGroup.classList.add('error');
        isValid = false;
      } else {
        phoneGroup.classList.remove('error');
      }

      // Exam validation
      var examSelect = document.getElementById('form-exam');
      var examGroup = document.getElementById('fg-exam');
      if (!examSelect.value) {
        examGroup.classList.add('error');
        isValid = false;
      } else {
        examGroup.classList.remove('error');
      }

      if (isValid) {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Remove error on input
    ['form-name', 'form-phone', 'form-exam'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () {
          this.closest('.form-group').classList.remove('error');
        });
        el.addEventListener('change', function () {
          this.closest('.form-group').classList.remove('error');
        });
      }
    });

    // Phone: only allow digits
    var phoneField = document.getElementById('form-phone');
    if (phoneField) {
      phoneField.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
      });
    }
  }

  /* ──────────────────────────────────────────────
     11. GALLERY LIGHTBOX
     ────────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  window.openLightbox = function (galleryItem) {
    var img = galleryItem.querySelector('img');
    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function () {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close lightbox on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close lightbox on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ──────────────────────────────────────────────
     12. BACK TO TOP BUTTON
     ────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────
     13. PERFORMANCE — Single Throttled Scroll Handler
     ────────────────────────────────────────────── */
  var scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        handleNavScroll();
        animateCounters();
        revealOnScroll();
        handleBackToTop();
        updateScrollProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────────────────────
     14. TOUCH SWIPE for Testimonials (Mobile)
     ────────────────────────────────────────────── */
  const slider = document.getElementById('testimonials-slider');
  var touchStartX = 0;
  var touchEndX = 0;

  if (slider) {
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          window.nextTestimonial();
        } else {
          window.prevTestimonial();
        }
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     15. LAZY LOAD IMAGES (Fallback for older browsers)
     ────────────────────────────────────────────── */
  if (!('loading' in HTMLImageElement.prototype)) {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    var imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ──────────────────────────────────────────────
     16. PREFERS REDUCED MOTION — Accessibility
     ────────────────────────────────────────────── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReduced.matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(function (el) {
      el.classList.add('revealed');
      el.style.transition = 'none';
    });
    clearInterval(autoSlideInterval);
  }
  // Disable Right Click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
  document.addEventListener("keydown", function (e) {

    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === "U")
    ) {
      e.preventDefault();
    }

  });

})();
