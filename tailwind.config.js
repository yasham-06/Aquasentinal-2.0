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
          bg: '#06101E',
          bgSecondary: '#0B1A28',
          surface: '#0D2032',
          elevated: '#15334E',
          hero: '#040D17',
          border: '#183C5A',
          borderSubtle: '#122D44',
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
          bg: '#06101E',
          card: '#0D2032',
          hero: '#040D17',
          elevated: '#15334E',
          border: '#183C5A',
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
      borderRadius: {
        'xl': '12px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card-glow': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 15px 0 rgba(34, 211, 238, 0.05)',
        'hero-glow': '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px 0 rgba(34, 211, 238, 0.08)',
        'alert-glow': '0 0 25px 0 rgba(239, 68, 68, 0.25)',
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
