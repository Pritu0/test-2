(function () {
  'use strict';

  // ==========================================================================
  // CONFIG — change the password here. This is a client-side gate only
  // (there is no server on a static site), so it keeps casual visitors out
  // of edit mode but is not real security — don't store anything sensitive
  // through it.
  // ==========================================================================
  var ADMIN_PASSWORD = 'inas2026';

  var LS_CERT_URLS = 'portfolio_cert_urls';
  var LS_ARTICLES = 'portfolio_articles';
  var LS_CV_EXTRAS = 'portfolio_cv_extras';
  var SS_UNLOCKED = 'portfolio_admin_unlocked';

  // ==========================================================================
  // Seed content — drafted now since no real posts exist yet. Each one can
  // be edited or deleted from the admin panel, and new ones can be added
  // the same way; nothing here is fabricated project data, only general,
  // standard technical practice tied to the projects already listed above.
  // ==========================================================================
  var DEFAULT_ARTICLES = [
    {
      id: 'a1',
      title: 'Notes on the Corporate Network Architecture Design project',
      date: '2026',
      excerpt: 'Why multi-subnet VLAN isolation and redundant gateways matter, and how MikroTik and Cisco fit together in that design.',
      body: "When I laid out the corporate network, the first decision was splitting the flat network into subnets by function \u2014 one for staff workstations, one for servers, one for guest/public access, and a separate management subnet for the networking gear itself. Flat networks are easy to set up and painful to secure: a single compromised device can see everything else on the wire. VLANs fix that at layer 2, and pairing them with proper inter-VLAN routing rules means traffic between segments has to pass through a firewall policy instead of just existing by default.\n\nMikroTik handled the routing and NAT layer \u2014 RouterOS is inexpensive relative to enterprise alternatives, and its firewall syntax (chains, address lists, connection tracking) is flexible enough to write fairly granular rules once you're comfortable with it. Cisco's manageable switches did the VLAN tagging and trunking between wiring closets, since their CLI and hardware reliability are still the safer choice for switching infrastructure that has to run unattended for years.\n\nRedundant gateways were the other piece. A single router is a single point of failure for the entire office \u2014 if it drops, everyone drops. Running a redundancy protocol between two edge routers means a hardware failure or a firmware update doesn't take the whole network offline while someone walks to the server room.\n\nOn DHCP and NAT: I kept DHCP scopes narrow and documented (which range is workstations, which is VoIP if applicable, which is printers) rather than one large pool for everything, since it makes troubleshooting \u2014 and firewall rule-writing \u2014 much easier later. The main lesson from this project: most of the actual security value came from the boring parts (documented subnetting, narrow firewall rules, keeping a management VLAN separate) rather than anything exotic.",
    },
    {
      id: 'a2',
      title: 'Setting up AD-DS & DNS on Windows Server 2022',
      date: '2026',
      excerpt: 'Domain controller basics, DNS zone design, and where Group Policy actually earns its keep in a small corporate environment.',
      body: "Active Directory Domain Services is the identity backbone for a Windows-based office \u2014 once it's in place, user accounts, computer accounts, and permissions all live in one directory instead of being managed device-by-device. Promoting a Windows Server 2022 box to a domain controller is the easy part; the decisions that actually matter are the domain name you pick (using a name you don't control publicly avoids future conflicts), and how you plan your organizational unit (OU) structure before you start creating accounts, since restructuring OUs later means redoing every Group Policy link and permission that pointed at the old structure.\n\nDNS runs alongside AD-DS almost by necessity \u2014 domain-joined machines rely on it to find domain controllers in the first place. I set up an Active Directory\u2013integrated primary zone (so DNS records replicate automatically along with AD instead of needing a separate transfer mechanism) plus a reverse lookup zone, which matters more than people expect: a lot of logging, troubleshooting, and some security tooling depend on reverse DNS resolving correctly.\n\nGroup Policy is where centralized management actually shows up day to day \u2014 password complexity and lockout policy, drive mappings, restricting who can install software, pushing printer connections, disabling USB storage on machines that shouldn't have it. The practical lesson was to keep policies scoped narrowly (one policy per concern, linked to the OU that needs it) rather than one large policy doing everything, since narrow policies are far easier to troubleshoot when something unexpected happens on a specific machine or user.\n\nOn security: disabling the built-in Administrator account for daily use, enforcing a real password policy from day one, and keeping a second break-glass admin account with credentials stored offline are all cheap insurance against the two most common failure modes \u2014 a compromised admin credential, and getting locked out of your own domain.",
    },
    {
      id: 'a3',
      title: 'Linux administration & storage services, lessons learned',
      date: '2026',
      excerpt: 'SSH hardening, backup automation, and choosing between NFS and Samba for a mixed environment.',
      body: "Most of what makes a Linux file server \"secure enough\" for a small business happens in the first hour of setup, not in ongoing maintenance. Key-based SSH authentication instead of passwords, then disabling password authentication entirely in sshd_config, removes the single most common attack surface \u2014 automated credential-stuffing against SSH just stops working. Disabling direct root login and requiring sudo for privileged commands adds an audit trail: you can see who ran what, not just that \"root\" did something. Fail2ban on top of that catches anything that slips through by watching for repeated failed attempts and blocking the source.\n\nFor backups, I leaned on cron plus rsync for file-level backups and a scheduled dump-and-compress routine for anything database-backed, writing to a separate volume (and, ideally, off-box or off-site storage \u2014 a backup that lives on the same disk as the data it's backing up doesn't survive a disk failure). The habit that actually matters more than the tooling choice is testing restores periodically; a backup job that's been silently failing for three months is worse than no backup, because you don't find out until you need it.\n\nOn NFS versus Samba: NFS is the simpler, lower-overhead choice when every client is Linux/Unix, since it's a native filesystem-level protocol without SMB's authentication overhead. Samba earns its place the moment Windows clients need access, since it speaks SMB natively and integrates with Windows-style permissions and (if needed) Active Directory. In a mixed environment I've generally kept both running side by side, scoped to the clients that actually need each one, rather than forcing everything through one protocol.\n\nThe overall lesson: none of this is exotic \u2014 it's mostly about not skipping the unglamorous setup steps (key-based auth, tested backups, scoped permissions) before moving on to the parts that feel more like \"real\" infrastructure work.",
    },
  ];

  // ==========================================================================
  // Storage helpers
  // ==========================================================================
  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getCertUrls() { return readJSON(LS_CERT_URLS, {}); }
  function setCertUrl(title, url) {
    var map = getCertUrls();
    if (url) map[title] = url; else delete map[title];
    writeJSON(LS_CERT_URLS, map);
  }
  function getArticles() {
    var stored = readJSON(LS_ARTICLES, null);
    return stored !== null ? stored : DEFAULT_ARTICLES;
  }
  function setArticles(list) { writeJSON(LS_ARTICLES, list); }
  function getCvExtras() { return readJSON(LS_CV_EXTRAS, []); }
  function setCvExtras(list) { writeJSON(LS_CV_EXTRAS, list); }

  // Exposed for other scripts (script.js certifications, cv-modal render)
  window.PortfolioData = {
    getCertUrls: getCertUrls,
    getArticles: getArticles,
    getCvExtras: getCvExtras,
  };

  // ==========================================================================
  // Auth
  // ==========================================================================
  function isUnlocked() {
    try { return sessionStorage.getItem(SS_UNLOCKED) === '1'; } catch (e) { return false; }
  }
  function unlock() {
    try { sessionStorage.setItem(SS_UNLOCKED, '1'); } catch (e) { /* ignore */ }
  }
  function lock() {
    try { sessionStorage.removeItem(SS_UNLOCKED); } catch (e) { /* ignore */ }
  }

  function toast(msg) {
    var el = document.getElementById('admin-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'admin-toast';
      el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-xl opacity-0 pointer-events-none transition-opacity duration-300';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 1800);
  }

  // ==========================================================================
  // Panel UI
  // ==========================================================================
  var activeTab = 'certs';

  function buildPanelShell() {
    var overlay = document.createElement('div');
    overlay.id = 'admin-overlay';
    overlay.className = 'fixed inset-0 z-[70] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML =
      '<div class="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">' +
      '  <div class="flex items-center justify-between px-6 py-4 border-b border-ink-100 dark:border-ink-800 shrink-0">' +
      '    <h3 class="font-display font-bold text-lg text-ink-900 dark:text-white">Admin</h3>' +
      '    <div class="flex items-center gap-2">' +
      '      <button id="admin-lock-btn" type="button" class="text-xs font-mono text-ink-400 hover:text-rose-500 px-2 py-1">Lock</button>' +
      '      <button id="admin-close-btn" type="button" aria-label="Close" class="w-8 h-8 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">' +
      '        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="flex border-b border-ink-100 dark:border-ink-800 px-6 gap-5 shrink-0">' +
      '    <button data-tab="certs" class="admin-tab py-3 text-sm font-semibold border-b-2 -mb-px">Certification Links</button>' +
      '    <button data-tab="articles" class="admin-tab py-3 text-sm font-semibold border-b-2 -mb-px">Articles</button>' +
      '    <button data-tab="cv" class="admin-tab py-3 text-sm font-semibold border-b-2 -mb-px">CV Extras</button>' +
      '  </div>' +
      '  <div id="admin-tab-body" class="overflow-y-auto p-6 flex-1"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector('#admin-close-btn').addEventListener('click', closePanel);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePanel(); });
    overlay.querySelector('#admin-lock-btn').addEventListener('click', function () {
      lock();
      closePanel();
      toast('Admin locked');
    });
    overlay.querySelectorAll('.admin-tab').forEach(function (btn) {
      btn.addEventListener('click', function () { setTab(btn.getAttribute('data-tab')); });
    });
    return overlay;
  }

  function setTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.admin-tab').forEach(function (btn) {
      var on = btn.getAttribute('data-tab') === tab;
      btn.classList.toggle('border-signal-600', on);
      btn.classList.toggle('text-signal-600', on);
      btn.classList.toggle('dark:text-signal-400', on);
      btn.classList.toggle('border-transparent', !on);
      btn.classList.toggle('text-ink-400', !on);
    });
    var body = document.getElementById('admin-tab-body');
    if (!body) return;
    if (tab === 'certs') renderCertsTab(body);
    if (tab === 'articles') renderArticlesTab(body);
    if (tab === 'cv') renderCvTab(body);
  }

  function openPanel() {
    var overlay = document.getElementById('admin-overlay') || buildPanelShell();
    overlay.style.display = 'flex';
    setTab(activeTab);
  }
  function closePanel() {
    var overlay = document.getElementById('admin-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // --- Certifications tab ---
  function renderCertsTab(body) {
    var titles = Array.prototype.slice.call(document.querySelectorAll('#certifications [data-cert-url]'))
      .map(function (row) {
        var label = row.querySelector('.cert-label');
        return label ? label.textContent.trim() : '';
      });
    var urls = getCertUrls();
    body.innerHTML = '<p class="text-xs text-ink-500 mb-4">Paste a verification URL for any certificate that has one (Credly, LinkedIn Learning, issuer page, etc). Leave blank for none. Saves as you leave the field.</p>' +
      '<div class="space-y-2">' +
      titles.map(function (t, i) {
        return '<div class="flex items-center gap-3">' +
          '<span class="text-xs text-ink-600 dark:text-ink-300 w-1/2 shrink-0 leading-snug">' + escapeHtml(t) + '</span>' +
          '<input type="url" data-cert-index="' + i + '" value="' + escapeHtml(urls[t] || '') + '" placeholder="https://..." class="flex-1 text-xs rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-800 dark:text-ink-100">' +
          '</div>';
      }).join('') + '</div>';

    body.querySelectorAll('input[data-cert-index]').forEach(function (input, i) {
      input.addEventListener('change', function () {
        setCertUrl(titles[i], input.value.trim());
        toast('Saved');
        if (window.PortfolioAdmin && window.PortfolioAdmin.refreshCertLinks) window.PortfolioAdmin.refreshCertLinks();
      });
    });
  }

  // --- Articles tab ---
  function renderArticlesTab(body) {
    var list = getArticles();
    body.innerHTML = '<div id="admin-articles-list" class="space-y-4"></div>' +
      '<button id="admin-add-article" type="button" class="mt-4 btn-primary text-sm" style="padding:0.55rem 1.1rem;">+ Add article</button>';

    var listEl = body.querySelector('#admin-articles-list');
    list.forEach(function (a) { listEl.appendChild(articleEditRow(a, list)); });

    body.querySelector('#admin-add-article').addEventListener('click', function () {
      var fresh = { id: 'a' + Date.now(), title: '', date: String(new Date().getFullYear()), excerpt: '', body: '' };
      list.push(fresh);
      setArticles(list);
      listEl.appendChild(articleEditRow(fresh, list));
      refreshArticlesSection();
    });
  }

  function articleEditRow(a, list) {
    var row = document.createElement('div');
    row.className = 'border border-ink-200 dark:border-ink-700 rounded-lg p-3 space-y-2';
    row.innerHTML =
      '<input type="text" value="' + escapeHtml(a.title) + '" placeholder="Title" class="w-full text-sm font-semibold rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-800 dark:text-ink-100" data-field="title">' +
      '<input type="text" value="' + escapeHtml(a.excerpt) + '" placeholder="One-line excerpt" class="w-full text-xs rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-700 dark:text-ink-200" data-field="excerpt">' +
      '<textarea rows="4" placeholder="Full article body" class="w-full text-xs rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-700 dark:text-ink-200" data-field="body">' + escapeHtml(a.body) + '</textarea>' +
      '<div class="flex justify-end"><button type="button" class="text-xs font-semibold text-rose-500 hover:text-rose-600" data-action="delete">Delete</button></div>';

    row.querySelectorAll('[data-field]').forEach(function (input) {
      input.addEventListener('change', function () {
        a[input.getAttribute('data-field')] = input.value;
        setArticles(list);
        toast('Saved');
        refreshArticlesSection();
      });
    });
    row.querySelector('[data-action="delete"]').addEventListener('click', function () {
      var idx = list.indexOf(a);
      if (idx > -1) list.splice(idx, 1);
      setArticles(list);
      row.remove();
      toast('Deleted');
      refreshArticlesSection();
    });
    return row;
  }

  // --- CV extras tab ---
  function renderCvTab(body) {
    var list = getCvExtras();
    body.innerHTML = '<p class="text-xs text-ink-500 mb-4">Extra label/value lines to show in the CV (e.g. Languages, Awards) \u2014 shown only when at least one exists.</p>' +
      '<div id="admin-cv-list" class="space-y-2"></div>' +
      '<button id="admin-add-cv" type="button" class="mt-4 btn-primary text-sm" style="padding:0.55rem 1.1rem;">+ Add field</button>';

    var listEl = body.querySelector('#admin-cv-list');
    list.forEach(function (item) { listEl.appendChild(cvExtraRow(item, list)); });

    body.querySelector('#admin-add-cv').addEventListener('click', function () {
      var fresh = { label: '', value: '' };
      list.push(fresh);
      setCvExtras(list);
      listEl.appendChild(cvExtraRow(fresh, list));
      refreshCvExtras();
    });
  }

  function cvExtraRow(item, list) {
    var row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML =
      '<input type="text" value="' + escapeHtml(item.label) + '" placeholder="Label (e.g. Languages)" class="w-1/3 text-xs rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-800 dark:text-ink-100" data-field="label">' +
      '<input type="text" value="' + escapeHtml(item.value) + '" placeholder="Value" class="flex-1 text-xs rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-2.5 py-1.5 text-ink-800 dark:text-ink-100" data-field="value">' +
      '<button type="button" data-action="delete" class="text-rose-500 hover:text-rose-600 shrink-0" aria-label="Delete"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>';

    row.querySelectorAll('[data-field]').forEach(function (input) {
      input.addEventListener('change', function () {
        item[input.getAttribute('data-field')] = input.value;
        setCvExtras(list);
        toast('Saved');
        refreshCvExtras();
      });
    });
    row.querySelector('[data-action="delete"]').addEventListener('click', function () {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      setCvExtras(list);
      row.remove();
      toast('Deleted');
      refreshCvExtras();
    });
    return row;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function refreshArticlesSection() { if (window.PortfolioAdmin && window.PortfolioAdmin.refreshArticles) window.PortfolioAdmin.refreshArticles(); }
  function refreshCvExtras() { if (window.PortfolioAdmin && window.PortfolioAdmin.refreshCvExtras) window.PortfolioAdmin.refreshCvExtras(); }

  // ==========================================================================
  // Password prompt + discreet trigger
  // ==========================================================================
  function promptPassword() {
    var overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[70] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4';
    overlay.innerHTML =
      '<div class="bg-white dark:bg-ink-900 rounded-2xl w-full max-w-xs p-6 shadow-2xl">' +
      '  <p class="text-sm font-semibold text-ink-900 dark:text-white mb-3">Admin password</p>' +
      '  <input type="password" id="admin-pw-input" class="w-full text-sm rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-3 py-2 text-ink-800 dark:text-ink-100" autocomplete="off">' +
      '  <p id="admin-pw-error" class="text-xs text-rose-500 mt-2 hidden">Incorrect password.</p>' +
      '  <div class="flex justify-end gap-2 mt-4">' +
      '    <button id="admin-pw-cancel" type="button" class="text-sm text-ink-500 px-3 py-1.5">Cancel</button>' +
      '    <button id="admin-pw-submit" type="button" class="btn-primary text-sm" style="padding:0.5rem 1rem;">Unlock</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
    var input = overlay.querySelector('#admin-pw-input');
    input.focus();

    function submit() {
      if (input.value === ADMIN_PASSWORD) {
        unlock();
        overlay.remove();
        openPanel();
      } else {
        overlay.querySelector('#admin-pw-error').classList.remove('hidden');
        input.value = '';
        input.focus();
      }
    }
    overlay.querySelector('#admin-pw-submit').addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    overlay.querySelector('#admin-pw-cancel').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function initTrigger() {
    var trigger = document.getElementById('admin-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      if (isUnlocked()) openPanel(); else promptPassword();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Trigger lives in footer.html, which loads async — poll briefly for it.
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var trigger = document.getElementById('admin-trigger');
      if (trigger) { initTrigger(); clearInterval(iv); }
      if (tries > 40) clearInterval(iv);
    }, 150);
  });
})();
