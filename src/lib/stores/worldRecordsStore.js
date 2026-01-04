import {writable} from 'svelte/store';

// Store for world records
export const showWorldRecords = writable(false);
export const worldRecords = writable({men: {}, women: {}});
export const isLoadingRecords = writable(false);
