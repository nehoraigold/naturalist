const path              = require('path');
const config            = require('./config.json');
const HtmlLoader        = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
	entry: `./${config.client.srcPath}/index.tsx`,
	mode: config.run.mode === "production" ? "production" : "development",
	output: {
		filename: './main.js',
		path: path.resolve(__dirname, config.client.buildPath)
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	devServer: {
		contentBase: path.join(__dirname, config.client.buildPath),
		compress: true,
		port: config.server.port
	},
	devtool: "source-map",
	plugins: [
		new HtmlLoader({template: "./client/public/index.html"}),
		new CopyWebpackPlugin([
			{from: `${config.client.publicPath}/images`, to: "images"},
			{from: `${config.client.publicPath}/themes`, to: "themes"}
		]),
	],
	module: {
		rules: [
			{test: /\.css$/, use: ['style-loader', 'css-loader']},
			{test: /\.tsx?$/, loader: "awesome-typescript-loader"},
			{test: /\.(gif|jpg|jpeg|png)$/, use: {loader: 'file-loader', options: {name: '[name].[ext]'}}},
			{enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
		]
	}
// }, {
// 	entry: './server/server.js',
// 	output: {
// 		filename: './index.js',
// 		path: path.resolve(__dirname, 'server/build')
// 	},
// 	devtool: "sourceMap"
}];