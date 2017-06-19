import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './mutation-types.js';
import {PointManage} from './pointManage/pointManage.js';
import {TobManage} from './tobManage/tobManage.js';

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(Vuex);
Vue.http.options.emulateJSON= true;
Vue.http.options.emulateHTTP = true;
//打开弹窗
function showDialog(param){
	param.context.commit(types.DialogOpen,param);
	if(param.type=='toast'){
		window.setTimeout(function(){
			let callback = param.callback || function(){};
			param.context.commit(types.DialogCancel,param);
			callback.call(param.context);
		},2000);
	};
};

export default new Vuex.Store({
  modules:{
    pointManage:PointManage,
    TobManage:TobManage
  },
  mutations: {
    [types.DialogMsg](state, param){

      state.dialogMsg = param;
    },
    [types.Login](state, param){
    	//登录
    	if(param.login){
        	//成功
        	state.pageStatus.isLogin = true;
        	state.pageStatus.isTemplateManager = escape(param.isTemplateManager)==1;
        	localStorage.setItem('nickname',escape(param.nickname));
        	localStorage.setItem('isTemplateManager',escape(param.isTemplateManager));
        	localStorage.setItem('pageLogin','true');
    	}else{
        	//失败
    		state.pageStatus.isLogin = false;
    		state.pageStatus.isTemplateManager = false;
        	localStorage.setItem('nickname','');
        	localStorage.setItem('isTemplateManager','');
        	localStorage.setItem('pageLogin','false');
    	};
    },
    [types.Logout](state,param){
    	//退出
    	state.pageStatus.isLogin = false;
		state.pageStatus.isTemplateManager = false;
    	localStorage.setItem('nickname','');
    	localStorage.setItem('isTemplateManager','');
    	localStorage.setItem('pageLogin','false');
    },
	[types.DialogOpen](state,param){
		//打开弹窗
		state.pageStatus.dialog.show = true;
		state.pageStatus.dialog.style = param.style||{width:350,height:150,maxHeight:''};
		state.pageStatus.dialog.title = param.title||'提示';
		state.pageStatus.dialog.message = param.message||'';
		state.pageStatus.dialog.type = param.type||'';
		state.pageStatus.dialog.icon = param.icon||'';
		state.pageStatus.dialog.result = '';
		state.pageStatus.dialog.callback = param.callback||function(){};
	},
	[types.DialogCancel](state,param){
		//关闭弹窗
		state.pageStatus.dialog.show = false;
		state.pageStatus.dialog.style = {width:350,height:150,maxHeight:''};
		state.pageStatus.dialog.title = '提示';
		state.pageStatus.dialog.message = '';
		state.pageStatus.dialog.type = '';
		state.pageStatus.dialog.icon = '';
		state.pageStatus.dialog.result = param.result;
		window.setTimeout(function(){
			state.pageStatus.dialog.callback = function(){};
		},50);
	}
  },
  actions:{
    [types.DialogMsg](context, param){
      context.commit(types.DialogMsg,param);
    },
    [types.Login](context, param){
		//登录
    	context.rootState.pageStatus.isRequesting = true;
		Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobLogin,param,{
			headers: {
				'Accept': '*/*'
			}
		}).then(res => {
	    	context.rootState.pageStatus.isRequesting = false;
			var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
			if(result.statusCode == '0'){
				//获取数据成功
				showDialog({type:'toast',icon:'icon-circle-check',message:'登录成功.',context:context,callback:function(){
					context.commit(types.Login,{login: true,nickname: result.data.userName,isTemplateManager: result.data.templateFlag});
				}});
			}else{
				showDialog({type:'alert',message:result.msg,context:context});
				context.commit(types.Login,{login: false,nickname: '',isTemplateManager: ''});
			};
		},err => {
	    	context.rootState.pageStatus.isRequesting = false;
			showDialog({type:'alert',message:'网络错误.',context:context});
		});
    },
    [types.Logout](context, param){
		//退出
		Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobLogout,param,{
			headers: {
				'Accept': '*/*'
			}
		}).then(res => {
			var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
			if(result.statusCode == '0'){
				//获取数据成功
				showDialog({type:'toast',icon:'icon-circle-check',message:'退出成功.',context:context,callback:function(){
					context.commit(types.Logout);
				}});
			}else{
				showDialog({type:'alert',message:result.msg,context:context});
			};
		},err => {
			showDialog({type:'alert',message:'网络错误.',context:context});
		});
    },
	[types.DialogOpen](context,param){
		//打开弹窗
		context.commit(types.DialogOpen,param);
		if(param.type=='toast'){
			window.setTimeout(function(){
				let callback = param.callback || function(){};
				callback.call(context);
				context.commit(types.DialogCancel,param);
			},2000);
		};
	},
	[types.DialogCancel](context,param){
		//关闭弹窗
		context.commit(types.DialogCancel,param);
	}
  },
  getters:{
    dialogMsg(state){
      return state.dialogMsg;
    },
    getPageStatus: (state)=>state.pageStatus
  },
  state:{
    dialogMsg:{"display":false,"msg":""},
	pageStatus: {
		isSave: false,//保存状态
		isLoading: false,//用于蒙层loading
		isRequesting: false,//用于按钮置灰
		isLogin: localStorage.getItem('pageLogin')=='true',//登录状态
		isTemplateManager: unescape(localStorage.getItem('isTemplateManager'))=='1',//是否为模板管理人员
		dialog: {
			show: false,//是否显示
			style: {
				width: 350,
				height: 150,
				maxHeight: ''
			},
			title: '提示',//标题
			message: '',//提示语
			type: '',//弹窗--confirm:确认框;alert:警告;tips:提示;toast:弹幕提示
			icon: '',//图标--icon-question:询问;icon-notification:警告;icon-info:信息;icon-circle-check:成功;icon-circle-cross:错误;
			result: '',//返回结果
			callback: function(){}//回调函数
		},
		tobKeyword: '',//tob搜索关键字
		currentPage: 1,//tob列表当前页码
    	oSearch: {isTemplate:'',name:'全部'},//tob搜索默认选中分类
    	aSearch: [{isTemplate:'',name:'全部'},{isTemplate:0,name:'TOB'},{isTemplate:1,name:'模板'}]//tob搜索分类
	},
    serverPath:{
      commonPath:"/hmc_ghb_server/tob/",
      getTreeNode:"getTreeNode",//查询所有节点
      pointAdd:"templateNodeAdd",//新增加分类和节点
      pointUpdate:"templateNodeUpdate",//节点修改

      tobAdd:"tobAdd",//tob创建
      tobUpdate:"tobUpdate",//tob修改
      tobList:"tobList",//tob列表
      tobDetails:"tobDetails",//tob详情
      tobDelete:"tobDelete",//tob删除
      downLoadPDF:"downLoadPDF",//tob生成pdf
      submitPDF:"submitPDF",//tob提交
      tobPolicyRelationList:"tobPolicyRelationList",//tob保单关系列表
      claimsDataUpload:"claimsDataUpload",//理赔数据上传
      policyDataUpload:"policyDataUpload",//保单数据上传
      hosList:"hosList",//所有医院列表

      tobLogin:"tobLogin",//登录
      tobLogout:"tobLogout"//退出
    }
  }

})
