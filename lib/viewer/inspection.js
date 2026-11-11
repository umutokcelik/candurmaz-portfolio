import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { viewModes } from './modes';

function checkerTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    ctx.fillStyle = (x + y) % 2 ? '#286378' : '#e3eaf0'; ctx.fillRect(x * 64, y * 64, 64, 64);
    ctx.fillStyle = (x + y) % 2 ? '#c4edf7' : '#1b2c37'; ctx.font = 'bold 14px monospace'; ctx.fillText(`${String.fromCharCode(65 + y)}${x + 1}`, x * 64 + 10, y * 64 + 37);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.flipY = false;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// A lit sphere gives Matcap its own baked studio light, independent of scene lights.
function matcapTexture() {
  const size = 128, data = new Uint8Array(size * size * 4);
  const light = new THREE.Vector3(-0.5, 0.7, 1).normalize();
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = x / (size - 1) * 2 - 1, ny = 1 - y / (size - 1) * 2;
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const diffuse = Math.max(0, nx * light.x + ny * light.y + nz * light.z);
    const highlight = Math.pow(Math.max(0, -nx * 0.25 + ny * 0.4 + nz * 0.88), 22);
    const value = Math.min(1, 0.15 + diffuse * 0.65 + highlight * 0.3);
    const i = (y * size + x) * 4;
    data[i] = value * 230; data[i + 1] = value * 218; data[i + 2] = value * 202; data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
  return texture;
}

function channelMaterial(source, mode) {
  const maps = { base: source.map, metal: source.metalnessMap, rough: source.roughnessMap, aniso: source.anisotropyMap, specColor: source.specularColorMap, specIntensity: source.specularIntensityMap };
  const uniforms = {};
  for (const [name, texture] of Object.entries(maps)) {
    texture?.updateMatrix();
    uniforms[`${name}Map`] = { value: texture || null };
    uniforms[`${name}Transform`] = { value: texture?.matrix.clone() || new THREE.Matrix3() };
    uniforms[`${name}Channel`] = { value: texture?.channel || 0 };
    uniforms[`${name}Present`] = { value: !!texture };
  }
  Object.assign(uniforms, {
    channelMode: { value: ['metalness', 'roughness', 'anisotropy', 'specular'].indexOf(mode) },
    metalness: { value: source.metalness || 0 }, roughness: { value: source.roughness ?? 1 },
    anisotropy: { value: source.anisotropy || 0 }, baseColor: { value: source.color?.clone() || new THREE.Color(1, 1, 1) },
    specularColor: { value: source.specularColor?.clone() || new THREE.Color(1, 1, 1) },
    specularIntensity: { value: source.specularIntensity ?? 1 },
    dielectricF0: { value: source.ior ? ((source.ior - 1) / (source.ior + 1)) ** 2 : 0.04 },
  });
  const defines = {};
  for (const texture of Object.values(maps)) if (texture?.channel > 0) defines[`USE_UV${texture.channel}`] = '';
  const declarations = Object.keys(maps).map((name) => `uniform sampler2D ${name}Map; uniform mat3 ${name}Transform; uniform int ${name}Channel; uniform bool ${name}Present;`).join('\n');
  return new THREE.ShaderMaterial({
    uniforms, defines, side: source.side, toneMapped: false,
    vertexShader: `varying vec2 inspectorUv0; varying vec2 inspectorUv1; varying vec2 inspectorUv2; varying vec2 inspectorUv3;
      void main(){
        inspectorUv0=uv; inspectorUv1=uv; inspectorUv2=uv; inspectorUv3=uv;
        #ifdef USE_UV1
          inspectorUv1=uv1;
        #endif
        #ifdef USE_UV2
          inspectorUv2=uv2;
        #endif
        #ifdef USE_UV3
          inspectorUv3=uv3;
        #endif
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }`,
    fragmentShader: `${declarations}
      varying vec2 inspectorUv0; varying vec2 inspectorUv1; varying vec2 inspectorUv2; varying vec2 inspectorUv3;
      uniform int channelMode; uniform float metalness; uniform float roughness; uniform float anisotropy;
      uniform vec3 baseColor; uniform vec3 specularColor; uniform float specularIntensity; uniform float dielectricF0;
      vec2 mapUv(int channel,mat3 transform){vec2 uv=inspectorUv0;if(channel==1)uv=inspectorUv1;if(channel==2)uv=inspectorUv2;if(channel==3)uv=inspectorUv3;return (transform*vec3(uv,1.0)).xy;}
      void main(){
        float metal=metalness;if(metalPresent)metal*=texture2D(metalMap,mapUv(metalChannel,metalTransform)).b;
        vec3 value=vec3(metal);
        if(channelMode==1){float r=roughness;if(roughPresent)r*=texture2D(roughMap,mapUv(roughChannel,roughTransform)).g;value=vec3(r);}
        if(channelMode==2){float a=anisotropy;if(anisoPresent)a*=texture2D(anisoMap,mapUv(anisoChannel,anisoTransform)).b;value=vec3(a);}
        if(channelMode==3){
          vec3 base=baseColor;if(basePresent)base*=texture2D(baseMap,mapUv(baseChannel,baseTransform)).rgb;
          vec3 spec=specularColor;if(specColorPresent)spec*=texture2D(specColorMap,mapUv(specColorChannel,specColorTransform)).rgb;
          float intensity=specularIntensity;if(specIntensityPresent)intensity*=texture2D(specIntensityMap,mapUv(specIntensityChannel,specIntensityTransform)).a;
          value=mix(min(vec3(dielectricF0)*spec,vec3(1.0))*intensity,base,metal);
        }
        gl_FragColor=vec4(clamp(value,0.0,1.0),1.0);
        #include <colorspace_fragment>
      }`,
  });
}

