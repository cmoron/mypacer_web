<script>
  import '../app.css';
  import Banner from '$lib/components/Banner.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

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
