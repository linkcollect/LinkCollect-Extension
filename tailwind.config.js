/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			// this is animation class
			animation: {
				fade: 'fadeInUp 2s cubic-bezier(.35,.98,.31,.97)',
			},

			// this is actual animation that runs on each mount
			keyframes: (theme) => ({
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translate(0, 4rem)' },
					'100%': { opacity: '1', transform: 'translate(0, 0)' },
				},
				fadeInRight: {
					'0%': { opacity: '0', transform: 'translate(-4rem, 0rem)' },
					'100%': { opacity: '1', transform: 'translate(0, 0)' },
				},
			}),
		},
		colors: {
			bgPrimary: '#fff',
			bgSecodary: '#f9f9f9',
			bgGrey: '#f1f1f1',
			primary: '#6166f1',
			lightPrimary: '#8084f3',
			secodary: '#dedff1',
			secodaryLight: '#e8e9f8',
			textPrimary: '#232438',
			textSecondary: '#636472',
			textLight: '#f6f6f6',
			success: '#62b560',
			danger: '#ff0000',
			lightBlueBG: '#e8e8fc',
		},
	},
	plugins: [],
};
