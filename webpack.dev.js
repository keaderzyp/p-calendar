const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = merge(config,{
	mode:'development',
	entry:{
		main:path.resolve(__dirname,'src/main.js')
	},
	devtool:'inline-source-map',
	output:{
		filename:'[name].bundle.js',
		path:path.resolve(__dirname,'dist')
	},
	devServer:{
		contentBase:[path.resolve(__dirname,'dist'),path.resolve(__dirname,'public')],
		hot:true,
		port:8086,
		compress:true,
		host:'0.0.0.0'
	},
	module:{
		rules:[
			{
				test:/\.scss$/,
				use:[{
					loader:'style-loader'
				},{
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
				},{
					loader:'css-loader'
				},{
					loader:'postcss-loader'
				}]
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:path.resolve(__dirname,'public/index.html'),
			filename:path.resolve(__dirname,'dist/index.html'),
			chunks:['main']
		})
	]
})