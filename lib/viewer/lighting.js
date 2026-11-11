import { Quaternion, Vector3 } from 'three';

export function cameraBackDirection(camera) {
  return new Vector3(0, 0, 1).applyQuaternion(camera.getWorldQuaternion(new Quaternion())).normalize();
}

export function draggedLightDirection(start, cameraRotation, dx, dy, width, height) {
  const up = new Vector3(0, 1, 0).applyQuaternion(cameraRotation);
  const right = new Vector3(1, 0, 0).applyQuaternion(cameraRotation);
  return start.clone()
    .applyAxisAngle(up, dx / Math.max(1, width) * Math.PI * 2)
    .applyAxisAngle(right, dy / Math.max(1, height) * Math.PI)
    .normalize();
}

// Capture Alt+drag before OrbitControls sees pointerdown. This keeps light and
// camera gestures independent, including damping and automatic camera rotation.
export function attachViewerLighting({ canvas, camera, controls, light, getTarget, getRadius, onChange = () => {} }) {
  const events = new AbortController();
  const options = { capture: true, signal: events.signal };
  const document = canvas.ownerDocument;
  const window = document.defaultView;
  let drag = null, mode = 'camera', disposed = false;

  function place(direction) {
    const target = getTarget();
    const distance = Math.max(camera.position.distanceTo(target) * 1.5, getRadius() * 5, 8);
    light.target.position.copy(target);
    light.position.copy(target).addScaledVector(direction, distance);
    light.shadow.camera.far = distance + Math.max(getRadius() * 6, 10);
    light.shadow.camera.updateProjectionMatrix();
  }
  function finish(notify = true) {
    if (!drag) return;
    const previous = drag; drag = null;
    controls.enabled = previous.controlsEnabled;
    delete canvas.dataset.lightingDrag;
    if (canvas.hasPointerCapture(previous.id)) canvas.releasePointerCapture(previous.id);
    if (notify && previous.moved) onChange({ mode, dragging: false });
  }
  function reset({ notify = true } = {}) {
    if (disposed) return;
    finish(false);
    place(cameraBackDirection(camera));
    mode = 'camera';
    if (notify) onChange({ mode, dragging: false });
  }
  canvas.addEventListener('pointerdown', (event) => {
    if (!event.altKey || event.button !== 0 || drag || !controls.enabled) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const rect = canvas.getBoundingClientRect();
    drag = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      width: rect.width, height: rect.height,
      direction: light.position.clone().sub(light.target.position).normalize(),
      cameraRotation: camera.getWorldQuaternion(new Quaternion()),
      controlsEnabled: controls.enabled, moved: false,
    };
    controls.enabled = false;
    canvas.dataset.lightingDrag = 'true';
    canvas.setPointerCapture(event.pointerId);
  }, options);
  document.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) < 1 && !drag.moved) return;
    drag.moved = true; mode = 'custom';
    place(draggedLightDirection(drag.direction, drag.cameraRotation, dx, dy, drag.width, drag.height));
    onChange({ mode, dragging: true });
  }, options);
  const end = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    event.preventDefault(); event.stopImmediatePropagation(); finish();
  };
  document.addEventListener('pointerup', end, options);
  document.addEventListener('pointercancel', end, options);
  canvas.addEventListener('lostpointercapture', () => finish(), { signal: events.signal });
  window.addEventListener('blur', () => finish(), { signal: events.signal });

  return {
    reset,
    get dragging() { return !!drag; },
    dispose() { finish(false); disposed = true; events.abort(); },
  };
}
