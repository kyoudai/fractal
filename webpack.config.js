module.exports = {
  entry: './src/app.ts',
  output: {
    path: __dirname + '/dist/',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'webpack-typescript'
      }
    ]
  }
};