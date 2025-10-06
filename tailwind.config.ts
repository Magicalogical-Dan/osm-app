import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // OSM Brand Colors
        'osm-blue': 'rgb(40, 88, 200)',
        'osm-green': 'rgb(101, 165, 44)',
        'osm-red': 'rgb(234, 54, 36)',
        // Secondary colors with 20% opacity
        'osm-blue-light': 'rgba(40, 88, 200, 0.2)',
        'osm-green-light': 'rgba(101, 165, 44, 0.2)',
        'osm-red-light': 'rgba(234, 54, 36, 0.2)',
      },
      animation: {
        'color-rotate': 'colorRotate 10s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        colorRotate: {
          '0%': { backgroundColor: 'rgb(40, 88, 200)' },
          '33%': { backgroundColor: 'rgb(101, 165, 44)' },
          '66%': { backgroundColor: 'rgb(234, 54, 36)' },
          '100%': { backgroundColor: 'rgb(40, 88, 200)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
