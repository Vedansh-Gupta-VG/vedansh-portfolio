// ============================================================
// DOCUMENT VIEWER: any [data-cert-open] element loads its
// preview image + metadata into the shared popup. No routing,
// no PDF chrome, no scrollbars, just the document.
//
// Download: if a PDF version of the document exists at the same
// path (e.g. foo.png → foo.pdf), the download button offers the
// PDF. Otherwise it downloads the original PNG/image file.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const image = document.getElementById('certModalImage');
  const title = document.getElementById('certModalTitle');
  const metaRow = document.getElementById('certModalMeta');
  const downloadBtn = document.getElementById('certDownloadBtn');

  function renderMeta(rawJson) {
    if (!metaRow) return;
    metaRow.innerHTML = '';
    if (!rawJson) return;
    let rows = [];
    try { rows = JSON.parse(rawJson); } catch (err) { rows = []; }
    rows.forEach(row => {
      const el = document.createElement('span');
      el.className = 'doc-viewer__row';
      el.innerHTML = '<span class="doc-viewer__row-label">' + row.label + '</span><span class="doc-viewer__row-value">' + row.value + '</span>';
      metaRow.appendChild(el);
    });
  }

  function attachDownloadListener(url, filename) {
    if (!downloadBtn) return;
    downloadBtn.onclick = async (e) => {
      e.preventDefault();
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = 'Downloading...';
      downloadBtn.style.pointerEvents = 'none';
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error('Download error:', err);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        a.click();
      } finally {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.pointerEvents = 'auto';
      }
    };
  }

  function setupDownload(imageSrc, label) {
    if (!downloadBtn) return;
    const pdfPath = imageSrc.replace(/\.(png|jpg|jpeg|webp)$/i, '.pdf');
    const hasPdfCandidate = pdfPath !== imageSrc;

    if (hasPdfCandidate) {
      fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            attachDownloadListener(pdfPath, (label || 'document') + '.pdf');
          } else {
            attachDownloadListener(imageSrc, (label || 'document') + '.' + imageSrc.split('.').pop());
          }
        })
        .catch(() => {
          attachDownloadListener(imageSrc, (label || 'document') + '.' + imageSrc.split('.').pop());
        });
    } else {
      attachDownloadListener(imageSrc, (label || 'document') + '.' + imageSrc.split('.').pop());
    }
  }

  document.querySelectorAll('[data-cert-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const src = btn.dataset.certImage;
      const label = btn.dataset.certTitle || 'Document';
      if (image) { image.src = src; image.alt = label; }
      if (title) title.textContent = label;
      renderMeta(btn.dataset.certMeta);
      setupDownload(src, label);
      openModal('modalCertificate');
    });
  });

  // Drop the image src once the popup closes so nothing keeps
  // loading or lingering in the background.
  const overlay = document.getElementById('modalCertificate');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && image) image.src = '';
    });
    overlay.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', () => { if (image) image.src = ''; });
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && image) image.src = '';
  });
});
