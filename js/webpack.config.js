const path = require('path');

module.exports = {
  entry: './src/aspire.ts',
  target: 'node',
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
    fallback: {
        "path": require.resolve("path-browserify")
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};