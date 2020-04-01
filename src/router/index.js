//路由
const routers = [
  //系统登录页面
  {
    path: '/',
    name: '',
    icon: '',
    meta: {
      title: '登录',
    },
    component: (resolve) => require(['../views/Blank.vue'], resolve)
  },
  {
    path: '/login',
    name: '',
    icon: '',
    meta: {
      title: '登录',
    },
    component: (resolve) => require(['../views/Login.vue'], resolve)
  },
  {
    path: '/main',
    name: 'main',
    icon: '',
    meta: {
      title: '登录',
    },
    component: (resolve) => require(['../views/Main.vue'], resolve)
  },
]

export default routers;
