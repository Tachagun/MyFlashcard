/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      minHeight: {
        '14': '3.5rem',   // 56px
        '20': '5rem',     // 80px
        '36': '9rem',     // 144px
        '40': '10rem',    // 160px
      },
      maxHeight: {
        '19': '4.75rem',  // 76px
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['business', 'light', 'dark'],
    base: true,
    styled: true,
    utils: true,
  },
}
