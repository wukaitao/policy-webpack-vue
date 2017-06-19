<template>
	<div class="tob-manage" @click="showSearchType=false;">
	  <div id="loadProg" class="loadProg" v-show="showLoadProg"><div id="progTip" class="progTip"></div></div>
		<div class="toolbar">
			<div class="toolbar-row">
				<span class="searchbox">
					<input type="text" v-model="pageStatus.tobKeyword" placeholder="请输入TOB名称或memberId" v-on:keyup.13="goPage(1,true)"/>
					<span class="type">
						<span @click.stop="showSearchType=!showSearchType">
							{{pageStatus.oSearch.name}}<i :class="showSearchType?'icon-arrow_drop_up':'icon-arrow_drop_down'"></i>
						</span>
						<ul v-if="showSearchType">
							<li v-for="one in pageStatus.aSearch" @click.stop="changeSearchType(one);">{{one.name}}</li>
						</ul>
					</span>
					<i @click="goPage(1,true);" class="icon-search"></i>
				</span>
			</div>
			<div class="toolbar-row pos_rel">
				<span class="btn btn-primary pos_rel_btn">+上传保单信息<div id="upload-bd-1" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传理赔信息<div id="upload-lp-1" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传会员数据<div id="upload-hy-1" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传会员卡数据<div id="upload-card-1" class="uploadcon"></div></span>
				<a href="#/tobadd" class="btn btn-primary">+新建TOB</a>
				<span @click="delSelectedTob();" class="btn btn-warn">!批量删除</span>
			</div>
		</div>
		<table class="data-table">
			<colgroup>
				<col width="82"/><col/><col width="70"/><col width="180"/><col width="130"/><col width="150"/><col width="130"/><col width="180"/>
			</colgroup>
			<thead>
				<tr>
					<th>
						全选  <input :disabled="isDisabledChooseAll" type="checkbox" v-model="chooseAll"/>
						<button class="btn" @click="chooseInvert();">反选</button>
					</th>
					<th>名称</th>
					<th>编号</th>
					<th>保单信息</th>
					<th>最后修改人</th>
					<th @click="sortBy('updateTime');">
						最后修改日期
						<span v-if="sort=='up'">↑</span>
						<span v-if="sort=='down'">↓</span>
					</th>
					<th>状态</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="one in sortBy()" v-if="sortBy().length" :class="{'template':one.isTemplate}">
					<td class="text-center">
						<input type="checkbox" v-model="one.chosen"/>
					</td>
					<td class="text-ellipsis" :title="one.tobName">{{one.tobName | toCn}}</td>
					<td class="text-center">
						<span v-if="!one.isTemplate">{{one.tobId}}</span>
						<span v-if="one.isTemplate">模板</span>
					</td>
					<td class="text-center" v-if="!one.isTemplate">
						<span v-if="!!one.policyKeyMsg">
							{{one.policyKeyMsg}}<i class="icon-eye" @click="showTobPolicyRelation(one.tobId,one.tobName);"></i>
						</span>
					</td>
					<td class="text-center" v-if="one.isTemplate"></td>
					<td class="text-center">{{one.updateBy}}</td>
					<td class="text-center">{{one.updateTime}}</td>
					<td class="text-center" v-if="!one.isTemplate">
						<span v-if="one.policyStatus==0">
							<span style="margin-right: 5px;">待提交</span>
							<span class="btn" @click="postTob(one);" v-if="!one.isPosting">提交</span>
							<span class="btn btn-disabled" v-if="one.isPosting">提交中.</span>
						</span>
						<span v-if="one.policyStatus==1">
							<span style="margin-right: 5px;color: #999;">已提交</span>
							<span class="btn" @click="postTob(one);" v-if="!one.isPosting">再提交</span>
							<span class="btn btn-disabled" v-if="one.isPosting">提交中.</span>
						</span>
					</td>
					<td class="text-center" v-if="one.isTemplate"></td>
					<td class="text-center">
						<router-link :to="'/tobview/'+one.tobId" tag="span" v-if="one.isTemplate&&!pageStatus.isTemplateManager" class="btn">查看</router-link>
						<router-link :to="'/tobedit/'+one.tobId" tag="span" v-if="!one.isTemplate||pageStatus.isTemplateManager" class="btn">修改</router-link>
						<router-link :to="'/tobcopy/'+one.tobId" tag="span" class="btn">复制</router-link>
						<span @click="createPdf(one.tobId);" class="btn">生成pdf</span>
					</td>
				</tr>
				<tr v-if="!sortBy().length">
					<td colspan="8" class="text-center">暂时没有数据，请稍后查询</td>
				</tr>
			</tbody>
		</table>
		<div class="toolbar">
			<div class="toolbar-row">
				<span class="btn btn-primary pos_rel_btn">+上传保单信息<div id="upload-bd-2" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传理赔信息<div id="upload-lp-2" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传会员数据<div id="upload-hy-2" class="uploadcon"></div></span>
				<span class="btn btn-primary pos_rel_btn">+上传会员卡数据<div id="upload-card-2" class="uploadcon"></div></span>
				<a href="#/tobadd" class="btn btn-primary">+新建TOB</a>
				<span @click="delSelectedTob();" class="btn btn-warn">!批量删除</span>
			</div>
		</div>
		<div class="pagination">
			<span class="pageInfo">共有 {{tobListData.totalCount}} 条记录，每页显示 20 条，当前第 {{tobListData.currentPage}}/{{tobListData.pageCount}} 页</span>
			<span @click="goPage(1,tobListData.currentPage!=1);" v-bind:class="{'btn-primary':tobListData.currentPage!=1,'btn-disabled':tobListData.currentPage==1}" class="btn">第一页</span>
			<span @click="goPage(parseInt(tobListData.currentPage)-1,parseInt(tobListData.currentPage)>1);" v-bind:class="{'btn-primary':parseInt(tobListData.currentPage)>1,'btn-disabled':parseInt(tobListData.currentPage)<=1}" class="btn">上一页</span>
			<span @click="goPage(parseInt(tobListData.currentPage)+1,parseInt(tobListData.currentPage)+1<=parseInt(tobListData.pageCount));" v-bind:class="{'btn-primary':parseInt(tobListData.currentPage)+1<=parseInt(tobListData.pageCount),'btn-disabled':parseInt(tobListData.currentPage)+1>parseInt(tobListData.pageCount)}" class="btn">下一页</span>
			<span @click="goPage(parseInt(tobListData.pageCount),parseInt(tobListData.currentPage)!=parseInt(tobListData.pageCount));" v-bind:class="{'btn-primary':parseInt(tobListData.currentPage)!=parseInt(tobListData.pageCount),'btn-disabled':parseInt(tobListData.currentPage)==parseInt(tobListData.pageCount)}" class="btn">最后一页</span>
				<select class="ipt-goPage" v-model="selectedPage" @change="goPage(selectedPage,true);">
					<option v-for="one in tobListData.pageCount" v-bind:value="one">{{one}}</option>
				</select>
		</div>
		<script type="text/plain" id="editor"></script>
	</div>
