<script>
  // Mockup statique d'un rapport hebdo MyPacer Club, intégré dans la landing
  // au-dessus de la ligne de flottaison comme preuve visuelle.
  // Données fictives mais crédibles — le club et les athlètes n'existent pas.
  // Les couleurs et le rendu reproduisent fidèlement reporter.py (mypacer_club).

  const clubName = 'AC Démo Athlétisme';
  const dateRange = 'du 17/03 au 23/03';
  const stats = {athletes: 12, highlights: 4, perfsHigh: 5};

  const highlights = [
    {
      medal: '🥇',
      borderColor: '#f59e0b',
      bgCard: '#fffbeb',
      nom: 'DURAND Léa',
      epreuve: '800m',
      tour: 'Finale',
      perf: '2\'14"82',
      meta: '1 042 pts • IR4 • 1er',
      qualif: {label: 'QI', bg: '#dbeafe', color: '#1e40af'},
    },
    {
      medal: '🥈',
      borderColor: '#94a3b8',
      bgCard: '#f8fafc',
      nom: 'MARTIN Hugo',
      epreuve: '5 000m',
      tour: '',
      perf: '14\'52"31',
      meta: '978 pts • N3 • 2e',
      qualif: {label: 'QE', bg: '#f3e8ff', color: '#6b21a8'},
    },
    {
      medal: '🥇',
      borderColor: '#f59e0b',
      bgCard: '#fffbeb',
      nom: 'GIRARD Patrick',
      epreuve: '10 km Route',
      tour: '',
      perf: '38\'12"',
      meta: 'R6 • 512e (1er M4)',
    },
    {
      medal: '',
      borderColor: '#e2e8f0',
      bgCard: '#ffffff',
      nom: 'ROUSSEAU Karim',
      epreuve: 'Marathon',
      tour: '',
      perf: '2h41\'18"',
      meta: '1 187 pts • IR2 • 1 234e',
      record: true,
    },
  ];

  const results = [
    {
      group: '22/03 à Lyon',
      items: [
        {nom: 'BERNARD Sophie', epreuve: 'Hauteur', perf: '1m72', meta: '892 pts • IR3 • 3e'},
        {nom: 'PETIT Léo', epreuve: '100m haies', perf: '14"08', meta: '845 pts • IR4 • 5e'},
      ],
    },
    {
      group: '23/03 à Saint-Étienne',
      items: [{nom: 'MOREAU Anaïs', epreuve: '1 500m', perf: '4\'38"15', meta: '821 pts • IR4 • 4e (2e F)'}],
    },
  ];
</script>

