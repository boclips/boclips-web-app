const debugScreens = require('tailwindcss-debug-screens');
const forms = require('@tailwindcss/forms');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],

  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['Rubik'],
    },
    letterSpacing: {
      tightestest: '-.15em',
    },
    screens: {
      sm: '320px',
      md: '768px',
      lg: '1148px',
      xl: '1680px',
    },
    extend: {
      gridTemplateRows: {
        home: 'auto minmax(0, 458px) auto',
        homepage: 'auto 1fr auto',
        newHomepage: 'auto auto auto auto',
        'search-view':
          'minmax(74px, auto) minmax(30px, min-content) auto 1fr auto',
        navbar: 'repeat(2, auto)',
        'cart-view': 'minmax(74px, auto) minmax(50px, auto) 1fr auto',
        'orders-view': 'minmax(74px, auto) minmax(50px, auto) 1fr auto',
        'library-view': 'minmax(74px, auto) minmax(50px, auto) 1fr auto',
        'playlist-view':
          'minmax(74px, auto) minmax(50px, auto) min-content 1fr auto',
        'explore-view': 'minmax(74px, auto) min-content min-content 1fr auto',
        'theme-detailed-view':
          'minmax(74px, auto) min-content min-content 1fr auto',
        'my-team-view': 'minmax(74px, auto) min-content 1fr auto',
        'order-view': 'minmax(74px, auto) 21px min-content 1fr auto',
        'large-screen-video-view':
          'minmax(74px, auto) minmax(0, auto) repeat(3, auto)',
        'video-view': 'minmax(74px, auto) minmax(0, auto) repeat(6, auto)',
      },
      gridTemplateColumns: {
        container:
          'minmax(1rem, 1fr) repeat(24, minmax(0, 38px)) minmax(1rem, 1fr)',
      },
      gridRowStart: {
        last: '-1',
      },
      gridRowEnd: {
        last: '-1',
      },
      margin: {
        7: '1.75rem',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
      },
      gridColumnEnd: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
        24: '24',
        25: '25',
        26: '26',
        27: '27',
      },
      borderWidth: {
        1: '1.5px',
        6: '6px',
      },
      colors: {
        blue: {
          100: 'var(--blue-100)',
          200: 'var(--blue-200)',
          300: 'var(--blue-300)',
          400: 'var(--blue-400)',
          500: 'var(--blue-500)',
          600: 'var(--blue-600)',
          700: 'var(--blue-700)',
          800: 'var(--blue-800)',
          900: 'var(--blue-900)',
        },
        red: {
          error: 'var(--red-error)',
        },
        yellow: {
          warning: 'var(--yellow-warning)',
          'warning-border': 'var(--yellow-warning-border)',
        },
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
        primary: '#00217D',
        'primary-hover': '#193DA1',
        'primary-active': '#001550',
        'primary-link': '#002E9E',
        'primary-light': '#F5F8FF',
        footer: '#616577',
        focus: '#63b3ed',
      },
      opacity: {
        55: '0.55',
      },
      fontSize: {
        xxs: '0.75rem',
        xs: '0.875rem',
        md: '1rem',
      },
      spacing: {
        14: '3.5rem',
      },
      boxShadow: {
        outline: '0 2px 8px 0 rgba(0,21,80,0.15)',
        'button-focus': '0 0 6px 0 #8BAAFF',
      },
      height: {
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        28: '7rem',
      },
      width: {
        44: '11rem',
        max: '105rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [forms, debugScreens],
};
