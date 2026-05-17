import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clubPage = readFileSync(resolve(__dirname, '../../src/routes/club/+page.svelte'), 'utf8');
const normalizedClubPage = clubPage.replace(/\s+/g, ' ');
const textOnlyClubPage = normalizedClubPage.replace(/<[^>]+>/g, '');

describe('MyPacer Club marketing copy', () => {
  it('presents the free trial as one full month, not a fixed end-of-May deadline', () => {
    expect(clubPage).not.toContain('Vos Interclubs de mai sont déjà dans le rapport.');
    expect(clubPage).not.toContain('préparer les Interclubs.');
    expect(clubPage).not.toContain("jusqu'au 31 mai");
    expect(clubPage).not.toContain('jusqu’au 31 mai');
    expect(clubPage).not.toContain('on vous offre la fin de saison');
    expect(normalizedClubPage).toContain('Testez MyPacer Club pendant 1 mois, sans engagement');
    expect(textOnlyClubPage).toContain('On active votre club pendant un mois complet');
    expect(normalizedClubPage).toContain("notre but n'est pas de le remplacer");
    expect(normalizedClubPage).toContain('rattrapages les lundi, mardi et mercredi soir');
  });

  it('keeps FFA data wording as a synthesis, not a raw exhaustive copy', () => {
    expect(clubPage).not.toContain('Résultats exhaustifs tirés en direct de la base FFA');
    expect(clubPage).not.toContain('rapport exhaustif');
    expect(clubPage).toContain('Synthèse hebdomadaire à partir des résultats publics FFA');
  });
});
