var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
		'bundle': './scripts/script.js',
		'bundle.min': './scripts/script.js',
	},
  output: {
    path: 'dist',
			filename: '[name].js'
	},
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: path.join(__dirname, 'scripts'),
				query: {
					presets: 'es2015',
				},
			}
		]
	},
	plugins: [
		// Avoid publishing files when compilation fails
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		})
	],
	stats: {
		// Nice coloured output
		colors: true
	},
	// Create Sourcemaps for the bundle
	devtool: 'source-map',
};
