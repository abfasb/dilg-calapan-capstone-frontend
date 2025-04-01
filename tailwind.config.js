/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
	darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		colors: {
			border: 'hsl(var(--border))',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			primary: {
			  DEFAULT: 'hsl(var(--primary))',
			  foreground: 'hsl(var(--primary-foreground))',
			},
			secondary: {
			  DEFAULT: 'hsl(var(--secondary))',
			  foreground: 'hsl(var(--secondary-foreground))',
			},
			muted: {
			  DEFAULT: 'hsl(var(--muted))',
			  foreground: 'hsl(var(--muted-foreground))',
			},
  			primary: {
  				'500': '#3B82F6',
  				'600': '#2563EB',
  				'700': '#1D4ED8'
  			},
			  cyan: {
				400: '#00f2fe',
			  },
			  blue: {
				500: '#4f46e5',
			  },
			  gray: {
				800: '#1f2937',
				900: '#111827',
			  }
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		backdropBlur: {
			sm: '4px',
		  }
  	}
  },
  plugins: [require("tailwindcss-animate")],
  plugins: [require('tailwind-scrollbar')],
}
