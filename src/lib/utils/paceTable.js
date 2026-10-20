// Même calcul que mypacer_api core/calculator.py : sert au prérendu, pour que le
// HTML livré aux moteurs contienne le tableau par défaut. L'API reste la source
// une fois la page chargée.
// Arrondi identique à round(x, 2) de Python : sur la valeur binaire exacte,
// et au chiffre pair en cas d'égalité exacte (ex. 24262.125 -> 24262.12).
export function round2(x) {
  const exact = x.toFixed(20);
  const dot = exact.indexOf('.');
  if (/\.\d\d50*$/.test(exact) && Number(exact[dot + 2]) % 2 === 0) {
    return Number(exact.slice(0, dot + 3));
  }
  return Number(x.toFixed(2));
}

export function computePaceTable(minPace, maxPace, increment, distances) {
  const rows = [];
  for (let pace = minPace; pace >= maxPace; pace -= increment) {
    const row = {pace, speed: round2(3600 / pace)};
    for (const d of distances) row[String(d)] = round2((d / 1000) * pace);
    rows.push(row);
  }
  return rows;
}

export function tableColumns(paceData) {
  if (paceData.length === 0) return [];
  return Object.keys(paceData[0])
    .filter((key) => key !== 'pace' && key !== 'speed')
    .map(Number)
    .sort((a, b) => a - b);
}
