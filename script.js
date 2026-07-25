(function () {
  'use strict';

  // Guard: fetch() of local fragment files is blocked under file:// by browsers.
  // Show a clear, friendly explanation instead of a silently broken page.
  if (window.location.protocol === 'file:') {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.innerHTML =
        '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
        'padding:2rem;font-family:Inter,ui-sans-serif,system-ui,sans-serif;text-align:center;background:#fff;color:#18181b;">' +
        '<div style="max-width:34rem;">' +
        '<h1 style="font-size:1.5rem;font-weight:800;margin-bottom:1rem;">One more step to view this site</h1>' +
        '<p style="line-height:1.7;color:#52525b;">This page loads its sections with <code>fetch()</code>, which browsers block when a page is opened directly as a <code>file://</code> path. ' +
        'Please serve this folder over a local server instead — e.g. right-click <code>index.html</code> in VS Code and choose ' +
        '<strong>“Open with Live Server”</strong>, or run <code>python3 -m http.server</code> in the folder and open ' +
        '<code>http://localhost:8000</code> — then reload.</p></div></div>';
    });
    return;
  }

  var SECTIONS = [
    'navbar', 'hero', 'about', 'experience', 'projects', 'services',
    'education', 'skills', 'testimonials', 'certifications', 'objective',
    'contact', 'footer', 'cv-modal'
  ];

  function loadSection(name) {
    var placeholder = document.getElementById(name + '-placeholder');
    if (!placeholder) return Promise.resolve();

    return fetch(name + '.html')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + name + '.html (HTTP ' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        var nodes = Array.prototype.slice.call(wrapper.childNodes);
        if (nodes.length) {
          placeholder.replaceWith.apply(placeholder, nodes);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  Promise.all(SECTIONS.map(loadSection)).then(function () {
    initTheme();
    initMobileMenu();
    initScrollProgress();
    initBackToTop();
    initActiveSection();
    initTestimonials();
    initContactForm();
    initCvModal();
    initFooterYear();
    revealPage();
  });

  // ---------------- Theme toggle ----------------
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var moonIcon = document.getElementById('icon-theme-moon');
    var sunIcon = document.getElementById('icon-theme-sun');

    function reflectIcons() {
      var isDark = document.documentElement.classList.contains('dark');
      if (moonIcon) moonIcon.classList.toggle('hidden', isDark);
      if (sunIcon) sunIcon.classList.toggle('hidden', !isDark);
    }
    reflectIcons();

    btn.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* ignore */ }
      reflectIcons();
    });
  }

  // ---------------- Mobile menu ----------------
  function initMobileMenu() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    var openIcon = document.getElementById('icon-menu-open');
    var closeIcon = document.getElementById('icon-menu-close');

    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (openIcon) openIcon.classList.toggle('hidden', open);
      if (closeIcon) closeIcon.classList.toggle('hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });

    var links = menu.querySelectorAll('a[data-nav-link]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () { setOpen(false); });
    }
  }

  // ---------------- Scroll progress bar ----------------
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---------------- Back to top ----------------
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function update() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      btn.classList.toggle('visible', scrollTop > 500);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------------- Active-section highlighting ----------------
  function initActiveSection() {
    var links = document.querySelectorAll('[data-nav-link]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) continue;
      var section = document.getElementById(href.slice(1));
      if (section && sections.indexOf(section) === -1) sections.push(section);
    }
    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // ---------------- Testimonials carousel ----------------
  function initTestimonials() {
    var slides = document.querySelectorAll('.testimonial-slide');
    if (!slides.length) return;
    var dots = document.querySelectorAll('#testimonial-dots .dot');
    var prevBtn = document.getElementById('testimonial-prev');
    var nextBtn = document.getElementById('testimonial-next');

    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.classList.toggle('hidden', i !== current); });
      dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
    }
    function startTimer() {
      stopTimer();
      timer = setInterval(function () { show(current + 1); }, 5000);
    }
    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); startTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); startTimer(); });
    });

    show(0);
    startTimer();
  }

  // ---------------- Contact form (mailto) ----------------
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var submitBtn = document.getElementById('cf-submit');
    var submitLabel = document.getElementById('cf-submit-label');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (document.getElementById('cf-name') || {}).value || '';
      var email = (document.getElementById('cf-email') || {}).value || '';
      var subject = (document.getElementById('cf-subject') || {}).value || 'Project Inquiry';
      var message = (document.getElementById('cf-message') || {}).value || '';

      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailtoUrl = 'mailto:inasbinyousuf@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      var originalLabel = submitLabel ? submitLabel.textContent : '';
      if (submitLabel) submitLabel.textContent = 'Opening Your Email App...';
      if (submitBtn) submitBtn.disabled = true;

      window.location.href = mailtoUrl;

      setTimeout(function () {
        if (submitLabel) submitLabel.textContent = originalLabel;
        if (submitBtn) submitBtn.disabled = false;
      }, 2500);
    });
  }

  // ---------------- CV modal + on-demand PDF export ----------------
  function initCvModal() {
    var modal = document.getElementById('cv-modal');
    if (!modal) return;
    var closeBtn = document.getElementById('cv-close');
    var downloadBtn = document.getElementById('cv-download');
    var downloadLabel = document.getElementById('cv-download-label');
    var openTriggers = document.querySelectorAll('[data-open-cv]');
    var pdfLibPromise = null;

    function open() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openTriggers.forEach(function (trigger) { trigger.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    function loadPdfLib() {
      if (window.html2pdf) return Promise.resolve();
      if (pdfLibPromise) return pdfLibPromise;
      pdfLibPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = function () { resolve(); };
        script.onerror = function () { reject(new Error('Could not load the PDF export library.')); };
        document.head.appendChild(script);
      });
      return pdfLibPromise;
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var content = document.getElementById('cv-content');
        if (!content) return;
        var originalLabel = downloadLabel ? downloadLabel.textContent : '';
        if (downloadLabel) downloadLabel.textContent = 'Preparing PDF...';
        downloadBtn.disabled = true;

        loadPdfLib()
          .then(function () {
            return window.html2pdf().set({
              margin: 0.4,
              filename: 'Inas-Bin-Yousuf-CV.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }).from(content).save();
          })
          .catch(function (err) {
            console.error(err);
            window.alert('Could not generate the PDF right now. Please check your connection and try again.');
          })
          .finally(function () {
            if (downloadLabel) downloadLabel.textContent = originalLabel;
            downloadBtn.disabled = false;
          });
      });
    }
  }

  // ---------------- Footer year ----------------
  function initFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // ---------------- One-time page reveal ----------------
  function revealPage() {
    var main = document.getElementById('page-content');
    if (!main) return;
    requestAnimationFrame(function () {
      main.classList.add('loaded');
    });
  }
})();