<div class="frame" aria-label="Exemple de rapport hebdomadaire MyPacer Club">
  <!-- Chrome de fenêtre email -->
  <div class="frame-chrome">
    <span class="dot dot-red" aria-hidden="true"></span>
    <span class="dot dot-yellow" aria-hidden="true"></span>
    <span class="dot dot-green" aria-hidden="true"></span>
    <div class="frame-subject">📨 Résultats du week-end — {clubName}</div>
  </div>

  <!-- Contenu rapport (reproduction fidèle du format email) -->
  <div class="report">
    <div class="report-header">
      <h3 class="report-title">{clubName}</h3>
      <div class="report-subtitle">Résultats {dateRange}</div>
    </div>

    <!-- Dashboard 3 stats -->
    <table class="dashboard" cellpadding="0" cellspacing="0">
      <tr>
        <td class="stat stat-divider">
          <div class="stat-num">{stats.athletes}</div>
          <div class="stat-label">Athlètes</div>
        </td>
        <td class="stat stat-divider">
          <div class="stat-num">{stats.highlights}</div>
          <div class="stat-label">Highlights</div>
        </td>
        <td class="stat">
          <div class="stat-num">{stats.perfsHigh}</div>
          <div class="stat-label">Perfs IR et Nat.</div>
        </td>
      </tr>
    </table>

    <!-- Légende des badges -->
    <div class="legend">
      <span class="record">RP</span> Record personnel
      <span class="legend-sep" aria-hidden="true">·</span>
      <span class="qualif legend-qi">QI</span> Qualification individuelle
      <span class="legend-sep" aria-hidden="true">·</span>
      <span class="qualif legend-qe">QE</span> Qualification équipe
    </div>

    <!-- Highlights -->
    <div class="highlights">
      <h4 class="highlights-title">🏆 Podiums et hautes performances</h4>
      {#each highlights as h}
        <div class="card" style:border-left-color={h.borderColor} style:background-color={h.bgCard}>
          <div class="card-left">
            <div class="card-name">
              {#if h.medal}<span class="medal">{h.medal}</span>
              {/if}{h.nom}
            </div>
            <div class="card-event">
              {h.epreuve}{#if h.tour}
                <span class="tour">- {h.tour}</span>{/if}
            </div>
          </div>
          <div class="card-right">
            <div class="card-perf">
              {h.perf}
              {#if h.qualif}
                <span class="qualif" style:background-color={h.qualif.bg} style:color={h.qualif.color}>
                  {h.qualif.label}
                </span>
              {/if}
              {#if h.record}
                <span class="record">RP</span>
              {/if}
            </div>
            <div class="card-meta">{h.meta}</div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Tous les résultats -->
    <h4 class="results-title">🏃 Tous les Résultats ({stats.athletes - 9})</h4>
    {#each results as group}
      <div class="date-group">📅 {group.group}</div>
      {#each group.items as r}
        <div class="card card-default">
          <div class="card-left">
            <div class="card-name">{r.nom}</div>
            <div class="card-event">{r.epreuve}</div>
          </div>
          <div class="card-right">
            <div class="card-perf-default">{r.perf}</div>
            <div class="card-meta">{r.meta}</div>
          </div>
        </div>
      {/each}
    {/each}

    <div class="report-footer">
      Vous recevez cet email car vous êtes abonné aux rapports hebdomadaires du club <strong>{clubName}</strong>.
    </div>
  </div>

  <div class="frame-caption">Aperçu d'un rapport hebdomadaire — données fictives</div>
</div>

<style>
  .frame {
    max-width: 560px;
    margin: 0 auto;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    background-color: white;
    border: var(--border-width) solid var(--color-neutral-200);
    text-align: left;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #333;
  }

  .frame-chrome {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 14px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-red {
    background-color: #ff5f57;
  }
  .dot-yellow {
    background-color: #febc2e;
  }
  .dot-green {
    background-color: #28c840;
  }

  .frame-subject {
    margin-left: 10px;
    font-size: 12px;
    color: #475569;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report {
    padding: 18px 16px 16px 16px;
    line-height: 1.4;
  }

  .report-header {
    text-align: center;
    margin-bottom: 18px;
  }

  .report-title {
    color: #111;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin: 0 0 4px 0;
    font-family: inherit;
  }

  .report-subtitle {
    color: #475569;
    font-size: 13px;
  }

  .dashboard {
    width: 100%;
    background-color: #f0f7ff;
    border: 1px solid #dbeafe;
    border-radius: 8px;
    margin-bottom: 18px;
    border-collapse: separate;
  }

  .stat {
    text-align: center;
    padding: 12px 6px;
  }

  .stat-divider {
    border-right: 1px solid #dbeafe;
  }

  .stat-num {
    font-size: 22px;
    font-weight: bold;
    color: #1e40af;
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.03em;
  }

  .highlights {
    background-color: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 18px;
  }

  .highlights-title {
    color: #92400e;
    font-size: 13px;
    margin: 0 0 12px 0;
    text-transform: uppercase;
    font-weight: 700;
    border-bottom: 2px solid #fde68a;
    padding-bottom: 5px;
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .results-title {
    color: #1e40af;
    font-size: 13px;
    margin: 24px 0 12px 0;
    text-transform: uppercase;
    font-weight: 700;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 5px;
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .date-group {
    background-color: #f1f5f9;
    color: #475569;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: bold;
    margin: 12px 0 6px 0;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .card {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    margin-bottom: 6px;
    border-bottom: 1px solid #f1f5f9;
    border-left: 5px solid #e2e8f0;
    background-color: #ffffff;
  }

  .card-default {
    border-left-color: #e2e8f0;
    background-color: #ffffff;
  }

  .card-left {
    flex: 1;
    min-width: 0;
  }

  .card-right {
    text-align: right;
    flex-shrink: 0;
  }

  .card-name {
    font-size: 13px;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .medal {
    font-size: 16px;
    margin-right: 2px;
  }

  .card-event {
    font-size: 12px;
    color: #475569;
  }

  .tour {
    color: #64748b;
    font-style: italic;
  }

  .card-perf {
    font-size: 14px;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 3px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .card-perf-default {
    font-size: 13px;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .qualif {
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.03em;
  }

  /* Badge record personnel — violet « record de secteur » F1, fidèle à reporter.py */
  .record {
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.03em;
    background-color: #7c3aed;
    color: #ffffff;
  }

  .legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 18px;
  }

  .legend-qi {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .legend-qe {
    background-color: #f3e8ff;
    color: #6b21a8;
  }

  .legend-sep {
    color: #cbd5e1;
  }

  .card-meta {
    font-size: 12px;
    color: #475569;
  }

  .report-footer {
    margin-top: 20px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    line-height: 1.5;
  }

  .frame-caption {
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--color-neutral-500);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-neutral-50);
    border-top: var(--border-width) solid var(--color-neutral-200);
  }

  @media (max-width: 540px) {
    .frame-subject {
      font-size: 11px;
    }

    .report {
      padding: 14px 12px 12px 12px;
    }

    .report-title {
      font-size: 17px;
    }

    .stat-num {
      font-size: 18px;
    }

    .stat-label {
      font-size: 10px;
    }

    .card-name {
      font-size: 12px;
    }

    .card-event,
    .card-meta {
      font-size: 11px;
    }
  }
</style>
