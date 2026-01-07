<script>
  import PaceTable from '$lib/components/PaceTable.svelte';
</script>

<svelte:head>
  <title>MyPacer - Tableau d'allures & Recherche FFA</title>
</svelte:head>

<!-- Contenu SEO statique pour les moteurs de recherche et utilisateurs sans JS -->
<noscript>
  <div style="padding: 2rem; max-width: 800px; margin: 0 auto; text-align: center;">
    <h1>MyPacer - Calculateur d'allure Running & Recherche FFA</h1>
    <p>Outil gratuit pour coureurs : générez vos tables d'allures personnalisées pour toutes les distances (5km, 10km, Semi-Marathon, Marathon) et consultez les records officiels de tous les licenciés FFA.</p>
    <p><strong>Ce site nécessite JavaScript pour fonctionner.</strong> Veuillez l'activer dans votre navigateur.</p>
  </div>
</noscript>

<PaceTable />
