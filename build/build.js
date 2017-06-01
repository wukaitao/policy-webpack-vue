﻿const HtmlWebpackPlugin =  require('html-webpack-plugin');//生成html中间件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//抽取css样式
const TransferWebpackPlugin = require('transfer-webpack-plugin');//复制文件
const autoprefixer = require('autoprefixer');//样式添加浏览器前缀
const webpack = require('webpack');//打包工具
const merge = require('webpack-merge');//合并
const path = require('path');//路径中间件
const baseWebpackConfig = require('./config');//基本打包配置

const config = merge(baseWebpackConfig,{
	output: {
		path: path.resolve(__dirname,'../dist'),//__direname当前目录,创建相对于当前目录的文件夹
		publicPath: '/',//生成静态文件夹所在的相对目录
		filename: 'assets/js/[name].[hash].js',//name文件名;hash为MD5编码
		chunkFilename: 'assets/js/[id].[hash].js'//文件命名配置
	},
	devtool: false,//关掉开发模式
	module: {
		loaders: [
			{
				test: /\.(css|scss)$/,
				loader: ExtractTextPlugin.extract('style','css!sass','resolve-url')
			}
		]
	},
	vue: {
		loaders: ['vue-style','style','css','resolve-url'],
		postcss: autoprefixer({
			browsers: ['last 2 versions']
		})
	},
	plugins: [
  		new ExtractTextPlugin('assets/css/[name].[hash].css'),//抽取css样式
  		new TransferWebpackPlugin([
  			//form:绝对目录;to:相对output.path目录
  			{from: path.resolve(__dirname,'../client/assets/json'),to: 'assets/json'},//复制json文件
  			{from: path.resolve(__dirname,'../client/assets/lib'),to: 'assets/lib'}//复制lib文件
  		]),
  		new HtmlWebpackPlugin({
  			filename: 'index.html',//文件名
  			title: 'my first project by webpack.',//标题(会被template模板覆盖)
  			favicon: path.resolve(__dirname,'../client/assets/images/favorite.ico'),//图标
  			template: path.resolve(__dirname,'../client/main.html'),//模板
  			inject: true,//是否插入到body
  			minify: {//压缩
  				removeComments: true,//移除注释
  				collapseWhitespace: true,//去除空格
  				removeAttributeQuotes: true//去除属性引用
  			}
  		})
  	]
});

webpack(config,function(err,stats){
	if(err) throw err;
	console.log('complete.');
});