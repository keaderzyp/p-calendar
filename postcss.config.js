module.exports = {
	plugins:{
		'postcss-preset-env':{},
		"cssnano":{},
		'postcss-pxtorem': {
			rootValue: 1,
			propList: ['*'],
			exclude: /assets/i
		}
	}
}