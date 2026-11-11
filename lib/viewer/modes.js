export const viewModeGroups = [
  { label: 'Render', items: [
    { id: 'final', label: 'Final Render', icon: 'render' },
    { id: 'raw', label: 'No Post-Processing', icon: 'render' },
  ] },
  { label: 'Material channels', items: [
    { id: 'baseColor', label: 'Base Color', icon: 'drop' },
    { id: 'metalness', label: 'Metalness', icon: 'bolt' },
    { id: 'anisotropy', label: 'Anisotropy', icon: 'arrows' },
    { id: 'roughness', label: 'Roughness', icon: 'dots' },
    { id: 'emission', label: 'Emission', icon: 'sun' },
    { id: 'specular', label: 'Specular F0', icon: 'sphere' },
  ] },
  { label: 'Geometry', items: [
    { id: 'matcap', label: 'Matcap', icon: 'render' },
    { id: 'wireframe', label: 'Wireframe', icon: 'wire' },
    { id: 'normals', label: 'Vertex Normals', icon: 'arrows' },
  ] },
  { label: 'UV', items: [
    { id: 'uv', label: 'UV Checker', icon: 'checker' },
  ] },
];
export const viewModes = viewModeGroups.flatMap((group) => group.items);

const paths = {
  reset: '<path d="M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7"/>',
  rotate: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  fullscreen: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  render: '<circle cx="12" cy="12" r="9"/><path d="M5.5 9a7 7 0 0 1 4-4m3.5 14-1-2m4-1 1.5 1.5"/>',
  drop: '<path d="M10 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/><circle cx="19" cy="6" r="2"/>',
  bolt: '<path d="m14 2-10 12h7l-1 8L20 9h-7z"/>',
  arrows: '<path d="M4 10V4h6M4 4l7 7m3 9h6v-6m0 6-7-7M14 4h6v6m0-6-7 7M4 14v6h6m-6 0 7-7"/>',
  dots: '<circle cx="12" cy="12" r="9"/><path d="M8 8h.01M12 6h.01M16 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h.01M12 18h.01M16 16h.01" stroke-width="2.8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  sphere: '<circle cx="12" cy="12" r="9"/><path d="M5 10a8 8 0 0 1 6-6"/>',
  wire: '<path d="M3 3h18v18H3zM3 21 21 3"/>',
  checker: '<path d="M3 3h18v18H3z"/><path d="M3 3h9v9H3zm9 9h9v9h-9z" fill="currentColor" stroke="none"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
};
export const viewerIcon = (name) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.render}</svg>`;
