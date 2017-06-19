<template>
	<div class="pt-edit" :compute="setPageStatus">
	  <div class="title">{{this.$route.path.indexOf("modify")>-1 ? "修改"+typeText:"创建"+typeText}}</div>
	  <div class="content">
	    <div class="label">{{typeText}}名称</div>
	    <div class="label">
	    	<input type="text" class="ipt" :value="nodeTitle" :compute="getModeNodeTitle" @input="cnodeTitle"/>
	    </div>
	    <div class="label">* 不会在页面显示</div>
	  </div>
	  <div class="content">
	    <div class="label">描述文字</div>
	    <div class="label">
	      <div id="editor"></div>
	    </div>
	    <div class="label">* 会在页面显示</div>
	  </div>
	  <div v-show="isShowValEditor">
		  <div class="content">
		    <div class="label" @click='addKeyBenfit'>责任限额</div>
		    <div class="label">
		      <div id="editor2"></div>
		    </div>
		    <div class="label">* 会在页面显示</div>
		  </div>
	  </div>
	  <div class="content">
		  <div class="label">
	    	<button type="button" :class="[{btn:true},{saveDisable : !saveBtnDisable}]" @click="getEditorVal();">{{saveBtnVal}}</button>
	    </label>
	  </div>
	</div>
</template>

<script>
import * as types from 'src/store/mutation-types.js';
import {mapGetters} from 'vuex';
let isFromPointmanage = true;

