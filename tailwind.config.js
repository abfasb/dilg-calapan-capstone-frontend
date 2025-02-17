/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		colors: {
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
}
