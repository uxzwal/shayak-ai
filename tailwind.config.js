/**
 * Sahayak AI - Tailwind CSS Configuration
 * Customizes Tailwind for emergency response design
 */

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Emergency severity colors
        emergency: {
          mild: '#10b981',        // Green
          moderate: '#f59e0b',    // Amber
          severe: '#f97316',      // Orange
          critical: '#dc2626',    // Red
        },
        // Medical/Healthcare colors
        medical: {
          primary: '#3b82f6',     // Blue
          secondary: '#10b981',   // Green
          danger: '#ef4444',      // Red
          warning: '#f59e0b',     // Amber
          info: '#06b6d4',        // Cyan
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'emergency': '0 20px 25px -5px rgba(220, 38, 38, 0.1)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'safe-area-inset-top': 'max(env(safe-area-inset-top, 0px), 1rem)',
        'safe-area-inset-bottom': 'max(env(safe-area-inset-bottom, 0px), 1rem)',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      zIndex: {
        'modal': '50',
        'dropdown': '40',
        'sticky': '20',
        'overlay': '10',
      },
    },
  },
  plugins: [
    // Custom plugin for emergency severity utilities
    function({ addUtilities }) {
      const severityUtilities = {
        '.severity-mild': {
          '@apply bg-green-50 border-green-300 text-green-900': {},
        },
        '.severity-moderate': {
          '@apply bg-yellow-50 border-yellow-300 text-yellow-900': {},
        },
        '.severity-severe': {
          '@apply bg-orange-50 border-orange-300 text-orange-900': {},
        },
        '.severity-critical': {
          '@apply bg-red-50 border-red-300 text-red-900': {},
        },
      };
      addUtilities(severityUtilities);
    },
  ],
  corePlugins: {
    // Ensure all core utilities are available
    preflight: true,
  },
};
