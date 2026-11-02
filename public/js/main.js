document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });
  }

  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const page = link.dataset.page;
    if ((currentPage === 'home' && page === 'home') || page === currentPage) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  const planSelect = document.querySelector('#plan');
  if (plan && planSelect) {
    const option = [...planSelect.options].find((item) => item.text.toLowerCase() === plan.toLowerCase());
    if (option) planSelect.value = option.value;
  }

  const form = document.querySelector('#enquiry-form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = document.querySelector('#form-status');
      const button = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());

      status.textContent = 'Sending your enquiry...';
      button.disabled = true;
      button.style.opacity = '.65';

      try {
        const response = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to submit enquiry.');
        status.textContent = result.message;
        form.reset();
      } catch (error) {
        status.textContent = error.message || 'Something went wrong. Please try again.';
      } finally {
        button.disabled = false;
        button.style.opacity = '1';
      }
    });
  }
});