</template>

<script>
import * as types from "src/store/mutation-types.js";
import {mapGetters} from 'vuex';

export default {
	data(){
	    return{
	    	tobListData: '',
	    	selectedPage: 1,
	    	chooseAll: false,
	    	isDisabledChooseAll: false,
	    	sort: '',
	    	showLoadProg:false,
	    	showSearchType: false
	    }
	},
	mounted(){
	      let self = this;
	      let config_bd;
        let configBase = {
           fileName:"file",
           showQueueDiv:"progTip",
           dragdropWidth:"100%",
           statusBarWidth:"auto",
           onSelect:function(files){
             $("#progTip").show().children().remove();
             let textKey;
             if(/policyDataUpload/.test(this.url)){
                textKey = "保单";
             }else if(/claimsDataUpload/.test(this.url)){
                textKey = "理赔";
             }else if(/memberDataUpload/.test(this.url)){
                textKey = "会员";
             }else if(/memberCardDataUpload/.test(this.url)){
                textKey = "会员卡";
             }

             if(files && files[0] && files[0].name && files[0].name.indexOf(textKey)>-1){
               console.log("true")
             }else{
              self.$store.dispatch(types.DialogOpen,{"display":true,"message":"文件名称必须包含‘"+textKey+"’关键字。"});
               return false;
             }

             console.log(files[0].name)
           },
           onSuccess:function(files,data,xhr,pd){

             if(typeof data == "string"){
              var data = JSON.parse(data);
             }
             self.showLoadProg = false;

             if(data && data.statusCode == '0'){
               self.$store.dispatch(types.DialogOpen,{"display":true,"message":"文件上传成功"});
             }else{
               self.$store.dispatch(types.DialogOpen,{"display":true,"message":data.msg});
             }
           },

           onError:function(){
              self.showLoadProg = false;
           },
           onCancel:function(){
            self.showLoadProg = false;
           },
           onSubmit:function(){
            self.showLoadProg = true;
           }
        };
        config_bd=Object.assign({url:this.$store.state.serverPath.commonPath+"policyDataUpload"},configBase);
        let config_lp=Object.assign({url:this.$store.state.serverPath.commonPath+"claimsDataUpload"},configBase);
        let config_hy=Object.assign({url:this.$store.state.serverPath.commonPath+"memberDataUpload"},configBase);
        let config_card=Object.assign({url:this.$store.state.serverPath.commonPath+"memberCardDataUpload"},configBase);

        $("#upload-bd-1").uploadFile(config_bd);
        $("#upload-bd-2").uploadFile(config_bd);
      	$("#upload-lp-1").uploadFile(config_lp);
      	$("#upload-lp-2").uploadFile(config_lp);
      	$("#upload-hy-1").uploadFile(config_hy);
      	$("#upload-hy-2").uploadFile(config_hy);
      	$("#upload-card-1").uploadFile(config_card);
      	$("#upload-card-2").uploadFile(config_card);

	},
	filters: {
		toCn: function(value){
			return unescape(value);
		},
		toDate: function(value){
			return value.substring(0,10);
		}
	},
 	methods: {
	 	hidetip(){
	 	    $("#show").hide();
	 	},
	 	postTob: function(one){
	 		let self = this;
 			self.showDialog({type:'confirm',message:'请确认是否提交TOB.',callback:function(){
		 		let param = {tobId: one.tobId};
		 		one.isPosting=true;
				self.$store.dispatch(types.SubmitPDF,param);
        	}});
	 	},
 		goPage: function(currentPage,flag){
 			if(!flag) return;
 			//搜索/分页
 			this.sort = '';
 			this.pageStatus.currentPage = currentPage;
			let param = {currentPage: currentPage};
			this.pageStatus.oSearch.isTemplate!==''&&(param.isTemplate=this.pageStatus.oSearch.isTemplate);
			if(/^[0-9]*$/.test(this.pageStatus.tobKeyword)) param.tobMemberIdPattern = this.pageStatus.tobKeyword;
			else param.tobNamePattern = this.pageStatus.tobKeyword;
			this.$store.dispatch(types.TobListData,param);
 		},
 		delSelectedTob: function(){
 			//批量删除tob
 			let self = this;
			let param = {
				currentPage: this.tobListData.currentPage,
				tobIdArray: []
			};
			this.pageStatus.oSearch.isTemplate!==''&&(param.isTemplate=this.pageStatus.oSearch.isTemplate);
			if(/^[0-9]*$/.test(this.pageStatus.tobKeyword)) param.tobMemberIdPattern = this.pageStatus.tobKeyword;
			else param.tobNamePattern = this.pageStatus.tobKeyword;
 			for(var one of this.tobListData.basicList){
 				if(!!one.chosen) param.tobIdArray.push(one.tobId);
 			};
 			if(!param.tobIdArray.length){
 				this.showDialog({type:'alert',message:'请选择要删除的TOB'});
 				return;
 			};
 			param.tobIdArray = JSON.stringify(param.tobIdArray);
 			this.showDialog({type:'confirm',message:'删除TOB将不可恢复，请确认是否删除所选TOB.',style:{width:360,height:150},callback:function(){
				self.$store.dispatch(types.DeleteTob,param);
        	}});
 		},
 		createPdf: function(id){
 			//生成pdf
			this.$store.dispatch(types.CreatePdf,{tobId: id});
 		},
 		showTobPolicyRelation: function(id,tobName){
 			//保单关系列表
			this.$store.dispatch(types.TobPolicyRelationList,{tobId: id,tobName: tobName});
 		},
 		uploadSettlement: function(){
 			//上传理赔信息
 		},
	 	sortBy: function(date){
	 		//排序
	 		let self = this;
	 		if(!date) return this.tobListData.basicList;
	 		else{
	 			this.sort = this.sort=='up' ? 'down' : 'up';
	 			return this.tobListData.basicList.sort(function(a,b){
          			let atime = new Date(a[date].replace(/-/g,'/')).getTime();
          			let btime = new Date(b[date].replace(/-/g,'/')).getTime();
		 			if(self.sort=='up') return atime < btime ? -1 : 1;
		 			else return atime > btime ? -1 : 1;
		 		});
	 		};
	 	},
	 	chooseInvert: function(){
	 		//反选
			for(let item of this.tobListData.basicList){
				item.chosen = !item.chosen;
			};
	 	},
      	showDialog: function(param){
      		//打开弹窗
      		this.$store.dispatch(types.DialogOpen,param);
      	},
      	changeSearchType: function(oSearch){
      		this.pageStatus.oSearch = oSearch;
      		this.showSearchType = !this.showSearchType;
      	}
 	},
	computed:{
		...mapGetters({
		    tobListData: 'getTobListData',
			pageStatus: 'getPageStatus'
		}),
		chooseAll: {
			set: function(newVal){
				for(let item of this.tobListData.basicList){
					item.chosen = newVal;
				};
			},
			get: function(){
				let flag = true;
				if(!this.sortBy()||!this.sortBy().length){
					this.isDisabledChooseAll = true;
					return false;
				}else this.isDisabledChooseAll = false;
				for(let item of this.tobListData.basicList){
					if(!item.chosen){
						flag = false;
						break;
					};
				};
				return flag;
			}
		}
	},
	created(){
		let self = this;
		//获取tob列表
		this.pageStatus.currentPage = 1;
		this.pageStatus.tobKeyword = '';
		this.pageStatus.oSearch = {isTemplate:'',name:'全部'};
    	this.pageStatus.aSearch = [{isTemplate:'',name:'全部'},{isTemplate:0,name:'TOB'},{isTemplate:1,name:'模板'}];
		let param = {currentPage: this.pageStatus.currentPage};
		this.pageStatus.oSearch.isTemplate!==''&&(param.isTemplate=this.pageStatus.oSearch.isTemplate);
		if(/^[0-9]*$/.test(this.pageStatus.tobKeyword)) param.tobMemberIdPattern = this.pageStatus.tobKeyword;
		else param.tobNamePattern = this.pageStatus.tobKeyword;
		this.$store.dispatch(types.TobListData,param);
		//监听当前页码
		self.$watch('tobListData',function(newVal,oldVal){
			self.selectedPage = newVal.currentPage;
		});
	}
}
</script>
<style>

.progTip{width:550px;height:108px;background:#fff;border-radius:10px;position:absolute;margin:auto;left:0;top:0;bottom:0;right:0;}
.loadProg{width:100%;height:100%;background:rgba(0,0,0,0.5);position:fixed;left:0;top:0;z-index:999;}
</style>