export default{
  data() {
    return {
      saveBtnVal:"保存",
      saveBtnDisable:true,
      nodeTitle:"",
      keyBenfitTagMod:[],
      keyBenfitTagAdd:[{chart:"A",val:""}],
      benefitKeyDesc:"",
      benefitValueDesc:"",
      benefitReplaceKeys:"",
      benefitReplaceValues:"",
      isShowValEditor:true
    }
  },
  computed:{
    ...mapGetters({
      modifyPointData:"getModifyData",
			pageStatus: 'getPageStatus'
    }),
    typeText(){
      if(location.hash.match(/modifypoint|createpoint/))return "节点";
      return "分类";
    },
    setPageStatus(){
        this.saveBtnVal = "保存";
        this.saveBtnDisable = true;

     },
    getModeNodeTitle(){
      let ue1,ue2;
      if(location.hash.match(/modifypoint\/(\d+)/)){
        this.nodeTitle = unescape(this.modifyPointData.nodeTitle);
        let self =this;
        setTimeout(function(){
          UE.getEditor('editor').setContent(unescape(self.modifyPointData.benefitKeyDesc));
        },500);
        setTimeout(function(){
          UE.getEditor('editor2').setContent(unescape(self.modifyPointData.benefitValueDesc));
        },500);

      }else if(location.hash.match(/modifycate\/(\d+)/)){
        this.nodeTitle = unescape(this.modifyPointData.nodeTitle);
        if(this.modifyPointData.nodeType == 1){
          this.isShowValEditor = false;
        }
        let self =this;
        setTimeout(function(){
          UE.getEditor('editor').setContent(unescape(self.modifyPointData.benefitKeyDesc));
        },500);
        setTimeout(function(){
          UE.getEditor('editor2').setContent(unescape(self.modifyPointData.benefitValueDesc));
        },500);
      }else{
        return this.nodeTitle;
      }
    }
  },
  created(){
    //请求后台错误后恢复按钮状态
    let self = this;
		self.$watch('pageStatus.dialog.result',function(newVal,oldVal){
			if(!newVal){
        self.saveBtnVal = '保存';
        self.saveBtnDisable = true;
			};
		});
  },
   mounted(){
   		if(!isFromPointmanage) return;
      var router = location.hash.match(/modifypoint\/(\d+)/);
      var routercate = location.hash.match(/modifycate\/(\d+)/);

      if(router){
        this.keyBenfitTagMod=[];
        let pointId = "";
        if(router[1]){
            pointId = router[1];
            this.$store.dispatch(types.ModifyPoint,{"pointId":pointId});
        }
      }else if(routercate){
        if(routercate[1]){
            this.$store.dispatch(types.ModifyPoint,{"cateId":routercate[1]});
        }
      }
      if(location.hash.match(/createcate\/1/)){

        this.isShowValEditor = false;
      }
      UE.getEditor('editor',{initialFrameWidth:550,initialFrameHeight:250,scaleEnabled:true})
      UE.getEditor('editor2',{initialFrameWidth:550,initialFrameHeight:250,scaleEnabled:true})
   },
   beforeDestroy(){
   		if(!isFromPointmanage) return;
      UE.getEditor('editor').destroy();
      UE.getEditor('editor2').destroy();
      this.keyBenfitTagMod=[];
   },
   methods:{
     cnodeTitle(e){
       this.nodeTitle = e.target.value;
     },
     getEditorVal(e){
        if(!this.saveBtnDisable)return;
        var data = {
            benefitKeyDesc:escape(UE.getEditor('editor').getContent()),
            benefitValueDesc:escape(UE.getEditor('editor2').getContent()),
            nodeTitle:escape(this.nodeTitle)
        }
        let createPointReg = location.hash.match(/createpoint\/(\d+)\/(\d+)/);//匹配新增节点
        let createTypeReg = location.hash.match(/createcate\/(\d+)/);//匹配新增分类
        let modifyTypeReg = location.hash.match(/modifycate\/(\d+)/);//匹配修改分类
        if(location.hash.match(/modifypoint\/(\d+)/)){//如果是修改节点
            data.libId = this.modifyPointData.libId;
						if(!data.benefitKeyDesc || !data.nodeTitle ||  !data.benefitValueDesc){
							this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
							return;
						};
            this.$store.dispatch(types.SaveModifyPointData,data);
        }else if(createPointReg){//新增节点
          let benefitReplaceKeys=[],benefitReplaceValues=[];
          data.nodeType=3;
          data.parentId=createPointReg[2];
          data.orderId = 99999;
					if(!data.benefitKeyDesc || !data.nodeTitle ||  !data.benefitValueDesc){
						this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
						return;
					};
          this.$store.dispatch(types.SaveCreatePointData,data);
        }else if(createTypeReg){//新增分类
            data.nodeType=createTypeReg[1];
            data.orderId = 99999;
            data.parentId=0;
						if(!data.benefitKeyDesc || !data.nodeTitle){
							this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
							return;
						};
						if(data.nodeType!=1 && !data.benefitValueDesc){
							this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
							return;
						};
            this.$store.dispatch(types.SaveCreateCateData,data);
        }else if(modifyTypeReg){//修改分类
            data.libId = modifyTypeReg[1];
            data.nodeType = this.modifyPointData.nodeType;
						if(!data.benefitKeyDesc || !data.nodeTitle){
							this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
							return;
						};
						if(data.nodeType!=1 && !data.benefitValueDesc){
							this.$store.dispatch(types.DialogOpen,{type:'alert',message:'输入框都不能为空！'});
							return;
						};
            this.$store.dispatch(types.SaveModifyCateData,data);
        };
        this.saveBtnVal = "保存中...";
        this.saveBtnDisable = false;
    },
    addKeyBenfit:function(e){
       let abc="ABCDEFGHIJKLMNOPQRSTUVXYZ";
       let len;
       if(location.hash.match(/modifypoint\/(\d+)/)){
        len = this.keyBenfitTagMod.length;
       }
       if(location.hash.match(/createpoint\/(\d+)/)){
        len = this.keyBenfitTagAdd.length;
       }
       let chart = abc.substr(len,1);
       let obj = {};
       obj["chart"]=chart;
       obj["val"]="";
       if(location.hash.match(/modifypoint\/(\d+)/)){
        this.keyBenfitTagMod.push(obj);
       }
       if(location.hash.match(/createpoint\/(\d+)/)){
        this.keyBenfitTagAdd.push(obj);
       }
    }
 },
	beforeCreate(){
		!isFromPointmanage&&this.$router.push({path:'/pointmanage'});
	},
	beforeRouteEnter(to, from, next){
		isFromPointmanage = from.matched.length&&from.matched[0].path=='/pointmanage';
		next();
	}
}
</script>