export function createModelInspection(root, scene, renderer, floor, grid, radius) {
  const bindings = [], debug = new Map(), helpers = [];
  const ownedTextures = [];
  root.traverse((object) => { if (object.isMesh) bindings.push({ object, original: object.material }); });
  const originals = [...new Set(bindings.flatMap((binding) => [].concat(binding.original)))];
  let checker, matcap;
  function inspectionMaterial(source, mode) {
    const key = `${source.uuid}:${mode}`;
    if (debug.has(key)) return debug.get(key);
    let material;
    switch (mode) {
      case 'baseColor': material = new THREE.MeshBasicMaterial({ color: source.color || 0xffffff, map: source.map, vertexColors: source.vertexColors, side: source.side, toneMapped: false }); break;
      case 'emission': material = new THREE.MeshBasicMaterial({ color: source.emissive?.clone().multiplyScalar(source.emissiveIntensity ?? 1) || 0x000000, map: source.emissiveMap, side: source.side, toneMapped: false }); break;
      case 'metalness': case 'roughness': case 'anisotropy': case 'specular': material = channelMaterial(source, mode); break;
      case 'matcap':
        if (!matcap) { matcap = matcapTexture(); ownedTextures.push(matcap); }
        material = new THREE.MeshMatcapMaterial({ matcap, side: source.side, flatShading: source.flatShading, toneMapped: false }); break;
      case 'wireframe': material = new THREE.MeshBasicMaterial({ color: '#a3def1', wireframe: true, side: THREE.DoubleSide, toneMapped: false }); break;
      case 'uv':
        if (!checker) { checker = checkerTexture(); ownedTextures.push(checker); }
        material = new THREE.MeshBasicMaterial({ map: checker, side: source.side, toneMapped: false }); break;
      default: return source;
    }
    debug.set(key, material); return material;
  }
  return {
    setMode(mode) {
      if (!viewModes.some((item) => item.id === mode)) throw new Error(`Unknown view mode: ${mode}`);
      const studio = ['final', 'raw', 'normals'].includes(mode);
      renderer.toneMapping = mode === 'final' || mode === 'normals' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
      floor.visible = grid.visible = studio;
      for (const binding of bindings) {
        binding.object.material = ['final', 'raw', 'normals'].includes(mode) ? binding.original : Array.isArray(binding.original) ? binding.original.map((material) => inspectionMaterial(material, mode)) : inspectionMaterial(binding.original, mode);
      }
      if (mode === 'normals' && !helpers.length) {
        scene.updateMatrixWorld(true);
        for (const { object } of bindings) if (object.geometry.attributes.normal) {
          const helper = new VertexNormalsHelper(object, radius * 0.035, '#54e8b0');
          helper.material.depthTest = false; scene.add(helper); helpers.push(helper);
        }
      }
      helpers.forEach((helper) => { helper.visible = mode === 'normals'; });
      if (mode === 'anisotropy' && !originals.some((m) => m.anisotropy || m.anisotropyMap)) return 'Anisotropy tanımlı değil · varsayılan değer: 0';
      if (mode === 'uv' && bindings.some(({ object }) => !object.geometry.attributes.uv)) return 'Bazı parçalarda UV koordinatları yok.';
      return '';
    },
    dispose() {
      for (const { object, original } of bindings) object.material = original;
      helpers.forEach((helper) => { scene.remove(helper); helper.dispose(); });
      debug.forEach((material) => material.dispose());
      ownedTextures.forEach((texture) => texture.dispose());
    },
  };
}
