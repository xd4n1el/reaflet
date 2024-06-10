/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src', 'hooks'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@store': path.resolve(__dirname, 'src', 'store'),
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@styles': path.resolve(__dirname, 'src', 'styles'),
      '@helpers': path.resolve(__dirname, 'src', 'helpers'),
      '@context': path.resolve(__dirname, 'src', 'context'),
      '@components': path.resolve(__dirname, 'src', 'components'),
    },
  },
};
