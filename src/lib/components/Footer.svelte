<script>
  const version = __APP_VERSION__;
</script>

<footer class="footer">
  <div class="footer-content">
    <nav class="footer-legal" aria-label="Informations légales">
      <a href="/mentions-legales">Mentions légales</a>
      <span aria-hidden="true">·</span>
      <a href="/cgv">CGV</a>
      <span aria-hidden="true">·</span>
      <a href="/cgu">CGU</a>
      <span aria-hidden="true">·</span>
      <a href="/confidentialite">Confidentialité</a>
    </nav>
    <p>
      <span class="version"> MyPacer v{version} - </span><a href="mailto:contact@mypacer.fr">contact@mypacer.fr</a>
    </p>
  </div>
</footer>

<style>
  .footer {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md) 0;
    border-top: var(--border-width) solid var(--color-neutral-200);
    text-align: center;
  }

  .footer-content {
    font-size: var(--font-size-sm);
    color: var(--color-neutral-600);
  }

  .footer-content a {
    color: var(--color-primary-500);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .footer-content a:hover {
    color: var(--color-primary-700);
    text-decoration: underline;
  }

  .footer-legal {
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-xs);
    color: var(--color-neutral-500);
  }

  .footer-legal span {
    margin: 0 var(--spacing-xs);
    color: var(--color-neutral-300);
  }

  .version {
    margin-left: var(--spacing-md);
    color: var(--color-neutral-400);
    font-size: var(--font-size-xs);
  }
</style>
