/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pashu: {
          dark: '#1B5E20',   // Dark green for "Pashu"
          light: '#7CB342',  // Light green for "Mitra"
          DEFAULT: '#2E7D32',
        },
        navy: {
          DEFAULT: '#1F3A8A', // Deep navy
          light: '#3B5BA5',   // PPT heading navy
          dark: '#172554',
        },
        pastel: {
          lavender: '#DCD6F7',
          lavenderLight: '#EDE9FB',
          peach: '#F5E6DA',
          peachLight: '#FCF5EF',
          mint: '#C8E6C9',
          mintLight: '#E8F5E9',
          softPink: '#F4B6B0',
          pinkLight: '#FDECEB',
        },
        risk: {
          high: '#DC2626',
          highBg: '#FEE2E2',
          highText: '#991B1B',
          medium: '#D97706',
          mediumBg: '#FEF3C7',
          mediumText: '#92400E',
          low: '#16A34A',
          lowBg: '#DCFCE7',
          lowText: '#166534',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
