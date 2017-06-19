<template>
  <div class="pt-manage">
    <dl v-for="(item, index) in allPointData" v-if="item.nodeType==2">
      <dt>
      	<header @click="modifycate(item.libId)">{{item.nodeTitle | toCn}}</header>
      </dt>
    	<dd v-for="childitem in item.children" @click="modifyPoint(childitem.libId)">{{childitem.nodeTitle | toCn}}</dd>
    	<dd class="btn" @click="createPoint(item.libId)">+新建节点</dd>
    </dl>
    <dl>
      <router-link to="/createcate/2" class="btn" tag="dd">+新建分类</router-link>
    </dl>
    <dl>
      <dt>
      	<header>自定义标题</header>
      </dt>
	    <dd v-for="(item, index) in allPointData" @click="modifycate(item.libId)" v-if="item.nodeType==1">{{item.nodeTitle | toCn}}</dd>
	  	<router-link to="/createcate/1" class="btn" tag="dd">+新建自定义标题节点</router-link>
    </dl>
    <dl>
      <dt>
      	<header>医院</header>
      </dt>
        <dd v-for="(item, index) in allPointData" @click="modifycate(item.libId)" v-if="item.nodeType==5">{{item.nodeTitle | toCn}}</dd>
      	<router-link to="/createcate/5" class="btn" tag="dd">+新建医院节点</router-link>
    </dl>
  </div>
</template>
<script>
import * as types from 'src/store/mutation-types.js';
import {mapGetters} from 'vuex';

export default{
  data(){
    return {
      allPointData: ''
    }
  },
  filters: {
		toCn: function(value){
			return unescape(value);
		}
  },
  computed: {
    ...mapGetters({
        allPointData: 'getAllPointData'
    })
  },
  beforeCreate(){
    this.$store.dispatch(types.QueryAllPointData);
  },
  methods: {
    modifyPoint(pointId){
      this.$router.push({'path': 'modifypoint/' + pointId});
    },
    createPoint(parentId){
      this.$router.push({'path': 'createpoint/' + 3 + '/' + parentId});
    },
    modifycate(id){
      this.$router.push({'path': 'modifycate/' + id});
    }
  }
}
</script>
