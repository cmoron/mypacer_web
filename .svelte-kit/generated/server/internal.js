
import root from '../root.svelte';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	service_worker_options: undefined,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"fr\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"icon\" type=\"image/png\" href=\"" + assets + "/mypacer.webp\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n    <!-- SEO Meta Tags -->\n    <meta name=\"description\" content=\"Outil gratuit pour coureurs : générez vos tables d'allures (10km, Semi, Marathon) et consultez les records officiels de tous les licenciés FFA.\" />\n\n    <!-- OpenGraph -->\n    <meta property=\"og:type\" content=\"website\" />\n    <meta property=\"og:url\" content=\"https://mypacer.fr/\" />\n    <meta property=\"og:title\" content=\"MyPacer - L'outil des coureurs exigeants\" />\n    <meta property=\"og:description\" content=\"Calculez vos temps de passage et comparez vos records avec la base FFA.\" />\n    <meta property=\"og:image\" content=\"https://mypacer.fr/mypacer-og-image.jpg\" />\n\n    <!-- Umami Analytics -->\n    <script defer src=\"https://cloud.umami.is/script.js\" data-website-id=\"dc8bff03-6409-404e-86ff-db375f634066\"></script>\n\n    <!-- Structured Data -->\n    <script type=\"application/ld+json\">\n    {\n      \"@context\": \"http://schema.org\",\n      \"@type\": \"WebApplication\",\n      \"name\": \"MyPacer Tableau d'Allures\",\n      \"description\": \"Tableau interactif des allures et des temps de passages en course à pied. Affichez et comparez vos records personnels directement depuis le tableau.\",\n      \"url\": \"https://www.mypacer.fr\",\n      \"applicationCategory\": \"HealthApplication\",\n      \"operatingSystem\": \"Tous\",\n      \"browserRequirements\": \"Requiert un navigateur HTML5 compatible\",\n      \"softwareVersion\": \"2.0\",\n      \"offers\": {\n        \"@type\": \"Offer\",\n        \"price\": \"0.00\",\n        \"priceCurrency\": \"EUR\"\n      }\n    }\n    </script>\n\n    <!-- Font Awesome -->\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css\" />\n\n    " + head + "\n  </head>\n  <body data-sveltekit-preload-data=\"hover\">\n    <div style=\"display: contents\">" + body + "</div>\n  </body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "x8cyho"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };
