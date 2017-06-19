// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store/index';
import Nav from './components/Nav.vue';
import Popup from './components/Popup.vue';
import Login from './components/Login.vue';
import PointManage from './components/pointManage/PointManage.vue';
import CreatePoint from './components/pointManage/CreatePoint.vue';
import TobManage from './components/tobManage/TobManage.vue';
import TobEdit from './components/tobManage/TobEdit.vue';
import PointChoose from './components/tobManage/PointChoose.vue';
import PointDrag from './components/tobManage/PointDrag.vue';
require('assets/css/common.css');
require('assets/css/page.css');
Vue.use(VueRouter);

const routes = [
  { path: '/login', component: Login },
  { path: '', component: TobManage },
  { path: '/tobmanage', component: TobManage },
  { path: '/tobadd', component: TobEdit },
  { path: '/tobview/:id', component: TobEdit },
  { path: '/tobedit/:id', component: TobEdit },
  { path: '/tobcopy/:id', component: TobEdit },
  { path: '/pointchoose', component: PointChoose },
  { path: '/pointdrag', component: PointDrag },
  { path: '/pointmanage', component: PointManage },
  { path: '/createcate/:type',component: CreatePoint },
  { path: '/modifycate/:id', component: CreatePoint },
  { path: '/createpoint/:type/:parentId', component: CreatePoint },
  { path: '/modifypoint/:pointId', component: CreatePoint }
];

const router = new VueRouter({
  routes: routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { 
    'head-nav': Nav,
    'popup': Popup
  }
})
