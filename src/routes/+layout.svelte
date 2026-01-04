<script>
  import '../app.css';
</script>

<div class="app-wrapper">
  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  .app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: 2rem 0;
  }

  @media (max-width: 639px) {
    .main-content {
      padding: 1.5rem 0;
    }
  }
</style>
