import { viewModeGroups, viewModes, viewerIcon } from './modes';

const iconButton = (action, label, icon, toggle = false) => `<button type="button" class="viewer-icon-button" data-viewer-action="${action}" aria-label="${label}" ${toggle ? 'aria-pressed="false"' : ''}>${viewerIcon(icon)}<span class="viewer-tooltip" role="tooltip">${label}</span></button>`;

export function modelViewerMarkup(model) {
  return `<div class="viewer-shell">
    <div class="viewer-heading">
      <div class="viewer-title"><strong>${model.title}</strong><span>Örnek model · İnteraktif 3D önizleme</span></div>
      <div class="viewer-tools" role="group" aria-label="Model kontrolleri">
        ${iconButton('reset', 'Görünümü sıfırla', 'reset')}
        ${iconButton('rotate', 'Otomatik döndür', 'rotate', true)}
        ${iconButton('fullscreen', 'Tam ekran', 'fullscreen')}
      </div>
    </div>
    <div class="viewer-stage">
      <div class="viewer-canvas"></div>
      <div class="viewer-status" role="status"><span class="viewer-spinner" aria-hidden="true"></span><p>Görüntüleyici hazırlanıyor…</p><button type="button" data-viewer-retry hidden>Tekrar dene</button></div>
      <span class="viewer-mode-note" role="status" hidden></span>
      <span class="viewer-hint">Sürükle: döndür · İki parmak / tekerlek: yakınlaştır</span>
      <div class="viewer-inspector" role="menu" aria-label="Model görünümü" hidden>
        ${viewModeGroups.map((group) => `<div class="viewer-mode-group" role="group" aria-label="${group.label}"><p lang="en">${group.label}</p>${group.items.map((mode) => `<button type="button" role="menuitemradio" data-viewer-mode="${mode.id}" hidden disabled aria-disabled="true" aria-checked="${mode.id === 'final'}" tabindex="-1">${viewerIcon(mode.icon)}<span>${mode.label}</span>${mode.id === 'final' ? '<span class="viewer-mode-check" aria-hidden="true">✓</span>' : ''}</button>`).join('')}</div>`).join('')}
      </div>
    </div>
    <div class="viewer-displaybar">
      <button type="button" class="viewer-mode-trigger" data-viewer-menu aria-haspopup="menu" aria-expanded="false" aria-label="Model görünümünü seç">${viewerIcon('render')}<span data-viewer-mode-label>Final Render</span>${viewerIcon('chevron')}</button>
      <span class="viewer-meta" data-viewer-stats>Model yükleniyor…</span>
    </div>
    <details class="viewer-materials"><summary>Materyaller ve UV</summary><p data-viewer-materials>Yükleniyor…</p></details>
  </div>`;
}

