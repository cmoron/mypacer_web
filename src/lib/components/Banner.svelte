<script>
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import myPacerSVG from '$lib/assets/mypacer.svg?raw';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const navLinks = [
    {href: '/', label: 'Allures & Athlètes'},
    {href: '/club', label: 'MyPacer Club'},
  ];
</script>

<header class="banner" class:mounted>
  <a class="banner-logo" href="/" aria-label="Accueil MyPacer">
    <!-- Safe: myPacerSVG is a static SVG file imported at build time, not user content -->
    <!-- eslint-disable svelte/no-at-html-tags -->
    {@html myPacerSVG}
    <!-- eslint-enable svelte/no-at-html-tags -->
  </a>
  <h1 class="banner-subtitle">Tableau d'allures - Recherche d'athlètes FFA</h1>
  <nav class="banner-nav" aria-label="Navigation principale">
    {#each navLinks as link}
      <a
        href={link.href}
        class:active={$page.url.pathname === link.href}
        aria-current={$page.url.pathname === link.href ? 'page' : undefined}
      >
        {link.label}
      </a>
    {/each}
  </nav>
</header>

<style>
  .banner {
    background: linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 100%);
    padding: var(--spacing-lg) 0;
    border-bottom: var(--border-width) solid var(--color-neutral-200);
    opacity: 0;
    transform: translateY(-10px);
    transition:
      opacity var(--transition-base),
      transform var(--transition-base);
  }

  .banner.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .banner-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
    text-decoration: none;
  }

  .banner-subtitle {
    text-align: center;
    margin-top: var(--spacing-sm);
    margin-bottom: 0;
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--color-neutral-600);
  }

  .banner-logo :global(svg) {
    width: auto;
    height: 46px;
  }

  .banner-nav {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-md);
    flex-wrap: wrap;
    padding: 0 var(--container-padding);
  }

  .banner-nav a {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-neutral-700);
    text-decoration: none;
    transition:
      background-color var(--transition-base),
      color var(--transition-base);
  }

  .banner-nav a:hover,
  .banner-nav a:focus-visible {
    background-color: var(--color-primary-50);
    color: var(--color-primary-700);
  }

  .banner-nav a.active {
    background-color: var(--color-primary-100);
    color: var(--color-primary-700);
    font-weight: var(--font-weight-semibold);
  }

  @media (min-width: 640px) {
    .banner {
      padding: var(--spacing-xl) 0;
    }

    .banner-logo :global(svg) {
      height: 56px;
    }
  }
</style>
