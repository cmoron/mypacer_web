import {writable} from 'svelte/store';
import {DEFAULT_VMA} from '$lib/utils/constants.js';

export const showVMA = writable(false);
export const selectedVMA = writable(DEFAULT_VMA);
