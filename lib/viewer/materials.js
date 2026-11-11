import { TextureLoader, SRGBColorSpace, NoColorSpace } from 'three';

const channels = {
  baseColor: { property: 'map', color: true },
  emissive: { property: 'emissiveMap', color: true },
  normal: { property: 'normalMap' },
  roughness: { property: 'roughnessMap' },
  metalness: { property: 'metalnessMap' },
  ao: { property: 'aoMap' },
  alpha: { property: 'alphaMap' },
};

export function collectModelMaterials(root) {
  const materials = new Set();
  root.traverse((object) => {
    if (object.isMesh) for (const material of [].concat(object.material || [])) materials.add(material);
  });
  return [...materials];
}

// Named PBR slots keep future mapping independent of the scene and camera.
export async function applyMaterialMappings(root, overrides, isActive) {
  const loader = new TextureLoader();
  for (const material of collectModelMaterials(root)) {
    const mapping = overrides[material.name];
    if (!mapping) continue;
    for (const [name, url] of Object.entries(mapping.textures || {})) {
      const channel = channels[name];
      if (!channel) throw new Error(`Unknown texture channel: ${name}`);
      const texture = await loader.loadAsync(url);
      if (!isActive()) { texture.dispose(); return; }
      texture.flipY = false;
      texture.colorSpace = channel.color ? SRGBColorSpace : NoColorSpace;
      material[channel.property]?.dispose();
      material[channel.property] = texture;
      if (name === 'alpha') material.transparent = true;
    }
    if (mapping.color) material.color.set(mapping.color);
    if (mapping.roughness !== undefined) material.roughness = mapping.roughness;
    if (mapping.metalness !== undefined) material.metalness = mapping.metalness;
    material.needsUpdate = true;
  }
}

export function disposeObject(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of [].concat(object.material || [])) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}
