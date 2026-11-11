import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Mesh, BoxGeometry, BufferGeometry, Float32BufferAttribute, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, Texture } from 'three';
import { createModelInspection } from '../lib/viewer/inspection.js';
import { getAvailableViewModes } from '../lib/viewer/capabilities.js';

function model(material, geometry = new BoxGeometry()) {
  const root = new Group(); root.add(new Mesh(geometry, material)); return root;
}

test('missing channels are absent, while valid zero-valued PBR scalars remain selectable', () => {
  const root = model(new MeshStandardMaterial({ metalness: 0, roughness: 0 }));
  const modes = getAvailableViewModes(root);
  assert.ok(!modes.includes('anisotropy'));
  assert.ok(!modes.includes('emission'));
  for (const id of ['metalness', 'roughness', 'specular', 'uv', 'normals', 'wireframe']) assert.ok(modes.includes(id), id);
});

test('actual anisotropy, emission, and texture data enable their channels', () => {
  const material = new MeshPhysicalMaterial({ anisotropy: 0.5, emissive: '#ff0000', emissiveIntensity: 1 });
  const root = model(material);
  assert.ok(getAvailableViewModes(root).includes('anisotropy'));
  assert.ok(getAvailableViewModes(root).includes('emission'));
  material.anisotropy = 0;
  assert.ok(!getAvailableViewModes(root).includes('anisotropy'));
  material.anisotropyMap = new Texture();
  assert.ok(getAvailableViewModes(root).includes('anisotropy'));
});

test('incomplete geometry hides UV / normal modes, and non-PBR materials do not expose PBR-only channels', () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3));
  const root = model(new MeshBasicMaterial(), geometry);
  root.add(new Mesh(new BoxGeometry(), new MeshBasicMaterial()));
  const modes = getAvailableViewModes(root);
  for (const id of ['uv', 'normals', 'matcap', 'metalness', 'roughness', 'specular']) assert.ok(!modes.includes(id), id);
  for (const id of ['final', 'raw', 'baseColor', 'wireframe']) assert.ok(modes.includes(id), id);
  assert.deepEqual(getAvailableViewModes(new Group()), []);
});

test('unavailable modes cannot change the renderer or the model materials', () => {
  const material = new MeshStandardMaterial();
  const root = model(material);
  const renderer = { toneMapping: 99 };
  const inspection = createModelInspection(root, new Group(), renderer, { visible: true }, { visible: true }, 2);
  assert.throws(() => inspection.setMode('anisotropy'), RangeError);
  assert.equal(renderer.toneMapping, 99);
  assert.equal(root.children[0].material, material);
  inspection.dispose();
});
