// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import "babel-polyfill";
import VueRouter from 'vue-router'
import routers from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'font-awesome/css/font-awesome.css'
import './assets/iconfont/iconfont.css'

import TokenUtil from './utils/TokenUtil'
import StorageUtil from './utils/StorageUtil'
import Constant from './utils/Constant'
import LockUtil from './utils/LockUtil'
import RouterUtil  from './utils/RouterUtil'
import ajax from './utils/AjaxUtil'
import api from './api/index'
import axios from 'axios'

Vue.prototype.$axios = axios
Vue.prototype.$ajax = ajax
Vue.prototype.$api = api
Vue.prototype.$router = VueRouter;

Vue.config.productionTip = false

Vue.use(iView)

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  routes: routers,
};
const router = new VueRouter(RouterConfig);


// //路由配置
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  let user = StorageUtil.select(Constant.USER_KEY);
  let token = TokenUtil.getToken();
  let isExpirated = TokenUtil.isExpirated();
  let isLogin = (user !== null) && token && !isExpirated;
  let isLoginPage = to.path == '/login';
  let isLockPage = to.path == '/lock';
  if (!isLogin) {
    //清空缓存
    if(StorageUtil.select(Constant.PLATFORM)){
      StorageUtil.delete(Constant.PLATFORM)
    }
    if (!isLoginPage) {
      next({path: '/login', query: {redirect: to.fullPath}})
    } else {
      next();//登录页面放行
    }
  } else {
    if (isLoginPage) {//
      next(false);
      iView.LoadingBar.finish();
    } else {
      if (LockUtil.isLocked()) {
        if (!isLockPage) {
          next({path: '/lock'});
        } else {
          if (from.path == '/lock') {
            next(false);
            iView.LoadingBar.finish();
          } else {
            next();//锁屏页面放行
          }
        }
      } else {
        let isExist = RouterUtil.isExist(to);
        if(!isExist){
          next({path: '/404'});
        }else{
          let permission = RouterUtil.hasPermission(to.path);
          if(permission||user.superAdmin){
            next();
          }else{
            next({path: '/403'});
          }
        }
      }
    }
  }
} );

router.afterEach(() => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
