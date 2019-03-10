const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(glsl|vert|frag)$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  },
  output: {
    filename: "index.js",
    path: __dirname + '/public/js',
    publicPath: 'js/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    inline: true,
    hot: true
  }

};