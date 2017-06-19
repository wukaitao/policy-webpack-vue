import Vue from 'vue';
import Vuex from 'vuex';
import * as type from './../mutation-types.js';

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(Vuex);
Vue.http.options.emulateJSON= true;
Vue.http.options.emulateHTTP = false;
/*
function triggerDialog(context,data,parama){
  let body = data && typeof data.body == "string" ? JSON.parse(data.body):data.body;

  let statusCode = body && body.statusCode;
  if(statusCode==0){
    context.commit(type.DialogMsg,parama);
  }else{
    context.commit(type.DialogMsg,{"display":true, "error":true,"msg":"操作失败！"});
  }
}
*/
//打开弹窗
function showDialog(param){
	param.context.commit(type.DialogOpen,param);
	if(param.type=='toast'){
		window.setTimeout(function(){
			let callback = param.callback || function(){};
			param.context.commit(type.DialogCancel,param);
			callback.call(param.context);
		},2000);
	};
};
//改变保存状态
function changeSaveSataus(state){
	state.pageStatus.isSave = true;
	window.setTimeout(function(){
		state.pageStatus.isSave = false;
	},50);
};

const PointManage = {
	state: {
		testData:'1111',
		allTeacher: [],
		allPointData:[],
		modifyData:"",
		modifyCateData:""
	},
	mutations: {
		[type.ModifyPoint](state,param){
			state.modifyPointData = "";

			state.allPointData.map(function(item,index){
				if(param.cateId){
					if(item.libId == param.cateId){
						state.modifyData = item;
					};
				}else{
					if(item.children){
						item.children.map(function(citem,i){
							if(citem.libId == param.pointId){
								state.modifyData = citem;
							};
						});
					};
				};
			});
		},
		[type.ModifyCate](sate,param){
			state.allPointData.map(function(item,index){
				if(item.libId == param.cateId){
					state.modifyData = item;
				};
			});
		},
		[type.QueryAllPointData](state,param){
			state.allPointData = param.data;
		}
	},
	actions: {
		[type.QueryAllPointData](context,param){
	    	//请求所有节点数据
	    	context.rootState.pageStatus.isLoading = true;
	    	Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.getTreeNode,{},{
		        headers:{
		        	'Accept':'*/*'
		        }
	    	}).then(res =>{
	    		context.rootState.pageStatus.isLoading = false;
				var result = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
				if(result.statusCode == '0'){
					//获取数据成功
					context.commit(type.QueryAllPointData,result);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
	    	},res=>{
	    		context.rootState.pageStatus.isLoading = false;
	    		showDialog({type:'alert',message:'网络请求发生错误！',context:context});
	    		//triggerDialog(context,{"body":{"statusCode":0}},{"display":true,"error":true, "msg":"网络请求发生错误！"})
	    	});
		},
		[type.ModifyPoint](context,param){
			context.commit(type.ModifyPoint,param);
		},
		[type.ModifyCate](context,param){
			context.commit(type.ModifyCate,param);
		},
		[type.SaveCreatePointData](context,param){
			//新增节点
			/*
			if(!param.benefitKeyDesc || !param.nodeTitle ||  !param.benefitValueDesc){
				showDialog({type:'alert',message:'输入框都不能为空！',context:context});
				//triggerDialog(context,{"body":{"statusCode":0}},{"display":true, "error":true,"msg":"输入框都不能为空！"});
				return;
			};
			*/
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath+context.rootState.serverPath.pointAdd,param,{
				headers:{
					'Accept':'*/*'
				}
			}).then(res =>{
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
				if(result.statusCode == '0'){
					//获取数据成功
					showDialog({type:'alert',message:'成功新增节点！',context:context});
					changeSaveSataus(context.rootState);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
				//triggerDialog(context,res,{"display":true, "msg":"成功新增节点！"})
			},res=>{
				context.rootState.pageStatus.isLoading = false;
	    		showDialog({type:'alert',message:'操作失败！',context:context});
				//triggerDialog(context,res,{"display":true, "error":true,"msg":"操作失败！"})
			});
		},
		[type.SaveModifyPointData](context,param){
			//修改节点
			/*
			if(!param.benefitKeyDesc || !param.nodeTitle ||  !param.benefitValueDesc){
				showDialog({type:'alert',message:'输入框都不能为空！',context:context});
				//triggerDialog(context,{"body":{"statusCode":0}},{"display":true,"error":true, "msg":"输入框都不能为空！"});
				return;
			};
			*/
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath+context.rootState.serverPath.pointUpdate, param, {
				headers:{
					'Accept':'*/*'
				}
			}).then(res =>{
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
				if(result.statusCode == '0'){
					//获取数据成功
					showDialog({type:'alert',message:'成功修改节点！',context:context});
					changeSaveSataus(context.rootState);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
				//triggerDialog(context,res,{"display":true, "msg":"成功修改节点！"})
			},res=>{
				context.rootState.pageStatus.isLoading = false;
	    		showDialog({type:'alert',message:'操作失败！',context:context});
				//triggerDialog(context,res,{"display":true, "error":true,"msg":"操作失败！"})
			});
		},
		[type.SaveCreateCateData](context,param){
			//新增分类
			/*
			if(!param.benefitKeyDesc || !param.nodeTitle){
				showDialog({type:'alert',message:'输入框都不能为空！',context:context});
				//triggerDialog(context,{"body":{"statusCode":0}},{"display":true, "error":true,"msg":"输入框都不能为空！"});
				return;
			};
			if(param.nodeType!=1 && !param.benefitValueDesc){
				showDialog({type:'alert',message:'输入框都不能为空！',context:context});
				//triggerDialog(context,{"body":{"statusCode":0}},{"display":true, "error":true,"msg":"输入框都不能为空！"});
				return;
			};
			*/
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath+context.rootState.serverPath.pointAdd, param, {
				headers:{
					'Accept':'*/*'
				}
			}).then(res =>{
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
				if(result.statusCode == '0'){
					//获取数据成功
					showDialog({type:'alert',message:'成功新增分类！',context:context});
					changeSaveSataus(context.rootState);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
				//triggerDialog(context,res,{"display":true, "msg":"成功新增分类！"})
			},res=>{
				context.rootState.pageStatus.isLoading = false;
	    		showDialog({type:'alert',message:'操作失败！',context:context});
				//triggerDialog(context,res,{"display":true, "error":true,"msg":"操作失败！"})
			});
		},
		[type.SaveModifyCateData](context,param){
			//修改分类
			/*
			if(!param.benefitKeyDesc || !param.nodeTitle){
				triggerDialog(context,{"body":{"statusCode":0}},{"display":true, "error":true,"msg":"输入框都不能为空！"});
				return;
			};
			if(param.nodeType!=1 && !param.benefitValueDesc){
				triggerDialog(context,{"body":{"statusCode":0}},{"display":true, "error":true,"msg":"输入框都不能为空！"});
				return;
			};
			*/
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath+context.rootState.serverPath.pointUpdate, param, {
				headers:{
					'Accept':'*/*'
				}
			}).then(res =>{
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
				if(result.statusCode == '0'){
					//获取数据成功
					showDialog({type:'alert',message:'成功修改分类！',context:context});
					changeSaveSataus(context.rootState);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
				//triggerDialog(context,res,{"display":true, "msg":"成功修改分类！"});
			},res=>{
				context.rootState.pageStatus.isLoading = false;
	    		showDialog({type:'alert',message:'操作失败！',context:context});
				//triggerDialog(context,res,{"display":true,"error":true, "msg":"操作失败！"})
			});
		}
	},
	getters: {
		getAllPointData:function(state){
			return state.allPointData;
		},
		getModifyData:function(state){
			return state.modifyData;
		}
	}
}
export {PointManage};