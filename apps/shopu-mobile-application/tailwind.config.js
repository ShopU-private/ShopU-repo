/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        KarlaRegular: ['Karla-Regular', 'sans-serif'],
        KarlaSemiBold: ['Karla-SemiBold', 'sans-serif'],
        KarlaMedium: ['Karla-Medium', 'sans-serif'],
        KarlaBold: ['Karla-Bold', 'sans-serif'],
        RobotoMedium: ['Roboto-Medium', 'sans-serif'],
        RobotoRegular: ['Roboto-Regular', 'sans-serif'],
        RobotoSemiBold: ['Roboto-SemiBold', 'sans-serif'],
        PoppinsSemiBold: ['Poppins-SemiBold', 'sans-serif'],
        PoppinsRegular: ['Poppins-Regular', 'sans-serif'],
      },
      colors: {
        primary: {
          bold: '#317C80',
          semiBold: '#1E6E76',
          light: '#9DE6EA',
        },
        secondary: '#E93E40',
        black: '#212525',
        gray: '#D9D9D9',
        lightRed: '#E93E404D',
      },
    },
  },
  plugins: [],
};
