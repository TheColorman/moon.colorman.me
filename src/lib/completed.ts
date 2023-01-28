import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = {};

const initialValue: {
    [id: number]: boolean;
} = browser
	? JSON.parse(window.localStorage.getItem('nasu-progress') ?? JSON.stringify(defaultValue))
	: defaultValue;

const completed = writable(initialValue);

completed.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('nasu-progress', JSON.stringify(value));
	}
});

export default completed;
