import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape, d as each, n as null_to_empty, f as set_store_value, v as validate_component } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
import { debounce } from "lodash-es";
function formatTime(seconds, withCentiseconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const fullSeconds = Math.floor(seconds % 60);
  const centiseconds = Math.floor((seconds - Math.floor(seconds)) * 100);
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours}h`;
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += `${hours > 0 ? minutes.toString().padStart(2, "0") : minutes}'`;
  }
  formattedTime += `${fullSeconds.toString().padStart(2, "0")}"`;
  if (withCentiseconds) {
    formattedTime += `${centiseconds.toString().padStart(2, "0")}`;
  }
  return formattedTime;
}
function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = secondsPerKm % 60;
  return `${minutes}'${seconds.toString().padStart(2, "0")}"`;
}
function formatSpeed(speed) {
  return speed.toFixed(2);
}
const DEFAULT_MIN_PACE = 360;
const DEFAULT_MAX_PACE = 120;
const DEFAULT_INCREMENT = 1;
const DEFAULT_VMA = 16;
const DEFAULT_DISTANCES = [
  100,
  200,
  300,
  400,
  500,
  600,
  800,
  1e3,
  1500,
  1609.34,
  3e3,
  5e3,
  1e4,
  2e4,
  21097,
  42195
];
const selectedMinPace = writable(DEFAULT_MIN_PACE);
const selectedMaxPace = writable(DEFAULT_MAX_PACE);
const selectedIncrement = writable(DEFAULT_INCREMENT);
function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem("customDistances") ?? "[]");
  } catch {
    return [];
  }
}
function saveCustom(customList) {
  localStorage.setItem("customDistances", JSON.stringify(customList));
}
function persist(fullList) {
  saveCustom(fullList.filter((d) => !DEFAULT_DISTANCES.includes(d)));
}
const distances = writable([...DEFAULT_DISTANCES, ...loadCustom()].sort((a, b) => a - b));
distances.subscribe(persist);
const showWorldRecords = writable(false);
const worldRecords = writable({ men: {}, women: {} });
const isLoadingRecords = writable(false);
const colorPool = [
  "#03A9F4",
  "#F44336",
  "#9C27B0",
  "#607D8B",
  "#E91E63",
  "#3F51B5",
  "#795548",
  "#009688",
  "#00BCD4",
  "#4CAF50"
];
const storedColorUsage = JSON.parse(localStorage.getItem("colorUsage"));
const colorUsage = storedColorUsage || new Array(colorPool.length).fill(false);
function getNextColor() {
  let index = colorUsage.indexOf(false);
  if (index === -1) {
    colorUsage.fill(false);
    index = 0;
  }
  colorUsage[index] = true;
  localStorage.setItem("colorUsage", JSON.stringify(colorUsage));
  return colorPool[index];
}
function releaseColor(color) {
  const index = colorPool.indexOf(color);
  if (index !== -1) {
    colorUsage[index] = false;
    localStorage.setItem("colorUsage", JSON.stringify(colorUsage));
  }
}
function createAthleteStore() {
  const { subscribe: subscribe2, set, update } = writable([]);
  return {
    // Subscribe to the athletes data
    subscribe: subscribe2,
    // Set the athletes data
    setAthletes: (athletes) => set(athletes),
    // Add an athlete to the store
    addAthlete: (athleteData) => {
      update((athletes) => {
        if (athletes.some((a) => a.id === athleteData.id)) {
          return athletes;
        }
        const color = getNextColor();
        return [...athletes, { ...athleteData, color, isLoading: false, visible: true, records: [] }];
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
      update((athletes) => athletes.map((a) => a.id === athleteId ? { ...a, isLoading } : a));
    },
    // Update an athlete's records
    setRecords: (athleteId, records) => {
      update((athletes) => athletes.map((a) => a.id === athleteId ? { ...a, records, isLoading: false } : a));
    },
    setAllInvisible: () => {
      update((athletes) => athletes.map((a) => ({ ...a, visible: false })));
    },
    // Toggle the athlete's visibility
    toggleVisible: (athleteId) => {
      update((athletes) => athletes.map((a) => a.id === athleteId ? { ...a, visible: !a.visible } : a));
    },
    isAthleteVisible: (athleteId) => {
      let isVisible = false;
      update((athletes) => {
        const found = athletes.find((a) => a.id === athleteId);
        if (found) {
          isVisible = found.visible;
        }
        return athletes;
      });
      return isVisible;
    },
    // Reset the store
    reset: () => {
      colorUsage.fill(false);
      set([]);
    }
  };
}
const selectedAthletes = createAthleteStore();
const mapping = {
  AFG: "AF",
  ALA: "AX",
  ALB: "AL",
  DZA: "DZ",
  ASM: "AS",
  AND: "AD",
  AGO: "AO",
  AIA: "AI",
  ATA: "AQ",
  ATG: "AG",
  ARG: "AR",
  ARM: "AM",
  ABW: "AW",
  AUS: "AU",
  AUT: "AT",
  AZE: "AZ",
  BHS: "BS",
  BHR: "BH",
  BGD: "BD",
  BRB: "BB",
  BLR: "BY",
  BEL: "BE",
  BLZ: "BZ",
  BEN: "BJ",
  BMU: "BM",
  BTN: "BT",
  BOL: "BO",
  BES: "BQ",
  BIH: "BA",
  BWA: "BW",
  BVT: "BV",
  BRA: "BR",
  VGB: "VG",
  IOT: "IO",
  BRN: "BN",
  BGR: "BG",
  BFA: "BF",
  BDI: "BI",
  KHM: "KH",
  CMR: "CM",
  CAN: "CA",
  CPV: "CV",
  CYM: "KY",
  CAF: "CF",
  TCD: "TD",
  CHL: "CL",
  CHN: "CN",
  HKG: "HK",
  MAC: "MO",
  CXR: "CX",
  CCK: "CC",
  COL: "CO",
  COM: "KM",
  COG: "CG",
  COD: "CD",
  COK: "CK",
  CRI: "CR",
  CIV: "CI",
  HRV: "HR",
  CUB: "CU",
  CUW: "CW",
  CYP: "CY",
  CZE: "CZ",
  DNK: "DK",
  DJI: "DJ",
  DMA: "DM",
  DOM: "DO",
  ECU: "EC",
  EGY: "EG",
  SLV: "SV",
  GNQ: "GQ",
  ERI: "ER",
  EST: "EE",
  ETH: "ET",
  FLK: "FK",
  FRO: "FO",
  FJI: "FJ",
  FIN: "FI",
  FRA: "FR",
  GUF: "GF",
  PYF: "PF",
  ATF: "TF",
  GAB: "GA",
  GMB: "GM",
  GEO: "GE",
  DEU: "DE",
  GHA: "GH",
  GIB: "GI",
  GRC: "GR",
  GRL: "GL",
  GRD: "GD",
  GLP: "GP",
  GUM: "GU",
  GTM: "GT",
  GGY: "GG",
  GIN: "GN",
  GNB: "GW",
  GUY: "GY",
  HTI: "HT",
  HMD: "HM",
  VAT: "VA",
  HND: "HN",
  HUN: "HU",
  ISL: "IS",
  IND: "IN",
  IDN: "ID",
  IRN: "IR",
  IRQ: "IQ",
  IRL: "IE",
  IMN: "IM",
  ISR: "IL",
  ITA: "IT",
  JAM: "JM",
  JPN: "JP",
  JEY: "JE",
  JOR: "JO",
  KAZ: "KZ",
  KEN: "KE",
  KIR: "KI",
  PRK: "KP",
  KOR: "KR",
  KWT: "KW",
  KGZ: "KG",
  LAO: "LA",
  LVA: "LV",
  LBN: "LB",
  LSO: "LS",
  LBR: "LR",
  LBY: "LY",
  LIE: "LI",
  LTU: "LT",
  LUX: "LU",
  MKD: "MK",
  MDG: "MG",
  MWI: "MW",
  MYS: "MY",
  MDV: "MV",
  MLI: "ML",
  MLT: "MT",
  MHL: "MH",
  MTQ: "MQ",
  MRT: "MR",
  MUS: "MU",
  MYT: "YT",
  MEX: "MX",
  FSM: "FM",
  MDA: "MD",
  MCO: "MC",
  MNG: "MN",
  MNE: "ME",
  MSR: "MS",
  MAR: "MA",
  MOZ: "MZ",
  MMR: "MM",
  NAM: "NA",
  NRU: "NR",
  NPL: "NP",
  NLD: "NL",
  ANT: "AN",
  NCL: "NC",
  NZL: "NZ",
  NIC: "NI",
  NER: "NE",
  NGA: "NG",
  NIU: "NU",
  NFK: "NF",
  MNP: "MP",
  NOR: "NO",
  OMN: "OM",
  PAK: "PK",
  PLW: "PW",
  PSE: "PS",
  PAN: "PA",
  PNG: "PG",
  PRY: "PY",
  PER: "PE",
  PHL: "PH",
  PCN: "PN",
  POL: "PL",
  PRT: "PT",
  PRI: "PR",
  QAT: "QA",
  REU: "RE",
  ROU: "RO",
  RUS: "RU",
  RWA: "RW",
  BLM: "BL",
  SHN: "SH",
  KNA: "KN",
  LCA: "LC",
  MAF: "MF",
  SPM: "PM",
  VCT: "VC",
  WSM: "WS",
  SMR: "SM",
  STP: "ST",
  SAU: "SA",
  SEN: "SN",
  SRB: "RS",
  SYC: "SC",
  SLE: "SL",
  SGP: "SG",
  SXM: "SX",
  SVK: "SK",
  SVN: "SI",
  SLB: "SB",
  SOM: "SO",
  ZAF: "ZA",
  SGS: "GS",
  SSD: "SS",
  ESP: "ES",
  LKA: "LK",
  SDN: "SD",
  SUR: "SR",
  SJM: "SJ",
  SWZ: "SZ",
  SWE: "SE",
  CHE: "CH",
  SYR: "SY",
  TWN: "TW",
  TJK: "TJ",
  TZA: "TZ",
  THA: "TH",
  TLS: "TL",
  TGO: "TG",
  TKL: "TK",
  TON: "TO",
  TTO: "TT",
  TUN: "TN",
  TUR: "TR",
  TKM: "TM",
  TCA: "TC",
  TUV: "TV",
  UGA: "UG",
  UKR: "UA",
  ARE: "AE",
  GBR: "GB",
  USA: "US",
  UMI: "UM",
  URY: "UY",
  UZB: "UZ",
  VUT: "VU",
  VEN: "VE",
  VNM: "VN",
  VIR: "VI",
  WLF: "WF",
  ESH: "EH",
  YEM: "YE",
  ZMB: "ZM",
  ZWE: "ZW",
  XKX: "XK"
};
function flagIso3ToIso2(countryCode) {
  if (mapping[countryCode]) {
    return mapping[countryCode];
  }
  return "xx";
}
const css$1 = {
  code: ".athlete-search.svelte-1toysts.svelte-1toysts{margin-top:10px;margin-bottom:10px;position:relative}.search-box.svelte-1toysts.svelte-1toysts{position:relative;display:flex;align-items:center}.search-input.svelte-1toysts.svelte-1toysts{margin-top:10px;margin-bottom:10px;padding:10px;padding-left:30px;width:50%}.search-icon.svelte-1toysts.svelte-1toysts{position:absolute;left:10px;color:#aaa;transition:color 0.3s}.search-input.svelte-1toysts:focus+.search-icon.svelte-1toysts{color:#666}.suggestions.svelte-1toysts .fi.svelte-1toysts{margin-right:5px;vertical-align:top}.fa-mars.svelte-1toysts.svelte-1toysts{color:#1565c0}.fa-venus.svelte-1toysts.svelte-1toysts{color:#ec407a}.suggestions.svelte-1toysts .license.svelte-1toysts{color:#aaa}.suggestions.svelte-1toysts.svelte-1toysts{position:relative;list-style:none;margin-top:4px;padding:10px;background:white;width:50%;min-height:32px;border:1px solid #ccc;border-radius:4px;position:absolute;z-index:100}.progress-bar.svelte-1toysts.svelte-1toysts{position:absolute;height:3px;background-color:#03a9f4;width:0%;top:0;left:0;animation:svelte-1toysts-loadProgress 2s infinite}@keyframes svelte-1toysts-loadProgress{0%{width:0%}50%{width:100%}100%{width:0%}}.suggestion-btn.svelte-1toysts.svelte-1toysts{width:100%;background:none;border:none;text-align:left;padding:8px 12px;cursor:pointer}.suggestion-btn.svelte-1toysts.svelte-1toysts:hover{background-color:#f0f0f0}.selected-athlete.svelte-1toysts.svelte-1toysts{margin-top:5px;font-size:16px}.delete-athlete-btn.svelte-1toysts.svelte-1toysts{background:none;border:none;color:red;font-size:16px;cursor:pointer;margin-right:5px}.color-indicator.svelte-1toysts.svelte-1toysts{width:20px;height:20px;display:inline-block;margin-right:5px;vertical-align:middle}.database-status.svelte-1toysts.svelte-1toysts{font-size:11px;color:#888;margin-bottom:10px;font-style:italic}.database-status.svelte-1toysts a.svelte-1toysts{font-size:11px}",
  map: `{"version":3,"file":"AthleteSearch.svelte","sources":["AthleteSearch.svelte"],"sourcesContent":["<script>\\n  import {onMount} from 'svelte';\\n  import {writable} from 'svelte/store';\\n  import {debounce} from 'lodash-es';\\n  import {selectedAthletes} from './athletesStore.js';\\n  import {flagIso3ToIso2} from '../utils/flagsUtils.js';\\n  import '/node_modules/flag-icons/css/flag-icons.min.css';\\n\\n  const athleteSuggestions = writable([]);\\n  const isLoading = {};\\n  const databaseStatus = writable({numAthletes: 0, lastUpdate: ''});\\n  let activeSearchCount = 0;\\n  let isSearching = false;\\n  let inputElement;\\n  let searchQuery = '';\\n  let controller;\\n\\n  /**\\n   * Fetches athlete records from the API and logs the data to the console.\\n   * @param {Object} athlete - The athlete object to fetch records for.\\n   */\\n  async function fetchAthleteRecords(athlete) {\\n    isLoading[athlete.id] = true;\\n    try {\\n      const response = await fetch(\\n        \`\${import.meta.env.VITE_API_URL}/get_athlete_records?ident=\${encodeURIComponent(athlete.id)}\`\\n      );\\n      if (response.ok) {\\n        return response.json();\\n      } else {\\n        console.error('Failed to fetch athlete records');\\n      }\\n    } catch (error) {\\n      console.error('Error fetching athlete records:', error);\\n    } finally {\\n      // set isLoading a false pour cet athlete\\n      isLoading[athlete.id] = false;\\n    }\\n  }\\n\\n  /**\\n   * Fetches the database status from the API and updates the local state.\\n   */\\n  async function fetchDatabaseStatus() {\\n    try {\\n      const response = await fetch(\`\${import.meta.env.VITE_API_URL}/database_status\`);\\n      if (response.ok) {\\n        const data = await response.json();\\n        if (data.last_update) {\\n          data.last_update = new Date(data.last_update).toLocaleString();\\n        }\\n        if (data.num_athletes) {\\n          data.num_athletes = new Intl.NumberFormat().format(data.num_athletes);\\n        }\\n        databaseStatus.set(data);\\n      } else {\\n        console.error('Failed to fetch database status');\\n      }\\n    } catch (error) {\\n      console.error('Error fetching database status:', error);\\n    }\\n  }\\n\\n  /**\\n   * Toggles the visibility of athlete records in the UI and fetches the records if visible.\\n   * @param {Object} athlete - The athlete object to toggle records for.\\n   */\\n  function toggleAthleteRecords(athlete) {\\n    selectedAthletes.toggleVisible(athlete.id);\\n    if (selectedAthletes.isAthleteVisible(athlete.id)) {\\n      selectedAthletes.setLoading(athlete.id, true);\\n      fetchAthleteRecords(athlete)\\n        .then((records) => {\\n          selectedAthletes.setRecords(athlete.id, records);\\n        })\\n        .catch((error) => {\\n          console.error('Error fetching athlete records:', error);\\n          selectedAthletes.setLoading(athlete.id, false);\\n        });\\n    }\\n  }\\n\\n  /**\\n   * Checks if athlete records are currently loading.\\n   * @param {string} athleteId - The ID of the athlete to check loading state for.\\n   * @return {boolean} - True if records are loading, false otherwise.\\n   */\\n  function isLoadingRecords(athleteId) {\\n    return isLoading[athleteId] || false;\\n  }\\n\\n  /**\\n   * Debounced function to fetch athlete data from the API based on the user's query.\\n   * It only triggers the API request if the query length is 2 or more characters to reduce unnecessary requests.\\n   * @param {string} query - The search text input by the user to find athletes.\\n   */\\n  const fetchAthletes = debounce(async (query) => {\\n    if (query.length < 3) {\\n      athleteSuggestions.set([]);\\n      return;\\n    }\\n\\n    if (controller) {\\n      controller.abort();\\n    }\\n\\n    controller = new AbortController();\\n    const signal = controller.signal;\\n\\n    isSearching = true;\\n    activeSearchCount++;\\n\\n    try {\\n      const response = await fetch(\\n        \`\${import.meta.env.VITE_API_URL}/get_athletes_from_db?name=\${encodeURIComponent(query)}\`,\\n        {signal}\\n      );\\n      if (response.ok) {\\n        const data = await response.json();\\n        athleteSuggestions.set(data);\\n      } else {\\n        console.error('Failed to fetch athlete data');\\n        athleteSuggestions.set([]);\\n      }\\n    } catch (error) {\\n      if (error.name === 'AbortError') {\\n        // Ignore abort errors as they are intentional\\n        console.debug('Fetch aborted:', query);\\n      } else {\\n        console.error('Error fetching athlete data:', error);\\n        athleteSuggestions.set([]);\\n      }\\n    } finally {\\n      activeSearchCount--;\\n      if (activeSearchCount === 0) {\\n        isSearching = false;\\n      }\\n    }\\n  }, 200); // Delay in milliseconds\\n\\n  /**\\n   * Selects an athlete from the suggestions list and adds them to the selected athletes list.\\n   * @param {Object} athlete - The athlete object to add to the selected athletes list.\\n   */\\n  function selectAthlete(athlete) {\\n    searchQuery = '';\\n    selectedAthletes.addAthlete(athlete);\\n    fetchAthleteRecords(athlete)\\n      .then((records) => {\\n        selectedAthletes.setRecords(athlete.id, records);\\n      })\\n      .catch((error) => {\\n        console.error('Error fetching athlete records:', error);\\n      });\\n    athleteSuggestions.set([]);\\n  }\\n\\n  /**\\n   * Deletes an athlete from the selected athletes list.\\n   * @param {Object} athlete - The athlete object to delete.\\n   */\\n  function deleteAthlete(athlete) {\\n    selectedAthletes.removeAthlete(athlete.id);\\n  }\\n\\n  /**\\n   * Closes the suggestions list if a click event occurs outside the search input element.\\n   * This provides a way for users to dismiss the suggestions by clicking outside the input area.\\n   * @param {MouseEvent} event - The click event triggered outside the search input.\\n   */\\n  function handleClickOutside(event) {\\n    if (inputElement && !inputElement.contains(event.target)) {\\n      athleteSuggestions.set([]);\\n    }\\n  }\\n\\n  /**\\n   * Handles the focus event on the search input to trigger a search if the query length is 3 or more characters.\\n   */\\n  function handleFocus() {\\n    if (searchQuery.length >= 3) {\\n      fetchAthletes(searchQuery);\\n    }\\n  }\\n\\n  onMount(() => {\\n    fetchDatabaseStatus();\\n\\n    const storedAthletes = localStorage.getItem('selectedAthletes');\\n    if (storedAthletes) {\\n      selectedAthletes.setAthletes(JSON.parse(storedAthletes));\\n    }\\n\\n    selectedAthletes.subscribe(($selectedAthletes) => {\\n      localStorage.setItem('selectedAthletes', JSON.stringify($selectedAthletes));\\n    });\\n\\n    window.addEventListener('click', handleClickOutside);\\n    return () => {\\n      window.removeEventListener('click', handleClickOutside);\\n    };\\n  });\\n<\/script>\\n\\n<div class=\\"athlete-search\\">\\n  <div class=\\"search-box\\">\\n    <input\\n      type=\\"text\\"\\n      class=\\"search-input\\"\\n      bind:value={searchQuery}\\n      on:focus={handleFocus}\\n      on:input={() => fetchAthletes(searchQuery)}\\n      placeholder=\\"Rechercher un athlète...\\"\\n      bind:this={inputElement}\\n    />\\n    <i class=\\"fas fa-search search-icon\\"></i>\\n  </div>\\n  {#if $databaseStatus.num_athletes}\\n    <div class=\\"database-status\\">\\n      {$databaseStatus.num_athletes} athlètes de <a href=\\"https://www.bases_athle.fr\\">bases.athle.fr</a>\\n    </div>\\n  {/if}\\n\\n  {#if $athleteSuggestions.length || isSearching}\\n    <ul class=\\"suggestions\\">\\n      {#if isSearching}\\n        <div class=\\"progress-bar\\"></div>\\n      {/if}\\n      {#each $athleteSuggestions as athlete}\\n        <li>\\n          <button on:click={() => selectAthlete(athlete)} class=\\"suggestion-btn\\">\\n            <span class=\\"fi fi-{flagIso3ToIso2(athlete.nationality).toLowerCase()}\\"></span>\\n            {athlete.name} - {athlete.birth_date || ''}\\n            {#if athlete.sexe}\\n              <i class={\`fa \${athlete.sexe === 'M' ? 'fa-mars' : 'fa-venus'}\`}></i>\\n            {/if}\\n            {#if athlete.license_id}\\n              <i class=\\"license\\">{athlete.license_id}</i>\\n            {/if}\\n          </button>\\n        </li>\\n      {/each}\\n    </ul>\\n  {/if}\\n\\n  {#each $selectedAthletes as athlete}\\n    <div class=\\"selected-athlete\\">\\n      <label class=\\"switch\\">\\n        <input\\n          id=\\"athlete-switch-{athlete.id}\\"\\n          type=\\"checkbox\\"\\n          checked={athlete.visible}\\n          on:change={() => toggleAthleteRecords(athlete)}\\n        />\\n        <span class=\\"slider round\\"></span>\\n      </label>\\n      <button on:click={() => deleteAthlete(athlete)} class=\\"delete-athlete-btn\\">x</button>\\n      <span class=\\"color-indicator\\" style=\\"background-color: {athlete.color};\\"></span>\\n      <a href={athlete.url} target=\\"_blank\\" rel=\\"noopener noreferrer\\">\\n        {athlete.name}\\n      </a>\\n      <span>\\n        {#if athlete.sexe}\\n          <i class={\`fa \${athlete.sexe === 'M' ? 'fa-mars' : 'fa-venus'}\`}></i>\\n        {/if}\\n        <i class=\\"fas fa-external-link-alt\\"></i>\\n      </span>\\n      {#if isLoadingRecords(athlete.id)}\\n        <div class=\\"spinner\\"></div>\\n      {/if}\\n    </div>\\n  {/each}\\n</div>\\n\\n<style>\\n  .athlete-search {\\n    margin-top: 10px;\\n    margin-bottom: 10px;\\n    position: relative;\\n  }\\n\\n  .search-box {\\n    position: relative;\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .search-input {\\n    margin-top: 10px;\\n    margin-bottom: 10px;\\n    padding: 10px;\\n    padding-left: 30px;\\n    width: 50%;\\n  }\\n\\n  .search-icon {\\n    position: absolute;\\n    left: 10px;\\n    color: #aaa;\\n    transition: color 0.3s;\\n  }\\n  .search-input:focus + .search-icon {\\n    color: #666;\\n  }\\n\\n  .suggestions .fi {\\n    margin-right: 5px;\\n    vertical-align: top;\\n  }\\n\\n  .fa-mars {\\n    color: #1565c0;\\n  }\\n\\n  .fa-venus {\\n    color: #ec407a;\\n  }\\n\\n  .suggestions .license {\\n    color: #aaa;\\n  }\\n\\n  .suggestions {\\n    position: relative;\\n    list-style: none;\\n    margin-top: 4px;\\n    padding: 10px;\\n    background: white;\\n    width: 50%;\\n    min-height: 32px;\\n    border: 1px solid #ccc;\\n    border-radius: 4px;\\n    position: absolute;\\n    z-index: 100;\\n  }\\n\\n  .progress-bar {\\n    position: absolute;\\n    height: 3px;\\n    background-color: #03a9f4;\\n    width: 0%;\\n    top: 0;\\n    left: 0;\\n    animation: loadProgress 2s infinite;\\n  }\\n\\n  @keyframes loadProgress {\\n    0% {\\n      width: 0%;\\n    }\\n    50% {\\n      width: 100%;\\n    }\\n    100% {\\n      width: 0%;\\n    }\\n  }\\n\\n  .suggestion-btn {\\n    width: 100%;\\n    background: none;\\n    border: none;\\n    text-align: left;\\n    padding: 8px 12px;\\n    cursor: pointer;\\n  }\\n\\n  .suggestion-btn:hover {\\n    background-color: #f0f0f0;\\n  }\\n\\n  .selected-athlete {\\n    margin-top: 5px;\\n    font-size: 16px;\\n  }\\n\\n  .delete-athlete-btn {\\n    background: none;\\n    border: none;\\n    color: red;\\n    font-size: 16px;\\n    cursor: pointer;\\n    margin-right: 5px;\\n  }\\n\\n  .color-indicator {\\n    width: 20px;\\n    height: 20px;\\n    display: inline-block;\\n    margin-right: 5px;\\n    vertical-align: middle;\\n  }\\n\\n  .database-status {\\n    font-size: 11px;\\n    color: #888;\\n    margin-bottom: 10px;\\n    font-style: italic;\\n  }\\n\\n  .database-status a {\\n    font-size: 11px;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAmRE,6CAAgB,CACd,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,IAAI,CACnB,QAAQ,CAAE,QACZ,CAEA,yCAAY,CACV,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MACf,CAEA,2CAAc,CACZ,UAAU,CAAE,IAAI,CAChB,aAAa,CAAE,IAAI,CACnB,OAAO,CAAE,IAAI,CACb,YAAY,CAAE,IAAI,CAClB,KAAK,CAAE,GACT,CAEA,0CAAa,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,IAAI,CACV,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,KAAK,CAAC,IACpB,CACA,4BAAa,MAAM,CAAG,2BAAa,CACjC,KAAK,CAAE,IACT,CAEA,2BAAY,CAAC,kBAAI,CACf,YAAY,CAAE,GAAG,CACjB,cAAc,CAAE,GAClB,CAEA,sCAAS,CACP,KAAK,CAAE,OACT,CAEA,uCAAU,CACR,KAAK,CAAE,OACT,CAEA,2BAAY,CAAC,uBAAS,CACpB,KAAK,CAAE,IACT,CAEA,0CAAa,CACX,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,GAAG,CACf,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,KAAK,CACjB,KAAK,CAAE,GAAG,CACV,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,GACX,CAEA,2CAAc,CACZ,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,OAAO,CACzB,KAAK,CAAE,EAAE,CACT,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,SAAS,CAAE,2BAAY,CAAC,EAAE,CAAC,QAC7B,CAEA,WAAW,2BAAa,CACtB,EAAG,CACD,KAAK,CAAE,EACT,CACA,GAAI,CACF,KAAK,CAAE,IACT,CACA,IAAK,CACH,KAAK,CAAE,EACT,CACF,CAEA,6CAAgB,CACd,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,OACV,CAEA,6CAAe,MAAO,CACpB,gBAAgB,CAAE,OACpB,CAEA,+CAAkB,CAChB,UAAU,CAAE,GAAG,CACf,SAAS,CAAE,IACb,CAEA,iDAAoB,CAClB,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GAAG,CACV,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,OAAO,CACf,YAAY,CAAE,GAChB,CAEA,8CAAiB,CACf,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,YAAY,CACrB,YAAY,CAAE,GAAG,CACjB,cAAc,CAAE,MAClB,CAEA,8CAAiB,CACf,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,MACd,CAEA,+BAAgB,CAAC,gBAAE,CACjB,SAAS,CAAE,IACb"}`
};
const AthleteSearch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $databaseStatus, $$unsubscribe_databaseStatus;
  let $athleteSuggestions, $$unsubscribe_athleteSuggestions;
  let $selectedAthletes, $$unsubscribe_selectedAthletes;
  $$unsubscribe_selectedAthletes = subscribe(selectedAthletes, (value) => $selectedAthletes = value);
  const athleteSuggestions = writable([]);
  $$unsubscribe_athleteSuggestions = subscribe(athleteSuggestions, (value) => $athleteSuggestions = value);
  const isLoading = {};
  const databaseStatus = writable({ numAthletes: 0, lastUpdate: "" });
  $$unsubscribe_databaseStatus = subscribe(databaseStatus, (value) => $databaseStatus = value);
  let activeSearchCount = 0;
  let isSearching = false;
  let inputElement;
  let searchQuery = "";
  let controller;
  function isLoadingRecords2(athleteId) {
    return isLoading[athleteId] || false;
  }
  debounce(
    async (query) => {
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
        const response = await fetch(`${"/api"}/get_athletes_from_db?name=${encodeURIComponent(query)}`, { signal });
        if (response.ok) {
          const data = await response.json();
          athleteSuggestions.set(data);
        } else {
          console.error("Failed to fetch athlete data");
          athleteSuggestions.set([]);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.debug("Fetch aborted:", query);
        } else {
          console.error("Error fetching athlete data:", error);
          athleteSuggestions.set([]);
        }
      } finally {
        activeSearchCount--;
        if (activeSearchCount === 0) {
          isSearching = false;
        }
      }
    },
    200
  );
  $$result.css.add(css$1);
  $$unsubscribe_databaseStatus();
  $$unsubscribe_athleteSuggestions();
  $$unsubscribe_selectedAthletes();
  return `<div class="athlete-search svelte-1toysts"><div class="search-box svelte-1toysts"><input type="text" class="search-input svelte-1toysts" placeholder="Rechercher un athlète..."${add_attribute("value", searchQuery, 0)}${add_attribute("this", inputElement, 0)}> <i class="fas fa-search search-icon svelte-1toysts"></i></div> ${$databaseStatus.num_athletes ? `<div class="database-status svelte-1toysts">${escape($databaseStatus.num_athletes)} athlètes de <a href="https://www.bases_athle.fr" class="svelte-1toysts" data-svelte-h="svelte-18c9cjd">bases.athle.fr</a></div>` : ``} ${$athleteSuggestions.length || isSearching ? `<ul class="suggestions svelte-1toysts">${isSearching ? `<div class="progress-bar svelte-1toysts"></div>` : ``} ${each($athleteSuggestions, (athlete) => {
    return `<li><button class="suggestion-btn svelte-1toysts"><span class="${"fi fi-" + escape(flagIso3ToIso2(athlete.nationality).toLowerCase(), true) + " svelte-1toysts"}"></span> ${escape(athlete.name)} - ${escape(athlete.birth_date || "")} ${athlete.sexe ? `<i class="${escape(null_to_empty(`fa ${athlete.sexe === "M" ? "fa-mars" : "fa-venus"}`), true) + " svelte-1toysts"}"></i>` : ``} ${athlete.license_id ? `<i class="license svelte-1toysts">${escape(athlete.license_id)}</i>` : ``}</button> </li>`;
  })}</ul>` : ``} ${each($selectedAthletes, (athlete) => {
    return `<div class="selected-athlete svelte-1toysts"><label class="switch"><input id="${"athlete-switch-" + escape(athlete.id, true)}" type="checkbox" ${athlete.visible ? "checked" : ""}> <span class="slider round"></span></label> <button class="delete-athlete-btn svelte-1toysts" data-svelte-h="svelte-k43bj9">x</button> <span class="color-indicator svelte-1toysts" style="${"background-color: " + escape(athlete.color, true) + ";"}"></span> <a${add_attribute("href", athlete.url, 0)} target="_blank" rel="noopener noreferrer">${escape(athlete.name)}</a> <span>${athlete.sexe ? `<i class="${escape(null_to_empty(`fa ${athlete.sexe === "M" ? "fa-mars" : "fa-venus"}`), true) + " svelte-1toysts"}"></i>` : ``} <i class="fas fa-external-link-alt"></i></span> ${isLoadingRecords2(athlete.id) ? `<div class="spinner"></div>` : ``} </div>`;
  })} </div>`;
});
const showVMA = writable(false);
const selectedVMA = writable(DEFAULT_VMA);
const css = {
  code: "form.svelte-1qgjma0.svelte-1qgjma0{margin-bottom:10px}label.vma-switch-label.svelte-1qgjma0.svelte-1qgjma0{width:30px !important;margin-left:2.1rem}label.svelte-1qgjma0.svelte-1qgjma0{display:inline-block;width:100px;margin-bottom:5px}select.svelte-1qgjma0.svelte-1qgjma0{display:inline-block;width:120px;margin-bottom:5px}table.svelte-1qgjma0.svelte-1qgjma0{border-collapse:collapse}thead.svelte-1qgjma0.svelte-1qgjma0{position:sticky;top:0;z-index:10}th.svelte-1qgjma0.svelte-1qgjma0{background-color:#03a9f4;color:#fff;cursor:pointer;padding:3px}td.svelte-1qgjma0.svelte-1qgjma0{text-align:center;margin:0px;padding-left:5px;padding-right:5px}tr.svelte-1qgjma0.svelte-1qgjma0:nth-child(even){background-color:#f2f2f2;z-index:-2}tr.svelte-1qgjma0.svelte-1qgjma0:hover{background-color:#b3e5fc}.highlighted.svelte-1qgjma0.svelte-1qgjma0{background-color:#b3e5fc}.col-head.svelte-1qgjma0.svelte-1qgjma0{font-weight:bold}td.svelte-1qgjma0.svelte-1qgjma0{text-align:center;margin:0px;padding-left:5px;padding-right:5px;box-sizing:border-box}.men-record.svelte-1qgjma0.svelte-1qgjma0{background-color:gold;color:#1565c0}.women-record.svelte-1qgjma0.svelte-1qgjma0{background-color:gold;color:#ec407a}.error.svelte-1qgjma0.svelte-1qgjma0{color:red}.contact.svelte-1qgjma0.svelte-1qgjma0{margin-top:1rem}.custom-dist.svelte-1qgjma0.svelte-1qgjma0{display:flex;align-items:center;gap:0.4rem;margin:0.5rem 0 0.5rem}.custom-dist.svelte-1qgjma0 input.svelte-1qgjma0{padding:0.5rem}.add-btn.svelte-1qgjma0.svelte-1qgjma0{width:24px;height:24px;border:none;border-radius:4px;background:#03a9f4;color:#fff;font-size:1.4rem;font-weight:700;line-height:1;cursor:pointer;display:grid;place-items:center;transition:background 0.2s}.add-btn.svelte-1qgjma0.svelte-1qgjma0:hover,.add-btn.svelte-1qgjma0.svelte-1qgjma0:focus-visible{background:#0288d1;outline:none}.delete-btn.svelte-1qgjma0.svelte-1qgjma0{cursor:pointer;font-weight:bold;color:#ffebee}.delete-btn.svelte-1qgjma0.svelte-1qgjma0:hover{color:#b71c1c}",
  map: `{"version":3,"file":"PaceTable.svelte","sources":["PaceTable.svelte"],"sourcesContent":["<script>\\n  import {onMount} from 'svelte';\\n\\n  import {formatPace, formatSpeed, formatTime} from '../utils/timeUtils.js';\\n  import {setupStore} from '../utils/storeUtils.js';\\n  import {DEFAULT_INCREMENT, DEFAULT_MIN_PACE, DEFAULT_MAX_PACE, DEFAULT_VMA} from '../utils/constants.js';\\n\\n  import {\\n    selectedMinPace,\\n    selectedMaxPace,\\n    selectedIncrement,\\n    distances,\\n    addDistance,\\n    removeDistance,\\n    DEFAULT_DISTANCES,\\n  } from './paceTableStore.js';\\n\\n  import {showWorldRecords, worldRecords, isLoadingRecords} from '../worldRecords/worldRecordsStore.js';\\n  import {selectedAthletes} from '../athletes/athletesStore.js';\\n  import AthleteSearch from '../athletes/AthleteSearch.svelte';\\n  import {showVMA, selectedVMA} from './vmaStore.js';\\n\\n  // State variables for storing pace data and table columns\\n  let paceData = [];\\n  let columns = [];\\n  let athletes = [];\\n  let errorMessage = '';\\n  let prevSelectedMinPace = DEFAULT_MIN_PACE;\\n  let prevSelectedMaxPace = DEFAULT_MAX_PACE;\\n  const vmaRange = Array.from({length: 41}, (_, i) => 10 + i * 0.5);\\n\\n  // Loading state to prevent concurrent API calls\\n  let isLoading = false;\\n  let fetchTimeout = null;\\n\\n  // Mapping of numeric distances to human-readable names\\n  const distanceDisplayNames = {\\n    '1609.34': 'Mile',\\n    '5000': '5km',\\n    '10000': '10km',\\n    '20000': '20km',\\n    '21097': 'Semi M.',\\n    '42195': 'Marathon',\\n  };\\n\\n  // Predefined ranges for pacing and increments\\n  const paceRange = [90, 120, 180, 240, 300, 360, 420, 480, 540, 600].reverse();\\n  const incrementRange = [1, 2, 5, 10, 15, 20, 30];\\n\\n  // Object to keep track of highlighted table cells\\n  const highlighted = {\\n    column: null,\\n    row: null,\\n  };\\n\\n  /**\\n   * Prevents event propagation and updates highlighted state for table cells.\\n   * @param {Event} event - The DOM event object.\\n   * @param {string} column - The column identifier to highlight.\\n   * @param {Object} row - The row data object to highlight.\\n   */\\n  function handleHighlight(event, column, row) {\\n    event.stopPropagation();\\n\\n    if (column !== null && column !== undefined) {\\n      highlighted.column = column === highlighted.column ? null : column;\\n    }\\n\\n    if (row !== null && row !== undefined) {\\n      highlighted.row = row === highlighted.row ? null : row;\\n    }\\n  }\\n\\n  /**\\n   * Fetches pace data from an API endpoint and updates local state.\\n   * Includes loading flag to prevent concurrent calls.\\n   */\\n  async function fetchPaceData() {\\n    // Prevent concurrent API calls\\n    if (isLoading) {\\n      console.log('Skipping fetch: already loading');\\n      return;\\n    }\\n\\n    isLoading = true;\\n    try {\\n      const response = await fetch(\`\${import.meta.env.VITE_API_URL}/generate_table\`, {\\n        method: 'POST',\\n        headers: {\\n          'Content-Type': 'application/json',\\n        },\\n        body: JSON.stringify({\\n          min_pace: $selectedMinPace,\\n          max_pace: $selectedMaxPace,\\n          increment: $selectedIncrement,\\n          distances: $distances,\\n        }),\\n      });\\n\\n      if (response.ok) {\\n        paceData = await response.json();\\n        if (paceData.length > 0) {\\n          columns = Object.keys(paceData[0])\\n            .filter((key) => key !== 'pace' && key != 'speed')\\n            .sort((a, b) => parseInt(a) - parseInt(b))\\n            .map(Number)\\n            .sort((a, b) => a - b);\\n        }\\n      } else {\\n        console.error('Error fetching data from the API');\\n      }\\n    } catch (error) {\\n      console.error('Error:', error);\\n    } finally {\\n      isLoading = false;\\n    }\\n  }\\n\\n  /**\\n   * Debounced version of fetchPaceData to avoid multiple simultaneous calls.\\n   * Waits 150ms after the last change before making the API call.\\n   */\\n  function debouncedFetchPaceData() {\\n    // Clear any pending fetch\\n    if (fetchTimeout) {\\n      clearTimeout(fetchTimeout);\\n    }\\n\\n    // Schedule new fetch after 150ms of inactivity\\n    fetchTimeout = setTimeout(() => {\\n      fetchPaceData();\\n    }, 150);\\n  }\\n\\n  /**\\n   * Checks if a given time for a distance is a men's world record.\\n   * @param {string} distance - The distance for which to check the record.\\n   * @param {number} time - The time achieved for the distance.\\n   * @return {boolean} - True if the time is a world record for men; otherwise, false.\\n   */\\n  function isMenWR(distance, time) {\\n    if ($isLoadingRecords) return false;\\n    const record = $worldRecords['men'][distance];\\n    return isWR(distance, time, record);\\n  }\\n\\n  /**\\n   * Checks if a given time for a distance is a women's world record.\\n   * @param {string} distance - The distance for which to check the record.\\n   * @param {number} time - The time achieved for the distance.\\n   * @return {boolean} - True if the time is a world record for women; otherwise, false.\\n   */\\n  function isWomenWR(distance, time) {\\n    if ($isLoadingRecords) return false;\\n    const record = $worldRecords['women'][distance];\\n    return isWR(distance, time, record);\\n  }\\n\\n  /**\\n   * General function to check if a time is a world record.\\n   * @param {string} distance - The distance for which to check the record.\\n   * @param {number} time - The time achieved.\\n   * @param {number} record - The current world record time for the distance.\\n   * @return {boolean} - True if the time is a world record; otherwise, false.\\n   */\\n  function isWR(distance, time, record) {\\n    if (!record) return false;\\n    const timeDiff = (Number(distance) * Number($selectedIncrement)) / 1000;\\n    const prevTime = time + timeDiff;\\n    const nextTime = time - timeDiff;\\n    return (\\n      Math.abs(time - record) < Math.abs(prevTime - record) && Math.abs(time - record) < Math.abs(nextTime - record)\\n    );\\n  }\\n\\n  /**\\n   * Returns the color of the athlete record for a given cell in the table.\\n   * @param {string} distance - The distance for which to check the record.\\n   * @param {number} time - The time achieved for the distance.\\n   * @return {string} - The color of the athlete record, or an empty string if none.\\n   */\\n  function getAthleteRecordColor(distance, time) {\\n    const timeDiff = (Number(distance) * Number($selectedIncrement)) / 1000;\\n    const prevTime = time + timeDiff;\\n    const nextTime = time - timeDiff;\\n    const athleteColors = [];\\n\\n    for (const athlete of athletes) {\\n      const record = athlete.records[distance];\\n      if (\\n        Math.abs(time - record) < Math.abs(prevTime - record) &&\\n        Math.abs(time - record) <= Math.abs(nextTime - record)\\n      ) {\\n        athleteColors.push(athlete.color);\\n      }\\n    }\\n\\n    if (athleteColors.length > 1) {\\n      const gradient = athleteColors\\n        .map(\\n          (color, index) =>\\n            \`\${color} \${(index * 100) / athleteColors.length}%, \${color} \${((index + 1) * 100) / athleteColors.length}%\`\\n        )\\n        .join(', ');\\n      return \`background: linear-gradient(to right, \${gradient}); color: #fff;\`;\\n    } else if (athleteColors.length === 1) {\\n      return \`background-color: \${athleteColors[0]}; color: #fff;\`;\\n    } else {\\n      return '';\\n    }\\n  }\\n\\n  let newDistance = '';\\n\\n  function handleAddDistance() {\\n    addDistance(newDistance);\\n    newDistance = '';\\n  }\\n\\n  // Fetch initial data when component mounts\\n  onMount(() => {\\n    const unsubscribeMinPace = setupStore(selectedMinPace, 'selectedMinPace', DEFAULT_MIN_PACE);\\n    const unsubscribeMaxPace = setupStore(selectedMaxPace, 'selectedMaxPace', DEFAULT_MAX_PACE);\\n    const unsubscribeIncrement = setupStore(selectedIncrement, 'selectedIncrement', DEFAULT_INCREMENT);\\n    const unsubscribeShowVMA = setupStore(showVMA, 'showVMA', false);\\n    const unscubscribeSelectedVMA = setupStore(selectedVMA, 'selectedVMA', DEFAULT_VMA);\\n\\n    return () => {\\n      unsubscribeMinPace();\\n      unsubscribeMaxPace();\\n      unsubscribeIncrement();\\n      unsubscribeShowVMA();\\n      unscubscribeSelectedVMA();\\n    };\\n  });\\n\\n  $: if ($selectedAthletes) {\\n    athletes = $selectedAthletes.filter((a) => a.visible);\\n    debouncedFetchPaceData();\\n  }\\n\\n  $: if (!$isLoadingRecords && paceData.length > 0) {\\n    paceData = paceData.map((row) => ({...row}));\\n  }\\n\\n  $: if ($selectedMinPace && $selectedMaxPace && $selectedIncrement) {\\n    if ($selectedMinPace < $selectedMaxPace) {\\n      errorMessage = \\"L'allure minimale ne peut pas être supérieure à l'allure maximale.\\";\\n      $selectedMinPace = prevSelectedMinPace;\\n      $selectedMaxPace = prevSelectedMaxPace;\\n    } else {\\n      errorMessage = '';\\n      prevSelectedMinPace = $selectedMinPace;\\n      prevSelectedMaxPace = $selectedMaxPace;\\n      debouncedFetchPaceData();\\n    }\\n  }\\n\\n  $: ($distances, debouncedFetchPaceData());\\n<\/script>\\n\\n<div class=\\"top-container\\">\\n  <!-- Athlete search component -->\\n  <AthleteSearch />\\n\\n  <!-- World records component -->\\n  <!--<WorldRecords />-->\\n\\n  <!-- Form to select pace range and increment -->\\n  <form>\\n    <div>\\n      <label for=\\"min-pace\\">Min.</label>\\n      <select id=\\"min-pace\\" class=\\"material-select\\" bind:value={$selectedMinPace}>\\n        {#each paceRange as pace}/km\\n          <option value={pace}>{formatPace(pace)} / km</option>\\n        {/each}\\n      </select>\\n    </div>\\n    <div>\\n      <label for=\\"max-pace\\">Max.</label>\\n      <select id=\\"max-pace\\" class=\\"material-select\\" bind:value={$selectedMaxPace}>\\n        {#each paceRange as pace}\\n          <option value={pace}>{formatPace(pace)} / km</option>\\n        {/each}\\n      </select>\\n    </div>\\n    <div>\\n      <label for=\\"increment\\">Incrément.</label>\\n      <select id=\\"increment\\" class=\\"material-select\\" bind:value={$selectedIncrement}>\\n        {#each incrementRange as increment}\\n          <option value={increment}>{increment}\\"</option>\\n        {/each}\\n      </select>\\n    </div>\\n  </form>\\n\\n  <!-- Ajout distance personnalisée -->\\n  <div class=\\"custom-dist\\">\\n    <!--<label for=\\"custom-dist\\">+ Dist (m)</label>-->\\n    <div class=\\"custom-dist\\">\\n      <input\\n        type=\\"number\\"\\n        placeholder=\\"Ajouter distance (m)\\"\\n        bind:value={newDistance}\\n        min=\\"1\\"\\n        on:keydown={(e) => e.key === 'Enter' && handleAddDistance()}\\n      />\\n\\n      <button type=\\"button\\" class=\\"add-btn\\" aria-label=\\"Ajouter une distance\\" on:click={handleAddDistance}>+</button>\\n    </div>\\n  </div>\\n\\n  <div class=\\"vma-selector\\">\\n    <label class=\\"switch\\">\\n      <input id=\\"vma-switch\\" type=\\"checkbox\\" bind:checked={$showVMA} />\\n      <span class=\\"slider round\\"></span>\\n    </label>\\n    <label class=\\"vma-switch-label\\" for=\\"vma-switch\\">VMA</label>\\n    {#if $showVMA}\\n      <select bind:value={$selectedVMA}>\\n        {#each vmaRange as vma}\\n          <option value={vma}>{vma.toFixed(1)} km/h</option>\\n        {/each}\\n      </select>\\n    {/if}\\n  </div>\\n\\n  {#if errorMessage}\\n    <p class=\\"error\\">{errorMessage}</p>\\n  {/if}\\n</div>\\n\\n<!-- Table markup to display pace data -->\\n<table>\\n  <!-- Table header -->\\n  <thead>\\n    <tr>\\n      {#if $showVMA}\\n        <th>% VMA</th>\\n      {/if}\\n      <th>t/km</th>\\n      <th>km/h</th>\\n      {#each columns as column}\\n        <th on:click={() => handleHighlight(event, column, null)}>\\n          {distanceDisplayNames[column] || column}\\n          {#if !DEFAULT_DISTANCES.includes(column)}\\n            <span\\n              class=\\"delete-btn\\"\\n              role=\\"button\\"\\n              tabindex=\\"0\\"\\n              aria-label=\\"Supprimer\\"\\n              on:click={(e) => {\\n                e.stopPropagation();\\n                console.log('removeDistance', column);\\n                console.log(DEFAULT_DISTANCES, column, DEFAULT_DISTANCES.includes(column));\\n                removeDistance(column);\\n              }}\\n              on:keydown={(e) => e.key === 'Enter' && removeDistance(column)}>X</span\\n            >\\n          {/if}\\n        </th>\\n      {/each}\\n    </tr>\\n  </thead>\\n  <!-- Table body -->\\n  <tbody>\\n    {#each paceData as row, rowIndex}\\n      <tr on:click={(event) => handleHighlight(event, null, row)}>\\n        {#if $showVMA}\\n          <td class:highlighted={highlighted.row === row}>{Math.round((100 * row.speed) / $selectedVMA)}%</td>\\n        {/if}\\n        <td class:highlighted={highlighted.row === row} class=\\"col-head\\">{formatPace(row.pace)}</td>\\n        <td class:highlighted={highlighted.row === row} class=\\"col-head\\">{formatSpeed(row.speed)}</td>\\n        {#each columns as column, columnIndex}\\n          <td\\n            on:click={(event) => handleHighlight(event, column, row)}\\n            class:highlighted={highlighted.column === column || highlighted.row === row}\\n            class:men-record={$showWorldRecords && isMenWR(column, row[column])}\\n            class:women-record={$showWorldRecords && isWomenWR(column, row[column])}\\n            style={getAthleteRecordColor(column, row[column])}\\n          >\\n            {formatTime(row[column], column < 800)}\\n          </td>\\n        {/each}\\n      </tr>\\n    {/each}\\n  </tbody>\\n</table>\\n\\n<div class=\\"contact\\"><a href=\\"mailto:contact@mypacer.fr\\">contact@mypacer.fr</a></div>\\n\\n<style>\\n  form {\\n    margin-bottom: 10px;\\n  }\\n\\n  label.vma-switch-label {\\n    width: 30px !important;\\n    margin-left: 2.1rem;\\n  }\\n\\n  label {\\n    display: inline-block;\\n    width: 100px;\\n    margin-bottom: 5px;\\n  }\\n\\n  select {\\n    display: inline-block;\\n    width: 120px;\\n    margin-bottom: 5px;\\n  }\\n\\n  table {\\n    border-collapse: collapse;\\n  }\\n\\n  thead {\\n    position: sticky;\\n    top: 0;\\n    z-index: 10;\\n  }\\n\\n  th {\\n    background-color: #03a9f4;\\n    color: #fff;\\n    cursor: pointer;\\n    padding: 3px;\\n  }\\n\\n  td {\\n    text-align: center;\\n    margin: 0px;\\n    padding-left: 5px;\\n    padding-right: 5px;\\n  }\\n\\n  tr:nth-child(even) {\\n    background-color: #f2f2f2;\\n    z-index: -2;\\n  }\\n\\n  tr:hover {\\n    background-color: #b3e5fc;\\n  }\\n\\n  .highlighted {\\n    background-color: #b3e5fc;\\n  }\\n\\n  .col-head {\\n    font-weight: bold;\\n  }\\n\\n  td {\\n    text-align: center;\\n    margin: 0px;\\n    padding-left: 5px;\\n    padding-right: 5px;\\n    box-sizing: border-box;\\n  }\\n\\n  .men-record {\\n    background-color: gold;\\n    color: #1565c0;\\n  }\\n\\n  .women-record {\\n    background-color: gold;\\n    color: #ec407a;\\n  }\\n\\n  .error {\\n    color: red;\\n  }\\n\\n  .contact {\\n    margin-top: 1rem;\\n  }\\n\\n  .custom-dist {\\n    display: flex;\\n    align-items: center;\\n    gap: 0.4rem;\\n    margin: 0.5rem 0 0.5rem;\\n  }\\n\\n  .custom-dist input {\\n    padding: 0.5rem;\\n  }\\n\\n  .add-btn {\\n    width: 24px;\\n    height: 24px;\\n    border: none;\\n    border-radius: 4px;\\n    background: #03a9f4;\\n    color: #fff;\\n    font-size: 1.4rem;\\n    font-weight: 700;\\n    line-height: 1;\\n    cursor: pointer;\\n    display: grid;\\n    place-items: center;\\n    transition: background 0.2s;\\n  }\\n\\n  .add-btn:hover,\\n  .add-btn:focus-visible {\\n    background: #0288d1; /* bleu 600 – plus sombre */\\n    outline: none;\\n  }\\n\\n  .delete-btn {\\n    cursor: pointer;\\n    font-weight: bold;\\n    color: #ffebee;\\n  }\\n\\n  .delete-btn:hover {\\n    color: #b71c1c;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAwYE,kCAAK,CACH,aAAa,CAAE,IACjB,CAEA,KAAK,+CAAkB,CACrB,KAAK,CAAE,IAAI,CAAC,UAAU,CACtB,WAAW,CAAE,MACf,CAEA,mCAAM,CACJ,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,KAAK,CACZ,aAAa,CAAE,GACjB,CAEA,oCAAO,CACL,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,KAAK,CACZ,aAAa,CAAE,GACjB,CAEA,mCAAM,CACJ,eAAe,CAAE,QACnB,CAEA,mCAAM,CACJ,QAAQ,CAAE,MAAM,CAChB,GAAG,CAAE,CAAC,CACN,OAAO,CAAE,EACX,CAEA,gCAAG,CACD,gBAAgB,CAAE,OAAO,CACzB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,GACX,CAEA,gCAAG,CACD,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,GAAG,CACX,YAAY,CAAE,GAAG,CACjB,aAAa,CAAE,GACjB,CAEA,gCAAE,WAAW,IAAI,CAAE,CACjB,gBAAgB,CAAE,OAAO,CACzB,OAAO,CAAE,EACX,CAEA,gCAAE,MAAO,CACP,gBAAgB,CAAE,OACpB,CAEA,0CAAa,CACX,gBAAgB,CAAE,OACpB,CAEA,uCAAU,CACR,WAAW,CAAE,IACf,CAEA,gCAAG,CACD,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,GAAG,CACX,YAAY,CAAE,GAAG,CACjB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,UACd,CAEA,yCAAY,CACV,gBAAgB,CAAE,IAAI,CACtB,KAAK,CAAE,OACT,CAEA,2CAAc,CACZ,gBAAgB,CAAE,IAAI,CACtB,KAAK,CAAE,OACT,CAEA,oCAAO,CACL,KAAK,CAAE,GACT,CAEA,sCAAS,CACP,UAAU,CAAE,IACd,CAEA,0CAAa,CACX,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,MAAM,CACX,MAAM,CAAE,MAAM,CAAC,CAAC,CAAC,MACnB,CAEA,2BAAY,CAAC,oBAAM,CACjB,OAAO,CAAE,MACX,CAEA,sCAAS,CACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,OAAO,CACnB,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,CAAC,CACd,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,UAAU,CAAC,IACzB,CAEA,sCAAQ,MAAM,CACd,sCAAQ,cAAe,CACrB,UAAU,CAAE,OAAO,CACnB,OAAO,CAAE,IACX,CAEA,yCAAY,CACV,MAAM,CAAE,OAAO,CACf,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,OACT,CAEA,yCAAW,MAAO,CAChB,KAAK,CAAE,OACT"}`
};
const PaceTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $distances, $$unsubscribe_distances;
  let $selectedMaxPace, $$unsubscribe_selectedMaxPace;
  let $selectedMinPace, $$unsubscribe_selectedMinPace;
  let $selectedIncrement, $$unsubscribe_selectedIncrement;
  let $isLoadingRecords, $$unsubscribe_isLoadingRecords;
  let $selectedAthletes, $$unsubscribe_selectedAthletes;
  let $worldRecords, $$unsubscribe_worldRecords;
  let $showVMA, $$unsubscribe_showVMA;
  let $selectedVMA, $$unsubscribe_selectedVMA;
  let $showWorldRecords, $$unsubscribe_showWorldRecords;
  $$unsubscribe_distances = subscribe(distances, (value) => $distances = value);
  $$unsubscribe_selectedMaxPace = subscribe(selectedMaxPace, (value) => $selectedMaxPace = value);
  $$unsubscribe_selectedMinPace = subscribe(selectedMinPace, (value) => $selectedMinPace = value);
  $$unsubscribe_selectedIncrement = subscribe(selectedIncrement, (value) => $selectedIncrement = value);
  $$unsubscribe_isLoadingRecords = subscribe(isLoadingRecords, (value) => $isLoadingRecords = value);
  $$unsubscribe_selectedAthletes = subscribe(selectedAthletes, (value) => $selectedAthletes = value);
  $$unsubscribe_worldRecords = subscribe(worldRecords, (value) => $worldRecords = value);
  $$unsubscribe_showVMA = subscribe(showVMA, (value) => $showVMA = value);
  $$unsubscribe_selectedVMA = subscribe(selectedVMA, (value) => $selectedVMA = value);
  $$unsubscribe_showWorldRecords = subscribe(showWorldRecords, (value) => $showWorldRecords = value);
  let paceData = [];
  let columns = [];
  let athletes = [];
  let errorMessage = "";
  let prevSelectedMinPace = DEFAULT_MIN_PACE;
  let prevSelectedMaxPace = DEFAULT_MAX_PACE;
  const vmaRange = Array.from({ length: 41 }, (_, i) => 10 + i * 0.5);
  let isLoading = false;
  let fetchTimeout = null;
  const distanceDisplayNames = {
    "1609.34": "Mile",
    "5000": "5km",
    "10000": "10km",
    "20000": "20km",
    "21097": "Semi M.",
    "42195": "Marathon"
  };
  const paceRange = [90, 120, 180, 240, 300, 360, 420, 480, 540, 600].reverse();
  const incrementRange = [1, 2, 5, 10, 15, 20, 30];
  const highlighted = { column: null, row: null };
  async function fetchPaceData() {
    if (isLoading) {
      console.log("Skipping fetch: already loading");
      return;
    }
    isLoading = true;
    try {
      const response = await fetch(`${"/api"}/generate_table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          min_pace: $selectedMinPace,
          max_pace: $selectedMaxPace,
          increment: $selectedIncrement,
          distances: $distances
        })
      });
      if (response.ok) {
        paceData = await response.json();
        if (paceData.length > 0) {
          columns = Object.keys(paceData[0]).filter((key) => key !== "pace" && key != "speed").sort((a, b) => parseInt(a) - parseInt(b)).map(Number).sort((a, b) => a - b);
        }
      } else {
        console.error("Error fetching data from the API");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading = false;
    }
  }
  function debouncedFetchPaceData() {
    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }
    fetchTimeout = setTimeout(
      () => {
        fetchPaceData();
      },
      150
    );
  }
  function isMenWR(distance, time) {
    if ($isLoadingRecords) return false;
    const record = $worldRecords["men"][distance];
    return isWR(distance, time, record);
  }
  function isWomenWR(distance, time) {
    if ($isLoadingRecords) return false;
    const record = $worldRecords["women"][distance];
    return isWR(distance, time, record);
  }
  function isWR(distance, time, record) {
    if (!record) return false;
    const timeDiff = Number(distance) * Number($selectedIncrement) / 1e3;
    const prevTime = time + timeDiff;
    const nextTime = time - timeDiff;
    return Math.abs(time - record) < Math.abs(prevTime - record) && Math.abs(time - record) < Math.abs(nextTime - record);
  }
  function getAthleteRecordColor(distance, time) {
    const timeDiff = Number(distance) * Number($selectedIncrement) / 1e3;
    const prevTime = time + timeDiff;
    const nextTime = time - timeDiff;
    const athleteColors = [];
    for (const athlete of athletes) {
      const record = athlete.records[distance];
      if (Math.abs(time - record) < Math.abs(prevTime - record) && Math.abs(time - record) <= Math.abs(nextTime - record)) {
        athleteColors.push(athlete.color);
      }
    }
    if (athleteColors.length > 1) {
      const gradient = athleteColors.map((color, index) => `${color} ${index * 100 / athleteColors.length}%, ${color} ${(index + 1) * 100 / athleteColors.length}%`).join(", ");
      return `background: linear-gradient(to right, ${gradient}); color: #fff;`;
    } else if (athleteColors.length === 1) {
      return `background-color: ${athleteColors[0]}; color: #fff;`;
    } else {
      return "";
    }
  }
  let newDistance = "";
  $$result.css.add(css);
  {
    if ($selectedAthletes) {
      athletes = $selectedAthletes.filter((a) => a.visible);
      debouncedFetchPaceData();
    }
  }
  {
    if (!$isLoadingRecords && paceData.length > 0) {
      paceData = paceData.map((row) => ({ ...row }));
    }
  }
  {
    if ($selectedMinPace && $selectedMaxPace && $selectedIncrement) {
      if ($selectedMinPace < $selectedMaxPace) {
        errorMessage = "L'allure minimale ne peut pas être supérieure à l'allure maximale.";
        set_store_value(selectedMinPace, $selectedMinPace = prevSelectedMinPace, $selectedMinPace);
        set_store_value(selectedMaxPace, $selectedMaxPace = prevSelectedMaxPace, $selectedMaxPace);
      } else {
        errorMessage = "";
        prevSelectedMinPace = $selectedMinPace;
        prevSelectedMaxPace = $selectedMaxPace;
        debouncedFetchPaceData();
      }
    }
  }
  {
    debouncedFetchPaceData();
  }
  $$unsubscribe_distances();
  $$unsubscribe_selectedMaxPace();
  $$unsubscribe_selectedMinPace();
  $$unsubscribe_selectedIncrement();
  $$unsubscribe_isLoadingRecords();
  $$unsubscribe_selectedAthletes();
  $$unsubscribe_worldRecords();
  $$unsubscribe_showVMA();
  $$unsubscribe_selectedVMA();
  $$unsubscribe_showWorldRecords();
  return `<div class="top-container"> ${validate_component(AthleteSearch, "AthleteSearch").$$render($$result, {}, {}, {})}    <form class="svelte-1qgjma0"><div><label for="min-pace" class="svelte-1qgjma0" data-svelte-h="svelte-v0vbq0">Min.</label> <select id="min-pace" class="material-select svelte-1qgjma0">${each(paceRange, (pace) => {
    return `/km
          <option${add_attribute("value", pace, 0)}>${escape(formatPace(pace))} / km</option>`;
  })}</select></div> <div><label for="max-pace" class="svelte-1qgjma0" data-svelte-h="svelte-v7ujnk">Max.</label> <select id="max-pace" class="material-select svelte-1qgjma0">${each(paceRange, (pace) => {
    return `<option${add_attribute("value", pace, 0)}>${escape(formatPace(pace))} / km</option>`;
  })}</select></div> <div><label for="increment" class="svelte-1qgjma0" data-svelte-h="svelte-1fk35zi">Incrément.</label> <select id="increment" class="material-select svelte-1qgjma0">${each(incrementRange, (increment) => {
    return `<option${add_attribute("value", increment, 0)}>${escape(increment)}&quot;</option>`;
  })}</select></div></form>  <div class="custom-dist svelte-1qgjma0"> <div class="custom-dist svelte-1qgjma0"><input type="number" placeholder="Ajouter distance (m)" min="1" class="svelte-1qgjma0"${add_attribute("value", newDistance, 0)}> <button type="button" class="add-btn svelte-1qgjma0" aria-label="Ajouter une distance" data-svelte-h="svelte-uskr2p">+</button></div></div> <div class="vma-selector"><label class="switch svelte-1qgjma0"><input id="vma-switch" type="checkbox"${add_attribute("checked", $showVMA, 1)}> <span class="slider round"></span></label> <label class="vma-switch-label svelte-1qgjma0" for="vma-switch" data-svelte-h="svelte-4ytuzi">VMA</label> ${$showVMA ? `<select class="svelte-1qgjma0">${each(vmaRange, (vma) => {
    return `<option${add_attribute("value", vma, 0)}>${escape(vma.toFixed(1))} km/h</option>`;
  })}</select>` : ``}</div> ${errorMessage ? `<p class="error svelte-1qgjma0">${escape(errorMessage)}</p>` : ``}</div>  <table class="svelte-1qgjma0"> <thead class="svelte-1qgjma0"><tr class="svelte-1qgjma0">${$showVMA ? `<th class="svelte-1qgjma0" data-svelte-h="svelte-12tol9b">% VMA</th>` : ``} <th class="svelte-1qgjma0" data-svelte-h="svelte-1j08yrr">t/km</th> <th class="svelte-1qgjma0" data-svelte-h="svelte-q6592d">km/h</th> ${each(columns, (column) => {
    return `<th class="svelte-1qgjma0">${escape(distanceDisplayNames[column] || column)} ${!DEFAULT_DISTANCES.includes(column) ? `<span class="delete-btn svelte-1qgjma0" role="button" tabindex="0" aria-label="Supprimer" data-svelte-h="svelte-16pw5an">X</span>` : ``} </th>`;
  })}</tr></thead>  <tbody>${each(paceData, (row, rowIndex) => {
    return `<tr class="svelte-1qgjma0">${$showVMA ? `<td class="${["svelte-1qgjma0", highlighted.row === row ? "highlighted" : ""].join(" ").trim()}">${escape(Math.round(100 * row.speed / $selectedVMA))}%</td>` : ``} <td class="${["col-head svelte-1qgjma0", highlighted.row === row ? "highlighted" : ""].join(" ").trim()}">${escape(formatPace(row.pace))}</td> <td class="${["col-head svelte-1qgjma0", highlighted.row === row ? "highlighted" : ""].join(" ").trim()}">${escape(formatSpeed(row.speed))}</td> ${each(columns, (column, columnIndex) => {
      return `<td${add_attribute("style", getAthleteRecordColor(column, row[column]), 0)} class="${[
        "svelte-1qgjma0",
        (highlighted.column === column || highlighted.row === row ? "highlighted" : "") + " " + ($showWorldRecords && isMenWR(column, row[column]) ? "men-record" : "") + " " + ($showWorldRecords && isWomenWR(column, row[column]) ? "women-record" : "")
      ].join(" ").trim()}">${escape(formatTime(row[column], column < 800))} </td>`;
    })} </tr>`;
  })}</tbody></table> <div class="contact svelte-1qgjma0" data-svelte-h="svelte-6lf6t8"><a href="mailto:contact@mypacer.fr">contact@mypacer.fr</a></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-tccddv_START -->${$$result.title = `<title>MyPacer - Calculateur d&#39;allure Running &amp; Recherche FFA</title>`, ""}<!-- HEAD_svelte-tccddv_END -->`, ""} ${validate_component(PaceTable, "PaceTable").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
