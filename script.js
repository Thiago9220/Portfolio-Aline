// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 200;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.services-grid .reveal, .portfolio-grid .reveal, .testimonials-grid .reveal').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});

emailjs.init('SUA_PUBLIC_KEY');

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('.btn');
  const originalText = btn.innerHTML;

  // Feedback visual: enviando...
  btn.innerHTML = '⏳ Enviando...';
  btn.disabled = true;

  emailjs.sendForm(
    'SEU_SERVICE_ID',
    'SEU_TEMPLATE_ID',
    contactForm
  ).then(() => {
    btn.innerHTML = '✓ Mensagem Enviada!';
    btn.style.background = 'linear-gradient(135deg, #4ADE80, #22C55E)';
    btn.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.4)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  }).catch((error) => {
    console.error('EmailJS Error:', error);
    btn.innerHTML = '✗ Erro ao enviar';
    btn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
    btn.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.4)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
    }, 3000);
  });
});

function animateCounter(element, target) {
  const startTime = performance.now();
  const duration = 2000;
  const suffix = target.replace(/[\d.]/g, '');
  const numericValue = parseFloat(target);

  if (isNaN(numericValue)) {
    element.textContent = target;
    return;
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const current = Math.round(numericValue * eased);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe stat numbers for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.textContent;
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===== PARALLAX EFFECT ON ORBS =====
window.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 10;
    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
