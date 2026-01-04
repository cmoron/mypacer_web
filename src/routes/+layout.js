// Force client-side rendering for the entire app
// This is necessary because we use localStorage and browser APIs
export const ssr = false;
export const prerender = true; // Pre-render the HTML shell for SEO
