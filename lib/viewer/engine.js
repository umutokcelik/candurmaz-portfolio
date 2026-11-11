import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { applyMaterialMappings, collectModelMaterials, disposeObject } from './materials';
import { createModelInspection } from './inspection';

export function createModelViewer(host, asset, { onProgress, onReady, onError }) {
  let active = true, root = null, materials = [], frame = 0, fitted = false;
  let environment, pmrem, inspection;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', `${asset.title} 3D model: sürükleyerek döndür, tekerlek veya iki parmakla yakınlaştır`);
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111722');
  scene.fog = new THREE.Fog('#111722', 22, 45);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  camera.position.set(6, 4, 7);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 1;
  controls.maxDistance = 25;
  controls.autoRotateSpeed = 1.2;
  controls.listenToKeyEvents(canvas);
  const target = new THREE.Vector3(0, 0.8, 0);
  let radius = 2, fitBounds = null;

  const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 80), new THREE.MeshStandardMaterial({ color: '#1c2431', roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.025;
  floor.receiveShadow = true;
  scene.add(floor);
  const grid = new THREE.GridHelper(22, 44, '#47546b', '#354053');
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  scene.add(grid);
  scene.add(new THREE.HemisphereLight('#dcecff', '#44404d', 0.8));
  const key = new THREE.DirectionalLight('#fff5e5', 2);
  key.position.set(4, 8, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -6;
  key.shadow.camera.right = key.shadow.camera.top = 6;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#9abfff', 1);
  rim.position.set(-4, 3, -5); scene.add(rim);
  pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.75;
  pmrem.dispose();

  function fit() {
    const vertical = THREE.MathUtils.degToRad(camera.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    const direction = new THREE.Vector3(1.1, 0.65, 1.3).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
    const up = direction.clone().cross(right).normalize();
    let distance = radius * 1.2;
    if (fitBounds) {
      for (const x of [fitBounds.min.x, fitBounds.max.x]) for (const y of [fitBounds.min.y, fitBounds.max.y]) for (const z of [fitBounds.min.z, fitBounds.max.z]) {
        const corner = new THREE.Vector3(x, y, z).sub(target);
        const depth = corner.dot(direction);
        distance = Math.max(distance, Math.abs(corner.dot(right)) / Math.tan(horizontal / 2) + depth, Math.abs(corner.dot(up)) / Math.tan(vertical / 2) + depth);
      }
    }
    camera.position.copy(target).add(direction.multiplyScalar(distance * 1.22));
    controls.target.copy(target);
    controls.minDistance = radius * 0.65;
    controls.maxDistance = radius * 12;
    controls.update(); controls.saveState();
  }
  function resize() {
    if (!active) return;
    const { width, height } = host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    const previousAspect = camera.aspect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (fitted && Math.abs(previousAspect - camera.aspect) > 0.4) fit();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host); resize();
  function contextLost(event) {
    event.preventDefault();
    onError('3D görüntüleme kesildi. Tekrar deneyebilirsin.');
  }
  canvas.addEventListener('webglcontextlost', contextLost);
  function animate() {
    if (!active) return;
    frame = requestAnimationFrame(animate);
    if (document.hidden) return;
    controls.update(); renderer.render(scene, camera);
  }
  animate();
  new GLTFLoader().load(asset.src, async (gltf) => {
    if (!active) { disposeObject(gltf.scene); return; }
    root = gltf.scene;
    try {
      await applyMaterialMappings(root, asset.materialOverrides || {}, () => active);
      if (!active) { disposeObject(root); return; }
      const bounds = new THREE.Box3().setFromObject(root);
      const size = bounds.getSize(new THREE.Vector3());
      if (bounds.isEmpty()) throw new Error('Model contains no visible geometry');
      const scale = 4 / Math.max(size.x, size.y, size.z);
      const pivot = new THREE.Group();
      root.position.sub(bounds.getCenter(new THREE.Vector3()));
      pivot.add(root); pivot.scale.setScalar(scale);
      pivot.position.y = size.y * scale / 2 + 0.015;
      scene.add(pivot);
      const normalized = new THREE.Box3().setFromObject(pivot);
      normalized.getCenter(target);
      fitBounds = normalized;
      radius = normalized.getSize(new THREE.Vector3()).length() / 2;
      let triangles = 0, meshes = 0, uvMeshes = 0;
      root.traverse((object) => {
        if (!object.isMesh) return;
        meshes++; if (object.geometry.attributes.uv) uvMeshes++;
        triangles += (object.geometry.index?.count || object.geometry.attributes.position.count) / 3;
        object.castShadow = true; object.receiveShadow = true;
      });
      materials = collectModelMaterials(root);
      inspection = createModelInspection(root, scene, renderer, floor, grid, radius);
      fitted = true; resize(); fit();
      onReady({ triangles: Math.round(triangles), meshes, uvMeshes, materials: materials.map((m) => m.name || 'Adsız materyal') });
    } catch (error) { if (active) { console.error('Model preparation failed', error); onError('Model hazırlanamadı. Tekrar deneyebilirsin.'); } }
  }, (event) => { if (active) onProgress(event.total ? Math.round(event.loaded / event.total * 100) : null); }, (error) => {
    if (active) { console.error('Model loading failed', error); onError('Model yüklenemedi. Bağlantını kontrol edip tekrar dene.'); }
  });

  return {
    reset: fit,
    setAutoRotate(enabled) { controls.autoRotate = enabled; },
    setViewMode(mode) { return inspection?.setMode(mode) || ''; },
    dispose() {
      if (!active) return;
      active = false;
      cancelAnimationFrame(frame); observer.disconnect();
      canvas.removeEventListener('webglcontextlost', contextLost);
      controls.dispose();
      inspection?.dispose();
      disposeObject(scene);
      if (root && !root.parent) disposeObject(root);
      environment?.dispose(); renderer.dispose();
      renderer.forceContextLoss(); canvas.remove();
    },
  };
}
