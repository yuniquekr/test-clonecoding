document.addEventListener('DOMContentLoaded', () => {

  /* ===========================
     1. Sticky Header
     =========================== */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
     4. CTA Button → Contact Section
     =========================== */
  document.querySelectorAll('.cta-main').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const contact = document.getElementById('contact');
      if (!contact) return;
      const headerHeight = header.offsetHeight;
      const top = contact.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
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
     6. Scroll Fade-in (IntersectionObserver)
     =========================== */
  const style = document.createElement('style');
  style.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-up.visible {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(style);

  const fadeTargets = document.querySelectorAll(
    '.procedure-card, .ba-case, .doctor-card, .stat-item, .location-item'
  );
  fadeTargets.forEach(el => el.classList.add('fade-up'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeTargets.forEach(el => observer.observe(el));
  } else {
    // 폴백: 즉시 표시
    fadeTargets.forEach(el => el.classList.add('visible'));
  }

});
