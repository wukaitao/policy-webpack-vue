<template>
	<div class="login-container" :compute="setPageStatus">
		<div class="login-head">
			<div class="logo"></div>
			<div class="name">
				<h1>招商信诺TOB管理系统</h1>
			</div>
		</div>
		<div class="login-main">
			<div class="login-area">
				<div class="login-box">
					<h2 class="title">用户登录</h2>
					<form id="formLogin" method="post" @submit.prevent v-on:keyup.13="login">
						<div class="form-row">
							<label for="userName">用户名：</label>
							<input :disabled="pageStatus.isRequesting" v-model="userName" id="userName" type="text" name="userName" autocomplete="off" maxlength="12" placeholder="请输入用户名" class="textbox-text"/>
						</div>
						<div class="form-row">
							<label for="password"><span style="letter-spacing: 1em;">密</span>码：</label>
							<input :disabled="pageStatus.isRequesting" v-model="password" id="password" type="password" name="password" autocomplete="off" maxlength="20" placeholder="请输入密码" class="textbox-text"/>
						</div>
						<div class="btn-area">
							<button @click="login();" id="btnLogin" class="btn" :class="{'btn-disabled':pageStatus.isRequesting}" type="button">{{btnText}}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="login-foot">
			<p>Powered By 招商信诺信息技术中心</p>
		</div>
	</div>
</template>
<script>
import * as types from 'src/store/mutation-types.js';
import {mapGetters} from 'vuex';

export default {
	data(){
		return{
			userName: '',
			password: '',
			btnText: '登录'
		}
	},
	methods: {
		login: function(){
			if(this.pageStatus.isRequesting) return;
			let self = this;
			let userNameReg = /^[a-zA-Z\d]\w{3,11}[a-zA-Z\d]$/;
			let passwordReg = /^(\w){6,20}$/;
			self.userName = self.userName.replace(/^\s+|\s+$/g,'');
			self.password = self.password.replace(/^\s+|\s+$/g,'')
			if(!userNameReg.test(self.userName)){
				this.showDialog({type:'alert',message:'用户名必须是以数字或字母开头，4-12位字符'});
				return;
			}else if(!passwordReg.test(self.password)){
				this.showDialog({type:'alert',message:'密码必须是6-20位字母、数字、下划线'});
				return;
			};
			let param = {
				userName: this.userName,
				password: $.md5(this.password)
			};

			this.$store.dispatch(types.Login,param);
		},
      	showDialog: function(param){
      		//打开弹窗
      		this.$store.dispatch(types.DialogOpen,param);
      	}
	},
	computed:{
		...mapGetters({
			pageStatus: 'getPageStatus'
		}),
		setPageStatus(){
			if(this.pageStatus.isRequesting) this.btnText = '登录中...';
			else this.btnText = '登录';
		}
	}
}
</script>
