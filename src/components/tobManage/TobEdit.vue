<template>
<div class="tob-edit">
	<header>
		<button class="btn" @click="back();">返回</button>
		<button class="btn" @click="save();" v-if="showTobBtn()">保存TOB</button>
		<button class="btn" @click="save(true);" v-if="showTemplateBtn()">保存模板</button>
		<router-link to="/pointchoose" class="btn" tag="button" v-if="showEditBtn()">挑选节点</router-link>
		<router-link to="/pointdrag" class="btn" tag="button" v-if="showEditBtn()">调整排序</router-link>
	</header>
	<section>
		<!-- 基础信息 -->
		<article>
			<nav>
				<div>基础信息</div>
				<hr>
				<button class="btn" v-if="showEditBtn()" @click="show('editBase',{count:1,id:'baseeditor0',nodeIndex:'base',bind:'tobTitle'})">{{editBase?'预览':'编辑'}}</button>
			</nav>
			<table v-show="!editBase">
				<colgroup>
					<col width="100"/><col/>
				</colgroup>
				<tr>
					<td class="label">
						<span v-if="!tobCur.isTemplate">TOB名称：</span>
						<span v-if="tobCur.isTemplate">模板名称：</span>
					</td>
					<td>
						<div class="detail" v-html="tobCur.tobName"></div>
					</td>
				</tr>
				<tr>
					<td class="label" valign="top">
						<span v-if="!tobCur.isTemplate">TOB标题：</span>
						<span v-if="tobCur.isTemplate">模板标题：</span>
					</td>
					<td>
						<div class="detail" v-html="tobCur.tobTitle"></div>
					</td>
				</tr>
			</table>
			<table v-show="editBase">
				<colgroup>
					<col width="100"/><col/>
				</colgroup>
				<tr>
					<td class="label">
						<span v-if="!tobCur.isTemplate">TOB名称：</span>
						<span v-if="tobCur.isTemplate">模板名称：</span>
					</td>
					<td>
						<input type="text" class="ipt" maxlength="250" v-model="tobCur.tobName">
					</td>
				</tr>
				<tr>
					<td class="label" valign="top">
						<span v-if="!tobCur.isTemplate">TOB标题：</span>
						<span v-if="tobCur.isTemplate">模板标题：</span>
					</td>
					<td id="baseeditor0" class="editor"></td>
				</tr>
			</table>
		</article>
		<!-- 分类节点 -->
		<div v-for="(parent,index) in tobCur.benefitList">
			<div v-if="parent.nodeType==2" :id="'o'+parent.libId">
				<nav class="nodeType2">
					<div>{{parent.nodeTitle | toCn}}</div>
					<hr style="margin-top: 15px;">
					<button class="btn" v-if="showEditBtn()" @click="show(parent,{count:2,id:'o'+parent.libId+'editor0'+'-o'+parent.libId+'editor1',nodeIndex:index+'',bind:'benefitKeyDesc-benefitValueDesc'})">{{parent.showEdit?'预览':'编辑'}}</button>
				</nav>
				<table>
					<tr>
						<td class="label">描述文字：</td>
						<td class="label">责任限额：</td>
					</tr>
					<tr v-show="!parent.showEdit">
						<td>
							<div class="detail" v-html="parent.benefitKeyDesc"></div>
						</td>
						<td>
							<div class="detail" v-html="parent.benefitValueDesc"></div>
						</td>
					</tr>
					<tr v-show="parent.showEdit">
						<td :id="'o'+parent.libId+'editor0'" class="editor"></td>
						<td :id="'o'+parent.libId+'editor1'" class="editor"></td>
					</tr>
				</table>
				<!-- 子节点 -->
				<article style="margin-left: 2em;" v-for="(point,subIndex) in parent.children">
					<nav>
						<div>{{point.nodeTitle | toCn}}</div>
						<hr>
						<button class="btn" v-if="showEditBtn()" @click="show(point,{count:2,id:'p'+point.libId+'editor0'+'-p'+point.libId+'editor1',nodeIndex:index+'-'+subIndex,bind:'benefitKeyDesc-benefitValueDesc'})">{{point.showEdit?'预览':'编辑'}}</button>
					</nav>
					<table>
						<tr>
							<td class="label">描述文字：</td>
							<td class="label">
								责任限额：
								<span v-if="!!subIndex" v-show="!point.showEdit&&point.isPrev" style="float: right;color: #000">
									<input type="checkbox" v-model="point.isPrev" disabled="disabled"/>
									与上一节点相同
								</span>
								<span v-if="!!subIndex" v-show="point.showEdit" style="float: right;color: #000;">
									<input type="checkbox" v-model="point.isPrev" v-on:change="changeIsPrev(point);"/>
									与上一节点相同
								</span>
							</td>
						</tr>
						<tr v-show="!point.showEdit">
							<td>
								<div class="detail" v-html="point.benefitKeyDesc"></div>
							</td>
							<td>
								<div class="detail" v-show="!point.isPrev" v-html="point.benefitValueDesc"></div>
							</td>
						</tr>
						<tr v-show="point.showEdit">
							<td :id="'p'+point.libId+'editor0'" class="editor"></td>
							<td v-show="!point.isPrev" :id="'p'+point.libId+'editor1'" class="editor"></td>
						</tr>
					</table>
				</article>
			</div>
			<!-- 自定义节点 -->
			<article v-if="parent.nodeType==1" :id="'o'+parent.libId">
				<nav class="nodeType1">
					<div>{{parent.nodeTitle | toCn}}</div>
					<hr>
					<button class="btn" v-if="showEditBtn()" @click="show(parent,{count:1,id:'o'+parent.libId+'editor0',nodeIndex:index+'',bind:'benefitKeyDesc'})">{{parent.showEdit?'预览':'编辑'}}</button>
				</nav>
				<table>
					<tr>
						<td class="label">自定义节点：</td>
					</tr>
					<tr v-show="!parent.showEdit">
						<td>
							<div class="detail" v-html="parent.benefitKeyDesc"></div>
						</td>
					</tr>
					<tr v-show="parent.showEdit">
						<td :id="'o'+parent.libId+'editor0'" class="editor"></td>
					</tr>
				</table>
			</article>
			<!-- 医院节点 -->
			<article v-if="parent.nodeType==5" :id="'o'+parent.libId">
				<nav class="nodeType5">
					<div>{{parent.nodeTitle | toCn}}</div>
					<hr>
					<button class="btn" v-if="showEditBtn()" @click="show(parent,{count:2,id:'o'+parent.libId+'editor0'+'-o'+parent.libId+'editor1',nodeIndex:index+'',bind:'benefitKeyDesc-benefitValueDesc'})">{{parent.showEdit?'预览':'编辑'}}</button>
				</nav>
				<table>
					<tr>
						<td class="label">医院节点标题：</td>
						<td class="label">医院节点描述：</td>
					</tr>
					<tr v-show="!parent.showEdit">
						<td>
							<div class="detail" v-html="parent.benefitKeyDesc"></div>
						</td>
						<td>
							<div class="detail" v-html="parent.benefitValueDesc"></div>
						</td>
					</tr>
					<tr v-show="parent.showEdit">
						<td :id="'o'+parent.libId+'editor0'" class="editor"></td>
						<td :id="'o'+parent.libId+'editor1'" class="editor"></td>
					</tr>
				</table>
			</article>
		</div>
		<!-- 医院选择 -->
		<article>
			<nav>
				<div>医院选择</div>
				<hr>
				<button class="btn" v-if="showEditBtn()" @click="show('editHospital',{count:0,id:'',nodeIndex:'',bind:''})">{{editHospital?'预览':'编辑'}}</button>
			</nav>
			<table v-show="!editHospital">
				<tr>
					<td class="label">共付医院：</td>
					<td class="label">无赔付医院：</td>
				</tr>
				<tr>
					<td valign="top">
						<ul class="detail">
							<li v-bind:class="{'exp':one.IS_EXPENSIVE}"  v-for="one in hospitalListData" v-if="one.payType==0">{{one.HOS_NAME | toCn}}</li>
						</ul>
					</td>
					<td valign="top">
						<ul class="detail">
							<li v-bind:class="{'exp':one.IS_EXPENSIVE}" v-for="one in hospitalListData" v-if="one.payType==1">{{one.HOS_NAME | toCn}}</li>
						</ul>
					</td>
				</tr>
			</table>
			<table v-show="editHospital" class="table-hospital" :compute="setBtnStatus">
				<colgroup>
					<col width="40%"/><col width="20%"/><col width="40%"/>
				</colgroup>
				<tr>
					<td class="type">
						医院类型选择：
						<span class="tab-container">
							<span class="tab" v-bind:class="{'selected':curHospitalType=='coinsuranceList'}" @click="curHospitalType='coinsuranceList';">共付医院</span>
							<span class="tab" v-bind:class="{'selected':curHospitalType=='deductibleList'}" @click="curHospitalType='deductibleList';">无赔付医院</span>
						</span>
					</td>
					<td></td>
					<td class="toolbar">
						<span class="searchbox">
							<input type="text" placeholder="请输入医院名称" v-model="keyWord"/>
							<i @click="searchHospital();" class="icon-search"></i>
						</span>
					</td>
				</tr>
				<tr>
					<td class="title label">
						所有医院
						<span class="choose">
							<input type="checkbox" :disabled="isDisabledHosSelectedAllLeft" v-model="hosSelectedAllLeft"/>全选
						</span>
					</td>
					<td></td>
					<td class="title label">
						选中医院
						<span class="choose">
							<input type="checkbox" :disabled="isDisabledHosSelectedAllRight" v-model="hosSelectedAllRight"/>全选
						</span>
					</td>
				</tr>
				<tr>
					<td>
						<div class="hospital-container">
							<ul>
								<li class="hospital" v-bind:class="{'selected':one.chosen,'exp':one.IS_EXPENSIVE}" v-on:click="one.chosen=!one.chosen;" v-for="one in searchHospital()" v-if="one.payType==2">{{one.HOS_NAME | toCn}}</li>
							</ul>
						</div>
					</td>
					<td class="text-center">
						<span class="btn" :class="{'btn-disabled':!hasChosenLeft}" @click="addHospital();"> &gt;&gt; </span>
						<span class="btn" :class="{'btn-disabled':!hasChosenRight}" @click="removeHospital();"> &lt;&lt; </span>
						<span class="btn" :class="{'btn-disabled':!hasExpLeft}" @click="addExpHospital();">添加所有昂贵医院 </span>
						<span class="btn" :class="{'btn-disabled':!hasExpRight}" @click="removeExpHospital();">移除所有昂贵医院 </span>
					</td>
					<td>
						<div class="hospital-container">
							<ul v-show="curHospitalType=='coinsuranceList'">
								<li class="hospital" v-bind:class="{'selected':one.chosen,'exp':one.IS_EXPENSIVE}" v-on:click="one.chosen=!one.chosen;" v-for="one in hospitalListData" v-if="one.payType==0">{{one.HOS_NAME | toCn}}</li>
							</ul>
							<ul v-show="curHospitalType=='deductibleList'">
								<li class="hospital" v-bind:class="{'selected':one.chosen,'exp':one.IS_EXPENSIVE}" v-on:click="one.chosen=!one.chosen;" v-for="one in hospitalListData" v-if="one.payType==1">{{one.HOS_NAME | toCn}}</li>
							</ul>
						</div>
					</td>
				</tr>
			</table>
		</article>
	</section>
	<footer>
		<button class="btn" @click="back();">返回</button>
		<button class="btn btn-primary" @click="save();" v-if="showTobBtn()">保存TOB</button>
		<button class="btn btn-primary" @click="save(true);" v-if="showTemplateBtn()">保存模板</button>
	</footer>
	<button class="btn toTop" @click="toTop();">Top</button>
