/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#C1121F', hover: '#A00E1A', soft: 'rgba(193,18,31,0.10)' },
        success: '#2ECC71',
        warning: '#F5A623',
        error: '#FF4D4D',
        info: '#4DA3FF',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        card: '0 2px 8px rgba(0,0,0,0.08)',
        elevated: '0 4px 16px rgba(0,0,0,0.12)',
        nav: '0 -1px 3px rgba(0,0,0,0.08)',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
}
