<script>
  import {page} from '$app/stores';

  const links = [
    {href: '/mentions-legales', label: 'Mentions légales'},
    {href: '/cgv', label: 'CGV'},
    {href: '/cgu', label: 'CGU'},
    {href: '/confidentialite', label: 'Confidentialité'},
  ];

  // Single source of truth for the "last updated" date across the 4 legal pages.
  // Update whenever any legal document is materially modified.
  export const LAST_UPDATED = '11 avril 2026';
</script>

<div class="legal-wrapper">
  <aside class="legal-nav" aria-label="Documents légaux">
    <h2 class="legal-nav-title">Informations légales</h2>
    <nav>
      <ul>
        {#each links as link}
          <li>
            <a
              href={link.href}
              class:active={$page.url.pathname === link.href}
              aria-current={$page.url.pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    <p class="legal-updated">Dernière mise à jour : {LAST_UPDATED}</p>
  </aside>

  <article class="legal-content">
    <slot />
  </article>
</div>

<style>
  .legal-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: var(--spacing-2xl);
    align-items: start;
  }

  .legal-nav {
    position: sticky;
    top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--color-neutral-50);
    border: var(--border-width) solid var(--color-neutral-200);
    border-radius: var(--border-radius-lg);
  }

  .legal-nav-title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-neutral-600);
    margin: 0 0 var(--spacing-md) 0;
  }

  .legal-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .legal-nav li {
    margin-bottom: var(--spacing-xs);
  }

  .legal-nav a {
    display: block;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-neutral-700);
    text-decoration: none;
    transition:
      background-color var(--transition-base),
      color var(--transition-base);
  }

  .legal-nav a:hover {
    background-color: var(--color-primary-50);
    color: var(--color-primary-700);
  }

  .legal-nav a.active {
    background-color: var(--color-primary-100);
    color: var(--color-primary-700);
    font-weight: var(--font-weight-semibold);
  }

  .legal-updated {
    margin: var(--spacing-lg) 0 0 0;
    font-size: var(--font-size-xs);
    color: var(--color-neutral-500);
  }

  .legal-content {
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    line-height: 1.7;
    color: var(--color-neutral-800);
    max-width: 780px;
  }

  .legal-content :global(h1) {
    font-family: var(--font-family-display);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-neutral-900);
    margin: 0 0 var(--spacing-lg) 0;
    padding-bottom: var(--spacing-md);
    border-bottom: var(--border-width-thick) solid var(--color-primary-500);
  }

  .legal-content :global(h2) {
    font-family: var(--font-family-display);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-900);
    margin: var(--spacing-xl) 0 var(--spacing-md) 0;
  }

  .legal-content :global(h3) {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-800);
    margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  }

  .legal-content :global(p) {
    margin: 0 0 var(--spacing-md) 0;
  }

  .legal-content :global(ul),
  .legal-content :global(ol) {
    margin: 0 0 var(--spacing-md) 0;
    padding-left: var(--spacing-lg);
  }

  .legal-content :global(li) {
    margin-bottom: var(--spacing-xs);
  }

  .legal-content :global(a) {
    color: var(--color-primary-600);
    text-decoration: underline;
    transition: color var(--transition-base);
  }

  .legal-content :global(a:hover) {
    color: var(--color-primary-700);
  }

  .legal-content :global(strong) {
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-900);
  }

  .legal-content :global(address) {
    font-style: normal;
    padding: var(--spacing-md);
    background-color: var(--color-neutral-50);
    border-left: 3px solid var(--color-primary-500);
    border-radius: var(--border-radius-sm);
    margin: var(--spacing-md) 0;
  }

  .legal-content :global(.callout) {
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--color-primary-50);
    border: var(--border-width) solid var(--color-primary-100);
    border-left: 4px solid var(--color-primary-500);
    border-radius: var(--border-radius-md);
    margin: var(--spacing-lg) 0;
  }

  .legal-content :global(.callout strong) {
    color: var(--color-primary-700);
  }

  .legal-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-md) 0 var(--spacing-lg) 0;
    font-size: var(--font-size-sm);
    border: var(--border-width) solid var(--color-neutral-200);
    border-radius: var(--border-radius-md);
    overflow: hidden;
  }

  .legal-content :global(th),
  .legal-content :global(td) {
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
    vertical-align: top;
    border-bottom: var(--border-width) solid var(--color-neutral-200);
  }

  .legal-content :global(th) {
    background-color: var(--color-neutral-50);
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-800);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .legal-content :global(tr:last-child td) {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    .legal-wrapper {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .legal-nav {
      position: static;
    }
  }
</style>
