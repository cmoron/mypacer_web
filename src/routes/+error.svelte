<script>
  import {page} from '$app/stores';
</script>

<svelte:head>
  <title>Page introuvable — MyPacer</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h1>{$page.status === 404 ? 'Page introuvable' : 'Erreur'}</h1>
<p><a href="/">Retour au tableau d'allures</a></p>
