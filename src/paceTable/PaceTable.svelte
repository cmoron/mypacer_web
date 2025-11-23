<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { formatPace, formatSpeed, formatTime } from '../utils/timeUtils.js';
  import { setupStore } from '../utils/storeUtils.js';
  import {
    DEFAULT_INCREMENT,
    DEFAULT_MIN_PACE,
    DEFAULT_MAX_PACE,
    DEFAULT_VMA,
  } from '../utils/constants.js';

  import {
    selectedMinPace,
    selectedMaxPace,
    selectedIncrement,
    distances,
    addDistance,
    removeDistance,
    DEFAULT_DISTANCES,
  } from './paceTableStore.js';

  import { showWorldRecords, worldRecords, isLoadingRecords } from '../worldRecords/worldRecordsStore.js';
  import { selectedAthletes } from '../athletes/athletesStore.js';
  import AthleteSearch from '../athletes/AthleteSearch.svelte';
  import { showVMA, selectedVMA } from './vmaStore.js';

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
    // Prevent concurrent API calls
    if (isLoading) {
      console.log('Skipping fetch: already loading');
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate_table`, {
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
   * Checks if a given time for a distance is a men's world record.
   * @param {string} distance - The distance for which to check the record.
   * @param {number} time - The time achieved for the distance.
   * @return {boolean} - True if the time is a world record for men; otherwise, false.
   */
  function isMenWR(distance, time) {
    if ($isLoadingRecords) return false;
    const record = $worldRecords['men'][distance];
    return isWR(distance, time, record);
  }

  /**
   * Checks if a given time for a distance is a women's world record.
   * @param {string} distance - The distance for which to check the record.
   * @param {number} time - The time achieved for the distance.
   * @return {boolean} - True if the time is a world record for women; otherwise, false.
   */
  function isWomenWR(distance, time) {
    if ($isLoadingRecords) return false;
    const record = $worldRecords['women'][distance];
    return isWR(distance, time, record);
  }

  /**
   * General function to check if a time is a world record.
   * @param {string} distance - The distance for which to check the record.
   * @param {number} time - The time achieved.
   * @param {number} record - The current world record time for the distance.
   * @return {boolean} - True if the time is a world record; otherwise, false.
   */
  function isWR(distance, time, record) {
    if (!record) return false;
    const timeDiff = Number(distance) * Number($selectedIncrement) / 1000;
    const prevTime = time + timeDiff;
    const nextTime = time - timeDiff;
    return Math.abs(time - record) < Math.abs(prevTime - record) &&
      Math.abs(time - record) < Math.abs(nextTime - record);
  }

  /**
  * Returns the color of the athlete record for a given cell in the table.
  * @param {string} distance - The distance for which to check the record.
  * @param {number} time - The time achieved for the distance.
  * @return {string} - The color of the athlete record, or an empty string if none.
  */
  function getAthleteRecordColor(distance, time) {
    const timeDiff = Number(distance) * Number($selectedIncrement) / 1000;
    const prevTime = time + timeDiff;
    const nextTime = time - timeDiff;
    const athleteColors = [];

    for (const athlete of athletes) {
      const record = athlete.records[distance];
      if (Math.abs(time - record) < Math.abs(prevTime - record) &&
        Math.abs(time - record) <= Math.abs(nextTime - record)) {
        athleteColors.push(athlete.color);
      }
    }

    if (athleteColors.length > 1) {
      const gradient = athleteColors.map((color, index) =>
        `${color} ${index * 100 / athleteColors.length}%, ${color} ${(index + 1) * 100 / athleteColors.length}%`).join(', ');
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

  $: if (!$isLoadingRecords && paceData.length > 0) {
    paceData = paceData.map((row) => ({...row}));
  }

  $: if ($selectedMinPace && $selectedMaxPace && $selectedIncrement) {
    if ($selectedMinPace < $selectedMaxPace) {
      errorMessage = 'L\'allure minimale ne peut pas être supérieure à l\'allure maximale.';
      $selectedMinPace = prevSelectedMinPace;
      $selectedMaxPace = prevSelectedMaxPace;
    } else {
      errorMessage = '';
      prevSelectedMinPace = $selectedMinPace;
      prevSelectedMaxPace = $selectedMaxPace;
      debouncedFetchPaceData();
    }
  }

  $: $distances, debouncedFetchPaceData();
</script>

<div class="top-container">

  <!-- Athlete search component -->
  <AthleteSearch />

  <!-- World records component -->
  <!--<WorldRecords />-->

  <!-- Form to select pace range and increment -->
  <form>
    <div>
      <label for="min-pace">Min.</label>
      <select id="min-pace" class="material-select" bind:value={$selectedMinPace}>
        {#each paceRange as pace}/km
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

  <!-- Ajout distance personnalisée -->
  <div class="custom-dist">
    <!--<label for="custom-dist">+ Dist (m)</label>-->
    <div class="custom-dist">
      <input
        type="number"
        placeholder="Ajouter distance (m)"
        bind:value={newDistance}
        min="1"
        on:keydown={(e) => e.key === 'Enter' && handleAddDistance()}
      />

      <button
        type="button"
        class="add-btn"
        aria-label="Ajouter une distance"
        on:click={handleAddDistance}
      >+</button>
    </div>
  </div>

  <div class="vma-selector">
    <label class="switch">
      <input id="vma-switch" type="checkbox" bind:checked={$showVMA}>
      <span class="slider round"></span>
    </label>
    <label class="vma-switch-label" for="vma-switch">VMA</label>
    {#if $showVMA}
      <select bind:value={$selectedVMA}>
        {#each vmaRange as vma}
          <option value={vma}>{vma.toFixed(1)} km/h</option>
        {/each}
      </select>
    {/if}
  </div>

  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}

</div>

<!-- Table markup to display pace data -->
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
          <th on:click={() => handleHighlight(event, column, null)}>
              {distanceDisplayNames[column] || column}
              {#if !DEFAULT_DISTANCES.includes(column)}
                <span class="delete-btn" role="button" tabindex="0"
                  aria-label="Supprimer"
                  on:click={(e)=> {
                    e.stopPropagation();
                    console.log('removeDistance', column);
                    console.log(DEFAULT_DISTANCES, column, DEFAULT_DISTANCES.includes(column) );
                    removeDistance(column);
                  }}
                  on:keydown={(e)=>e.key==='Enter' && removeDistance(column)}
                >X</span>
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
          <td class:highlighted={highlighted.row === row}>{Math.round(100 * row.speed / $selectedVMA)}%</td>
        {/if}
        <td class:highlighted={highlighted.row === row} class="col-head">{formatPace(row.pace)}</td>
        <td class:highlighted={highlighted.row === row} class="col-head">{formatSpeed(row.speed)}</td>
        {#each columns as column, columnIndex}
          <td on:click={(event) => handleHighlight(event, column, row)}
              class:highlighted={highlighted.column === column || highlighted.row === row}
              class:men-record={$showWorldRecords && isMenWR(column, row[column])}
              class:women-record={$showWorldRecords && isWomenWR(column, row[column])}
              style="{getAthleteRecordColor(column, row[column])}">
              {formatTime(row[column], column < 800)}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<div class="contact"><a href="mailto:contact@mypacer.fr">contact@mypacer.fr</a></div>

<style>
  form {
    margin-bottom: 10px;
  }

  label.vma-switch-label {
    width: 30px !important;
    margin-left: 2.1rem;
  }

  label {
    display: inline-block;
    width: 100px;
    margin-bottom: 5px;
  }

  select {
    display: inline-block;
    width: 120px;
    margin-bottom: 5px;
  }

  table{
    border-collapse: collapse;
  }

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    background-color: #03A9F4;
    color: #fff;
    cursor: pointer;
    padding: 3px;
  }

  td {
    text-align: center;
    margin: 0px;
    padding-left: 5px;
    padding-right: 5px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
    z-index: -2;
  }

  tr:hover {
    background-color: #B3E5FC;
  }

  .highlighted {
    background-color: #B3E5FC;
  }

  .col-head {
    font-weight: bold;
  }

  td {
    text-align: center;
    margin: 0px;
    padding-left: 5px;
    padding-right: 5px;
    box-sizing: border-box;
  }

  .men-record {
    background-color: gold;
    color: #1565C0;
  }

  .women-record {
    background-color: gold;
    color: #EC407A;
  }

  .error {
    color: red;
  }

  .contact {
    margin-top: 1rem;
  }

  .custom-dist {
    display: flex;
    align-items: center;
    gap: .4rem;
    margin: .5rem 0 .5rem;
  }

  .custom-dist input {
    padding: 0.5rem;
  }

  .add-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: #03A9F4;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background .2s;
  }

  .add-btn:hover,
  .add-btn:focus-visible {
    background: #0288D1;          /* bleu 600 – plus sombre */
    outline: none;
  }

  .delete-btn {
      cursor:pointer;
      font-weight:bold;
      color:#ffebee
  }

  .delete-btn:hover {
      color:#b71c1c
  }
</style>
