<template>
	<div class="login-container">
		{{pageMessage}}
		<a href="#/tobmanage">跳转路由</a>
		<div style="width: 100%;height: 150px;" id="editorWrap">{{name}}</div>
	</div>
</template>
<script>
import md5 from 'md5';
console.log('Login.vue');
export default {
	data(){
		return{
			pageMessage: 'This is Login',
			name: 'Nicky.Wu'
		}
	},
	created(){
		console.log(md5('Nicky.Wu'));
		UE.getEditor('editorWrap');
	}
}
</script>
<style scoped>
	.login-container{
		background-color: #dedede;
	}
</style>