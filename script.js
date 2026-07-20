const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeCopy = document.querySelector('.theme-copy');

function setTheme(theme) {
  const isNight = theme === 'night';
  body.classList.toggle('night', isNight);
  themeToggle.setAttribute('aria-pressed', String(isNight));
  themeToggle.setAttribute('aria-label', `Switch to ${isNight ? 'light' : 'night'} mode`);
  themeCopy.textContent = isNight ? 'Night' : 'Light';
}

setTheme(localStorage.getItem('portfolio-theme') || 'light');
themeToggle.addEventListener('click', () => {
  const nextTheme = body.classList.contains('night') ? 'light' : 'night';
  localStorage.setItem('portfolio-theme', nextTheme);
  setTheme(nextTheme);
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

const slides = [...document.querySelectorAll('.certificate-slide')];
const currentSlide = document.querySelector('#slide-current');
let activeSlide = 0;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  currentSlide.textContent = String(activeSlide + 1).padStart(2, '0');
}

document.querySelectorAll('[data-slide]').forEach((button) => {
  button.addEventListener('click', () => showSlide(activeSlide + (button.dataset.slide === 'next' ? 1 : -1)));
});

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const details = Object.fromEntries(new FormData(form).entries());
  submitButton.disabled = true;
  formStatus.textContent = 'Sending your message…';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send message.');
    form.reset();
    formStatus.textContent = 'Thank you — your message has been sent.';
  } catch (error) {
    const subject = encodeURIComponent(`${details.subject} — portfolio enquiry`);
    const message = encodeURIComponent(`Name: ${details.name}\nEmail: ${details.email}\n\n${details.message}`);
    formStatus.innerHTML = `The form service is not available yet. <a href="mailto:tekjunhong@gmail.com?subject=${subject}&body=${message}">Open your email app instead</a>.`;
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
