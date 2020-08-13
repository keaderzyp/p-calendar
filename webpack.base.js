const path = require('path')

module.exports = {
	module:{
		rules:[
			{
				test:/\.js/,
				loader:'babel-loader'
			},
		]
	},
	resolve:{
		extensions: [".js", ".json",".scss",".css",'.vue',".jsx"],
		alias:{
			'@':path.resolve(__dirname,'src')
		}
	}
}