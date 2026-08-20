/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			red: {
  					50: '#f2f1e6',
  					100: '#e8e6cf',
  					200: '#d7d6b9',
  					300: '#c6c08e',
  					400: '#b8af55',
  					500: '#a9a135',
  					600: '#88822a',
  					700: '#6b6820',
  					800: '#444305',
  					900: '#301728'
  					},
  					sky: {
  					50: '#eef1f6',
  					100: '#dde3ee',
  					200: '#c4cee3',
  					300: '#aab8d6',
  					400: '#9eaecb',
  					500: '#94a9cb',
  					600: '#6f87b3',
  					700: '#566d94',
  					800: '#3f506b',
  					900: '#2b3850'
  					},
  					ember: {
  					50: '#f5f1e0',
  					100: '#ede4c4',
  					200: '#ddcf92',
  					300: '#cab85b',
  					400: '#b9a73d',
  					500: '#a9a135',
  					600: '#867f29',
  					700: '#6a6420',
  					800: '#48420f',
  					900: '#2c2908'
  				},
  			neutral: {
  				50: '#F7F7F5',
  				100: '#EDEEEC',
  				200: '#D0D3D4',
  				300: '#B9BCBD',
  				400: '#8E9192',
  				500: '#5E6162',
  				600: '#47494A',
  				700: '#353738',
  				800: '#25282A',
  				900: '#1A1C1D'
  			},
  			cliff: {
  					50: '#f1eee2',
  					100: '#e9e4d2',
  					200: '#dcd4b8',
  					300: '#cabfa0',
  					400: '#b5ab91',
  					500: '#9a917b',
  					600: '#7b7361',
  					700: '#5c5648',
  					800: '#3d3930',
  					900: '#1f1d18'
  				},
  			glacier: {
  					50: '#eef1f0',
  					100: '#dde4e1',
  					200: '#c8d3d0',
  					300: '#aebcb8',
  					400: '#94a4a0',
  					500: '#7e8f8b',
  					600: '#647570',
  					700: '#4e5b58',
  					800: '#363f3d',
  					900: '#222725'
  				},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			serif: ['var(--font-heading)'],
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
