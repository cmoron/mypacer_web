<script>
  // Pré-remplissage du mailto de demande de démo.
  // Le body guide le visiteur à donner les infos minimales pour qu'Estelle
  // puisse générer un vrai rapport personnalisé en retour.
  const DEMO_SUBJECT = encodeURIComponent('Demande de démo MyPacer Club');
  const DEMO_BODY = encodeURIComponent(
    [
      'Bonjour,',
      '',
      'Nous aimerions recevoir un rapport de démonstration de MyPacer Club pour notre club.',
      '',
      'Nom du club :',
      'Ville / département :',
      'Contact (nom, fonction) :',
      '',
      'Merci !',
    ].join('\n')
  );
  const DEMO_MAILTO = `mailto:contact@mypacer.fr?subject=${DEMO_SUBJECT}&body=${DEMO_BODY}`;

  const offers = [
    {
      name: 'Bureau',
      price: '99',
      recipients: "Jusqu'à 3 adresses email",
      audience: 'Président, secrétaire, community manager',
      features: [
        'Premier rapport dès le dimanche soir',
        'Rattrapages chaque soir jusqu’au mercredi',
        'Résultats exhaustifs tirés en direct de la base FFA',
        'Détection des podiums, qualifs individuelles (qi) et par équipe (qe)',
      ],
      highlighted: false,
    },
    {
      name: 'Staff Technique',
      price: '119',
      recipients: "Jusqu'à 15 adresses email",
      audience: 'Bureau + tous les entraîneurs de groupe',
      features: [
        "Tout ce qui est dans l'offre Bureau",
        'Chaque entraîneur reçoit ses résultats directement',
        'Fini les transferts de mails interminables',
        'La paix sociale au sein du staff',
      ],
      highlighted: true,
    },
  ];

  const faq = [
    {
      question: "On n'a plus de budget à cette période de l'année.",
      answer:
        "C'est justement pour ça que nous proposons l'offre Avant-Première : vous sécurisez l'outil sur le budget de la saison prochaine, et vous l'utilisez gratuitement dès maintenant pour préparer les Interclubs.",
    },
    {
      question: 'On a déjà un bénévole qui le fait super bien.',
      answer:
        "C'est génial — notre but est de lui faire gagner une heure trente par semaine. Il recevra un premier rapport dès le dimanche soir, puis des compléments les soirs suivants, et pourra utiliser ce temps pour rédiger des résumés plus sympas ou trier ses photos du week-end.",
    },
    {
      question: "L'offre Staff Technique à 119 €, c'est vraiment utile ?",
      answer:
        "C'est la préférée des gros clubs. Pour 20 € de différence avec l'offre Bureau, vous achetez la paix sociale : chaque entraîneur de groupe reçoit ses résultats directement, sans que le président n'ait à faire le facteur.",
    },
    {
      question: 'Et si le robot se trompe sur une qualif ?',
      answer:
        "MyPacer Club est branché en direct sur la base officielle de la FFA. Il détecte intelligemment les podiums, les qualifs individuelles (qi) et par équipe (qe). Il est souvent plus précis qu'un humain fatigué le dimanche soir.",
    },
    {
      question: 'Et si un résultat tombe en retard sur le site de la FFA ?',
      answer:
        "C'est exactement pour ça qu'on envoie plusieurs rapports. Le premier part dès le dimanche soir pour communiquer à chaud, puis on déclenche un complément chaque soir jusqu'au mercredi à chaque fois que de nouveaux résultats remontent sur la base FFA. Vous êtes toujours à jour, sans jamais avoir à surveiller la publication.",
    },
  ];
</script>

<svelte:head>
  <title>MyPacer Club — Les résultats de votre club dès le dimanche soir</title>
  <meta
    name="description"
    content="MyPacer Club vous envoie un premier rapport exhaustif des résultats de vos athlètes dès
      le dimanche soir, puis des rattrapages chaque soir jusqu'au mercredi. Communiquez à chaud à vos
      licenciés et aux familles, sans surveiller la base FFA. À partir de 99 € par saison."
  />
  <meta name="robots" content="index, follow" />
