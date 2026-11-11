// Each model owns its asset and named material bindings. Future texture maps belong
// in materialOverrides, rather than in the renderer or portfolio card.
export const models = {
  'tesla-cybertruck': {
    id: 'tesla-cybertruck',
    title: 'Tesla Cybertruck',
    subtitle: 'Örnek 3D model',
    src: '/models/tesla-cybertruck/model.glb',
    poster: '/models/tesla-cybertruck/poster.webp',
    materialOverrides: {
      TeslaBlack: { color: '#171b23', roughness: 0.85 },
      Base: { metalness: 0.9, roughness: 0.42 },
    },
  },
};
