export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icon.png","mypacer-icon.webp","mypacer.webp","vite.svg"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.j3R10QBM.js",app:"_app/immutable/entry/app.D4_4-4-J.js",imports:["_app/immutable/entry/start.j3R10QBM.js","_app/immutable/chunks/D4HC7ecw.js","_app/immutable/chunks/DHz2H-Fj.js","_app/immutable/chunks/DuE1YsxB.js","_app/immutable/entry/app.D4_4-4-J.js","_app/immutable/chunks/DHz2H-Fj.js","_app/immutable/chunks/CNU2L-1m.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
