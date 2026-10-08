document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('menu-button');
  const nav = document.getElementById('nav-menu');

  function close() {
    if (!button || !nav) return;
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
    button.textContent = '☰';
  }

  if (button && nav) {
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      button.textContent = open ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  const copyright = document.getElementById('copyright');
  if (copyright) {
    copyright.textContent = `© ${new Date().getFullYear()} KALXA. All rights reserved.`;
  }
});
