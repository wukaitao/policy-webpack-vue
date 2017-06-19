import Vue from 'vue';
import Vuex from 'vuex';
import * as type from './../mutation-types.js';

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(Vuex);
Vue.http.options.emulateJSON= true;
Vue.http.options.emulateHTTP = true;
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

const TobManage = {
	state: {
		tobListData: {
			basicList: [],
			currentPage: 1,
			totalCount: 0
		},
		tobCur:{},
		hospitalListData: []
	},
	mutations: {
		[type.TobListData](state,param){
			//获取tob列表
			param.basicList.forEach((item)=>{
				item.chosen=false;
				item.isPosting=false;
			});
			state.tobListData = param;
		},
		[type.DeleteTob](state,param){
			//删除tob
			param.basicList.forEach((item)=>item.chosen=false);
			state.tobListData = param;
		},
		[type.CreatePdf](state,param){
			//生成pdf
		},
		[type.SubmitPDF](state,param){
			//提交tob
			if(param.changeBtnStatus){
				state.tobListData.basicList.forEach((item)=>item.tobId==param.tobId&&(item.isPosting=false));
			}else{
				state.tobListData.basicList.forEach((item)=>item.tobId==param.tobId&&(item.policyStatus=1));
			};
		},
		[type.TobPolicyRelationList](state,param){
			//保单关系列表
		},
		[type.TobDetail](state,param){
			//获取tob详情
			param.tobName = unescape(param.tobName);
			if(param.path=='copy'){
				param.tobName = param.tobName + '-复制';
			};
			param.tobTitle = unescape(param.tobTitle);
			param.benefitList.sort((a,b)=>a.orderId-b.orderId);
			param.benefitList.forEach((p)=>{
				p.showEdit = false;
				p.benefitKeyDesc = unescape(p.benefitKeyDesc);
				p.benefitValueDesc = unescape(p.benefitValueDesc);
				p.chosen=true;
				p.children.sort((a,b)=>a.orderId-b.orderId);
				p.children.forEach((c)=>{
					c.showEdit = false;
					c.benefitKeyDesc = unescape(c.benefitKeyDesc);
					c.benefitValueDesc = unescape(c.benefitValueDesc);
					c.chosen=true;
					c.isPrev=c.nodeType==4;
				});
			});
			param.save = false;
			state.tobCur = param;
		},
		[type.TobRefreshOrder](state,param){
			//调整排序
			state.tobCur.benefitList.forEach((p,i)=>{
				p.orderId=i+1;
				p.children.forEach((c,j)=>{
					c.orderId=j+1;
					//排序后所有子节点nodeType为3,责任限额与上一节点不同
					if(param.isResetNodeType){
						c.nodeType=c.nodeType==4?3:c.nodeType;
						c.isPrev=false;
						//第一个子节点的责任限额不能与上一节点相同
						if(j==0){
							c.nodeType=3;
							c.isPrev=false;
						};
					};
				});
			});
		},
		[type.TobInitChosen](state,param){
			//获取节点树形列表
			let l=state.tobCur.benefitList;
			//遍历出所有现有id的list，包括父节点
			let idList=l.reduce((p,c)=>{
				p.push(c.libId);
				return p.concat(c.children.map((o)=>{
					return o.libId;
				}));
			},[]);
			//遍历完整节点树
			param.forEach((p)=>{
				p.showEdit = false;
				p.benefitKeyDesc = unescape(p.benefitKeyDesc);
				p.benefitValueDesc = unescape(p.benefitValueDesc);
				p.nodeTitle = unescape(p.nodeTitle);
				//list中不包含当前父节点则全部加入
				if(idList.indexOf(p.libId)==-1){
					let pt=JSON.parse(JSON.stringify(p));
					pt.chosen=false;
					pt.children.forEach((c)=>{
						c.showEdit = false;
						c.benefitKeyDesc = unescape(c.benefitKeyDesc);
						c.benefitValueDesc = unescape(c.benefitValueDesc);
						c.nodeTitle = unescape(c.nodeTitle);
						c.chosen=false;
						c.isPrev=c.nodeType==4;
					});
					l.push(pt);
				}else{
					//找到当前父节点parent
					let parent;
					l.some((o)=>o.libId==p.libId&&(parent=o));
					//遍历完整节点树中当前父节点
					p.children.forEach((c)=>{
						c.showEdit = false;
						c.benefitKeyDesc = unescape(c.benefitKeyDesc);
						c.benefitValueDesc = unescape(c.benefitValueDesc);
						c.nodeTitle = unescape(c.nodeTitle);
						c.isPrev=c.nodeType==4;
						if(idList.indexOf(c.libId)==-1){
							let pt=JSON.parse(JSON.stringify(c));
							pt.chosen=false;
							parent.children.push(pt);
						}
					});
				}
			});
		},
		[type.TobFilterChosen](state,param){
			//挑选节点
			let l=state.tobCur.benefitList;
			let lenp=l.length;
			let countp=0;
			for(let ip=0;ip<lenp;ip++){
				let p=l[ip-countp];
				if((p.nodeType==2&&(!p.chosenSome&&!p.chosenAll))||((p.nodeType==1||p.nodeType==5)&&!p.chosen)){
					l.splice(ip-countp,1);
					countp++;
				}else if(p.children){
					let lenc=p.children.length;
					let countc=0;
					for(let ic=0;ic<lenc;ic++){
						let j=ic-countc;
						p.children[j].isPrev=p.children[j].nodeType==4;
						if(!p.children[j].chosen){
							p.children.splice(j,1);
							countc++;
						}
					}
					//第一个子节点的责任限额不能与上一节点相同
					if(p.children.length){
						p.children[0].nodeType=3;
						p.children[0].isPrev=false;
					};
				}
			}
		},
		[type.HospitalList](state,param){
			//获取医院列表
			param.forEach(function(p){
				p.chosen = false;
				//0:共付;1:无赔付;2:所有;
				//编辑tob的时候根据返回的共付和无赔付list来改变payType
				if(state.tobCur.coinsuranceArray && state.tobCur.coinsuranceArray.indexOf(p.HOS_ID) != -1) p.payType = 0;
				else if(state.tobCur.deductibleArray && state.tobCur.deductibleArray.indexOf(p.HOS_ID) != -1) p.payType = 1;
				else p.payType = 2;
			});
			state.hospitalListData = param;
		},
		[type.TobSave](state,param){
			//创建/修改tob
		}
	},
	actions: {
		[type.TobListData](context,param){
			//获取tob列表
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobList,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					result.data.pageCount = result.data.totalCount==0 ? 1 : result.data.totalCount%20==0 ? result.data.totalCount/20 : parseInt(result.data.totalCount/20)+1;
					context.commit(type.TobListData,result.data);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				context.rootState.pageStatus.isLoading = false;
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		},
	    [type.DeleteTob](context,param){
			//删除tob
			Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobDelete,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					result.data.pageCount = result.data.totalCount%20==0 ? result.data.totalCount/20 : parseInt(result.data.totalCount/20)+1;
					context.commit(type.DeleteTob,result.data);
					showDialog({type:'alert',message:'删除TOB成功.',context:context});
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		},
	    [type.CreatePdf](context,param){
			//生成pdf
			window.location.href = context.rootState.serverPath.commonPath + context.rootState.serverPath.downLoadPDF+'?tobId='+param.tobId;
		},
	    [type.SubmitPDF](context,param){
			//提交tob
			let tobId = param.tobId;
			Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.submitPDF,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				context.commit(type.SubmitPDF,{changeBtnStatus:true,tobId:tobId});
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					!result.data&&(result.data={});
					result.data.tobId = tobId;
					context.commit(type.SubmitPDF,result.data);
					showDialog({type:'alert',message:'提交TOB成功.',context:context});
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				context.commit(type.SubmitPDF,{changeBtnStatus:true,tobId:tobId});
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		},
		[type.TobPolicyRelationList](context,param){
			//保单关系列表
			let tobName = param.tobName;
			delete param.tobName;
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobPolicyRelationList,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					let message = '<table class="data-policyInfo"><colgroup><col width="80"/><col width="100"/><col/><col width="100"/><col width="100"/></colgroup>';
					message += '<thead><tr><th>产品编码</th><th>计划编码</th><th>团体编号</th><th>子团体编号</th><th>会员数</th></tr></thead><tbody>';
					result.data.forEach((item)=>{
						message += '<tr><td>'+item.productCode+'</td><td>'+item.planCode+'</td><td>'+item.groupCode+'</td><td>'+item.subGroupCode+'</td><td>'+item.mbCnt+'</td></tr>';
					});
					message += '</tbody></table>';
					showDialog({type:'window',message:message,context:context,style:{width:500,height:150,maxHeight:400},title: '关联保单信息 -- '+tobName});
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				context.rootState.pageStatus.isLoading = false;
				context.commit(type.SubmitPDF,{changeBtnStatus:true,tobId:tobId});
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		},
		[type.TobDetail](context,param){
			//获取tob详情
			if(param.tobId){
				context.rootState.pageStatus.isLoading = true;
				let path = param.path;
				delete param.path;
				Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.tobDetails,param,{
					headers: {
						'Accept': '*/*'
					}
				}).then(res =>{
					var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
					if(result.statusCode == '0'){
						//获取数据成功
						result.data.path = path;
						context.commit(type.TobDetail,result.data);
						//获取所有医院列表
						Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.hosList,param,{
							headers: {
								'Accept': '*/*'
							}
						}).then(res => {
							context.rootState.pageStatus.isLoading = false;
							var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
							if(result.statusCode == '0'){
								//获取数据成功
								context.commit(type.HospitalList,result.data);
							}else if(result.statusCode == '302'){
								//用户未登录
								showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
									context.commit(type.Logout);
								}});
							}else{
								showDialog({type:'alert',message:result.msg,context:context});
							};
						},err => {
							context.rootState.pageStatus.isLoading = false;
							showDialog({type:'alert',message:'网络错误.',context:context});
						});
					}else if(result.statusCode == '302'){
						//用户未登录
						showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
							context.commit(type.Logout);
						}});
					}else{
						showDialog({type:'alert',message:result.msg,context:context});
					};
				},err => {
					context.rootState.pageStatus.isLoading = false;
					showDialog({type:'alert',message:'网络错误.',context:context});
				});
			}else{
				context.commit(type.TobDetail,{
				    'tobName': '新建TOB',
				    'tobTitle': '请在这里输入TOB标题',
				    'isTemplate': 0,
				    'benefitList': [],
				    'coinsuranceArray': [],
				    'deductibleArray': []
				});
				//获取所有医院列表
				Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.hosList,param,{
					headers: {
						'Accept': '*/*'
					}
				}).then(res => {
					var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
					if(result.statusCode == '0'){
						//获取数据成功
						context.commit(type.HospitalList,result.data);
					}else if(result.statusCode == '302'){
						//用户未登录
						showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
							context.commit(type.Logout);
						}});
					}else{
						showDialog({type:'alert',message:result.msg,context:context});
					};
				},err => {
					showDialog({type:'alert',message:'网络错误.',context:context});
				});
			};
		},
		[type.TobRefreshOrder](context,param){
			//调整排序
			context.commit(type.TobRefreshOrder,param);
		},
		[type.TobInitChosen](context,param){
			//获取节点树形列表
			context.rootState.pageStatus.isLoading = true;
			Vue.http.post(context.rootState.serverPath.commonPath + context.rootState.serverPath.getTreeNode,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					context.commit(type.TobInitChosen,result.data);
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				context.rootState.pageStatus.isLoading = false;
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		},
		[type.TobFilterChosen](context,param){
			//挑选节点
			context.commit(type.TobFilterChosen);
		},
		[type.HospitalList](context,param){
			//获取医院列表
		},
		[type.TobSave](context,param){
			//创建/修改tob
			context.rootState.pageStatus.isLoading = true;
			let path = param.path;
			let type = param.isTemplate ? '模板' : 'TOB';
			delete param.path;
			let urlApi = path=='edit' ? context.rootState.serverPath.tobUpdate : context.rootState.serverPath.tobAdd;
			Vue.http.post(context.rootState.serverPath.commonPath + urlApi,param,{
				headers: {
					'Accept': '*/*'
				}
			}).then(res => {
				context.rootState.pageStatus.isLoading = false;
				var result = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
				if(result.statusCode == '0'){
					//获取数据成功
					result.data==''&&(result.data={});
					result.data.path = path;
					context.rootState.pageStatus.isSave = true;
					window.setTimeout(function(){
						context.rootState.pageStatus.isSave = false;
					},50);
					if(!result.data.tobId) showDialog({type:'alert',message:'修改'+type+'成功.',context:context});
					else if(result.data.path=='copy') showDialog({type:'alert',message:'复制'+type+'成功.',context:context});
					else showDialog({type:'alert',message:'创建'+type+'成功.',context:context});
				}else if(result.statusCode == '302'){
					//用户未登录
					showDialog({type:'toast',message:'未登录.',context:context,callback:function(){
						context.commit(type.Logout);
					}});
				}else{
					showDialog({type:'alert',message:result.msg,context:context});
				};
			},err => {
				context.rootState.pageStatus.isLoading = false;
				showDialog({type:'alert',message:'网络错误.',context:context});
			});
		}
	},
	getters: {
		getTobListData: (state)=>state.tobListData,
		getTobCur: (state)=>state.tobCur,
		getHospitalListData: (state)=>state.hospitalListData
	}
};
export {TobManage};


