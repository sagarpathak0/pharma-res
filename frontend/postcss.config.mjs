import postcssOklabFunction from '@csstools/postcss-oklab-function';

const config = {
  plugins: [
    '@tailwindcss/postcss',
    postcssOklabFunction({
      preserve: false, // Converts oklch() to a browser-friendly format
    }),
  ],
};

export default config;