<template>
	<div class="c nav" v-if="!isLoginPath()">
		<div class="title">招商信诺TOB管理系统</div>
		<div class="welcome">欢迎您，<strong>{{getNickname()}}</strong> | <span @click="logout();" class="logout">退出</span></div>
		<div class="menu">
			<a @click="goPath('/tobmanage');" :class="isTobPath()?'focus':''">TOB管理</a>
			<span class="br">｜</span>
			<a @click="goPath('/pointmanage');" :class="isPointPath()?'focus':''">节点管理</a>
		</div>
	</div>
</template>
<script>
import * as types from "src/store/mutation-types.js";

export default {
	data() {
		return {
			pagePath: '',
			tobManagePath: ['/tobmanage','','/tobview/:id'],
			tobEditPath: ['/tobadd','/tobedit/:id','/tobcopy/:id'],
			tobPointPath: ['/pointchoose','/pointdrag'],
			pointManagePath: ['/pointmanage'],
			pointEditPath: ['/createcate/:type','/modifycate/:id','/createpoint/:type/:parentId','/modifypoint/:pointId']
		}
	},
	created(){
		//节点挑选/跳转顺序 刷新则跳转到tob管理
        let self = this;
		window.onbeforeunload = function(){
			if(self.isTobPointPath()) return '刷新当前页面将丢失节点操作并返回首页，请确认.';
			else if(self.isPointEditPath()) return '刷新页面将丢失页面操作并返回节点管理页面，请确认.';
		};
	},
   methods:{
		isLoginPath: function(){
			//登录页隐藏菜单
			return this.$route.matched[0].path=='/login';
		},
		getNickname: function(){
			//用户名
			return unescape(localStorage.getItem('nickname'));
		},
		logout: function(){
			let self = this;
			self.showDialog({type:'confirm',message:'请确认是否退出系统',callback:function(){
				self.$store.dispatch(types.Logout);
        	}});
		},
        goPath: function(path){
	      	let self = this;
	        let message = this.isTobEditPath() ? '离开当前页面将丢失未保存的TOB内容，请确认.' :
	                this.isTobPointPath() ? '离开当前页面将丢失节点操作，请确认.' : '离开页面将丢失未保存的内容';
	        if(this.isTobEditPath()||this.isTobPointPath()||this.isPointEditPath()){
	        	this.showDialog({type:'confirm',message:message,callback:function(){
	        		self.$router.push({path:path});
	        	}});
	        }else{
	        	this.$router.push({path:path});
	        };
        },
      	showDialog: function(param){
      		//打开弹窗
      		this.$store.dispatch(types.DialogOpen,param);
      	},
      	isTobPath: function(){
      		//tob页面
	        this.pagePath = this.$route.matched[0].path;
	        return this.tobManagePath.concat(this.tobEditPath,this.tobPointPath).indexOf(this.pagePath) != -1;
      	},
      	isPointPath: function(){
      		//节点页面
	        this.pagePath = this.$route.matched[0].path;
	        return this.pointManagePath.concat(this.pointEditPath).indexOf(this.pagePath) != -1;
      	},
      	isTobPointPath: function(){
      		//tob节点操作页面
	        this.pagePath = this.$route.matched[0].path;
	        return this.tobPointPath.indexOf(this.pagePath) != -1;
      	},
      	isPointEditPath: function(){
      		//节点编辑页面
	        this.pagePath = this.$route.matched[0].path;
	        return this.pointEditPath.indexOf(this.pagePath) != -1;
      	},
      	isTobEditPath: function(){
      		//tob编辑页面
	        this.pagePath = this.$route.matched[0].path;
	        return this.tobEditPath.indexOf(this.pagePath) != -1;
      	}
	}
}
</script>