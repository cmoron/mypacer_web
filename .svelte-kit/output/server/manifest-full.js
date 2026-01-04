export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icon.png","mypacer-icon.webp","mypacer.webp","robots.txt","sitemap.xml","vite.svg"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".txt":"text/plain",".xml":"text/xml",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.Dp1SFQHC.js",app:"_app/immutable/entry/app.DSBYQNGp.js",imports:["_app/immutable/entry/start.Dp1SFQHC.js","_app/immutable/chunks/BiJUjwxP.js","_app/immutable/chunks/DCZbF_Ch.js","_app/immutable/chunks/Cvv1SIiS.js","_app/immutable/entry/app.DSBYQNGp.js","_app/immutable/chunks/DCZbF_Ch.js","_app/immutable/chunks/dyCKyNtP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
