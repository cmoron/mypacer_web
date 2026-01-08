<script>
  import {onMount} from 'svelte';
  import {writable} from 'svelte/store';
  import {debounce} from 'lodash-es';
  import {API_URL} from '$lib/config.js';
  import {selectedAthletes} from '$lib/stores/athletesStore.js';
  import {flagIso3ToIso2} from '$lib/utils/flagsUtils.js';
  import '/node_modules/flag-icons/css/flag-icons.min.css';

  const athleteSuggestions = writable([]);
  const isLoading = {};
  const databaseStatus = writable({numAthletes: 0, lastUpdate: ''});
  let activeSearchCount = 0;
  let isSearching = false;
  let inputElement;
  let searchQuery = '';
  let controller;

  /**
   * Fetches athlete records from the API and logs the data to the console.
   * @param {Object} athlete - The athlete object to fetch records for.
   */
  async function fetchAthleteRecords(athlete) {
    isLoading[athlete.id] = true;
    try {
      const response = await fetch(`${API_URL}/get_athlete_records?ident=${encodeURIComponent(athlete.id)}`);
      if (response.ok) {
        return response.json();
      } else {
        console.error('Failed to fetch athlete records');
      }
    } catch (error) {
      console.error('Error fetching athlete records:', error);
    } finally {
      // set isLoading a false pour cet athlete
      isLoading[athlete.id] = false;
    }
  }

  /**
   * Fetches the database status from the API and updates the local state.
   */
  async function fetchDatabaseStatus() {
    try {
      const response = await fetch(`${API_URL}/database_status`);
      if (response.ok) {
        const data = await response.json();
        if (data.last_update) {
          data.last_update = new Date(data.last_update).toLocaleString();
        }
        if (data.num_athletes) {
          data.num_athletes = new Intl.NumberFormat().format(data.num_athletes);
        }
        databaseStatus.set(data);
      } else {
        console.error('Failed to fetch database status');
      }
    } catch (error) {
      console.error('Error fetching database status:', error);
    }
  }

  /**
   * Toggles the visibility of athlete records in the UI and fetches the records if visible.
   * @param {Object} athlete - The athlete object to toggle records for.
   */
  function toggleAthleteRecords(athlete) {
    selectedAthletes.toggleVisible(athlete.id);
    if (selectedAthletes.isAthleteVisible(athlete.id)) {
      selectedAthletes.setLoading(athlete.id, true);
      fetchAthleteRecords(athlete)
        .then((records) => {
          selectedAthletes.setRecords(athlete.id, records);
        })
        .catch((error) => {
          console.error('Error fetching athlete records:', error);
          selectedAthletes.setLoading(athlete.id, false);
        });
    }
  }

  /**
   * Checks if athlete records are currently loading.
   * @param {string} athleteId - The ID of the athlete to check loading state for.
   * @return {boolean} - True if records are loading, false otherwise.
   */
  function isLoadingRecords(athleteId) {
    return isLoading[athleteId] || false;
  }

  /**
   * Debounced function to fetch athlete data from the API based on the user's query.
   * It only triggers the API request if the query length is 2 or more characters to reduce unnecessary requests.
   * @param {string} query - The search text input by the user to find athletes.
   */
  const fetchAthletes = debounce(async (query) => {
    if (query.length < 3) {
      athleteSuggestions.set([]);
      return;
    }

    if (controller) {
      controller.abort();
    }

    controller = new AbortController();
    const signal = controller.signal;

    isSearching = true;
    activeSearchCount++;

    try {
      const response = await fetch(`${API_URL}/get_athletes_from_db?name=${encodeURIComponent(query)}`, {signal});
      if (response.ok) {
        const data = await response.json();
        athleteSuggestions.set(data);
      } else {
        console.error('Failed to fetch athlete data');
        athleteSuggestions.set([]);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Ignore abort errors as they are intentional
        console.debug('Fetch aborted:', query);
      } else {
        console.error('Error fetching athlete data:', error);
        athleteSuggestions.set([]);
      }
    } finally {
      activeSearchCount--;
      if (activeSearchCount === 0) {
        isSearching = false;
      }
    }
  }, 200); // Delay in milliseconds

  /**
   * Selects an athlete from the suggestions list and adds them to the selected athletes list.
   * @param {Object} athlete - The athlete object to add to the selected athletes list.
   */
  function selectAthlete(athlete) {
    searchQuery = '';
    selectedAthletes.addAthlete(athlete);
    fetchAthleteRecords(athlete)
      .then((records) => {
        selectedAthletes.setRecords(athlete.id, records);
      })
      .catch((error) => {
        console.error('Error fetching athlete records:', error);
      });
    athleteSuggestions.set([]);
  }

  /**
   * Deletes an athlete from the selected athletes list.
   * @param {Object} athlete - The athlete object to delete.
   */
  function deleteAthlete(athlete) {
    selectedAthletes.removeAthlete(athlete.id);
  }

  /**
   * Closes the suggestions list if a click event occurs outside the search input element.
   * This provides a way for users to dismiss the suggestions by clicking outside the input area.
   * @param {MouseEvent} event - The click event triggered outside the search input.
   */
  function handleClickOutside(event) {
    if (inputElement && !inputElement.contains(event.target)) {
      athleteSuggestions.set([]);
    }
  }

  /**
   * Handles the focus event on the search input to trigger a search if the query length is 3 or more characters.
   */
  function handleFocus() {
    if (searchQuery.length >= 3) {
      fetchAthletes(searchQuery);
    }
  }

  onMount(() => {
    fetchDatabaseStatus();

    const storedAthletes = localStorage.getItem('selectedAthletes');
    if (storedAthletes) {
      selectedAthletes.setAthletes(JSON.parse(storedAthletes));
    }

    selectedAthletes.subscribe(($selectedAthletes) => {
      localStorage.setItem('selectedAthletes', JSON.stringify($selectedAthletes));
    });

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="athlete-search">
  <div class="search-box">
    <input
      type="text"
      class="search-input"
      bind:value={searchQuery}
      on:focus={handleFocus}
      on:input={() => fetchAthletes(searchQuery)}
      placeholder="Rechercher un athlète..."
      bind:this={inputElement}
    />
    <i class="fas fa-search search-icon"></i>
  </div>
  {#if $databaseStatus.num_athletes}
    <div class="database-status">
      {$databaseStatus.num_athletes} athlètes de <a href="https://bases.athle.fr">bases.athle.fr</a>
    </div>
  {/if}

  {#if $athleteSuggestions.length || isSearching}
    <ul class="suggestions">
      {#if isSearching}
        <div class="progress-bar"></div>
      {/if}
      {#each $athleteSuggestions as athlete}
        <li>
          <button on:click={() => selectAthlete(athlete)} class="suggestion-btn">
            <span class="fi fi-{flagIso3ToIso2(athlete.nationality).toLowerCase()}"></span>
            {athlete.name} - {athlete.birth_date || ''}
            {#if athlete.sexe}
              <i class={`fa ${athlete.sexe === 'M' ? 'fa-mars' : 'fa-venus'}`}></i>
            {/if}
            {#if athlete.license_id}
              <i class="license">{athlete.license_id}</i>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#each $selectedAthletes as athlete}
    <div class="selected-athlete">
      <label class="switch">
        <input
          id="athlete-switch-{athlete.id}"
          type="checkbox"
          checked={athlete.visible}
          on:change={() => toggleAthleteRecords(athlete)}
        />
        <span class="slider round"></span>
      </label>
      <button on:click={() => deleteAthlete(athlete)} class="delete-athlete-btn">x</button>
      <span class="color-indicator" style="background-color: {athlete.color};"></span>
      <a href={athlete.url} target="_blank" rel="noopener noreferrer">
        {athlete.name}
      </a>
      <span>
        {#if athlete.sexe}
          <i class={`fa ${athlete.sexe === 'M' ? 'fa-mars' : 'fa-venus'}`}></i>
        {/if}
        <i class="fas fa-external-link-alt"></i>
      </span>
      {#if isLoadingRecords(athlete.id)}
        <div class="spinner"></div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .athlete-search {
    position: relative;
    width: 100%;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-input {
    width: 100%;
    padding: 14px var(--spacing-md);
    padding-left: var(--spacing-2xl);
    font-size: var(--font-size-base);
    border: var(--border-width) solid var(--color-neutral-300);
    border-radius: var(--border-radius-lg);
    transition: all var(--transition-base);
    background-color: white;
  }

  .search-input:hover {
    border-color: var(--color-neutral-400);
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.1);
  }

  .search-input:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    outline: none;
  }

  .search-icon {
    position: absolute;
    left: var(--spacing-md);
    color: var(--color-neutral-400);
    transition: color var(--transition-base);
    pointer-events: none;
  }

  .search-input:focus + .search-icon {
    color: var(--color-primary-500);
  }

  .suggestions {
    position: absolute;
    list-style: none;
    margin-top: var(--spacing-xs);
    padding: var(--spacing-md);
    background: white;
    width: 100%;
    max-width: 100%;
    min-height: 32px;
    border: var(--border-width) solid var(--color-neutral-200);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 100;
  }

  @media (min-width: 640px) {
    .suggestions {
      max-width: 75%;
    }
  }

  @media (min-width: 768px) {
    .suggestions {
      max-width: 600px;
    }
  }

  .suggestions .fi {
    margin-right: var(--spacing-sm);
    vertical-align: top;
  }

  .suggestions .license {
    color: var(--color-neutral-400);
  }

  .progress-bar {
    position: absolute;
    height: 3px;
    background-color: var(--color-primary-500);
    width: 0%;
    top: 0;
    left: 0;
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
    animation: loadProgress 2s infinite;
  }

  @keyframes loadProgress {
    0% {
      width: 0%;
    }
    50% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }

  .suggestion-btn {
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-fast);
    font-size: var(--font-size-sm);
  }

  .suggestion-btn:hover {
    background-color: var(--color-neutral-100);
  }

  .suggestion-btn:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  .fa-mars {
    color: var(--color-male);
  }

  .fa-venus {
    color: var(--color-female);
  }

  .selected-athlete {
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-base);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background-color: white;
    border-radius: var(--border-radius-md);
    border: var(--border-width) solid var(--color-neutral-200);
  }

  .delete-athlete-btn {
    background: none;
    border: none;
    color: var(--color-secondary-500);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-sm);
    transition: all var(--transition-fast);
    min-width: 24px;
    min-height: 24px;
  }

  .delete-athlete-btn:hover {
    background-color: var(--color-secondary-500);
    color: white;
  }

  .delete-athlete-btn:focus {
    outline: 2px solid var(--color-secondary-500);
    outline-offset: 2px;
  }

  .color-indicator {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: var(--border-radius-sm);
    flex-shrink: 0;
  }

  .database-status {
    font-size: var(--font-size-xs);
    color: var(--color-neutral-500);
    margin-bottom: var(--spacing-md);
    font-style: italic;
  }

  .database-status a {
    font-size: var(--font-size-xs);
    color: var(--color-primary-500);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .database-status a:hover {
    color: var(--color-primary-700);
    text-decoration: underline;
  }
</style>
