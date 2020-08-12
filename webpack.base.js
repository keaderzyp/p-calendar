const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
	module:{
		rules:[
			{
				test:/\.vue$/,
				loader:'vue-loader'
			},
			{
				test:/\.js/,
				loader:'babel-loader'
			},
		]
	},
	resolve:{
		extensions: [".js", ".json",".scss",".css",".vue",".jsx"],
		alias:{
			'@':path.resolve(__dirname,'src')
		}
	},
	plugins:[
		new VueLoaderPlugin()
	]
}