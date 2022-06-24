const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.glsl$/i,
				use: 'raw-loader'
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.jsx', '.ts', '.js', '.css', '.scss', '.sass', '.json'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'THREE Testing',
		}),
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000
	}
};
