import { animate, inView, scroll } from 'https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const springConfig = { type: 'spring', stiffness: 300, damping: 24 };

export function initMotionUI() {
  try {
    initHeroEntrance();
    initScrollReveals();
    initRouteLine();
    initNavbarShrink();
    initDealCardHover();
    setupModalAnimation();
  } catch (err) {
    console.warn('Motion UI init failed:', err);
  }
}

function initHeroEntrance() {
  const heroElements = document.querySelectorAll('[data-motion="hero"]');
  if (!heroElements.length) return;

  if (prefersReducedMotion) {
    heroElements.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  heroElements.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';

    animate(el, { opacity: 1, y: 0 }, {
      ...springConfig,
      delay: i * 0.08
    });
  });
}

function initScrollReveals() {
  if (prefersReducedMotion) return;

  const sections = document.querySelectorAll('.section-title, .section-subtitle');

  sections.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';

    inView(el, function() {
      animate(el, { opacity: 1, y: 0 }, springConfig);
    }, { amount: 0.5 });
  });
}

function initRouteLine() {
  const path = document.getElementById('routePath');
  const pins = document.querySelectorAll('.route-pin');
  if (!path) return;

  if (prefersReducedMotion) {
    pins.forEach(function(pin) {
      pin.classList.add('is-active');
    });
    return;
  }

  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  scroll(
    animate(path, { strokeDashoffset: [pathLength, 0] }, { ease: 'linear' }),
    { target: path, offset: ['start end', 'end start'] }
  );

  const sectionMap = {
    'how-it-works': document.getElementById('how-it-works'),
    'guides': document.getElementById('guides'),
    'deals': document.getElementById('deals'),
    'testimonials': document.getElementById('testimonials'),
    'blog': document.getElementById('blog')
  };

  Object.keys(sectionMap).forEach(function(key) {
    const section = sectionMap[key];
    const pin = document.querySelector('.route-pin[data-section="' + key + '"]');
    if (!section || !pin) return;

    inView(section, function() {
      pin.classList.add('is-active');
      if (!prefersReducedMotion) {
        animate(pin, { scale: [0.5, 1.2, 1] }, { duration: 0.4 });
      }
    }, { amount: 0.3 });
  });
}

function initNavbarShrink() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let shrunk = false;

  window.addEventListener('scroll', function() {
    const shouldShrink = window.scrollY > 60;
    if (shouldShrink !== shrunk) {
      shrunk = shouldShrink;
      navbar.classList.toggle('is-shrunk', shouldShrink);
    }
  }, { passive: true });
}

function initDealCardHover() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.deal-card').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      animate(card, { rotate: 0, y: -6 }, { type: 'spring', stiffness: 400, damping: 20 });
    });

    card.addEventListener('mouseleave', function() {
      const isEven = Array.from(card.parentNode.children).indexOf(card) % 2 === 1;
      animate(card, { rotate: isEven ? 0.5 : -0.5, y: 0 }, { type: 'spring', stiffness: 400, damping: 20 });
    });
  });
}

function setupModalAnimation() {
  if (!window.holidayApp) return;

  window.holidayApp.animateModal = function(element, open, onComplete) {
    if (!element) return;

    if (prefersReducedMotion) {
      element.style.opacity = open ? '1' : '0';
      if (onComplete) onComplete();
      return;
    }

    if (open) {
      element.style.opacity = '0';
      element.style.transform = 'scale(0.9)';
      animate(element, { opacity: 1, scale: 1 }, springConfig);
    } else {
      animate(element, { opacity: 0, scale: 0.9 }, {
        duration: 0.2,
        onComplete: onComplete
      });
    }
  };
}

export function initAuthMotionIfPresent() {
  const authVisual = document.querySelector('.auth-visual');
  const authCard = document.querySelector('.auth-card');
  if (!authVisual && !authCard) return;

  if (prefersReducedMotion) return;

  if (authVisual) {
    authVisual.style.opacity = '0';
    authVisual.style.transform = 'translateX(-20px)';
    animate(authVisual, { opacity: 1, x: 0 }, { ...springConfig, delay: 0.1 });
  }

  if (authCard) {
    authCard.style.opacity = '0';
    authCard.style.transform = 'translateX(20px)';
    animate(authCard, { opacity: 1, x: 0 }, { ...springConfig, delay: 0.2 });

    const formGroups = authCard.querySelectorAll('.form-group');
    formGroups.forEach(function(group, i) {
      group.style.opacity = '0';
      group.style.transform = 'translateY(12px)';
      animate(group, { opacity: 1, y: 0 }, { ...springConfig, delay: 0.3 + i * 0.06 });
    });
  }
}

