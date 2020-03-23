const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    ReactStuff: ['react', 'react-relay'],
    Styles: ['rebass', 'styled-system', 'styled-components'],
  },
  output: {
    path: path.join(__dirname, 'dist-dll'),
    filename: '[name].dll.js',
    library: '[name]',
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist-dll', '[name].json'),
      name: '[name]',
    }),
  ],
};
