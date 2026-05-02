import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clubPage = readFileSync(resolve(__dirname, '../../src/routes/club/+page.svelte'), 'utf8');
const normalizedClubPage = clubPage.replace(/\s+/g, ' ');

describe('MyPacer Club marketing copy', () => {
  it('does not present Interclubs as a fixed May deadline', () => {
    expect(clubPage).not.toContain('Vos Interclubs de mai sont déjà dans le rapport.');
    expect(clubPage).not.toContain('préparer les Interclubs.');
    expect(normalizedClubPage).toContain(
      'Interclubs, meetings, championnats : vos prochains résultats peuvent déjà être suivis dans MyPacer Club'
    );
    expect(normalizedClubPage).toContain('même si votre calendrier régional a déjà commencé');
  });
});
