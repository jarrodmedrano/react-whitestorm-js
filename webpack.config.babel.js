import path from 'path';
import webpack from 'webpack';

process.env.BABEL_ENV = 'browser';

const isProduction = process.env.NODE_ENV === 'production';

console.log(
  isProduction
  ? 'Production mode'
  : 'Development mode'
);

export default {
  devtool: isProduction ? false : 'source-map',
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.join(__dirname, './build/'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'WHSReact'
  },
  externals: {
    whs: {
      commonjs: "whs",
      commonjs2: "whs",
      amd: "whs",
      root: "WHS"
    },
    three: 'THREE'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015', 'react', 'stage-1'],
            plugins: [
                "add-module-exports",
                "transform-decorators-legacy",
                "transform-class-properties",
                "transform-object-rest-spread"
            ]
        }
      }
    ]
  },
  plugins: isProduction
  ? [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      minimize: true
    }),
  ]
  : [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    }
  },
  devServer: {
    contentBase: './examples/',
    publicPath: '/build/'
  }
}
