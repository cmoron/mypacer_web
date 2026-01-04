// Constants for the running pace table.
export const DEFAULT_MIN_PACE = 360; // 6'00"/km
export const DEFAULT_MAX_PACE = 120; // 2'00"/km
export const DEFAULT_INCREMENT = 1; // 1 second per km
export const DEFAULT_VMA = 16; // 16 km/h

// Immutable core distances (metres)
export const DEFAULT_DISTANCES = [
  100, 200, 300, 400, 500, 600, 800, 1000, 1500, 1609.34, 3000, 5000, 10000, 20000, 21097, 42195,
];

// Sanity cap for user input (metres)
export const MAX_CUSTOM_DISTANCE = 100000;
