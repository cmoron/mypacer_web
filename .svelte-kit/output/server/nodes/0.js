

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": true
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.cZmpZd2Y.js","_app/immutable/chunks/DHz2H-Fj.js","_app/immutable/chunks/CNU2L-1m.js"];
export const stylesheets = ["_app/immutable/assets/0.CAgyqHuK.css"];
export const fonts = [];
