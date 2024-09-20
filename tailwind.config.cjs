const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				'auto-fr': 'auto minmax(0, 1fr)'
			},
			colors: {
				primary: colors.gray[100],
				secondary: colors.white,
				tertiary: '#a5b4fc',
				dark: {
					primary: '#293548',
					secondary: '#1e293b',
					tertiary: '#0f172a',
					offset: {
						primary: '#2e3c52'
					},
					hover: {
						primary: '#344054'
					}
				},
				offset: {
					primary: colors.gray[200]
				},
				hover: {
					primary: colors.gray[300]
				}
			}
		}
	},
	plugins: []
};
