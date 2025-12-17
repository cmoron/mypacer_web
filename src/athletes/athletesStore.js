import {writable} from 'svelte/store';

/**
 * A pool of colors to use for athlete color indicators.
 * The colors are in hexadecimal format.
 * @type {string[]}
 */
const colorPool = [
  '#03A9F4',
  '#F44336',
  '#9C27B0',
  '#607D8B',
  '#E91E63',
  '#3F51B5',
  '#795548',
  '#009688',
  '#00BCD4',
  '#4CAF50',
];

const storedColorUsage = JSON.parse(localStorage.getItem('colorUsage'));
const colorUsage = storedColorUsage || new Array(colorPool.length).fill(false);

/**
 * Get the next color from the pool.
 * If all colors have been used, reset all colors as unused.
 * @return {string} - The next color in the pool.
 */
function getNextColor() {
  let index = colorUsage.indexOf(false);
  if (index === -1) {
    // reset all colors as unused
    colorUsage.fill(false);
    index = 0;
  }
  colorUsage[index] = true;
  localStorage.setItem('colorUsage', JSON.stringify(colorUsage));
  return colorPool[index];
}

/**
 * Release a color back to the pool.
 * @param {string} color - The color to release.
 */
function releaseColor(color) {
  const index = colorPool.indexOf(color);
  if (index !== -1) {
    colorUsage[index] = false;
    localStorage.setItem('colorUsage', JSON.stringify(colorUsage));
  }
}

/**
 * Creates a store to manage athlete data.
 * The store allows adding, removing, and updating athlete records.
 * @return {Object} - The athlete store object.
 */
function createAthleteStore() {
  const {subscribe, set, update} = writable([]);

  return {
    // Subscribe to the athletes data
    subscribe,

    // Set the athletes data
    setAthletes: (athletes) => set(athletes),

    // Add an athlete to the store
    addAthlete: (athleteData) => {
      update((athletes) => {
        if (athletes.some((a) => a.id === athleteData.id)) {
          // Athlete already exists, do not add again
          return athletes;
        }
        const color = getNextColor();
        return [...athletes, {...athleteData, color, isLoading: false, visible: true, records: []}];
      });
    },

    // Remove an athlete from the store
    removeAthlete: (athleteId) => {
      update((athletes) => {
        const athlete = athletes.find((a) => a.id === athleteId);
        if (athlete) {
          releaseColor(athlete.color);
        }
        return athletes.filter((a) => a.id !== athleteId);
      });
    },

    // Update an athlete's data
    setLoading: (athleteId, isLoading) => {
      update((athletes) => athletes.map((a) => (a.id === athleteId ? {...a, isLoading} : a)));
    },

    // Update an athlete's records
    setRecords: (athleteId, records) => {
      update((athletes) => athletes.map((a) => (a.id === athleteId ? {...a, records, isLoading: false} : a)));
    },

    setAllInvisible: () => {
      update((athletes) => athletes.map((a) => ({...a, visible: false})));
    },

    // Toggle the athlete's visibility
    toggleVisible: (athleteId) => {
      update((athletes) => athletes.map((a) => (a.id === athleteId ? {...a, visible: !a.visible} : a)));
    },

    isAthleteVisible: (athleteId) => {
      let isVisible = false;
      update((athletes) => {
        const found = athletes.find((a) => a.id === athleteId);
        if (found) {
          isVisible = found.visible;
        }
        return athletes; // Return without making changes
      });
      return isVisible;
    },

    // Reset the store
    reset: () => {
      colorUsage.fill(false);
      set([]);
    },
  };
}

// Create the athlete store
export const selectedAthletes = createAthleteStore();
