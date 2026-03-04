/* ===========================
   Global Modal Functions
   =========================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  if (!document.querySelector('.modal-overlay.active')) {
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     0. Hero Typewriter Effect
     =========================== */
  const typewriterEl = document.getElementById('hero-typewriter');
  const typewriterText = '당신의 아름다움을 완성하는 곳';

  if (typewriterEl) {
    typewriterEl.classList.add('typing');
    let i = 0;
    const typeTimer = setInterval(() => {
      typewriterEl.textContent += typewriterText[i];
      i++;
      if (i >= typewriterText.length) {
        clearInterval(typeTimer);
        setTimeout(() => typewriterEl.classList.remove('typing'), 1000);
      }
    }, 100);
  }


  /* ===========================
     1. Sticky Header + Parallax
     =========================== */
  const header = document.getElementById('header');
  const heroSection = document.getElementById('hero');

  /* ===========================
     Scroll Progress Bar + Back-to-Top
     =========================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 패럴랙스: 배경 위치를 스크롤의 절반 속도로 이동
    if (heroSection) {
      const offset = window.scrollY * 0.5;
      heroSection.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }

    // 스크롤 프로그레스바
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrolled = (window.scrollY / (docHeight - winHeight)) * 100;
    if (scrollProgressBar) scrollProgressBar.style.width = scrolled + '%';

    // Back-to-Top 버튼 표시/숨김
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });


  /* ===========================
     2. Hamburger Menu Toggle
     =========================== */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // 메뉴 항목 클릭 시 모바일 메뉴 닫기
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-label', '메뉴 열기');
    });
  });


  /* ===========================
     3. Smooth Scroll Navigation
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ===========================
     4. CTA Button → Booking Modal
     =========================== */
  document.querySelectorAll('.cta-main').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal('booking-modal');
    });
  });


  /* ===========================
     5. Contact Form Submit
     =========================== */
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      alert('이름과 연락처를 입력해 주세요.');
      return;
    }

    // 실제 배포 시 서버 전송 로직으로 교체
    alert(`${name}님, 상담 예약이 접수되었습니다.\n빠른 시일 내 ${phone}으로 연락드리겠습니다.`);
    form.reset();
  });


  /* ===========================
     6. Stat CountUp Animation
     =========================== */
  function countUp(el, target, duration = 2000) {
    let start = 0;
    const step = target / duration * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if ('IntersectionObserver' in window && statNumbers.length) {
    const aboutSection = document.getElementById('about');
    let countUpTriggered = false;

    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countUpTriggered) {
          countUpTriggered = true;
          statNumbers.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            countUp(el, target);
          });
          statObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    if (aboutSection) statObserver.observe(aboutSection);
  } else {
    statNumbers.forEach(el => {
      el.textContent = parseInt(el.dataset.target, 10).toLocaleString();
    });
  }


  /* ===========================
     6-A. Procedure Tabs
     =========================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });


  /* ===========================
     6-B. FAQ Accordion (exclusive open)
     =========================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    item.querySelector('.accordion-header').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // 모두 닫기
      accordionItems.forEach(i => i.classList.remove('active'));
      // 클릭한 항목이 닫혀 있었으면 열기
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  /* ===========================
     7. Scroll Animations (data-animate)
     =========================== */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animateEls.length) {
    const animObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    animateEls.forEach(el => animObserver.observe(el));
  } else {
    animateEls.forEach(el => el.classList.add('animated'));
  }


  /* ===========================
     7-A. Card Flip — Touch Tap Support
     =========================== */
  if (window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.card-flip').forEach(card => {
      card.addEventListener('click', e => {
        // 버튼/링크 클릭 시 플립하지 않음
        if (e.target.closest('button, a')) return;
        card.classList.toggle('flipped');
      });
    });
  }


  /* ===========================
     7-B. Button Ripple Effect
     =========================== */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* ===========================
     8. Before & After Carousel
     =========================== */
  const carousel   = document.getElementById('ba-carousel');
  const track      = document.getElementById('ba-track');
  const slides     = track ? Array.from(track.querySelectorAll('.slide')) : [];
  const dotsWrap   = document.getElementById('ba-dots');
  const prevBtn    = document.getElementById('ba-prev');
  const nextBtn    = document.getElementById('ba-next');

  if (slides.length && track) {
    let currentSlide = 0;
    let autoTimer = null;

    // Build dots
    const dots = slides.map((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `슬라이드 ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
      return btn;
    });

    function goTo(idx) {
      currentSlide = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(currentSlide + 1), 3000);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    prevBtn.addEventListener('click', () => { stopAuto(); goTo(currentSlide - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); goTo(currentSlide + 1); startAuto(); });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Touch swipe 지원
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopAuto();
        goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        startAuto();
      }
    }, { passive: true });

    startAuto();


    /* ===========================
       9. Image Comparison Slider
       =========================== */
    track.querySelectorAll('.comparison-slider').forEach(container => {
      const handle   = container.querySelector('.slider-handle');
      const afterImg = container.querySelector('.after');
      let isDragging = false;
      let ratio = 50; // percent

      function setRatio(x) {
        const rect = container.getBoundingClientRect();
        ratio = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
        afterImg.style.clipPath = `inset(0 ${100 - ratio}% 0 0)`;
        handle.style.left = `${ratio}%`;
      }

      handle.addEventListener('mousedown', e => {
        isDragging = true;
        e.preventDefault();
      });

      // Touch support
      handle.addEventListener('touchstart', e => {
        isDragging = true;
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        setRatio(e.clientX);
      });

      document.addEventListener('mouseup', () => { isDragging = false; });

      document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        setRatio(e.touches[0].clientX);
      }, { passive: true });

      document.addEventListener('touchend', () => { isDragging = false; });

      // Also allow dragging anywhere on the container
      container.addEventListener('mousedown', e => {
        isDragging = true;
        setRatio(e.clientX);
      });

      container.addEventListener('touchstart', e => {
        isDragging = true;
        setRatio(e.touches[0].clientX);
      }, { passive: true });
    });
  }


  /* ===========================
     10. Testimonial Carousel
     =========================== */
  const testimonialTrack   = document.getElementById('testimonial-track');
  const testimonialDotsWrap = document.getElementById('testimonial-dots');

  if (testimonialTrack && testimonialDotsWrap) {
    const tCards = Array.from(testimonialTrack.querySelectorAll('.testimonial-card'));
    let tCurrent = 0;
    let tAutoTimer = null;
    let tDots = [];

    function getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768)  return 2;
      return 1;
    }

    function getTotalSteps() {
      return Math.ceil(tCards.length / getVisibleCount());
    }

    function buildDots() {
      testimonialDotsWrap.innerHTML = '';
      tDots = [];
      const steps = getTotalSteps();
      for (let i = 0; i < steps; i++) {
        const btn = document.createElement('button');
        btn.className = 'carousel-dot' + (i === tCurrent ? ' active' : '');
        btn.setAttribute('aria-label', `후기 ${i + 1}`);
        btn.addEventListener('click', () => tGoTo(i));
        testimonialDotsWrap.appendChild(btn);
        tDots.push(btn);
      }
    }

    function tGoTo(idx) {
      const steps = getTotalSteps();
      tCurrent = ((idx % steps) + steps) % steps;
      const visibleCount = getVisibleCount();
      const cardWidth = tCards[0].offsetWidth;
      const gap = 28;
      testimonialTrack.style.transform = `translateX(-${tCurrent * visibleCount * (cardWidth + gap)}px)`;
      tDots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
    }

    function tStartAuto() {
      tStopAuto();
      tAutoTimer = setInterval(() => tGoTo(tCurrent + 1), 4000);
    }

    function tStopAuto() {
      if (tAutoTimer) { clearInterval(tAutoTimer); tAutoTimer = null; }
    }

    // Fade-in cards on intersection
    if ('IntersectionObserver' in window) {
      const tObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tCards.forEach((card, i) => {
              setTimeout(() => card.classList.add('visible'), i * 100);
            });
            tObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      tObserver.observe(testimonialTrack);
    } else {
      tCards.forEach(card => card.classList.add('visible'));
    }

    // Pause on hover
    testimonialTrack.parentElement.addEventListener('mouseenter', tStopAuto);
    testimonialTrack.parentElement.addEventListener('mouseleave', tStartAuto);

    buildDots();
    tStartAuto();

    // Rebuild on resize
    window.addEventListener('resize', () => {
      tStopAuto();
      buildDots();
      tGoTo(0);
      tStartAuto();
    });
  }


  /* ===========================
     Modal Setup
     =========================== */

  // ESC key closes any active modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
    }
  });

  // Overlay background click closes modal
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // Card-back "상담 예약" buttons → booking modal
  document.querySelectorAll('.card-back .btn-primary').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal('booking-modal');
    });
  });

  // Lightbox zoom buttons for procedure cards
  document.querySelectorAll('.card-front').forEach(front => {
    const img = front.querySelector('img');
    const h3  = front.querySelector('h3');
    if (!img) return;

    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'card-zoom-btn';
    zoomBtn.setAttribute('aria-label', '이미지 확대');
    zoomBtn.textContent = '🔍';
    front.appendChild(zoomBtn);

    zoomBtn.addEventListener('click', e => {
      e.stopPropagation();
      const lbImg     = document.getElementById('lightbox-img');
      const lbCaption = document.getElementById('lightbox-caption');
      if (lbImg) { lbImg.src = img.getAttribute('src') || ''; lbImg.alt = img.alt || ''; }
      if (lbCaption && h3) lbCaption.textContent = h3.textContent;
      openModal('lightbox');
    });
  });

  // Lightbox zoom buttons for Before/After comparison sliders
  document.querySelectorAll('.comparison-slider').forEach(slider => {
    const afterImg = slider.querySelector('.after');
    const desc     = slider.closest('.slide')?.querySelector('.ba-desc');

    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'comparison-zoom-btn';
    zoomBtn.setAttribute('aria-label', '이미지 확대');
    zoomBtn.textContent = '🔍';
    slider.appendChild(zoomBtn);

    zoomBtn.addEventListener('click', e => {
      e.stopPropagation();
      const lbImg     = document.getElementById('lightbox-img');
      const lbCaption = document.getElementById('lightbox-caption');
      if (lbImg && afterImg) { lbImg.src = afterImg.getAttribute('src') || ''; lbImg.alt = afterImg.alt || ''; }
      if (lbCaption) lbCaption.textContent = desc ? desc.textContent : '';
      openModal('lightbox');
    });
  });

  // Gallery masonry items → lightbox
  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      const img       = item.querySelector('img');
      const caption   = item.dataset.caption || item.querySelector('.masonry-caption')?.textContent || '';
      const lbImg     = document.getElementById('lightbox-img');
      const lbCaption = document.getElementById('lightbox-caption');
      if (lbImg && img) { lbImg.src = img.getAttribute('src') || ''; lbImg.alt = img.alt || ''; }
      if (lbCaption)    lbCaption.textContent = caption;
      openModal('lightbox');
    });
  });

  // Modal booking form submit
  const modalForm = document.getElementById('modal-contact-form');
  if (modalForm) {
    modalForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = modalForm.querySelector('#modal-name').value.trim();
      const phone = modalForm.querySelector('#modal-phone').value.trim();
      if (!name || !phone) { alert('이름과 연락처를 입력해 주세요.'); return; }
      alert(`${name}님, 상담 예약이 접수되었습니다.\n빠른 시일 내 ${phone}으로 연락드리겠습니다.`);
      modalForm.reset();
      closeModal('booking-modal');
    });
  }

});
