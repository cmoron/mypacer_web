import {browser} from '$app/environment';

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

/**
 * Récupère une entrée du cache localStorage
 * @param {string} key - Clé du cache
 * @return {*|null} - Données cachées ou null si expirées/inexistantes
 */
export function getFromCache(key) {
  if (!browser) return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const {data, expiresAt} = JSON.parse(cached);

    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lecture cache:', error);
    return null;
  }
}

/**
 * Stocke une entrée dans le cache localStorage avec TTL
 * @param {string} key - Clé du cache
 * @param {*} data - Données à cacher
 * @param {number} ttl - Durée de vie en millisecondes (défaut: 24h)
 */
export function setInCache(key, data, ttl = DEFAULT_TTL) {
  if (!browser) return;

  try {
    const cacheEntry = {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Erreur écriture cache:', error);
  }
}

/**
 * Supprime une entrée du cache
 * @param {string} key - Clé du cache
 */
export function removeFromCache(key) {
  if (!browser) return;
  localStorage.removeItem(key);
}

/**
 * Génère la clé de cache pour les records d'un athlète
 * @param {string} athleteId - ID de l'athlète (FFA ID)
 * @return {string} - Clé de cache
 */
export function getAthleteRecordsCacheKey(athleteId) {
  return `athlete_records_${athleteId}`;
}
