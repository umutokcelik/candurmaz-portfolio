import test from 'node:test';
import assert from 'node:assert/strict';
import { DirectionalLight, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { attachViewerLighting, cameraBackDirection, draggedLightDirection } from '../lib/viewer/lighting.js';

function setup() {
  const window = new EventTarget(), document = new EventTarget(); document.defaultView = window;
  const canvas = new EventTarget(), captures = new Set();
  Object.assign(canvas, {
    ownerDocument: document, dataset: {},
    getBoundingClientRect: () => ({ width: 800, height: 500 }),
    setPointerCapture: (id) => captures.add(id),
    hasPointerCapture: (id) => captures.has(id),
    releasePointerCapture: (id) => captures.delete(id),
  });
  const camera = new PerspectiveCamera(); camera.position.set(4, 3, 5);
  const target = new Vector3(0, 1, 0); camera.lookAt(target); camera.updateMatrixWorld();
  const controls = { enabled: true }, light = new DirectionalLight();
  const changes = [];
  const lighting = attachViewerLighting({ canvas, camera, controls, light, getTarget: () => target, getRadius: () => 2, onChange: (state) => changes.push(state) });
  return { canvas, document, window, camera, target, controls, light, changes, lighting };
}
function pointer(target, type, values = {}) {
  const event = new Event(type, { cancelable: true });
  Object.assign(event, { pointerId: 1, clientX: 100, clientY: 100, button: 0, altKey: false, ...values });
  target.dispatchEvent(event); return event;
}

test('sun reset uses the current camera direction and positions the light behind it', () => {
  const s = setup(); s.lighting.reset();
  const direction = s.light.position.clone().sub(s.target).normalize();
  assert.ok(direction.dot(cameraBackDirection(s.camera)) > 0.999999);
  assert.ok(s.light.position.distanceTo(s.target) > s.camera.position.distanceTo(s.target));
  assert.ok(s.light.target.position.equals(s.target));
  const before = s.light.position.clone();
  s.camera.position.set(-5, 2, 3); s.camera.lookAt(s.target); s.camera.updateMatrixWorld(); s.lighting.reset();
  assert.ok(!before.equals(s.light.position));
  assert.ok(s.light.position.clone().sub(s.target).normalize().dot(cameraBackDirection(s.camera)) > 0.999999);
  s.lighting.dispose();
});

test('Alt+drag moves only the light and restores camera controls on release', () => {
  const s = setup(); s.lighting.reset();
  const cameraPosition = s.camera.position.clone(), rotation = s.camera.quaternion.clone(), lightPosition = s.light.position.clone();
  assert.equal(pointer(s.canvas, 'pointerdown', { altKey: true }).defaultPrevented, true);
  assert.equal(s.controls.enabled, false); assert.equal(s.lighting.dragging, true);
  pointer(s.document, 'pointermove', { clientX: 300, clientY: 150 });
  assert.ok(!s.light.position.equals(lightPosition));
  assert.ok(s.camera.position.equals(cameraPosition)); assert.ok(s.camera.quaternion.equals(rotation));
  pointer(s.document, 'pointerup');
  assert.equal(s.controls.enabled, true); assert.equal(s.lighting.dragging, false);
  assert.equal(s.changes.at(-1).mode, 'custom');
  s.lighting.reset(); assert.equal(s.changes.at(-1).mode, 'camera');
  s.lighting.dispose();
});

test('ordinary drags are left to OrbitControls; cancellation and disposal release Alt gestures', () => {
  const s = setup(); s.lighting.reset();
  assert.equal(pointer(s.canvas, 'pointerdown').defaultPrevented, false);
  assert.equal(s.lighting.dragging, false); assert.equal(s.controls.enabled, true);
  pointer(s.canvas, 'pointerdown', { altKey: true });
  s.window.dispatchEvent(new Event('blur'));
  assert.equal(s.controls.enabled, true); assert.equal(s.lighting.dragging, false);
  pointer(s.canvas, 'pointerdown', { altKey: true });
  s.lighting.dispose(); assert.equal(s.controls.enabled, true);
  pointer(s.canvas, 'pointerdown', { altKey: true });
  assert.equal(s.lighting.dragging, false);
});

test('screen-space drag directions remain normalized and follow camera orientation', () => {
  const start = new Vector3(0, 0, 1), rotation = new Quaternion();
  assert.ok(draggedLightDirection(start, rotation, 200, 0, 800, 500).distanceTo(new Vector3(1, 0, 0)) < 1e-6);
  assert.ok(draggedLightDirection(start, rotation, 0, 250, 800, 500).distanceTo(new Vector3(0, -1, 0)) < 1e-6);
  assert.ok(Math.abs(draggedLightDirection(start, rotation, 25, 40, 0, 0).length() - 1) < 1e-6);
});
