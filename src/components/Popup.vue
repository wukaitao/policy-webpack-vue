<template>
	<div class="popup" :compute="setPageStatus">
		<div v-show="pageStatus.isLoading" class="cover">
			<div class="loading">
				<div class="box">
					<div class="contaier-one">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
					<div class="contaier-two">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
					<div class="contaier-three">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
					<div class="contaier-four">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
					<div class="contaier-five">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
					<div class="contaier-sixe">
						<span class="rect-odd"></span><span class="rect-even"></span>
					</div>
				</div>
				<p>加载中...</p>
			</div>
		</div>
		<div :class="{'show':pageStatus.dialog.show}" class="dialog">
			<div class="dialog-wrap">
				<div class="dialog-box" v-if="pageStatus.dialog.type!='toast'" :style="{width:+pageStatus.dialog.style.width+'px'}">
					<div class="dialog-title">
						<i @click="closeDialog();" class="icon-cross"></i>
						{{pageStatus.dialog.title}}
					</div>
					<div class="dialog-content" :style="{
						height: pageStatus.dialog.style.maxHeight?'auto':pageStatus.dialog.style.height-66+'px'
					}">
						<i v-if="pageStatus.dialog.type=='confirm'" :class="pageStatus.dialog.icon==''?'icon-question':pageStatus.dialog.icon"></i>
						<i v-if="pageStatus.dialog.type=='alert'" :class="pageStatus.dialog.icon==''?'icon-notification':pageStatus.dialog.icon"></i>
						<i v-if="pageStatus.dialog.type=='tips'" :class="pageStatus.dialog.icon==''?'icon-info':pageStatus.dialog.icon"></i>
						<p v-html="pageStatus.dialog.message" :style="{
							minHeight: pageStatus.dialog.style.maxHeight?pageStatus.dialog.style.height-76+'px':'100%',
							maxHeight: pageStatus.dialog.style.maxHeight?pageStatus.dialog.style.maxHeight+'px':'auto'
						}"></p>
					</div>
					<div class="dialog-toolbar">
						<button @click="confirmDialog();" class="btn btn-primary">确定</button>
						<button v-if="pageStatus.dialog.type=='confirm'" @click="closeDialog();" class="btn">取消</button>
					</div>
				</div>
				<div class="toast-box" v-if="pageStatus.dialog.type=='toast'">
					<i :class="pageStatus.dialog.icon==''?'icon-circle-cross':pageStatus.dialog.icon"></i>
					<p v-html="pageStatus.dialog.message"></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import * as types from 'src/store/mutation-types.js';
import {mapGetters} from 'vuex';

export default {
	data(){
		return{}
	},
	methods: {
    	closeDialog: function(){
    		//关闭弹窗
    		let param = {result: false};
    		this.$store.dispatch(types.DialogCancel,param);
    	},
    	confirmDialog: function(){
    		//确认操作
    		let param = {result: true};
    		if(this.pageStatus.dialog.type=='alert') this.closeDialog();
    		else this.$store.dispatch(types.DialogCancel,param);
    	}
	},
	computed:{
		...mapGetters({
			pageStatus: 'getPageStatus'
		}),
		setPageStatus(){
			//页面跳转
			let path = this.$route.matched[0].path;
			//登录状态
			if(path=='/login'){
				this.pageStatus.isLoading = false;
		        this.pageStatus.isLogin&&this.$router.push({path:'/tobmanage'});
			}else{
				!this.pageStatus.isLogin&&this.$router.push({path:'/login'});
			};
			//保存跳转
			if(path=='/tobadd'||path=='/tobedit/:id'||path=='/tobcopy/:id'){
				this.pageStatus.isSave&&this.$router.push({path:'/tobmanage'});
			}else if(path=='/createcate/:type'||path=='/modifycate/:id'||path=='/createpoint/:type/:parentId'||path=='/modifypoint/:pointId'){
				this.pageStatus.isSave&&this.$router.push({path:'/pointmanage'});
			};
			//弹窗回调
	        this.pageStatus.dialog.result&&this.pageStatus.dialog.callback.call(this);
		}
	}
}
</script>