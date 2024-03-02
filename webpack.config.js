const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/script.ts', './src/MenuManager.ts'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  },

  optimization: {
    minimize: true
  }
};