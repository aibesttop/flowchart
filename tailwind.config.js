/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#0ea5e9',
				secondary: '#8b5cf6',
				dark: '#1e293b',
				darker: '#0f172a'
			}
		}
	},
	plugins: []
};
