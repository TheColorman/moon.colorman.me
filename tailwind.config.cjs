/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				'auto-fr': 'auto minmax(0, 1fr)'
			}
		}
	},
	plugins: []
};
