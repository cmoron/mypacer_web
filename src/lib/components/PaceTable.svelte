<script>
  import {onMount} from 'svelte';
  import {browser} from '$app/environment';
  import {API_URL} from '$lib/config.js';

  import {formatPace, formatSpeed, formatTime} from '$lib/utils/timeUtils.js';
  import {setupStore} from '$lib/utils/storeUtils.js';
  import {DEFAULT_INCREMENT, DEFAULT_MIN_PACE, DEFAULT_MAX_PACE, DEFAULT_VMA} from '$lib/utils/constants.js';

  import {
    selectedMinPace,
    selectedMaxPace,
    selectedIncrement,
    distances,
    addDistance,
    removeDistance,
    DEFAULT_DISTANCES,
  } from '$lib/stores/paceTableStore.js';

  import {selectedAthletes} from '$lib/stores/athletesStore.js';
  import AthleteSearch from '$lib/components/AthleteSearch.svelte';
  import {showVMA, selectedVMA} from '$lib/stores/vmaStore.js';

  // State variables for storing pace data and table columns
  let paceData = [];
  let columns = [];
  let athletes = [];
  let errorMessage = '';
  let prevSelectedMinPace = DEFAULT_MIN_PACE;
  let prevSelectedMaxPace = DEFAULT_MAX_PACE;
  const vmaRange = Array.from({length: 41}, (_, i) => 10 + i * 0.5);

  // Loading state to prevent concurrent API calls
  let isLoading = false;
  let fetchTimeout = null;

  // Mapping of numeric distances to human-readable names
  const distanceDisplayNames = {
    '1609.34': 'Mile',
    '5000': '5km',
    '10000': '10km',
    '20000': '20km',
    '21097': 'Semi M.',
    '42195': 'Marathon',
  };

  // Predefined ranges for pacing and increments
  const paceRange = [90, 120, 180, 240, 300, 360, 420, 480, 540, 600].reverse();
  const incrementRange = [1, 2, 5, 10, 15, 20, 30];

  // Object to keep track of highlighted table cells
  const highlighted = {
    column: null,
    row: null,
  };

  /**
   * Prevents event propagation and updates highlighted state for table cells.
   * @param {Event} event - The DOM event object.
   * @param {string} column - The column identifier to highlight.
   * @param {Object} row - The row data object to highlight.
   */
  function handleHighlight(event, column, row) {
    event.stopPropagation();

    if (column !== null && column !== undefined) {
      highlighted.column = column === highlighted.column ? null : column;
    }

    if (row !== null && row !== undefined) {
      highlighted.row = row === highlighted.row ? null : row;
    }
  }

  /**
   * Fetches pace data from an API endpoint and updates local state.
   * Includes loading flag to prevent concurrent calls.
   */
  async function fetchPaceData() {
    // Only fetch on client side
    if (!browser) return;

    // Prevent concurrent API calls
    if (isLoading) {
      console.log('Skipping fetch: already loading');
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(`${API_URL}/generate_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          min_pace: $selectedMinPace,
          max_pace: $selectedMaxPace,
          increment: $selectedIncrement,
          distances: $distances,
        }),
      });

      if (response.ok) {
        paceData = await response.json();
        if (paceData.length > 0) {
          columns = Object.keys(paceData[0])
            .filter((key) => key !== 'pace' && key != 'speed')
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(Number)
            .sort((a, b) => a - b);
        }
      } else {
        console.error('Error fetching data from the API');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      isLoading = false;
    }
  }

  /**
   * Debounced version of fetchPaceData to avoid multiple simultaneous calls.
   * Waits 150ms after the last change before making the API call.
   */
  function debouncedFetchPaceData() {
    // Clear any pending fetch
    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }

    // Schedule new fetch after 150ms of inactivity
    fetchTimeout = setTimeout(() => {
      fetchPaceData();
    }, 150);
  }

  /**
   * Returns the color of the athlete record for a given cell in the table.
   * @param {string} distance - The distance for which to check the record.
   * @param {number} time - The time achieved for the distance.
   * @return {string} - The color of the athlete record, or an empty string if none.
   */
  function getAthleteRecordColor(distance, time) {
    const timeDiff = (Number(distance) * Number($selectedIncrement)) / 1000;
    const prevTime = time + timeDiff;
    const nextTime = time - timeDiff;
    const athleteColors = [];

    for (const athlete of athletes) {
      const record = athlete.records[distance];
      if (
        Math.abs(time - record) < Math.abs(prevTime - record) &&
        Math.abs(time - record) <= Math.abs(nextTime - record)
      ) {
        athleteColors.push(athlete.color);
      }
    }

    if (athleteColors.length > 1) {
      const gradient = athleteColors
        .map(
          (color, index) =>
            `${color} ${(index * 100) / athleteColors.length}%, ${color} ${((index + 1) * 100) / athleteColors.length}%`
        )
        .join(', ');
      return `background: linear-gradient(to right, ${gradient}); color: #fff;`;
    } else if (athleteColors.length === 1) {
      return `background-color: ${athleteColors[0]}; color: #fff;`;
    } else {
      return '';
    }
  }

  let newDistance = '';

  function handleAddDistance() {
    addDistance(newDistance);
    newDistance = '';
  }

  // Fetch initial data when component mounts
  onMount(() => {
    const unsubscribeMinPace = setupStore(selectedMinPace, 'selectedMinPace', DEFAULT_MIN_PACE);
    const unsubscribeMaxPace = setupStore(selectedMaxPace, 'selectedMaxPace', DEFAULT_MAX_PACE);
    const unsubscribeIncrement = setupStore(selectedIncrement, 'selectedIncrement', DEFAULT_INCREMENT);
    const unsubscribeShowVMA = setupStore(showVMA, 'showVMA', false);
    const unscubscribeSelectedVMA = setupStore(selectedVMA, 'selectedVMA', DEFAULT_VMA);

    return () => {
      unsubscribeMinPace();
      unsubscribeMaxPace();
      unsubscribeIncrement();
      unsubscribeShowVMA();
      unscubscribeSelectedVMA();
    };
  });

  $: if ($selectedAthletes) {
    athletes = $selectedAthletes.filter((a) => a.visible);
    debouncedFetchPaceData();
  }

  $: if ($selectedMinPace && $selectedMaxPace && $selectedIncrement) {
    if ($selectedMinPace < $selectedMaxPace) {
      errorMessage = "L'allure minimale ne peut pas être supérieure à l'allure maximale.";
      $selectedMinPace = prevSelectedMinPace;
      $selectedMaxPace = prevSelectedMaxPace;
    } else {
      errorMessage = '';
      prevSelectedMinPace = $selectedMinPace;
      prevSelectedMaxPace = $selectedMaxPace;
      debouncedFetchPaceData();
    }
  }

  $: ($distances, debouncedFetchPaceData());
</script>

<div class="top-container">
  <div class="top-row">
    <!-- Athlete search - Left side -->
    <div class="athlete-search-wrapper">
      <AthleteSearch />
    </div>

    <!-- Form Min/Max/Increment - Right side -->
    <div class="pace-controls">
      <form>
        <div>
          <label for="min-pace">Min.</label>
          <select id="min-pace" class="material-select" bind:value={$selectedMinPace}>
            {#each paceRange as pace}
              <option value={pace}>{formatPace(pace)} / km</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="max-pace">Max.</label>
          <select id="max-pace" class="material-select" bind:value={$selectedMaxPace}>
            {#each paceRange as pace}
              <option value={pace}>{formatPace(pace)} / km</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="increment">Incrément.</label>
          <select id="increment" class="material-select" bind:value={$selectedIncrement}>
            {#each incrementRange as increment}
              <option value={increment}>{increment}"</option>
            {/each}
          </select>
        </div>
      </form>
    </div>
  </div>

  <!-- Bottom row: custom distance and VMA -->
  <div class="bottom-row">
    <!-- Ajout distance personnalisée -->
    <div class="custom-dist">
      <input
        type="number"
        placeholder="Ajouter distance (m)"
        bind:value={newDistance}
        min="1"
        on:keydown={(e) => e.key === 'Enter' && handleAddDistance()}
      />
      <button type="button" class="add-btn" aria-label="Ajouter une distance" on:click={handleAddDistance}>+</button>
    </div>

    <div class="vma-selector">
      <label class="switch">
        <input id="vma-switch" type="checkbox" bind:checked={$showVMA} />
        <span class="switch slider round"></span>
      </label>
      <label class="vma-switch-label" for="vma-switch">VMA</label>
      {#if $showVMA}
        <select class="vma-select" bind:value={$selectedVMA}>
          {#each vmaRange as vma}
            <option value={vma}>{vma.toFixed(1)} km/h</option>
          {/each}
        </select>
      {/if}
    </div>
  </div>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</div>

<!-- Table markup to display pace data -->
<div class="table-wrapper">
<table>
  <!-- Table header -->
  <thead>
    <tr>
      {#if $showVMA}
        <th>% VMA</th>
      {/if}
      <th>t/km</th>
      <th>km/h</th>
      {#each columns as column}
        <th on:click={(event) => handleHighlight(event, column, null)}>
          {distanceDisplayNames[String(column)] || column}
          {#if !DEFAULT_DISTANCES.includes(column)}
            <span
              class="delete-btn"
              role="button"
              tabindex="0"
              aria-label="Supprimer"
              on:click={(e) => {
                e.stopPropagation();
                console.log('removeDistance', column);
                console.log(DEFAULT_DISTANCES, column, DEFAULT_DISTANCES.includes(column));
                removeDistance(column);
              }}
              on:keydown={(e) => e.key === 'Enter' && removeDistance(column)}>X</span
            >
          {/if}
        </th>
      {/each}
    </tr>
  </thead>
  <!-- Table body -->
  <tbody>
    {#each paceData as row, rowIndex}
      <tr on:click={(event) => handleHighlight(event, null, row)}>
        {#if $showVMA}
          <td class:highlighted={highlighted.row === row}>{Math.round((100 * row.speed) / $selectedVMA)}%</td>
        {/if}
        <td class:highlighted={highlighted.row === row} class="col-head">{formatPace(row.pace)}</td>
        <td class:highlighted={highlighted.row === row} class="col-head">{formatSpeed(row.speed)}</td>
        {#each columns as column, columnIndex}
          <td
            on:click={(event) => handleHighlight(event, column, row)}
            class:highlighted={highlighted.column === column || highlighted.row === row}
            style={getAthleteRecordColor(column, row[column])}
          >
            {formatTime(row[column], column < 800)}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
</div>

<style>
  .top-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .top-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
  }

  @media (min-width: 768px) {
    .top-row {
      flex-direction: row;
      gap: var(--spacing-lg);
    }
  }

  .pace-controls {
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 768px) {
    .pace-controls {
      flex: 0 0 calc(50% - var(--spacing-lg) / 2);
    }
  }

  .athlete-search-wrapper {
    flex: 1;
    min-width: 0;
  }

  @media (min-width: 768px) {
    .athlete-search-wrapper {
      flex: 0 0 calc(50% - var(--spacing-lg) / 2);
    }
  }

  .bottom-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
  }

  @media (min-width: 640px) {
    .bottom-row {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    width: 100%;
  }

  form > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-sm);
  }

  label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-neutral-700);
    min-width: 80px;
    flex-shrink: 0;
  }

  label.vma-switch-label {
    min-width: 30px !important;
    margin-left: var(--spacing-sm);
    flex-shrink: 0;
  }

  select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: var(--border-width) solid var(--color-neutral-300);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    background-color: white;
    cursor: pointer;
    transition: all var(--transition-base);
    flex: 1;
    min-width: 0;
  }

  select.vma-select {
    flex: 0 0 auto;
    width: 140px;
  }

  select:hover {
    border-color: var(--color-primary-400);
  }

  select:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
    outline: none;
  }

  .custom-dist {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
  }

  @media (min-width: 640px) {
    .custom-dist {
      /* width: auto; */
      /* flex: 0 0 auto; */
    }
  }

  .custom-dist input {
    padding: var(--spacing-sm) var(--spacing-md);
    border: var(--border-width) solid var(--color-neutral-300);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-sm);
    transition: all var(--transition-base);
  }

  .custom-dist input:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.1);
    outline: none;
  }

  .add-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: var(--border-radius-md);
    background: var(--color-primary-500);
    color: white;
    font-size: 1.4rem;
    font-weight: var(--font-weight-bold);
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background var(--transition-fast);
    flex-shrink: 0;
  }

  .add-btn:hover {
    background: var(--color-primary-600);
  }

  .add-btn:focus-visible {
    background: var(--color-primary-600);
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .vma-selector {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: auto;
    flex: 0 0 auto;
    min-height: var(--spacing-xxl);
  }

  .error {
    color: var(--color-secondary-500);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-sm);
    background-color: rgba(255, 107, 107, 0.1);
    border-radius: var(--border-radius-md);
    width: 100%;
  }

  /* Table styles - responsive */
  .table-wrapper {
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-lg);
  }

  @media (max-width: 767px) {
    .table-wrapper {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      max-height: 70vh;
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: var(--font-size-sm);
    background: white;
  }

  /* Arrondis sur les coins de la table */
  thead tr:first-child th:first-child {
    border-top-left-radius: var(--border-radius-lg);
  }

  thead tr:first-child th:last-child {
    border-top-right-radius: var(--border-radius-lg);
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: var(--border-radius-lg);
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: var(--border-radius-lg);
  }

  @media (min-width: 768px) {
    table {
      font-size: var(--font-size-base);
    }
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    background-color: var(--color-primary-500);
    color: white;
    font-weight: var(--font-weight-semibold);
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xs);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    white-space: nowrap;
    user-select: none;
  }

  @media (min-width: 768px) {
    th {
      padding: var(--spacing-sm) var(--spacing-sm);
    }
  }

  th:hover {
    background-color: var(--color-primary-600);
  }

  td {
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xs);
    border-bottom: var(--border-width) solid var(--color-neutral-200);
    transition: background-color var(--transition-fast);
  }

  @media (min-width: 768px) {
    td {
      padding: var(--spacing-sm) var(--spacing-sm);
    }
  }

  tr:nth-child(even) {
    background-color: var(--color-neutral-50);
  }

  tr:hover {
    background-color: var(--color-primary-100);
  }

  .highlighted {
    background-color: var(--color-primary-100);
  }

  .col-head {
    font-weight: var(--font-weight-bold);
  }

  .delete-btn {
    cursor: pointer;
    font-weight: var(--font-weight-bold);
    color: rgba(255, 255, 255, 0.7);
    margin-left: var(--spacing-xs);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
  }

  .delete-btn:hover {
    color: #b71c1c;
    background-color: rgba(255, 255, 255, 0.9);
  }
</style>
