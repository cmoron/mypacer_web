<script>
  import { onMount } from 'svelte';
  import myPacerSVG from '$lib/assets/mypacer.svg?raw';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<header class="banner" class:mounted>
  <div class="banner-content">
    {@html myPacerSVG}
  </div>
  <div class="banner-subtitle">
    Tableau d'allures - Recherche d'athlètes FFA
  </div>
</header>

<style>
  .banner {
    background: linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 100%);
    padding: var(--spacing-lg) 0;
    border-bottom: var(--border-width) solid var(--color-neutral-200);
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity var(--transition-base), transform var(--transition-base);
  }

  .banner.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .banner-content {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  .banner-subtitle {
    text-align: center;
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-600);
  }

  .banner-content :global(svg) {
    width: auto;
    height: 46px;
  }

  @media (min-width: 640px) {
    .banner {
      padding: var(--spacing-xl) 0;
    }

    .banner-content :global(svg) {
      height: 56px;
    }
  }
</style>
