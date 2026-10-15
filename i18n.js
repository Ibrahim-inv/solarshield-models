// Shared language switch for the Thea site: Arabic (default, right-to-left) and English (left-to-right).
// Static text: give an element data-i18n="key" and put the English HTML in window.I18N_EN[key]
// (a page script that runs before this file). aria-label: data-i18n-label="key".
// Dynamic text in page scripts: L('عربي', 'English'), and re-render on the 'langchange' event.
(function () {
  var q = null, saved = null;
  try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  try { saved = localStorage.getItem('thea-lang'); } catch (e) {}
  window.LANG = (q === 'en' || q === 'ar') ? q : (saved === 'en' ? 'en' : 'ar');
  window.L = function (ar, en) { return window.LANG === 'en' ? en : ar; };

  window.applyLang = function () {
    var en = window.LANG === 'en', root = document.documentElement, dict = window.I18N_EN || {};
    root.lang = en ? 'en' : 'ar';
    root.dir = en ? 'ltr' : 'rtl';
    if (root.dataset.titleEn) {
      if (root.dataset.titleAr === undefined) root.dataset.titleAr = document.title;
      document.title = en ? root.dataset.titleEn : root.dataset.titleAr;
    }
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.ar === undefined) el.dataset.ar = el.innerHTML;
      var k = el.dataset.i18n;
      el.innerHTML = (en && dict[k] != null) ? dict[k] : el.dataset.ar;
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
      if (el.dataset.arLabel === undefined) el.dataset.arLabel = el.getAttribute('aria-label') || '';
      var k = el.dataset.i18nLabel;
      el.setAttribute('aria-label', (en && dict[k] != null) ? dict[k] : el.dataset.arLabel);
    });
    var b = document.getElementById('langBtn');
    if (b) { b.textContent = en ? 'العربية' : 'English'; b.setAttribute('lang', en ? 'ar' : 'en'); }
    document.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
      try { var u = new URL(a.getAttribute('href'), location.href); u.searchParams.set('lang', window.LANG); a.href = u.href; } catch (e) {}
    });
    window.dispatchEvent(new Event('langchange'));
  };

  window.setLang = function (l) {
    window.LANG = l;
    try { localStorage.setItem('thea-lang', l); } catch (e) {}
    try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u.href); } catch (e) {}
    window.applyLang();
  };

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#langBtn')) window.setLang(window.LANG === 'en' ? 'ar' : 'en');
  });
  window.applyLang();
})();
