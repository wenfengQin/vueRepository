// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [{
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}, {
  path: '/',
  component: goods
}];

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes // 只能写成这个名字，其他名字路由无法渲染
});

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

