import { initMotionUI } from './motion-ui.js';

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileMenu();
  initHeroSection();
  initGuides();
  initDeals();
  initBlog();
  initSearch();
  initGetStarted();
  initFooter();
  initScrollEffects();
  initMotionUI();
});

function showToast(message, type) {
  const existing = document.querySelector('.site-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'site-toast site-toast--' + (type || 'info');
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    toast.classList.add('site-toast--visible');
  });

  setTimeout(function() {
    toast.classList.remove('site-toast--visible');
    setTimeout(function() { toast.remove(); }, 300);
  }, 2800);
}

function initNavbar() {
  const searchInput = document.querySelector('.search-bar-nav input');
  const addListingBtn = document.querySelector('.add-listing-btn');
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  const navbar = document.querySelector('.navbar');

  function closeAllDropdowns() {
    dropdowns.forEach(function(dropdown) {
      dropdown.classList.remove('open');
    });
  }

  function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (!target) return;

    const navbarHeight = navbar ? navbar.offsetHeight : 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({ top: top, behavior: 'smooth' });
    closeAllDropdowns();
  }

  dropdowns.forEach(function(dropdown) {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    if (toggle) {
      toggle.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const isOpen = dropdown.classList.contains('open');
          closeAllDropdowns();
          if (!isOpen) dropdown.classList.add('open');
        } else if (!href || !href.includes('.html')) {
          e.preventDefault();
          const isOpen = dropdown.classList.contains('open');
          closeAllDropdowns();
          if (!isOpen) dropdown.classList.add('open');
        }
      });
    }

    dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          scrollToSection(href);
          navbar.classList.remove('menu-open');
        }
      });
    });
  });

  document.querySelectorAll('.nav-links > ul > li > a:not(.nav-dropdown-toggle)').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href);
        navbar.classList.remove('menu-open');
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) closeAllDropdowns();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        showToast('Searching for: ' + this.value.trim(), 'success');
      }
    });
  }

  if (addListingBtn) {
    addListingBtn.addEventListener('click', function() {
      showToast('Listing form coming soon.', 'info');
    });
  }
}

function initMobileMenu() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navbar || !menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', function() {
    const isOpen = navbar.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (!this.classList.contains('nav-dropdown-toggle')) {
        navbar.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navbar.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initHeroSection() {
  const searchBtn = document.querySelector('.search-btn');
  const searchInputs = document.querySelectorAll('.search-box input, .search-box select');

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const parts = [];
      searchInputs.forEach(function(input) {
        if (input.value && input.value.trim()) {
          const label = input.placeholder || input.options[input.selectedIndex].text;
          parts.push(label + ': ' + input.value.trim());
        }
      });

      if (parts.length) {
        showToast('Searching — ' + parts.join(', '), 'success');
      } else {
        showToast('Enter a search term or location to begin.', 'info');
      }
    });
  }
}

function initGuides() {
  const guideCards = document.querySelectorAll('.guide-card');
  const seeAllLink = document.querySelector('.our-guides-section .see-all-link');

  guideCards.forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      const title = this.querySelector('.card-content h4').textContent;
      showToast('Opening guide: ' + title, 'info');
    });
  });

  if (seeAllLink) {
    seeAllLink.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector('.our-guides-section').scrollIntoView({ behavior: 'smooth' });
      showToast('Showing all city guides', 'info');
    });
  }
}

function initDeals() {
  const dealCards = document.querySelectorAll('.deal-card');

  dealCards.forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      const title = this.querySelector('.deal-card-content h4').textContent;
      const price = this.querySelector('.price').textContent.trim();
      showDealModal(title, price);
    });
  });
}

function initBlog() {
  const blogCards = document.querySelectorAll('.blog-card');
  const seeAllLink = document.querySelector('.travel-blog-section .see-all-link');

  blogCards.forEach(function(card) {
    const readMoreBtn = card.querySelector('.read-more-link');
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const title = card.querySelector('.blog-card-content h4').textContent;
        showToast('Reading: ' + title, 'info');
      });
    }
  });

  if (seeAllLink) {
    seeAllLink.addEventListener('click', function(e) {
      e.preventDefault();
      showToast('Loading all articles...', 'info');
    });
  }
}

function initSearch() {
  const categorySelect = document.querySelector('.search-box select');

  if (categorySelect) {
    categorySelect.addEventListener('change', function() {
      if (this.value) {
        showToast('Category: ' + this.options[this.selectedIndex].text, 'info');
      }
    });
  }
}

function initGetStarted() {
  const btn = document.querySelector('.get-started-btn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(function() {
      const firstInput = document.querySelector('.search-box input');
      if (firstInput) firstInput.focus();
    }, 600);
    showToast('Let\'s plan your next holiday!', 'success');
  });
}

