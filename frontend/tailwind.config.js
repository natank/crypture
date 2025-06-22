// tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        error: 'var(--color-error)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        subtle: 'var(--color-subtle)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        base: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        button: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--color-primary': '#2563eb',
          '--color-accent': '#22c55e',
          '--color-error': '#dc2626',
          '--color-background': '#f9fafb',
          '--color-foreground': '#111827',
          '--color-subtle': '#6b7280',
          '--color-border': '#e5e7eb',
        },
      });
    }),
  ],
};
