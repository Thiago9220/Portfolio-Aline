const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isEnglish = document.documentElement.lang.startsWith('en');
const copy = isEnglish ? {
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  campaignId: 'campaigns',
  sending: 'Sending your message…',
  sent: 'Message sent successfully. Thank you for reaching out!',
  error: 'Your message could not be sent. Please try again or use the email address.'
} : {
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  campaignId: 'campanhas',
  sending: 'Enviando sua mensagem…',
  sent: 'Mensagem enviada com sucesso. Obrigada pelo contato!',
  error: 'Não foi possível enviar agora. Tente novamente ou use o e-mail ao lado.'
};

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

function setMenuState(isOpen, returnFocus = false) {
  navToggle.classList.toggle('active', isOpen);
  navLinks.classList.toggle('active', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? copy.closeMenu : copy.openMenu);

  if (returnFocus) navToggle.focus();
}

navToggle.addEventListener('click', () => {
  setMenuState(!navLinks.classList.contains('active'));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('active')) {
    setMenuState(false, true);
  }

  if (event.key === 'Tab' && navLinks.classList.contains('active')) {
    const focusable = [navToggle, ...navLinks.querySelectorAll('a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) setMenuState(false);
});

const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 200;
  let activeId = '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      activeId = section.id.startsWith('creators-') ? copy.campaignId : section.id;
    }
  });

  navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });

  if (activeId) {
    const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
    activeLink?.classList.add('active');
    activeLink?.setAttribute('aria-current', 'location');
  }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((element) => revealObserver.observe(element));

  document.querySelectorAll('.services-grid .reveal, .portfolio-grid .reveal, .creators-grid .reveal')
    .forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index, 7) * 0.07}s`;
    });
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalContent = button.innerHTML;
    const formData = new FormData(contactForm);

    button.innerHTML = 'Enviando…';
    button.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    formStatus.className = 'form-status';
    formStatus.textContent = copy.sending;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Falha no envio');

      formStatus.className = 'form-status success';
      formStatus.textContent = copy.sent;
      contactForm.reset();
    } catch (error) {
      console.error('Formspree Error:', error);
      formStatus.className = 'form-status error';
      formStatus.textContent = copy.error;
    } finally {
      button.innerHTML = originalContent;
      button.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }
  });
}

function animateCounter(element, target) {
  const suffix = target.replace(/[\d.]/g, '');
  const numericValue = Number.parseFloat(target);

  if (Number.isNaN(numericValue) || prefersReducedMotion) {
    element.textContent = target;
    return;
  }

  const startTime = performance.now();
  const duration = 1600;

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(numericValue * eased)}${suffix}`;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, entry.target.textContent);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((element) => counterObserver.observe(element));
}

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll('.orb').forEach((orb, index) => {
      const speed = (index + 1) * 10;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  }, { passive: true });
}

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();
