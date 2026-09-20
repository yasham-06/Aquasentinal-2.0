/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        v2: {
          bg: '#061421',
          bgSecondary: '#081A2B',
          surface: '#0B2134',
          elevated: '#0F2940',
          border: '#163B55',
          cyan: '#22D3EE',
          brightCyan: '#06B6D4',
          blue: '#38BDF8',
          white: '#F8FAFC',
          secondaryText: '#94A3B8',
          mutedText: '#64748B',
          success: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
        },
        brand: {
          bg: '#061421',
          card: '#0B2134',
          elevated: '#0F2940',
          border: '#163B55',
          cyan: '#22D3EE',
          'cyan-hover': '#06B6D4',
          blue: '#38BDF8',
          text: '#F8FAFC',
          muted: '#94A3B8',
          success: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'flow-line': 'flowLine 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flowLine: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
      }
    },
  },
  plugins: [],
}
