

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": true
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BZOgtLo0.js","_app/immutable/chunks/DCZbF_Ch.js","_app/immutable/chunks/dyCKyNtP.js"];
export const stylesheets = ["_app/immutable/assets/0.SqBFZFtZ.css"];
export const fonts = [];
