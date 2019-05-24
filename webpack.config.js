const path        = require('path');
const webpack     = require('webpack');
const config      = require('./config.json');
const HtmlLoader  = require('html-webpack-plugin');
const StyleLoader = require('style-loader');
const CssLoader   = require('css-loader');

module.exports = [{
	entry: `./${config.client.srcPath}/index.tsx`,
	mode: "development",
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
		new HtmlLoader({template: "./client/public/index.html"})
	],
	module: {
		rules: [
			{test: /\.css$/, use: ['style-loader', 'css-loader']},
			{test: /\.tsx?$/, loader: "awesome-typescript-loader"},
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