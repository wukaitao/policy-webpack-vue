const path = require('path');//路径中间件
const autoprefixer = require('autoprefixer');//样式添加浏览器前缀

module.exports = {
	entry: {
		vendor: [
			'./bower_components/jquery/dist/jquery.js'
		],
		main: [
			'./client/main.js'
		]
	},
	resolve: {
		extensions: ['', '.js', '.vue'],
		fallback: [path.join(__dirname, '../node_modules')],
		alias: {
			'vue$': 'vue/dist/vue',
			'client': path.resolve(__dirname, '../client'),
			'assets': path.resolve(__dirname, '../client/assets'),
			'components': path.resolve(__dirname, '../client/components')
		}
	},
	resolveLoader: {
		fallback: [path.join(__dirname, '../node_modules')]
	},
	vue: {
		loaders: {
		    css: 'vue-style!css',
		    postcss: 'vue-style!css',
		    sass: 'vue-style!css!sass?indentedSyntax',
		    scss: 'vue-style!css!sass',
		    js: 'babel'
		}
	},
    babel: {
        presets: ['es2015','stage-2']
    },
	postcss: autoprefixer({
		browsers: ['last 2 versions']
	}),
	module: {
		loaders: [
			{
				test: /\.(js)$/,
				loader: 'babel'
			},
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(jpg|jpeg|gif|png)$/,
				loader: 'url',
				query: {
					limit: 10000,
					name: 'assets/images/[name].[hash].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
				loader: 'url',
				query: {
					limit: 10000,
					name: 'assets/fonts/[name].[hash].[ext]'
				}
			},
			{
				test: path.resolve(__dirname,'../bower_components/jquery/dist/jquery.js'),
				loader: 'expose?jQuery!expose?$'
			},
			{
				test: path.resolve(__dirname,'../bower_components/fetch/fetch.js'),
				loader: 'expose?fetch'
			}
		]
	}
};