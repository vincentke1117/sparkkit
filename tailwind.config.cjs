/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070b1a',
        surface: 'rgba(22, 29, 50, 0.75)',
        accent: '#6f9bff',
        accentSecondary: '#9f6fff',
      },
      boxShadow: {
        glow: '0 0 40px rgba(111, 155, 255, 0.45)',
      },
      borderRadius: {
        xl: '20px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
