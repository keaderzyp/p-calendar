const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = merge(config,{
	mode:'production',
	entry:{
		'p-calendar':path.resolve(__dirname,'src/components/p-calendar-export.js')
	},
	output:{
		library: "p-calendar",
		libraryTarget: "umd",
		filename: "[name].min.js",
		path:path.resolve(__dirname,'lib'),
		umdNamedDefine:true
	},
	module:{
		rules:[
			{
				test:/\.scss$/,
				use:[{
					loader:'style-loader'
				},
				MiniCssExtractPlugin.loader,{
					loader:'css-loader'
				},{
					loader:'postcss-loader'
				},{
					loader:'sass-loader'
				}]
			},
			{
				test:/\.css$/,
				use:[{
					loader:'style-loader'
				},
				MiniCssExtractPlugin.loader,{
					loader:'css-loader'
				},{
					loader:'postcss-loader'
				}]
			}
		]
	},
	plugins:[
		new MiniCssExtractPlugin({
			filename: '[name].min.css'
		})
	]
})