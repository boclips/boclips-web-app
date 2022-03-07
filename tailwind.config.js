const debugScreens = require('tailwindcss-debug-screens');
const forms = require('@tailwindcss/forms');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
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
        'home-responsive': 'auto minmax(100%, auto) auto',
        'navbar-responsive': 'auto auto',
        'default-view': 'auto minmax(0, auto) auto',
        'default-view-with-title': 'auto 50px minmax(0, auto) auto',
        'playlist-view':
          'auto minmax(50px, auto) auto auto minmax(0, auto) auto',
        'order-view': 'auto 21px minmax(0, auto) minmax(0, auto) auto',
        'video-view': 'auto repeat(4,auto) auto',
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
    },
  },
  plugins: [forms, debugScreens],
};
