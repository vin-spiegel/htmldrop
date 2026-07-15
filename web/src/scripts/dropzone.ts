  (function () {
    var nav = document.getElementById('siteNav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // Drag & drop publish — posts to the same /publish endpoint agents use.
  (function () {
    var MAX_BYTES = 25 * 1024 * 1024;
    var dz = document.getElementById('dropzone');
    var fileInput = document.getElementById('dzFile');
    if (!dz || !fileInput) return;
    var urlEl = document.getElementById('dzUrl');
    var openEl = document.getElementById('dzOpen');
    var copyBtn = document.getElementById('dzCopy');
    var againBtn = document.getElementById('dzAgain');
    var retryBtn = document.getElementById('dzRetry');
    var publishedUrl = '';

    function setState(s) { dz.setAttribute('data-state', s); }
    function state() { return dz.getAttribute('data-state'); }

    function fileMime(file) {
      var byExt = {
        html: 'text/html', htm: 'text/html',
        md: 'text/markdown', markdown: 'text/markdown',
        txt: 'text/plain', json: 'application/json', csv: 'text/csv',
        pdf: 'application/pdf',
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
        gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
      };
      var m = file.name.match(/\.([a-z0-9]+)$/i);
      return (m && byExt[m[1].toLowerCase()]) || null;
    }

    function handleResponse(p) {
      p.then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
        .then(function (data) {
          publishedUrl = data.url;
          urlEl.textContent = data.url.replace(/^https?:\/\//, '');
          urlEl.href = data.url;
          openEl.href = data.url;
          setState('done');
        })
        .catch(function () { setState('error'); });
    }

    function publish(body) {
      setState('busy');
      handleResponse(fetch('/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }));
    }

    function handleFile(file) {
      var mime = file && fileMime(file);
      if (!mime || file.size > MAX_BYTES) { setState('error'); return; }
      setState('busy');
      var title = file.name.replace(/\.[a-z0-9]+$/i, '');
      handleResponse(fetch('/publish/raw?title=' + encodeURIComponent(title), {
        method: 'POST',
        headers: { 'Content-Type': mime },
        body: file,
      }));
    }

    dz.addEventListener('click', function (e) {
      if (state() === 'done' || state() === 'busy') return;
      if (e.target.closest('.dz-again, .dz-actions, .dz-url')) return;
      if (state() === 'error') setState('idle');
      fileInput.click();
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
      fileInput.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) {
        e.preventDefault();
        if (state() === 'idle' || state() === 'error') dz.classList.add('drag');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('drag'); });
    });
    dz.addEventListener('drop', function (e) {
      if (state() === 'busy' || state() === 'done') return;
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });
    // Dropping outside the zone shouldn't navigate the tab away.
    window.addEventListener('dragover', function (e) { e.preventDefault(); });
    window.addEventListener('drop', function (e) { e.preventDefault(); });

    // Paste HTML source anywhere on the page to publish it.
    document.addEventListener('paste', function (e) {
      if (state() !== 'idle') return;
      if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
      var text = e.clipboardData && e.clipboardData.getData('text/plain');
      if (!text || text.length > MAX_BYTES) return;
      if (/<\w+[^>]*>/.test(text)) publish({ html: text });
      else if (/^#{1,6}\s|^[-*]\s|\*\*[^*]+\*\*|^\d+\.\s/m.test(text)) publish({ markdown: text });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(publishedUrl).then(function () {
          var orig = copyBtn.textContent;
          copyBtn.textContent = copyBtn.getAttribute('data-copied');
          setTimeout(function () { copyBtn.textContent = orig; }, 1400);
        });
      });
    }
    [againBtn, retryBtn].forEach(function (b) {
      if (b) b.addEventListener('click', function (e) { e.stopPropagation(); setState('idle'); });
    });
  })();
