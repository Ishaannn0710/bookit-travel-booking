import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Exact colors from Figma
      colors: {
        primary: {
          DEFAULT: '#FFD643',
          hover: '#FFC833',
          light: '#FFF4D6',
        },
        background: {
          DEFAULT: '#F9F9F9',
          gray: '#E9E9E9',
          light: '#EFEFEF',
        },
        text: {
          primary: '#000000',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
      },
      
      // Exact spacing from Figma
      spacing: {
        '124': '124px',
        '135': '135px',
        '280': '280px',
        '312': '312px',
        '381': '381px',
        '387': '387px',
        '765': '765px',
        '739': '739px',
      },
      
      // Border radius
      borderRadius: {
        card: '12px',
        button: '8px',
      },
      
      // Max widths
      maxWidth: {
        container: '1440px',
        card: '280px',
        hero: '765px',
        checkout: '739px',
        summary: '387px',
      },
      
      // Heights
      height: {
        card: '312px',
        'card-image': '312px',
        'hero-image': '381px',
        input: '48px',
        button: '48px',
      },
      
      // Box shadows
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        dropdown: '0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config