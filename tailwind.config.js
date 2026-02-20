/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      manrope: ['Manrope', 'system-ui', 'sans-serif'],
    },

    extend: {
      colors: {
        'cs-100': 'red',
        'bg-green': '#26A363',
        'cs-purple': '#8347CF',
        'cs-black': '#151515',
        'cs-gray-900': '#18181B',
        'cs-gray-100': '#D4D4D8',
        'cs-gray-800': '#38424D',
        'cs-gray-700': '#606871',
        'cs-gray-600': '#888E94',
        'cs-gray-500': '#52525B',
        'cs-gray-400': '#A1A1AA',
        'cs-gray-300': '#E7E8E9',
        'cs-gray-200': '#374151',
        'cs-gray': '#F6F6F3',
        'cs-lightGray-900': '#2D353E',
        'cs-darkBlack': '#000',
        'cs-green': '#277E78',
        'cs-green-200': '#42BA78',
        'cs-dark-500': '#202124',
        'cs-primary': '#42BA78',
        'cs-zinc': '#1a1d23',
        

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
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
				'vs-blue': '#4A3CE1',
				'vs-purple': '#4a3ce1',
				'vs-lemon-green': '#B5EB92',
      },

      maxWidth: {
        '9xl': '82rem',
        '7xl': '1240px',
      },

      boxShadow: {
        custom: '0px 10px 70px 0px rgba(0, 0, 0, 0.15)',
      },

      backgroundImage: {
        'gradient-text': 'linear-gradient(90deg, #FEF08A 0%, #60A5FA 100%)',
        'gradient-text2': 'linear-gradient(90deg, #854D0E 0%, #3730A3 100%)',
      },

      fontSize: {
        h1: '3.5rem',
        h2:'2.5rem'
      },

      letterSpacing: {
        tighterText: '-0.48px',
      },
      padding:{
        headerSpacer : '115px',
        headerSpacerMob : '64px'
      },
      
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
