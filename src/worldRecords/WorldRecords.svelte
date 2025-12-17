<script>
  import {onMount} from 'svelte';
  import {showWorldRecords, worldRecords, isLoadingRecords} from './worldRecordsStore.js';
  import {setupStore} from '../utils/storeUtils.js';

  /**
   * Fetches the world records from the API and updates the worldRecords store.
   */
  async function fetchWorldRecords() {
    isLoadingRecords.set(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_world_records`);
      if (response.ok) {
        worldRecords.set(await response.json());
      } else {
        console.error('Error retrieving world records');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      isLoadingRecords.set(false);
    }
  }

  $: if ($showWorldRecords) {
    fetchWorldRecords();
  }

  onMount(() => {
    const unsubscribeShowWorldRecords = setupStore(showWorldRecords, 'showWorldRecords', false);

    return () => {
      unsubscribeShowWorldRecords();
    };
  });
</script>

<div class="world-records">
  <label class="switch">
    <input id="wr-switch" type="checkbox" bind:checked={$showWorldRecords} />
    <span class="slider round"></span>
  </label>
  <label class="switch-label" for="wr-switch">WORLD RECORDS</label>
  <span class="record-indicator men" title="Men's World Record">M</span>
  <span class="record-indicator women" title="Women's World Record">W</span>
  {#if $isLoadingRecords}
    <div class="spinner"></div>
  {/if}
</div>

<style>
  .world-records {
    align-items: center;
    margin-bottom: 1rem;
  }

  .switch-label {
    margin-left: 2.1rem;
  }

  .record-indicator {
    width: 20px;
    height: 20px;
    display: inline-block;
    line-height: 20px;
    color: #fff;
    text-align: center;
    margin-left: 5px;
  }

  .men {
    background-color: gold;
    color: #1565c0;
  }

  .women {
    background-color: gold;
    color: #ec407a;
  }
</style>