// The scene engine, including channel inspection, is imported only when opened.
export function mountModelWindow(windowElement, asset) {
  const shell = windowElement.querySelector('.viewer-shell');
  const canvasHost = shell.querySelector('.viewer-canvas');
  const status = shell.querySelector('.viewer-status');
  const statusText = status.querySelector('p');
  const retry = shell.querySelector('[data-viewer-retry]');
  const tools = shell.querySelector('.viewer-tools');
  const trigger = shell.querySelector('[data-viewer-menu]');
  const menu = shell.querySelector('.viewer-inspector');
  const note = shell.querySelector('.viewer-mode-note');
  let active = true, viewer = null, attempt = 0;
  let availableModes = new Set();
  function updateAvailableModes(ids) {
    availableModes = new Set(ids);
    menu.querySelectorAll('[data-viewer-mode]').forEach((button) => {
      const supported = availableModes.has(button.dataset.viewerMode);
      button.hidden = !supported; button.disabled = !supported;
      button.setAttribute('aria-disabled', String(!supported));
    });
    menu.querySelectorAll('.viewer-mode-group').forEach((group) => {
      group.hidden = !group.querySelector('[data-viewer-mode]:not([hidden]):not([disabled])');
    });
  }
  const events = new AbortController();
  function closeMenu(restoreFocus = false) {
    menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  }
  function openMenu() {
    menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    (menu.querySelector('[aria-checked="true"]:not([hidden]):not([disabled])') || menu.querySelector('[data-viewer-mode]:not([hidden]):not([disabled])'))?.focus();
  }
  function selectMode(id) {
    const mode = viewModes.find((item) => item.id === id);
    if (!mode || !viewer || !availableModes.has(id)) return;
    const message = viewer.setViewMode(id);
    shell.dataset.viewMode = id;
    shell.querySelector('[data-viewer-mode-label]').textContent = mode.label;
    menu.querySelectorAll('[data-viewer-mode]').forEach((button) => {
      const selected = button.dataset.viewerMode === id;
      button.setAttribute('aria-checked', String(selected));
      button.querySelector('.viewer-mode-check')?.remove();
      if (selected) button.insertAdjacentHTML('beforeend', '<span class="viewer-mode-check" aria-hidden="true">✓</span>');
    });
    note.textContent = message; note.hidden = !message;
  }
  const setStatus = (message, error = false) => {
    status.hidden = false; statusText.textContent = message;
    status.classList.toggle('is-error', error); retry.hidden = !error;
  };
  async function load() {
    const currentAttempt = ++attempt;
    viewer?.dispose(); viewer = null; shell.dataset.loaded = 'false'; closeMenu(); updateAvailableModes([]);
    tools.querySelectorAll('[aria-pressed]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    tools.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    trigger.disabled = true;
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
          updateAvailableModes(info.availableModes);
          trigger.disabled = false;
          shell.querySelector('[data-viewer-stats]').textContent = `${info.triangles.toLocaleString('tr-TR')} üçgen · ${info.materials.length} materyal`;
          shell.querySelector('[data-viewer-materials]').textContent = `${info.materials.join(' · ')} — ${info.uvMeshes}/${info.meshes} parçada UV mevcut.`;
          shell.dataset.loaded = 'true';
          selectMode('final');
        },
        onError(message) { if (active) { shell.dataset.loaded = 'false'; closeMenu(); trigger.disabled = true; setStatus(message, true); } },
      });
    } catch (error) {
      console.error('3D viewer initialization failed', error);
      if (active) setStatus('Bu tarayıcıda 3D görüntüleme başlatılamadı. Tekrar deneyebilir veya başka bir tarayıcı kullanabilirsin.', true);
    }
  }
  retry.addEventListener('click', load, { signal: events.signal });
  trigger.addEventListener('click', () => { if (menu.hidden) openMenu(); else closeMenu(); }, { signal: events.signal });
  menu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-viewer-mode]');
    if (button) { selectMode(button.dataset.viewerMode); closeMenu(true); }
  }, { signal: events.signal });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); return; }
    const buttons = [...menu.querySelectorAll('[data-viewer-mode]:not([hidden]):not([disabled])')];
    let index = buttons.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') index = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp') index = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = buttons.length - 1;
    else if (event.key === 'Tab') { closeMenu(); return; }
    else return;
    event.preventDefault(); event.stopPropagation(); buttons[index].focus();
  }, { signal: events.signal });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) closeMenu();
  }, { signal: events.signal });
  tools.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-viewer-action]');
    if (!button || !viewer) return;
    switch (button.dataset.viewerAction) {
      case 'reset': viewer.reset(); break;
      case 'rotate': {
        const enabled = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(enabled)); viewer.setAutoRotate(enabled); break;
      }
      case 'fullscreen':
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (windowElement.requestFullscreen) await windowElement.requestFullscreen();
          else shell.querySelector('[data-viewer-stats]').textContent = 'Tam ekran bu tarayıcıda desteklenmiyor.';
        } catch { shell.querySelector('[data-viewer-stats]').textContent = 'Tam ekran açılamadı.'; }
        break;
    }
  }, { signal: events.signal });
  load();
  return () => { active = false; attempt++; events.abort(); viewer?.dispose(); };
}
