// src/paceTableStore.js
// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for the running‑pace table settings.
// ---------------------------------------------------------------------------
import {writable} from 'svelte/store';
import {
  DEFAULT_MIN_PACE,
  DEFAULT_MAX_PACE,
  DEFAULT_INCREMENT,
  DEFAULT_DISTANCES,
  MAX_CUSTOM_DISTANCE,
} from '../utils/constants.js';

// ─────────────────────────────────────────────────────────────────────────────
//  Pace‑range stores
// ─────────────────────────────────────────────────────────────────────────────
export const selectedMinPace = writable(DEFAULT_MIN_PACE);
export const selectedMaxPace = writable(DEFAULT_MAX_PACE);
export const selectedIncrement = writable(DEFAULT_INCREMENT);

// ─────────────────────────────────────────────────────────────────────────────
//  Distances (core + user custom)  ─ triées en permanence
// ─────────────────────────────────────────────────────────────────────────────
function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem('customDistances') ?? '[]');
  } catch {
    return [];
  }
}
function saveCustom(customList) {
  localStorage.setItem('customDistances', JSON.stringify(customList));
}

/**
 * Conserve uniquement les distances personnalisées dans localStorage.
 * @param {number[]} fullList  Liste complète (défaut + custom)
 */
function persist(fullList) {
  saveCustom(fullList.filter((d) => !DEFAULT_DISTANCES.includes(d)));
}

export const distances = writable([...DEFAULT_DISTANCES, ...loadCustom()].sort((a, b) => a - b));

// keep storage in sync even if the store is mutated directly
// (e.g. via `$distances = …` dans un composant)
distances.subscribe(persist);

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers to mutate the list
// ─────────────────────────────────────────────────────────────────────────────
export function addDistance(raw) {
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0 || value > MAX_CUSTOM_DISTANCE || DEFAULT_DISTANCES.includes(value)) return;

  distances.update((curr) => {
    if (curr.includes(value)) return curr; // duplicate
    const next = [...curr, value].sort((a, b) => a - b);
    persist(next);
    return next;
  });
}

export function removeDistance(value) {
  if (DEFAULT_DISTANCES.includes(value)) return; // protect core

  distances.update((curr) => {
    const next = curr.filter((d) => d !== value).sort((a, b) => a - b);
    persist(next);
    return next;
  });
}

// Re‑export core constants for convenience in components
export {DEFAULT_DISTANCES} from '../utils/constants.js';
