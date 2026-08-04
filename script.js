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
    'education', 'skills', 'testimonials', 'certifications', 'articles', 'objective',
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
    initCopyButtons();
    renderCertLinks();
    renderArticles();
    renderCvExtras();
    initCvModal();
    initFooterYear();
    initLanguage();
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

  // ---------------- Contact form ----------------
  // Submits directly via Web3Forms (https://web3forms.com) when configured —
  // free, no backend needed, just an access key tied to the destination
  // inbox. Until a real key is set below, the form automatically falls
  // back to opening a pre-filled mailto: link, so it always works.
  var WEB3FORMS_ACCESS_KEY = 'REPLACE-WITH-YOUR-WEB3FORMS-ACCESS-KEY';

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var submitBtn = document.getElementById('cf-submit');
    var submitLabel = document.getElementById('cf-submit-label');
    var statusEl = document.getElementById('cf-status');
    var isConfigured = WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.indexOf('REPLACE-WITH') !== 0;

    function setStatus(text, tone) {
      if (!statusEl) return;
      statusEl.textContent = text || '';
      statusEl.className = 'text-sm mt-3 ' + (tone === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400');
      statusEl.classList.toggle('hidden', !text);
    }

    function mailtoFallback(name, email, subject, message) {
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailtoUrl = 'mailto:inasbinyousuf@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
      window.location.href = mailtoUrl;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (document.getElementById('cf-name') || {}).value || '';
      var email = (document.getElementById('cf-email') || {}).value || '';
      var subject = (document.getElementById('cf-subject') || {}).value || 'Project Inquiry';
      var message = (document.getElementById('cf-message') || {}).value || '';

      var originalLabel = submitLabel ? submitLabel.textContent : '';
      setStatus('', null);

      if (!isConfigured) {
        if (submitLabel) submitLabel.textContent = 'Opening Your Email App...';
        if (submitBtn) submitBtn.disabled = true;
        mailtoFallback(name, email, subject, message);
        setTimeout(function () {
          if (submitLabel) submitLabel.textContent = originalLabel;
          if (submitBtn) submitBtn.disabled = false;
        }, 2500);
        return;
      }

      if (submitLabel) submitLabel.textContent = 'Sending...';
      if (submitBtn) submitBtn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name, email: email, subject: subject, message: message,
          from_name: 'Portfolio contact form — inasbinyousuf.com',
        }),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            setStatus('Message sent — thanks! I\u2019ll get back to you soon.', 'success');
            form.reset();
          } else {
            throw new Error(data.message || 'Send failed');
          }
        })
        .catch(function (err) {
          console.error(err);
          setStatus('Could not send automatically — opening your email app instead.', 'error');
          mailtoFallback(name, email, subject, message);
        })
        .finally(function () {
          if (submitLabel) submitLabel.textContent = originalLabel;
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  // ---------------- CV modal + ATS-friendly PDF export ----------------
  // Uses the browser's native print pipeline (window.print -> "Save as PDF")
  // rather than rasterizing the DOM to an image. This is deliberate: an
  // image-based PDF has no extractable text, so it would fail every ATS
  // (applicant tracking system) scan. Native print output keeps real,
  // selectable text in the PDF, which is what ATS parsers read.
  function initCvModal() {
    var modal = document.getElementById('cv-modal');
    if (!modal) return;
    var closeBtn = document.getElementById('cv-close');
    var downloadBtn = document.getElementById('cv-download');
    var printHint = document.getElementById('cv-print-hint');
    var openTriggers = document.querySelectorAll('[data-open-cv]');

    function open() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (printHint) printHint.classList.add('hidden');
    }

    openTriggers.forEach(function (trigger) { trigger.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var originalTitle = document.title;
        document.title = 'Inas-Bin-Yousuf-CV';
        document.body.classList.add('printing-cv');
        if (printHint) printHint.classList.remove('hidden');

        var restored = false;
        function restore() {
          if (restored) return;
          restored = true;
          document.title = originalTitle;
          document.body.classList.remove('printing-cv');
          window.removeEventListener('afterprint', restore);
        }
        window.addEventListener('afterprint', restore);
        setTimeout(restore, 3000); // fallback in browsers that skip afterprint

        window.print();
      });
    }
  }

  // ---------------- Copy-to-clipboard buttons ----------------
  function initCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy-value]');
    buttons.forEach(function (btn) {
      var value = btn.getAttribute('data-copy-value');
      var iconDefault = btn.querySelector('[data-copy-icon-default]');
      var iconSuccess = btn.querySelector('[data-copy-icon-success]');
      var resetTimer = null;

      btn.addEventListener('click', function () {
        function showSuccess() {
          if (iconDefault) iconDefault.classList.add('hidden');
          if (iconSuccess) iconSuccess.classList.remove('hidden');
          btn.setAttribute('aria-label', 'Copied');
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            if (iconDefault) iconDefault.classList.remove('hidden');
            if (iconSuccess) iconSuccess.classList.add('hidden');
            btn.setAttribute('aria-label', 'Copy email address');
          }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(showSuccess).catch(function () {
            fallbackCopy(value);
            showSuccess();
          });
        } else {
          fallbackCopy(value);
          showSuccess();
        }
      });
    });
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(textarea);
  }

  // ---------------- Certification verification links ----------------
  // Static rows start with an empty data-cert-url. Any cert with a URL
  // saved through the admin panel (localStorage) is upgraded here into a
  // clickable "verify" link with an external-link icon; the rest stay
  // plain text, unchanged.
  function renderCertLinks() {
    var rows = document.querySelectorAll('#certifications [data-cert-url]');
    if (!rows.length) return;
    var savedUrls = (window.PortfolioData && window.PortfolioData.getCertUrls) ? window.PortfolioData.getCertUrls() : {};

    rows.forEach(function (row) {
      var label = row.querySelector('.cert-label');
      if (!label) return;
      var title = label.textContent.trim();
      var url = savedUrls[title] || '';

      var existingLink = row.querySelector('a[data-cert-link]');
      if (existingLink) {
        row.insertBefore(label, existingLink);
        existingLink.remove();
        row.classList.remove('cred-row--linked');
      }
      if (!url) return;

      row.classList.add('cred-row--linked');
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('data-cert-link', '');
      link.className = 'flex items-center gap-1.5 hover:text-signal-600 dark:hover:text-signal-400 transition-colors';
      link.setAttribute('aria-label', 'Verify credential (opens in a new tab)');
      row.insertBefore(link, label);
      link.appendChild(label);
      var icon = document.createElement('svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('stroke-width', '2');
      icon.setAttribute('stroke-linecap', 'round');
      icon.setAttribute('stroke-linejoin', 'round');
      icon.setAttribute('class', 'w-3.5 h-3.5 shrink-0 text-ink-400');
      icon.innerHTML = '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>';
      link.appendChild(icon);
    });
  }

  // ---------------- Language toggle (EN / BN) ----------------
  function initLanguage() {
    var toggle = document.getElementById('lang-toggle');
    if (!toggle || !window.I18N) return;
    var buttons = toggle.querySelectorAll('.lang-btn');

    function getNested(obj, path) {
      return path.split('.').reduce(function (acc, key) {
        return acc && acc[key] !== undefined ? acc[key] : undefined;
      }, obj);
    }

    function applyLanguage(lang) {
      var dict = window.I18N[lang];
      if (!dict) return;
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var value = getNested(dict, el.getAttribute('data-i18n'));
        if (value !== undefined) el.textContent = value;
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var value = getNested(dict, el.getAttribute('data-i18n-placeholder'));
        if (value !== undefined) el.setAttribute('placeholder', value);
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var value = getNested(dict, el.getAttribute('data-i18n-html'));
        if (value !== undefined) el.innerHTML = value;
      });
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.classList.toggle('lang-bn', lang === 'bn');
      buttons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
      try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { applyLanguage(btn.getAttribute('data-lang')); });
    });

    var saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
    applyLanguage(saved === 'bn' ? 'bn' : 'en');
  }

  // ---------------- Articles (admin-managed, localStorage-backed) ----------------
  function renderArticles() {
    var container = document.getElementById('articles-list');
    if (!container) return;
    var articles = (window.PortfolioData && window.PortfolioData.getArticles) ? window.PortfolioData.getArticles() : [];

    if (!articles.length) {
      container.innerHTML = '<p class="text-sm text-ink-500 dark:text-ink-400 sm:col-span-2 lg:col-span-3">No articles yet.</p>';
      return;
    }

    container.innerHTML = articles.map(function (a, i) {
      return (
        '<div class="card-premium p-6 flex flex-col">' +
        '  <span class="pill bg-signal-50 text-signal-700 dark:bg-signal-500/10 dark:text-signal-300 mb-4 inline-block self-start">' + escapeHtmlLocal(a.date || '') + '</span>' +
        '  <h3 class="font-display font-semibold text-ink-900 dark:text-white leading-snug">' + escapeHtmlLocal(a.title) + '</h3>' +
        '  <p class="mt-2 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">' + escapeHtmlLocal(a.excerpt) + '</p>' +
        '  <div class="article-body mt-3 text-sm text-ink-600 dark:text-ink-300 leading-relaxed hidden space-y-3">' +
             (a.body || '').split('\n\n').map(function (p) { return '<p>' + escapeHtmlLocal(p) + '</p>'; }).join('') +
        '  </div>' +
        '  <button type="button" class="article-toggle mt-4 text-sm font-semibold text-signal-600 dark:text-signal-400 hover:text-signal-700 inline-flex items-center gap-1 self-start" data-index="' + i + '">' +
        '    <span class="label">Read more</span>' +
        '    <svg class="w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
        '  </button>' +
        '</div>'
      );
    }).join('');

    container.querySelectorAll('.article-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.card-premium');
        var bodyEl = card.querySelector('.article-body');
        var label = btn.querySelector('.label');
        var icon = btn.querySelector('svg');
        var open = !bodyEl.classList.contains('hidden');
        bodyEl.classList.toggle('hidden', open);
        label.textContent = open ? 'Read more' : 'Show less';
        icon.style.transform = open ? '' : 'rotate(180deg)';
      });
    });
  }

  function escapeHtmlLocal(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------------- CV extras (admin-managed, localStorage-backed) ----------------
  function renderCvExtras() {
    var mount = document.getElementById('cv-extras-mount');
    if (!mount) return;
    var extras = (window.PortfolioData && window.PortfolioData.getCvExtras) ? window.PortfolioData.getCvExtras() : [];
    var populated = extras.filter(function (e) { return e.label && e.value; });

    if (!populated.length) {
      mount.innerHTML = '';
      mount.classList.add('hidden');
      return;
    }
    mount.classList.remove('hidden');
    mount.innerHTML =
      '<h2 class="font-serif text-sm font-bold uppercase tracking-widest text-signal-600 mb-2">Additional Information</h2>' +
      populated.map(function (e) {
        return '<p class="text-sm text-ink-700 mb-1"><strong class="text-ink-900">' + escapeHtmlLocal(e.label) + ':</strong> ' + escapeHtmlLocal(e.value) + '</p>';
      }).join('');
  }

  // Hooks the admin panel (admin.js) calls after saving edits, so changes
  // reflect immediately without a page reload.
  window.PortfolioAdmin = {
    refreshCertLinks: renderCertLinks,
    refreshArticles: renderArticles,
    refreshCvExtras: renderCvExtras,
  };

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
