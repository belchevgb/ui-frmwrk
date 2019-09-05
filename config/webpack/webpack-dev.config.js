const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require("./helpers");

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['awesome-typescript-loader', 'template-file-loader'],
        exclude: /node_modules/
      },
      { 
        test: /\.(html|css)$/, 
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      }
    ]
  },
  optimization: {
		minimize: false
	},
  resolve: {
    extensions: ['.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  resolveLoader: {
    modules: [
      "node_modules",
      helpers.resolveRootPath("webpack")
    ]
  }
};