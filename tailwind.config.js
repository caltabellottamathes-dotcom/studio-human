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
  				50: '#F1F4F9',
  				100: '#E2E8F1',
  				200: '#C9D3E3',
  				300: '#AEBDD9',
  				400: '#9DB2D2',
  				500: '#94A9CB',
  				600: '#6481A8',
  				700: '#4C6589',
  				800: '#364A66',
  				900: '#23354A'
  			},
  			ember: {
  				50: '#FBF3EE',
  				100: '#F6E3D7',
  				200: '#EFD0BE',
  				300: '#E6B298',
  				400: '#DE9070',
  				500: '#DB7A51',
  				600: '#C26740',
  				700: '#9F5235',
  				800: '#6E3924',
  				900: '#4A2618'
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
  				50: '#F4F1EA',
  				100: '#EAE4D6',
  				200: '#DCD3BE',
  				300: '#CABEA5',
  				400: '#B5AB91',
  				500: '#9A917B',
  				600: '#7B7361',
  				700: '#5C5648',
  				800: '#3D3930',
  				900: '#1F1D18'
  			},
  			glacier: {
  				50: '#F1F4F9',
  				100: '#E2E8F1',
  				200: '#C9D3E3',
  				300: '#94A9CB',
  				400: '#7E96BC',
  				500: '#6481A8',
  				600: '#506889',
  				700: '#3F516B',
  				800: '#2D3A4D',
  				900: '#1C2430'
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
