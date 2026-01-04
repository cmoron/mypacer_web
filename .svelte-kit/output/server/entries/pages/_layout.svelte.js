import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: ".app-wrapper.svelte-1279qf5{min-height:100vh;display:flex;flex-direction:column}.main-content.svelte-1279qf5{flex:1;padding:2rem 0}@media(max-width: 639px){.main-content.svelte-1279qf5{padding:1.5rem 0}}",
  map: `{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n  import '../app.css';\\n<\/script>\\n\\n<div class=\\"app-wrapper\\">\\n  <main class=\\"main-content\\">\\n    <slot />\\n  </main>\\n</div>\\n\\n<style>\\n  .app-wrapper {\\n    min-height: 100vh;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  .main-content {\\n    flex: 1;\\n    padding: 2rem 0;\\n  }\\n\\n  @media (max-width: 639px) {\\n    .main-content {\\n      padding: 1.5rem 0;\\n    }\\n  }\\n</style>\\n"],"names":[],"mappings":"AAWE,2BAAa,CACX,UAAU,CAAE,KAAK,CACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAClB,CAEA,4BAAc,CACZ,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CAAC,CAChB,CAEA,MAAO,YAAY,KAAK,CAAE,CACxB,4BAAc,CACZ,OAAO,CAAE,MAAM,CAAC,CAClB,CACF"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app-wrapper svelte-1279qf5"><main class="main-content svelte-1279qf5">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
