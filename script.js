/**
 * GLIFFY — Creative Digital Studio | Interactive Homepage Engine
 * Premium Vanilla JavaScript Interactions:
 * - 3D Mockup Parallax & Cursor Physics
 * - Specular Spotlight & Card Tilt
 * - Header Scroll States & Active Spy
 * - Mobile Drawer Navigation
 * - Interactive Project Modal & Scope Chips
 * - Prototype Page Placeholders Toast
 * - One-Click Clipboard Email Copy
 * - Intersection Observer Scroll Reveals
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const cursorGlow = document.getElementById('cursorGlow');
  const siteHeader = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const heroVisualStage = document.getElementById('heroVisualStage');
  const mockupStage = document.getElementById('mockupStage');
  const browserMockup = document.getElementById('browserMockup');
  const magicCards = document.querySelectorAll('.magic-card');
  const talkModal = document.getElementById('talkModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const headerTalkBtn = document.getElementById('headerTalkBtn');
  const mobileDrawerTalkBtn = document.getElementById('mobileDrawerTalkBtn');
  const btnCtaTalk = document.getElementById('btnCtaTalk');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyBadge = document.getElementById('copyBadge');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const prototypeToast = document.getElementById('prototypeToast');
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  const scopeChips = document.querySelectorAll('.scope-chip');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  let toastTimeout = null;

  /* --------------------------------------------------------------------------
     1. Cursor Glow Follower
     -------------------------------------------------------------------------- */
  if (cursorGlow && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateCursorGlow = () => {
      // Lerp interpolation for fluid trailing glow
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;

      requestAnimationFrame(updateCursorGlow);
    };
    requestAnimationFrame(updateCursorGlow);
  }

  /* --------------------------------------------------------------------------
     2. Header Scroll Dynamics & Sticky Glassmorphism
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  if (navToggle && mobileDrawer) {
    const toggleDrawer = () => {
      const isOpen = navToggle.classList.contains('active');
      if (isOpen) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      } else {
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    };

    navToggle.addEventListener('click', toggleDrawer);

    // Close mobile drawer when clicking any link inside
    const drawerLinks = mobileDrawer.querySelectorAll('a, button');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navToggle.classList.contains('active')) {
          toggleDrawer();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. 3D Browser Mockup Cursor Reactive Parallax (Hero Section)
     -------------------------------------------------------------------------- */
  if (heroVisualStage && browserMockup && !prefersReducedMotion) {
    const floatingElements = heroVisualStage.querySelectorAll('[data-depth]');
    
    let targetRotateX = 4;
    let targetRotateY = -6;
    let currentRotateX = 4;
    let currentRotateY = -6;
    let isHoveringHero = false;

    heroVisualStage.addEventListener('pointerenter', () => {
      isHoveringHero = true;
    });

    heroVisualStage.addEventListener('pointermove', (e) => {
      const rect = heroVisualStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate normalized offset from center (-1 to 1)
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Subtle rotation bounds for cinematic restraint
      targetRotateY = normX * 12;
      targetRotateX = -normY * 10;

      // Parallax translation for orbiting floating badges
      floatingElements.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
        const moveX = normX * depth * 50;
        const moveY = normY * depth * 50;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    heroVisualStage.addEventListener('pointerleave', () => {
      isHoveringHero = false;
      targetRotateX = 4;
      targetRotateY = -6;

      floatingElements.forEach((el) => {
        el.style.transform = '';
      });
    });

    // Smooth animation loop for the mockup rotation
    const updateMockupPhysics = () => {
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      browserMockup.style.transform = `rotateY(${currentRotateY.toFixed(2)}deg) rotateX(${currentRotateX.toFixed(2)}deg)`;

      requestAnimationFrame(updateMockupPhysics);
    };
    requestAnimationFrame(updateMockupPhysics);
  }

  /* --------------------------------------------------------------------------
     5. Second Section: 3D Hover Tilt & Dynamic Light Sheen (Magic Cards)
     -------------------------------------------------------------------------- */
  magicCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS custom properties for specular light position
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${xPercent}%`);
      card.style.setProperty('--mouse-y', `${yPercent}%`);

      if (!prefersReducedMotion) {
        // Calculate tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = -((y - centerY) / centerY) * 7;
        const tiltY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px)`;
      }
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  /* --------------------------------------------------------------------------
     6. Prototype Placeholder Notice for Unfinished Pages
     -------------------------------------------------------------------------- */
  const placeholderTriggers = document.querySelectorAll('.placeholder-trigger');

  const showPrototypeToast = (pageName) => {
    if (!prototypeToast) return;

    if (toastTitle) toastTitle.textContent = `${pageName} — Prototype Preview`;
    if (toastMsg) {
      toastMsg.textContent = `The ${pageName} experience is in development for the complete studio release. You are viewing the live homepage frontend.`;
    }

    prototypeToast.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      prototypeToast.classList.remove('active');
    }, 4500);
  };

  placeholderTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = trigger.getAttribute('data-page') || 'Section';
      showPrototypeToast(pageName);
    });
  });

  if (toastCloseBtn && prototypeToast) {
    toastCloseBtn.addEventListener('click', () => {
      prototypeToast.classList.remove('active');
      if (toastTimeout) clearTimeout(toastTimeout);
    });
  }

  /* --------------------------------------------------------------------------
     7. Interactive Modal: "Let's Talk" Contact Flow
     -------------------------------------------------------------------------- */
  const openModal = () => {
    if (!talkModal) return;
    talkModal.classList.add('open');
    talkModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = talkModal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  };

  const closeModal = () => {
    if (!talkModal) return;
    talkModal.classList.remove('open');
    talkModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (headerTalkBtn) headerTalkBtn.addEventListener('click', openModal);
  if (mobileDrawerTalkBtn) mobileDrawerTalkBtn.addEventListener('click', openModal);
  if (btnCtaTalk) btnCtaTalk.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Close modal when clicking backdrop
  if (talkModal) {
    talkModal.addEventListener('click', (e) => {
      if (e.target === talkModal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (talkModal && talkModal.classList.contains('open')) {
        closeModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        navToggle.click();
      }
    }
  });

  // Scope selection chips in modal
  scopeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      scopeChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Form Submission
  window.handleFormSubmit = () => {
    const form = document.getElementById('talkForm');
    const successMsg = document.getElementById('formSuccessMessage');

    if (form && successMsg) {
      form.style.display = 'none';
      successMsg.style.display = 'flex';

      const successCloseBtn = document.getElementById('successCloseBtn');
      if (successCloseBtn) {
        successCloseBtn.onclick = () => {
          closeModal();
          setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            successMsg.style.display = 'none';
          }, 400);
        };
      }
    }
  };

  /* --------------------------------------------------------------------------
     8. Direct Email One-Click Copy
     -------------------------------------------------------------------------- */
  if (copyEmailBtn && copyBadge) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'hello@gliffy.studio';
      try {
        await navigator.clipboard.writeText(email);
        copyBadge.textContent = 'Copied! ✓';
        copyBadge.style.background = 'rgba(34, 197, 94, 0.25)';
        copyBadge.style.color = '#4ADE80';

        setTimeout(() => {
          copyBadge.textContent = 'Copy';
          copyBadge.style.background = '';
          copyBadge.style.color = '';
        }, 2500);
      } catch (err) {
        // Fallback
        showPrototypeToast('hello@gliffy.studio copied to clipboard');
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Scroll Reveal Animations (Intersection Observer)
     -------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     10. Back to Top Button
     -------------------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. Interactive Tab Switching inside the Browser Mockup
     -------------------------------------------------------------------------- */
  const vpTabs = document.querySelectorAll('.vp-tab');
  vpTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      vpTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /* --------------------------------------------------------------------------
     12. Smooth Navigation to Homepage on Logo Click
     -------------------------------------------------------------------------- */
  const brandLogos = document.querySelectorAll('.brand-logo');
  brandLogos.forEach((logo) => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      if (history.pushState) {
        history.pushState(null, null, '#hero');
      }
    });
  });

  console.log('GLIFFY — Creative Digital Studio engine initialized.');
})();