</svelte:head>

<article class="club">
  <!-- Hero -->
  <section class="hero">
    <p class="eyebrow">MyPacer Club</p>
    <h1>Les résultats de votre club dans votre boîte mail, dès le dimanche soir.</h1>
    <p class="lede">
      Communiquez à chaud à vos athlètes, aux familles, à vos réseaux sociaux — et à la presse locale si vous le
      souhaitez. Premier rapport automatique dès le dimanche soir, puis un rattrapage chaque soir jusqu'au mercredi pour
      les résultats qui remontent plus tard sur la base FFA.
    </p>
    <div class="cta-row">
      <a class="btn btn-primary" href={DEMO_MAILTO}>Obtenir un rapport de démonstration</a>
      <a class="btn btn-ghost" href="#offres">Voir les offres</a>
    </div>
    <p class="hero-note">Gratuit, sans engagement. Estelle vous répond sous 48h avec un vrai rapport personnalisé.</p>
  </section>

  <!-- Problème / Solution -->
  <section class="two-col">
    <div>
      <h2>Le dimanche soir du bénévole</h2>
      <p>
        Vous connaissez la scène : un bénévole passe son dimanche soir à éplucher la base FFA pour compiler les
        résultats du week-end. Il faut ouvrir dix onglets, croiser les classements, repérer les podiums et les qualifs,
        faire attention à ne pas oublier un record personnel qui mérite d'être célébré.
      </p>
      <p>
        Et le lundi, les messages arrivent quand même : « vous avez oublié de parler de ma course », « ma fille a fait
        un record vous n'en avez pas parlé ». La charge mentale est réelle — et pendant ce temps, les résultats
        refroidissent.
      </p>
    </div>
    <div>
      <h2>Le dimanche soir avec MyPacer Club</h2>
      <p>
        À 19h, un premier rapport atterrit automatiquement dans les boîtes mail qui comptent. Les podiums mis en avant,
        les qualifs individuelles (qi) et par équipe (qe) détectées, les records personnels identifiés. Vous êtes prêts
        à communiquer <strong>le soir même</strong>.
      </p>
      <p>
        Les jours suivants, on continue de surveiller la base FFA pour vous : dès qu'un nouveau résultat est publié, un
        rapport complémentaire part le soir même jusqu'au mercredi. Vos communications restent à jour sans que personne
        n'ait à aller vérifier.
      </p>
    </div>
  </section>

  <!-- Timeline : le différenciant -->
  <section class="timeline-section">
    <header class="section-header">
      <p class="eyebrow">Le différenciant</p>
      <h2>Un rapport immédiat, puis des rattrapages automatiques</h2>
      <p>
        Les organisateurs de courses ne transmettent pas toujours leurs fichiers à la FFA le dimanche soir. Certains
        résultats arrivent le lundi, voire le mercredi. MyPacer Club vous envoie tout au fil de l'eau.
      </p>
    </header>

    <ol class="timeline">
      <li>
        <span class="timeline-when">Dimanche<br /><strong>19h</strong></span>
        <div class="timeline-body">
          <h3>Le rapport à chaud</h3>
          <p>
            Premier envoi automatique. Tout ce qui est déjà publié sur la FFA est dans votre boîte mail. Vous
            communiquez le soir même.
          </p>
        </div>
      </li>
      <li>
        <span class="timeline-when">Lundi → mercredi<br /><strong>chaque soir</strong></span>
        <div class="timeline-body">
          <h3>Les rattrapages</h3>
          <p>
            Dès qu'un nouveau résultat remonte sur la base FFA, un complément part automatiquement le soir. Uniquement
            les nouveautés — pas de spam.
          </p>
        </div>
      </li>
      <li>
        <span class="timeline-when">Mercredi soir<br /><strong>stop</strong></span>
        <div class="timeline-body">
          <h3>C'est bouclé</h3>
          <p>
            Le week-end est entièrement couvert, sans jamais avoir eu à surveiller la publication des résultats.
            Rendez-vous dimanche prochain.
          </p>
        </div>
      </li>
    </ol>
  </section>

  <!-- Offres -->
  <section id="offres" class="offers-section">
    <header class="section-header">
      <h2>Deux offres, un seul produit</h2>
      <p>
        Une formule annuelle par saison sportive (septembre → août). Pas de renouvellement automatique, pas de surprise.
      </p>
    </header>

    <div class="offers-grid">
      {#each offers as offer}
        <div class="offer-card" class:highlighted={offer.highlighted}>
          {#if offer.highlighted}
            <span class="badge">Le plus choisi</span>
          {/if}
          <h3>Offre {offer.name}</h3>
          <p class="price">
            <span class="amount">{offer.price}</span>
            <span class="unit">€ TTC<br />/ saison sportive</span>
          </p>
          <p class="recipients"><strong>{offer.recipients}</strong></p>
          <p class="audience">{offer.audience}</p>
          <ul class="features">
            {#each offer.features as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <a class="btn btn-primary btn-block" href={DEMO_MAILTO}>Demander une démo</a>
        </div>
      {/each}
    </div>

    <p class="tax-note">
      Tarifs exprimés en euros toutes taxes comprises. DecaSaaS est placé sous le régime de la franchise en base de TVA
      (article 293 B du CGI) : aucune TVA n'est collectée. Conditions détaillées dans nos <a href="/cgv">CGV</a>.
    </p>
  </section>

  <!-- Avant-première -->
  <section class="avant-premiere">
    <div class="avant-premiere-inner">
      <p class="eyebrow">Offre Avant-Première</p>
      <h2>Équipez-vous aujourd'hui, on vous offre la fin de saison</h2>
      <p>
        Vous souscrivez pour la saison 2026-2027 ? On vous ouvre l'accès <strong>immédiatement</strong> et
        <strong>gratuitement</strong> jusqu'au début de la saison couverte. Vos Interclubs de mai sont déjà dans le rapport.
      </p>
      <a class="btn btn-primary" href={DEMO_MAILTO}>Profiter de l'Avant-Première</a>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq">
    <h2>Les questions qu'on nous pose souvent</h2>
    <dl>
      {#each faq as { question, answer }}
        <div class="faq-item">
          <dt>{question}</dt>
          <dd>{answer}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <!-- CTA final -->
  <section class="final-cta">
    <h2>Prêt à voir ce que votre club recevrait dimanche prochain ?</h2>
    <p>Envoyez-nous un mot. On génère un rapport de démonstration avec vos vrais athlètes, et on vous le renvoie.</p>
    <a class="btn btn-primary btn-large" href={DEMO_MAILTO}>Obtenir mon rapport de démonstration</a>
    <p class="hero-note">Aucun engagement. Pas de carte bancaire. Juste un mail.</p>
  </section>
</article>

<style>
  .club {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    font-family: var(--font-family-base);
    color: var(--color-neutral-800);
    line-height: var(--line-height-relaxed);
  }

  .club :global(h1),
  .club :global(h2),
  .club :global(h3) {
    font-family: var(--font-family-display);
    color: var(--color-neutral-900);
  }

  .club :global(a) {
    color: var(--color-primary-600);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary-600);
    margin: 0 0 var(--spacing-sm) 0;
  }

  /* -------------------------------------------------------------------------- */
  /* Hero                                                                       */
  /* -------------------------------------------------------------------------- */
  .hero {
    text-align: center;
    padding: var(--spacing-3xl) 0 var(--spacing-2xl) 0;
  }

  .hero h1 {
    font-size: clamp(1.75rem, 4vw + 1rem, 2.75rem);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin: 0 auto var(--spacing-lg) auto;
    max-width: 740px;
  }

  .lede {
    font-size: var(--font-size-lg);
    color: var(--color-neutral-700);
    max-width: 680px;
    margin: 0 auto var(--spacing-xl) auto;
  }

  .cta-row {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
  }

  .hero-note {
    font-size: var(--font-size-sm);
    color: var(--color-neutral-500);
    margin: 0;
  }

  /* -------------------------------------------------------------------------- */
  /* Buttons                                                                    */
  /* -------------------------------------------------------------------------- */
  .btn {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    text-decoration: none;
    transition:
      background-color var(--transition-base),
      transform var(--transition-fast),
      box-shadow var(--transition-base);
    border: var(--border-width-thick) solid transparent;
    cursor: pointer;
  }

  .btn-primary {
    background-color: var(--color-primary-500);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover,
  .btn-primary:focus-visible {
    background-color: var(--color-primary-600);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-primary-600);
    border-color: var(--color-primary-100);
  }

  .btn-ghost:hover,
  .btn-ghost:focus-visible {
    background-color: var(--color-primary-50);
    border-color: var(--color-primary-500);
  }

  .btn-block {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: var(--spacing-md);
  }

  .btn-large {
    padding: var(--spacing-lg) var(--spacing-2xl);
    font-size: var(--font-size-lg);
  }

  /* -------------------------------------------------------------------------- */
  /* Two-column problème / solution                                             */
  /* -------------------------------------------------------------------------- */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
    padding: var(--spacing-2xl) 0;
    border-top: var(--border-width) solid var(--color-neutral-200);
    border-bottom: var(--border-width) solid var(--color-neutral-200);
  }

  .two-col h2 {
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .two-col p {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-neutral-700);
  }

  /* -------------------------------------------------------------------------- */
  /* Timeline (différenciant)                                                   */
  /* -------------------------------------------------------------------------- */
  .timeline-section {
    padding: var(--spacing-2xl) 0;
    border-top: var(--border-width) solid var(--color-neutral-200);
  }

  .timeline {
    list-style: none;
    padding: 0;
    margin: var(--spacing-xl) 0 0 0;
    display: grid;
    gap: var(--spacing-md);
    counter-reset: timeline-step;
  }

  .timeline li {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: var(--spacing-lg);
    align-items: start;
    padding: var(--spacing-lg);
    background-color: var(--color-neutral-50);
    border: var(--border-width) solid var(--color-neutral-200);
    border-left: 4px solid var(--color-primary-500);
    border-radius: var(--border-radius-lg);
  }

  .timeline-when {
    font-family: var(--font-family-display);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-neutral-600);
    line-height: 1.3;
  }

  .timeline-when strong {
    display: block;
    font-size: var(--font-size-xl);
    color: var(--color-primary-700);
    letter-spacing: 0;
    text-transform: none;
    margin-top: var(--spacing-xs);
  }

  .timeline-body h3 {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-lg);
  }

  .timeline-body p {
    margin: 0;
    color: var(--color-neutral-700);
  }

  /* -------------------------------------------------------------------------- */
  /* Section headers                                                            */
  /* -------------------------------------------------------------------------- */
  .section-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .section-header h2 {
    font-size: var(--font-size-2xl);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .section-header p {
    color: var(--color-neutral-600);
    margin: 0;
  }

  /* -------------------------------------------------------------------------- */
  /* Offers                                                                     */
  /* -------------------------------------------------------------------------- */
  .offers-section {
    padding: var(--spacing-2xl) 0;
  }

  .offers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
  }

  .offer-card {
    position: relative;
    padding: var(--spacing-xl);
    background-color: white;
    border: var(--border-width) solid var(--color-neutral-200);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
  }

  .offer-card.highlighted {
    border-color: var(--color-primary-500);
    box-shadow: var(--shadow-lg);
  }

  .badge {
    position: absolute;
    top: calc(var(--spacing-md) * -1);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-primary-500);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--border-radius-full);
  }

  .offer-card h3 {
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .price {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-sm);
    margin: 0 0 var(--spacing-md) 0;
  }

  .price .amount {
    font-family: var(--font-family-display);
    font-size: 3rem;
    font-weight: var(--font-weight-bold);
    color: var(--color-neutral-900);
    line-height: 1;
  }

  .price .unit {
    font-size: var(--font-size-xs);
    color: var(--color-neutral-600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.3;
  }

  .recipients {
    margin: 0 0 var(--spacing-xs) 0;
    color: var(--color-primary-700);
  }

  .audience {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-neutral-600);
    font-size: var(--font-size-sm);
  }

  .features {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--spacing-md) 0;
    flex: 1;
  }

  .features li {
    padding-left: var(--spacing-lg);
    position: relative;
    margin-bottom: var(--spacing-sm);
    color: var(--color-neutral-700);
    font-size: var(--font-size-sm);
  }

  .features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-primary-500);
    font-weight: var(--font-weight-bold);
  }

  .tax-note {
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--color-neutral-500);
    max-width: 680px;
    margin: var(--spacing-lg) auto 0 auto;
  }

  /* -------------------------------------------------------------------------- */
  /* Avant-Première                                                             */
  /* -------------------------------------------------------------------------- */
  .avant-premiere {
    margin: var(--spacing-2xl) 0;
  }

  .avant-premiere-inner {
    background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
    border: var(--border-width) solid var(--color-primary-100);
    border-left: 4px solid var(--color-primary-500);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl) var(--spacing-2xl);
    text-align: center;
  }

  .avant-premiere h2 {
    font-size: var(--font-size-xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .avant-premiere p {
    max-width: 640px;
    margin: 0 auto var(--spacing-lg) auto;
    color: var(--color-neutral-700);
  }

  /* -------------------------------------------------------------------------- */
  /* FAQ                                                                        */
  /* -------------------------------------------------------------------------- */
  .faq {
    padding: var(--spacing-2xl) 0;
    border-top: var(--border-width) solid var(--color-neutral-200);
  }

  .faq h2 {
    font-size: var(--font-size-2xl);
    text-align: center;
    margin: 0 0 var(--spacing-xl) 0;
  }

  .faq dl {
    margin: 0;
  }

  .faq-item {
    padding: var(--spacing-lg) 0;
    border-bottom: var(--border-width) solid var(--color-neutral-200);
  }

  .faq-item:last-child {
    border-bottom: none;
  }

  .faq dt {
    font-weight: var(--font-weight-semibold);
    color: var(--color-neutral-900);
    margin-bottom: var(--spacing-sm);
  }

  .faq dd {
    margin: 0;
    color: var(--color-neutral-700);
  }

  /* -------------------------------------------------------------------------- */
  /* CTA final                                                                  */
  /* -------------------------------------------------------------------------- */
  .final-cta {
    text-align: center;
    padding: var(--spacing-3xl) 0;
    border-top: var(--border-width) solid var(--color-neutral-200);
  }

  .final-cta h2 {
    font-size: var(--font-size-2xl);
    margin: 0 0 var(--spacing-md) 0;
  }

  .final-cta p {
    color: var(--color-neutral-700);
    max-width: 600px;
    margin: 0 auto var(--spacing-xl) auto;
  }

  .final-cta p.hero-note {
    margin-top: var(--spacing-md);
  }

  /* -------------------------------------------------------------------------- */
  /* Responsive                                                                 */
  /* -------------------------------------------------------------------------- */
  @media (max-width: 768px) {
    .hero {
      padding: var(--spacing-2xl) 0 var(--spacing-xl) 0;
    }

    .two-col,
    .offers-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }

    .timeline li {
      grid-template-columns: 1fr;
      gap: var(--spacing-sm);
    }

    .avant-premiere-inner {
      padding: var(--spacing-lg);
    }

    .btn-large {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
    }
  }
</style>
