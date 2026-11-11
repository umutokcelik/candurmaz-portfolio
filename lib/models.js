// Each model owns its asset and named material bindings.
export const models = {
  'stylized-car': {
    id: 'stylized-car',
    title: 'Stylized Car',
    subtitle: 'Örnek 3D model',
    src: '/models/stylized-car/model.glb',
    poster: '/models/stylized-car/poster.webp',
    framing: { excludeMaterials: ['Ground'] },
    cameraDirection: [-1.1, 0.65, 1.3],
    showFloor: false,
    showGrid: false,
    materialOverrides: {},
    attribution: {
      author: 'Split Studios',
      source: 'https://sketchfab.com/3d-models/stylized-car-0323feeb81e84e67a13acc964b6c609b',
      license: 'SKETCHFAB Standard',
    },
  },
};
