<script>
  import '../app.css';
  import Banner from '$lib/components/Banner.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import {page} from '$app/stores';

  // Une URL canonique par page (prérendue) : un canonical global faisait de
  // chaque page un doublon de la home.
  $: canonical = `https://mypacer.fr${$page.url.pathname}`;
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="https://mypacer.fr/mypacer.webp" />
  <meta property="og:locale" content="fr_FR" />
</svelte:head>

<div class="app-wrapper">
  <Banner />

  <div class="container">
    <main class="main-content">
      <slot />
    </main>
  </div>

  <Footer />
</div>

<style>
  .app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: var(--spacing-xl) 0;
  }

  @media (max-width: 639px) {
    .main-content {
      padding: var(--spacing-lg) 0;
    }
  }
</style>