</div>
</template>

<script>
import * as types from 'src/store/mutation-types.js';
import {mapGetters} from 'vuex';
let ueList = [];
let chose = false;
let drag = false;
//保存编辑器数据到state中
function saveEditorContent(self,isDestroy){
	ueList.forEach(function(item){
		if(!self.pageStatus.isSave){
			//在保存tob后不再保存到state
			let id = item.id;
			let nodeIndex = item.nodeIndex;
			let bind = item.bind;
			let value = item.ue.getContent();
			if(id=='baseeditor0') self.tobCur[bind]=value;//tob标题
			else if(nodeIndex.length==1){
				//自定义节点/医院节点/分类节点
				self.tobCur.benefitList[nodeIndex[0]][bind] = value;
				self.tobCur.benefitList[nodeIndex[0]].showEdit = false;
			}else if(nodeIndex.length==2){
				//子节点
				self.tobCur.benefitList[nodeIndex[0]].children[nodeIndex[1]][bind] = value;
				self.tobCur.benefitList[nodeIndex[0]].children[nodeIndex[1]].showEdit = false;
			};
		};
		isDestroy&&item.ue.destroy();
	});
	isDestroy&&(ueList=[]);
};

export default{
	data(){
		return{
			pagePath: '',
			keyWord: '',
			//coinsuranceList:共付医院;deductibleList:无赔付医院
			curHospitalType: 'coinsuranceList',
			editBase: false,
			editHospital: false,
			isDisabledHosSelectedAllLeft: false,
			isDisabledHosSelectedAllRight: false,
			hasChosenLeft: false,
			hasChosenRight: false,
			hasExpLeft: false,
			hasExpRight: false
		}
	},
	created(){
		//固定菜单
		$(window).scroll(function(){
			let scollTop = $(window).scrollTop();
			if(scollTop<80) $('.tob-edit header').css({top:80-scollTop+'px'});
			else $('.tob-edit header').css({top:'0px'});
			if(scollTop>10) $('.toTop').fadeIn('show');
			else $('.toTop').fadeOut('show');
		});
	},
	beforeDestroy(){
		//保存编辑器数据到state中后销毁编辑器
		let self = this;
		saveEditorContent(self,true);
	},
	filters: {
		toCn: function(value){
			return unescape(value);
		}
	},
	methods:{
		showEditBtn: function(){
			//查看且为模板管理人员的时候隐藏
			this.pagePath = this.$route.matched[0].path;
			return this.pagePath!='/tobview/:id';
		},
		showTobBtn: function(){
			//新建/复制(tob/模板)/编辑(tob)的时候true
			this.pagePath = this.$route.matched[0].path;
			return ['/tobadd','/tobcopy/:id'].indexOf(this.pagePath)!=-1 || (this.pagePath=='/tobedit/:id'&&!this.tobCur.isTemplate);
		},
		showTemplateBtn: function(){
			//新建/复制(tob/模板)/编辑(模板)的时候true
			this.pagePath = this.$route.matched[0].path;
			return (['/tobadd','/tobcopy/:id'].indexOf(this.pagePath)!=-1||(this.pagePath=='/tobedit/:id'&&this.tobCur.isTemplate))&&this.pageStatus.isTemplateManager;
		},
		show(obj,param){
			let self = this;
			let count = param.count;
			let id = param.id.split('-');
			let nodeIndex = param.nodeIndex.split('-');
			let bind = param.bind.split('-');
			//编辑/预览模式切换
			if(typeof obj == 'string') self[obj] = !self[obj];
			else if(typeof obj == 'object') obj.showEdit = !obj.showEdit;
			if(!count) return;
			//预览-保存编辑器数据到state中
			if((typeof obj=='object'&&!obj.showEdit)||(typeof obj=='string'&&!self[obj])){
				if(obj=='editBase'){
					//tob标题
					let value = ueList.filter(function(item){return item.id=='baseeditor0'})[0].ue.getContent();
					self.tobCur.tobTitle = value;
				}else if(nodeIndex.length==1){
					//自定义节点/医院节点/分类节点
					for(let i=0;i<count;i++){
						let oUe = ueList.filter(function(item){return item.id=='o'+obj.libId+'editor'+i})[0];
						self.tobCur.benefitList[nodeIndex[0]][oUe.bind] = oUe.ue.getContent();
					};
				}else if(nodeIndex.length==2){
					//子节点
					for(let i=0;i<count;i++){
						let oUe = ueList.filter(function(item){return item.id=='p'+obj.libId+'editor'+i})[0];
						self.tobCur.benefitList[nodeIndex[0]].children[nodeIndex[1]][oUe.bind] = oUe.ue.getContent();
					};
				};
			//编辑-渲染编辑器
			}else if((typeof obj=='object'&&obj.showEdit)||(typeof obj=='string'&&self[obj])){
				let lUe = [];
				if(obj=='editBase') lUe = ueList.filter(function(item){return item.id=='baseeditor0'});//tob标题
				else if(nodeIndex.length==1||nodeIndex.length==2) lUe = ueList.filter(function(item){return item.id==id[0]||item.id==id[1]});//自定义节点/医院节点/分类节点/子节点
				//如果存在编辑器则直接显示
				if(!!lUe.length) return;
				for(let i=0;i<count;i++){
					(function(){
						let value = '';
						if(obj=='editBase') value = self.tobCur[bind[i]];
						else if(nodeIndex.length==1) value = self.tobCur.benefitList[nodeIndex[0]][bind[i]];//自定义节点/医院节点/分类节点
						else if(nodeIndex.length==2) value = self.tobCur.benefitList[nodeIndex[0]].children[nodeIndex[1]][bind[i]];//子节点
						let editor = UE.getEditor(id[i],{initialFrameWidth:'100%',initialFrameHeight:150,scaleEnabled:true});
						editor.ready(function(){
							this.setContent(value);
						});
						ueList.push({
							id: id[i],
							nodeIndex: nodeIndex,
							bind: bind[i],
							ue: editor
						});
					})();
				};
			};
		},
		searchHospital: function(){
			//搜索医院列表
			var self = this;
			return self.hospitalListData.filter(function(item){
				return item.HOS_NAME.indexOf(self.keyWord) != -1;
			});
		},
		addHospital: function(){
			//添加医院
			let self = this;
			self.hospitalListData.forEach(function(item){
				if(item.payType=='2'&&item.chosen){
					if(self.curHospitalType == 'coinsuranceList') item.payType = '0';
					else if(self.curHospitalType == 'deductibleList') item.payType = '1';
					item.chosen = false;
				};
			});
		},
		removeHospital: function(){
			//移除医院
			let self = this;
			self.hospitalListData.forEach(function(item){
				let flag = (item.payType=='0'&&item.chosen&&self.curHospitalType == 'coinsuranceList') || (item.payType=='1'&&item.chosen&&self.curHospitalType == 'deductibleList');
				if(flag){
					item.payType = '2';
					item.chosen = false;
				};
			});
		},
		addExpHospital: function(){
			//添加所有昂贵医院
			let self = this;
			self.hospitalListData.forEach(function(item){
				if(item.IS_EXPENSIVE&&item.payType=='2'){
					if(self.curHospitalType == 'coinsuranceList') item.payType = '0';
					else if(self.curHospitalType == 'deductibleList') item.payType = '1';
					item.chosen = false;
				};
			});
		},
		removeExpHospital: function(){
			//移除所有昂贵医院
			let self = this;
			self.hospitalListData.forEach(function(item){
				if(item.IS_EXPENSIVE){
					if(self.curHospitalType=='coinsuranceList'&&item.payType=='0') item.payType = '2';
					else if(self.curHospitalType=='deductibleList'&&item.payType=='1') item.payType = '2';
					item.chosen = false;
				};
			});
		},
		changeIsPrev: function(obj){
			//改变isPrev
			obj.nodeType = obj.isPrev ? 4:3;
		},
		toTop(){
			//页面滚动到顶部
			$('body').animate({scrollTop:0},'slow');
		},
		save: function(isTemplate){
			let self = this;
			//更新orderId
			if(!drag) this.$store.dispatch(types.TobRefreshOrder,{isResetNodeType: false});
			//保存编辑器数据到state中
			saveEditorContent(self);
			//保存TOB
			let data = JSON.parse(JSON.stringify(this.tobCur));
			let hosData = JSON.parse(JSON.stringify(this.hospitalListData));
			let param = {
				tobName: data.tobName,
				tobTitle: escape(data.tobTitle),
				coinsuranceArray: [],
				deductibleArray: [],
				nodeArray: [],
				isTemplate: isTemplate ? 1 : 0,
				path: this.$route.matched[0].path=='/tobcopy/:id'?'copy':this.$route.matched[0].path=='/tobedit/:id'?'edit':'add'
			};
			//tobId
			!!this.$route.params.id && (param.tobId=this.$route.params.id);
			//coinsuranceArray/deductibleArray
			hosData.forEach(function(item){
				item.payType==0 && param.coinsuranceArray.push(item.HOS_ID);
				item.payType==1 && param.deductibleArray.push(item.HOS_ID);
			});
			//nodeArray
			data.benefitList.forEach(function(item){
				param.nodeArray.push({
					benefitKeyDesc: escape(item.benefitKeyDesc),
					benefitValueDesc: escape(item.benefitValueDesc),
					libId: item.libId,
					nodeType: item.nodeType,
					orderId: item.orderId,
					parentId: item.parentId,
					mergeNodeNum: 0
				});
				if(!!item.children&&!!item.children.length){
					item.children.forEach(function(subItem,subIndex){
						let mergeNodeNum = 0;
						if(subItem.nodeType=='3'){
							mergeNodeNum = 1;
							for(let i=subIndex+1;i<item.children.length;i++){
								if(item.children[i].nodeType=='3'){
									break;
								};
								mergeNodeNum++;
							};
						};
						param.nodeArray.push({
							benefitKeyDesc: escape(subItem.benefitKeyDesc),
							benefitValueDesc: escape(subItem.benefitValueDesc),
							libId: subItem.libId,
							nodeType: subItem.nodeType,
							orderId: subItem.orderId,
							parentId: subItem.parentId,
							mergeNodeNum: mergeNodeNum
						});
					});
				};
			});
			param.coinsuranceArray = JSON.stringify(param.coinsuranceArray);
			param.deductibleArray = JSON.stringify(param.deductibleArray);
			param.nodeArray = JSON.stringify(param.nodeArray);
			//校验
			if(data.tobName.replace(/^\s+|\s+$/g,'')==''){
				self.$store.dispatch(types.DialogOpen,{type:'alert',message:'TOB名称不能为空'});
				return;
			}else if(data.tobTitle.replace(/^\s+|\s+$/g,'')==''){
				self.$store.dispatch(types.DialogOpen,{type:'alert',message:'TOB标题不能为空'});
				return;
			};
			this.$store.dispatch(types.TobSave,param);
		},
		back: function(){
			//返回
			let self = this;
			self.$router.back();
		}
	},
	computed:{
		...mapGetters({
			tobCur: 'getTobCur',
			hospitalListData: 'getHospitalListData',
			pageStatus: 'getPageStatus'
		}),
		setBtnStatus(){
			let payType = this.curHospitalType=='coinsuranceList'?'0':'1';
			//所有医院全选按钮禁止状态
			let allLength = this.searchHospital().filter(function(item){return item.payType=='2'}).length;
			if(allLength) this.isDisabledHosSelectedAllLeft = false;
			else this.isDisabledHosSelectedAllLeft = true;
			//选中医院全选按钮禁止状态
			let chosenLength = this.hospitalListData.filter(function(item){return item.payType==payType}).length;
			if(chosenLength) this.isDisabledHosSelectedAllRight = false;
			else this.isDisabledHosSelectedAllRight = true;
			//添加医院按钮禁止状态
			let chosenLeftLength = this.searchHospital().filter(function(item){return item.payType=='2'&&item.chosen}).length;
			if(chosenLeftLength) this.hasChosenLeft = true;
			else this.hasChosenLeft = false;
			//移除医院按钮禁止状态
			let chosenRightLength = this.hospitalListData.filter(function(item){return item.payType==payType&&item.chosen}).length;
			if(chosenRightLength) this.hasChosenRight = true;
			else this.hasChosenRight = false;
			//添加所有昂贵医院按钮禁止状态
			let expLeftLength = this.hospitalListData.filter(function(item){return item.payType=='2'&&item.IS_EXPENSIVE}).length;
			if(expLeftLength) this.hasExpLeft = true;
			else this.hasExpLeft = false;
			//移除所有昂贵医院按钮禁止状态
			let expRightLength = this.hospitalListData.filter(function(item){return item.payType==payType&&item.IS_EXPENSIVE}).length;
			if(expRightLength) this.hasExpRight = true;
			else this.hasExpRight = false;
		},
		hosSelectedAllLeft: {
			set:function(newVal){
				for(let item of this.searchHospital()) if(item.payType=='2') item.chosen = newVal;
			},
			get:function(){
				let flag = true;
				if(!this.searchHospital().filter(function(item){return item.payType=='2'}).length) return false;
				for(let item of this.searchHospital()){
					if(item.payType=='2' && !item.chosen){
						flag = false;
						break;
					};
				};
				return flag;
			}
		},
		hosSelectedAllRight: {
			set: function(newVal){
				for(let item of this.hospitalListData){
					let isCoinsurance = this.curHospitalType=='coinsuranceList';
					let isDeductible = this.curHospitalType=='deductibleList';
					if(isCoinsurance) item.payType=='0'&&(item.chosen=newVal);
					else if(isDeductible) item.payType=='1'&&(item.chosen=newVal);
				};
			},
			get: function(){
				let flag = true;
				let isNoCoinsurance = this.curHospitalType=='coinsuranceList'&&!this.hospitalListData.filter(function(item){return item.payType=='0'}).length;
				let isNoDeductible = this.curHospitalType=='deductibleList'&&!this.hospitalListData.filter(function(item){return item.payType=='1'}).length;;
				if(isNoCoinsurance||isNoDeductible) return false;
				for(let item of this.hospitalListData){
					let isCoinsurance = item.payType=='0'&&!item.chosen&&this.curHospitalType=='coinsuranceList';
					let isDeductible = item.payType=='1'&&!item.chosen&&this.curHospitalType=='deductibleList';
					if(isCoinsurance||isDeductible){
						flag = false;
						break;
					};
				};
				return flag;
			}
		}
	},
	beforeCreate(){
		let self = this;
		let param = {
			tobId: self.$route.params.id,
			path: self.$route.matched[0].path=='/tobcopy/:id'?'copy':self.$route.matched[0].path=='/tobedit/:id'?'edit':'add'
		};
		if(chose) self.$store.dispatch(types.TobFilterChosen);
		else if(drag) self.$store.dispatch(types.TobRefreshOrder,{isResetNodeType: true});
		else self.$store.dispatch(types.TobDetail,param);
		//初始化页面配置
		self.editBase = false;
		self.editHospital = false;
	},
	beforeRouteEnter(to, from, next){
		chose = from.path=='/pointchoose';
		drag = from.path=='/pointdrag';
		next();
	}
}
</script>