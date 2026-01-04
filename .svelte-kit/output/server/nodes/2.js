

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.F5bUHDf6.js","_app/immutable/chunks/DHz2H-Fj.js","_app/immutable/chunks/CNU2L-1m.js","_app/immutable/chunks/DuE1YsxB.js"];
export const stylesheets = ["_app/immutable/assets/2.DlGkPquq.css"];
export const fonts = [];
