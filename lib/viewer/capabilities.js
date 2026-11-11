import { viewModes } from './modes.js';

// Availability comes from the loaded model, not the menu catalogue. A zero-valued
// PBR scalar (for example metalness=0) is valid data, rather than a missing channel.
export function getAvailableViewModes(root) {
  const meshes = [], materialSet = new Set();
  root.traverse((object) => {
    if (!object.isMesh || !object.geometry.attributes.position) return;
    meshes.push(object);
    for (const material of [].concat(object.material || [])) materialSet.add(material);
  });
  if (!meshes.length) return [];
  const materials = [...materialSet];
  const supported = {
    final: true,
    raw: true,
    baseColor: materials.some((material) => material.color || material.map),
    metalness: materials.some((material) => Number.isFinite(material.metalness) || material.metalnessMap),
    roughness: materials.some((material) => Number.isFinite(material.roughness) || material.roughnessMap),
    anisotropy: materials.some((material) => material.anisotropy > 0 || material.anisotropyMap),
    emission: materials.some((material) => material.emissiveMap || (material.emissiveIntensity > 0 && material.emissive && Math.max(material.emissive.r, material.emissive.g, material.emissive.b) > 0)),
    specular: materials.some((material) => material.isMeshStandardMaterial || material.isMeshPhysicalMaterial),
    matcap: meshes.every((mesh) => !!mesh.geometry.attributes.normal),
    wireframe: true,
    normals: meshes.every((mesh) => !!mesh.geometry.attributes.normal),
    uv: meshes.every((mesh) => !!mesh.geometry.attributes.uv),
  };
  return viewModes.filter((mode) => supported[mode.id]).map((mode) => mode.id);
}
