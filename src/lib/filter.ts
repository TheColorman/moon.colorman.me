import { browser } from '$app/environment';
import type { ObjectOption } from 'svelte-multiselect';
import { writable } from 'svelte/store';

export const filters: ObjectOption[] = [
	{
		label: 'Main releases',
		value: 'main',
		title: 'Any media that can be considered part of the main "canon".',
		preselected: true,
		selectedTitle: 'Any media that can be considered part of the main "canon".'
	},
	{
		label: 'Unofficial',
		value: 'unofficial',
		title: 'Relases by prominent Fate authors, but not directly under Type-Moon.',
		preselected: true,
		selectedTitle: 'Relases by prominent Fate authors, but not directly under Type-Moon.'
	},
	{
		label: 'Material Book',
		value: 'material',
		title: 'Booklet with extra background information about the universe.',
		selectedTitle: 'Booklet with extra background information about the universe.'
	}
];

const defaultValue = filters.filter((ob) => ob.preselected);

const initialValue = (() => {
	if (!browser) return defaultValue;
	const lsActive = window.localStorage.getItem('active-filters');
	if (!lsActive) return defaultValue;
	const active = JSON.parse(lsActive) as ObjectOption['value'][];
	return filters.filter((f) => active.includes(f.value));
})();

const activeFilters = writable<ObjectOption[]>(initialValue);

activeFilters.subscribe((value) => {
	if (!browser) return;
	window.localStorage.setItem('active-filters', JSON.stringify(value.map((f) => f.value)));
});

export default activeFilters;
