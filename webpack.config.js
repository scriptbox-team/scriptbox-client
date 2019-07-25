const path = require('path');

module.exports = {
  entry: './src/main-web.ts',
  mode: 'production',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist', 'web')
  },
  performance: {
    hints: false
  }
};