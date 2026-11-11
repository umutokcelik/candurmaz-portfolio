export function modelViewerMarkup(model) {
  return `<div class="viewer-shell">
    <div class="viewer-heading"><div><strong>${model.title}</strong><span>Örnek model · İnteraktif 3D önizleme</span></div><span class="viewer-badge">3D</span></div>
    <div class="viewer-stage">
      <div class="viewer-canvas"></div>
      <div class="viewer-status" role="status"><span class="viewer-spinner" aria-hidden="true"></span><p>Görüntüleyici hazırlanıyor…</p><button type="button" data-viewer-retry hidden>Tekrar dene</button></div>
      <span class="viewer-hint">Sürükle: döndür · İki parmak / tekerlek: yakınlaştır</span>
    </div>
    <div class="viewer-tools" role="group" aria-label="Model kontrolleri">
      <button type="button" data-viewer-action="reset">↺ <span>Görünümü sıfırla</span></button>
      <button type="button" data-viewer-action="rotate" aria-pressed="false">⟳ <span>Otomatik döndür</span></button>
      <button type="button" data-viewer-action="wireframe" aria-pressed="false">◇ <span>Tel kafes</span></button>
      <button type="button" data-viewer-action="fullscreen">⛶ <span>Tam ekran</span></button>
    </div>
    <div class="viewer-meta"><span data-viewer-stats>Model bilgileri yükleniyor…</span><span>GLB · PBR</span></div>
    <details class="viewer-materials"><summary>Materyaller ve UV</summary><p data-viewer-materials>Yükleniyor…</p></details>
  </div>`;
}

// Only the small window shell is part of the desktop bundle. Three.js loads on demand.
export function mountModelWindow(windowElement, asset) {
  const shell = windowElement.querySelector('.viewer-shell');
  const canvasHost = shell.querySelector('.viewer-canvas');
  const status = shell.querySelector('.viewer-status');
  const statusText = status.querySelector('p');
  const retry = shell.querySelector('[data-viewer-retry]');
  const tools = shell.querySelector('.viewer-tools');
  let active = true, viewer = null, attempt = 0;
  const events = new AbortController();
  const setStatus = (message, error = false) => {
    status.hidden = false; statusText.textContent = message;
    status.classList.toggle('is-error', error); retry.hidden = !error;
  };
  async function load() {
    const currentAttempt = ++attempt;
    viewer?.dispose(); viewer = null;
    tools.querySelectorAll('[aria-pressed]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    tools.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    setStatus('Model yükleniyor…');
    try {
      const { createModelViewer } = await import('./engine');
      if (!active || currentAttempt !== attempt) return;
      viewer = createModelViewer(canvasHost, asset, {
        onProgress(percent) { if (active) setStatus(percent === null ? 'Model yükleniyor…' : `Model yükleniyor… %${percent}`); },
        onReady(info) {
          if (!active) return;
          status.hidden = true;
          tools.querySelectorAll('button').forEach((button) => { button.disabled = false; });
          shell.querySelector('[data-viewer-stats]').textContent = `${info.triangles.toLocaleString('tr-TR')} üçgen · ${info.materials.length} materyal`;
          shell.querySelector('[data-viewer-materials]').textContent = `${info.materials.join(' · ')} — ${info.uvMeshes}/${info.meshes} parçada UV mevcut.`;
          shell.dataset.loaded = 'true';
        },
        onError(message) { if (active) { shell.dataset.loaded = 'false'; setStatus(message, true); } },
      });
    } catch (error) {
      console.error('3D viewer initialization failed', error);
      if (active) setStatus('Bu tarayıcıda 3D görüntüleme başlatılamadı. Tekrar deneyebilir veya başka bir tarayıcı kullanabilirsin.', true);
    }
  }
  retry.addEventListener('click', load, { signal: events.signal });
  tools.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-viewer-action]');
    if (!button || !viewer) return;
    switch (button.dataset.viewerAction) {
      case 'reset': viewer.reset(); break;
      case 'rotate': case 'wireframe': {
        const enabled = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(enabled));
        if (button.dataset.viewerAction === 'rotate') viewer.setAutoRotate(enabled);
        else viewer.setWireframe(enabled);
        break;
      }
      case 'fullscreen':
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (windowElement.requestFullscreen) await windowElement.requestFullscreen();
          else shell.querySelector('[data-viewer-stats]').textContent='Tam ekran bu tarayıcıda desteklenmiyor.';
        } catch { shell.querySelector('[data-viewer-stats]').textContent='Tam ekran açılamadı. Normal görünümde devam edebilirsin.'; }
        break;
    }
  }, { signal: events.signal });
  load();
  return () => { active = false; attempt++; events.abort(); viewer?.dispose(); };
}
