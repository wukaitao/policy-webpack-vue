<template>
<div class="pt-choose">
	<dl v-if="p.nodeType==2" v-for="p in tobCur.benefitList">
		<dt><header :class="{chosenSome: chosenSome(p),chosenAll: p.chosenAll}" @click="chosenAll(p);">{{p.nodeTitle | toCn}}</header></dt>
		<dd v-for="c in p.children" :class="{chosen: c.chosen}" @click="choose(c);">
			{{c.nodeTitle | toCn}}
		</dd>
	</dl>
	<dl>
		<dt><header :class="{chosenSome: chosenSome(1),chosenAll: chosenAll1}" @click="chosenAll(1);">自定义标题</header></dt>
		<dd v-if="c.nodeType==1" v-for="c in tobCur.benefitList" :class="{chosen: c.chosen}" @click="choose(c);">
			{{c.nodeTitle | toCn}}
		</dd>
	</dl>
	<dl>
		<dt><header :class="{chosenSome: chosenSome(5),chosenAll: chosenAll5}" @click="chosenAll(5);">医院</header></dt>
		<dd v-if="c.nodeType==5" v-for="c in tobCur.benefitList" :class="{chosen: c.chosen}" @click="choose(c);">
			{{c.nodeTitle | toCn}}
		</dd>
	</dl>
	<!--<button class="btn" @click="back();">返回</button>-->
	<button class="btn btn-primary" @click="back();">挑选完成</button>
</div>
</template>

<script>
import * as types from "src/store/mutation-types.js";
import {mapGetters} from 'vuex';
let isFromTob = true;

export default {
	data() {
		return {
			chosenAll1: false,
			chosenAll5: false
		}
	},
	filters: {
		toCn: function(value){
			return unescape(value);
		}
	},
	methods:{
		back(){
			this.$router.back();
		},
		choose(cpt){
			cpt.chosen=!cpt.chosen;
		},
		chosenSome(p){
			if(p==1){
				//自定义标题
				let list=this.tobCur.benefitList.filter((p)=>p.nodeType==1);
				if(!list.length) return;
				let chosenSome=false;
				this.chosenAll1=!list.some((pt)=>!pt.chosen);
				if(this.chosenAll1) chosenSome=false;
				else chosenSome=list.some((pt)=>pt.chosen);
				return chosenSome;
			}else if(p==5){
				//医院
				let list=this.tobCur.benefitList.filter((p)=>p.nodeType==5);
				if(!list.length) return;
				let chosenSome=false;
				this.chosenAll5=!list.some((pt)=>!pt.chosen);
				if(this.chosenAll5) chosenSome=false;
				else chosenSome=list.some((pt)=>pt.chosen);
				return chosenSome;
			}else{
				//分类节点
				if(!p.children.length) return;
				let chosenSome=false;
				p.chosenAll=!p.children.some((pt)=>!pt.chosen);
				if(p.chosenAll) chosenSome=false;
				else chosenSome=p.children.some((pt)=>pt.chosen);
				p.chosenSome=chosenSome;
				return chosenSome;
			};
		},
		chosenAll(p){
			if(p==1){
				//自定义标题
				let list=this.tobCur.benefitList.filter((p)=>p.nodeType==1);
				if(!list.length) return;
				this.chosenAll1=!this.chosenAll1;
				if(this.chosenAll1) list.forEach((pt)=>pt.chosen=true);
				else list.forEach((pt)=>pt.chosen=false);
			}else if(p==5){
				//医院
				let list=this.tobCur.benefitList.filter((p)=>p.nodeType==5);
				if(!list.length) return;
				this.chosenAll5=!this.chosenAll5;
				if(this.chosenAll5) list.forEach((pt)=>pt.chosen=true);
				else list.forEach((pt)=>pt.chosen=false);
			}else{
				//分类节点
				if(!p.children.length) return;
				p.chosenAll=!p.chosenAll;
				if(p.chosenAll) p.children.forEach((pt)=>pt.chosen=true);
				else p.children.forEach((pt)=>pt.chosen=false);
			};
		}
	},
	computed:{
		...mapGetters({
			tobCur: 'getTobCur'
		})
	},
	beforeCreate(){
		if(isFromTob) this.$store.dispatch(types.TobInitChosen);
		else this.$router.push({path:'/'});
	},
	beforeRouteEnter(to, from, next){
		isFromTob = from.matched.length&&
					(from.matched[0].path=='/tobadd'||from.matched[0].path=='/tobedit/:id'||from.matched[0].path=='/tobcopy/:id');
		next();
	}
}
</script>