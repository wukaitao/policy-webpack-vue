<template>
<div class="pt-drag">
	<dl v-for="p in tobCur.benefitList" draggable="true" @dragstart="pDragStart($event,p)" @dragover.prevent="pDragOver($event,p)" @drop="pDrop($event,p)">
		<dt><header class="chosen">{{p.nodeTitle | toCn}}</header></dt>
		<dd v-for="c in p.children" class="chosen" draggable="true" @dragstart.stop="cDragStart($event,c)" @dragover.prevent.stop="cDragOver($event,c)" @drop="cDrop($event,p,c)">
			{{c.nodeTitle | toCn}}
		</dd>
	</dl>
	<button class="btn btn-primary" @click="back">完成</button>

</div>
</template>

<script>
import * as types from "src/store/mutation-types.js";
import {mapGetters} from 'vuex';
let dragObj={};
let isFromTob = true;

export default {
	data() {
		return {}
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
		pDragStart(ev,o){
			dragObj=o;
			ev.dataTransfer.effectAllowed = "move";
		},
		cDragStart(ev,o){
			dragObj=o;
			ev.dataTransfer.effectAllowed = "move";
		},
		pDragOver(ev,o){
			if(!dragObj.parentId) ev.dataTransfer.dropEffect = o.parentId==dragObj.parentId?"move":"none";
			else ev.dataTransfer.dropEffect = "none";
		},
		cDragOver(ev,o){
			if(dragObj.parentId) ev.dataTransfer.dropEffect = o.parentId==dragObj.parentId?"move":"none";
		},
		pDrop(ev,o){
			if(!dragObj.parentId){
				let op=this.tobCur.benefitList.indexOf(dragObj);
				let tp=this.tobCur.benefitList.indexOf(o);
				this.tobCur.benefitList.splice(op,1);
				this.tobCur.benefitList.splice(tp,0,dragObj);
			}
		},
		cDrop(ev,p,o){
			if(dragObj.parentId){
				let op=p.children.indexOf(dragObj);
				let tp=p.children.indexOf(o);
				p.children.splice(op,1);
				p.children.splice(tp,0,dragObj);
			}
		}
	},
	computed:{
		...mapGetters({
			tobCur: 'getTobCur'
		})
	},
	beforeCreate(){
		!isFromTob&&this.$router.push({path:'/'});
	},
	beforeRouteEnter(to, from, next){
		isFromTob = from.matched.length&&
					(from.matched[0].path=='/tobadd'||from.matched[0].path=='/tobedit/:id'||from.matched[0].path=='/tobcopy/:id');
		next();
	}
}
</script>