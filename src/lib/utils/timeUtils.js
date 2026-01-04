/**
 * Converts a time value in seconds to a human-readable format.
 * Optionally includes centiseconds in the output.
 *
 * @param {number} seconds - The time value in seconds to be formatted.
 * @param {boolean} [withCentiseconds=false] - Determines whether to include centiseconds in the output.
 * @return {string} A string representing the formatted time.
 *                   Format: "hh'h'mm'mm'ss'ss'", with optional centiseconds as "cc" at the end.
 */
export function formatTime(seconds, withCentiseconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const fullSeconds = Math.floor(seconds % 60);
  const centiseconds = Math.floor((seconds - Math.floor(seconds)) * 100);

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}h`;
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += `${hours > 0 ? minutes.toString().padStart(2, '0') : minutes}'`;
  }
  formattedTime += `${fullSeconds.toString().padStart(2, '0')}"`;

  if (withCentiseconds) {
    formattedTime += `${centiseconds.toString().padStart(2, '0')}`;
  }

  return formattedTime;
}

/**
 * Converts a pace value from seconds per kilometer to a minutes/kilometer format.
 *
 * @param {number} secondsPerKm - The pace value in seconds per kilometer.
 * @return {string} A string representing the pace in minutes and seconds per kilometer.
 *                   Format: "mm'mm'ss'ss''".
 */
export function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = secondsPerKm % 60;
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

/**
 * Formats a speed value to a fixed decimal format.
 *
 * @param {number} speed - The speed value to be formatted.
 * @return {string} A string representing the formatted speed value, rounded to two decimal places.
 */
export function formatSpeed(speed) {
  return speed.toFixed(2);
}