function initFooter() {
  const footerImages = document.querySelectorAll('.footer-image');
  const fallbackImages = [
    'images/footer1.jpg',
    'images/footer2.jpg',
    'images/footer3.jpg',
    'images/footer4.jpg',
    'images/footer5.jpg',
    'images/footer6.jpg'
  ];

  footerImages.forEach(function(img, index) {
    const urlMatch = img.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    const imageUrl = urlMatch ? urlMatch[1] : fallbackImages[index];

    verifyFooterImage(img, imageUrl, fallbackImages[index]);

    img.addEventListener('click', function() {
      openLightbox(imageUrl, index, fallbackImages);
    });

    img.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(imageUrl, index, fallbackImages);
      }
    });
  });

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email || !email.includes('@')) {
        showToast('Enter a valid email address.', 'error');
        return;
      }

      showToast('Subscribed. Offers will go to ' + email, 'success');
      emailInput.value = '';
    });
  }

  document.querySelectorAll('.social-icons i').forEach(function(icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', function() {
      showToast('Opening social profile...', 'info');
    });
    icon.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showToast('Opening social profile...', 'info');
      }
    });
  });
}

function verifyFooterImage(element, url, fallback) {
  const testImg = new Image();
  testImg.onload = function() {
    element.style.backgroundImage = 'url("' + url + '")';
  };
  testImg.onerror = function() {
    element.style.backgroundImage = 'url("' + fallback + '")';
  };
  testImg.src = url;
}

function openLightbox(imageUrl, index, allImages) {
  const existing = document.querySelector('.photo-lightbox');
  if (existing) existing.remove();

  const lightbox = document.createElement('div');
  lightbox.className = 'photo-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-label', 'Photo gallery');
  lightbox.innerHTML =
    '<div class="photo-lightbox__backdrop"></div>' +
    '<div class="photo-lightbox__content">' +
      '<button class="photo-lightbox__close" aria-label="Close">&times;</button>' +
      '<button class="photo-lightbox__prev" aria-label="Previous">&#10094;</button>' +
      '<img class="photo-lightbox__img" src="' + imageUrl + '" alt="Travel photo ' + (index + 1) + '">' +
      '<button class="photo-lightbox__next" aria-label="Next">&#10095;</button>' +
    '</div>';

  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  let currentIndex = index;

  function showImage(i) {
    currentIndex = (i + allImages.length) % allImages.length;
    lightbox.querySelector('.photo-lightbox__img').src = allImages[currentIndex];
  }

  function closeLightbox() {
    lightbox.remove();
    document.body.style.overflow = '';
  }

  lightbox.querySelector('.photo-lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.photo-lightbox__backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.photo-lightbox__prev').addEventListener('click', function() {
    showImage(currentIndex - 1);
  });
  lightbox.querySelector('.photo-lightbox__next').addEventListener('click', function() {
    showImage(currentIndex + 1);
  });

  if (window.holidayApp && window.holidayApp.animateModal) {
    window.holidayApp.animateModal(lightbox.querySelector('.photo-lightbox__content'), true);
  }

  document.addEventListener('keydown', function onKey(e) {
    if (!document.querySelector('.photo-lightbox')) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

function initScrollEffects() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.guide-card, .deal-card, .blog-card, .step-item, .footer-image, .testimonial-card').forEach(function(el) {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

function showDealModal(title, price) {
  const existing = document.querySelector('.deal-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'deal-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Book listing');
  modal.innerHTML =
    '<div class="deal-modal__backdrop"></div>' +
    '<div class="deal-modal__box">' +
      '<button class="deal-modal__close" aria-label="Close">&times;</button>' +
      '<h3>' + title + '</h3>' +
      '<p class="deal-modal__price">' + price + '</p>' +
      '<button class="deal-modal__book">Book now</button>' +
    '</div>';

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  if (window.holidayApp && window.holidayApp.animateModal) {
    window.holidayApp.animateModal(modal.querySelector('.deal-modal__box'), true);
  }

  function closeModal() {
    if (window.holidayApp && window.holidayApp.animateModal) {
      window.holidayApp.animateModal(modal.querySelector('.deal-modal__box'), false, function() {
        modal.remove();
        document.body.style.overflow = '';
      });
    } else {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  modal.querySelector('.deal-modal__close').addEventListener('click', closeModal);
  modal.querySelector('.deal-modal__backdrop').addEventListener('click', closeModal);
  modal.querySelector('.deal-modal__book').addEventListener('click', function() {
    showToast('Booking request sent for ' + title, 'success');
    closeModal();
  });

  document.addEventListener('keydown', function onKey(e) {
    if (!document.querySelector('.deal-modal')) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    if (e.key === 'Escape') closeModal();
  });
}

function formatPrice(price) {
  return '$' + parseFloat(price).toFixed(2);
}

window.holidayApp = {
  formatPrice: formatPrice,
  showDealModal: showDealModal,
  showToast: showToast,
  animateModal: null
};
