import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
// hidden: true // (默认 false)

// //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
// redirect: 'noRedirect'

// // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// // 若你想不管路由下面的 children 声明的个数都显示你的根路由
// // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
// alwaysShow: true

// name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
// meta: {
//   roles: ['管理员', '供应商'] // 设置该路由进入的权限，支持多个权限叠加
//   title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
//   icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
//   noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
//   breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
//   affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

//   // 当路由设置了该属性，则会高亮相对应的侧边栏。
//   // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
//   // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
//   activeMenu: '/article/list'
// }

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  { // 企业总览
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '企业总览', icon: 'dashboard', affix: true }
    }]
  },

  { // 外协订单跟踪
    path: '/orderTracking',
    component: Layout,
    redirect: '/orderTracking/index',
    alwaysShow: true,
    meta: { title: '外协外购管理', icon: 'qutsourcing' },
    children: [
      {
        path: 'index',
        name: 'outList',
        component: () => import('@/views/orderTracking/index'),
        meta: { title: '外协订单跟踪', icon: 'table' }
      }
    ]
  },

  { // 外协申请管理
    path: '/application',
    // name: 'application',
    component: Layout,
    redirect: '/application/index',
    alwaysShow: true,
    meta: { title: '外协申请管理', icon: 'application' },
    children: [
      {
        path: 'index',
        name: 'appliList',
        component: () => import('@/views/appManage/requisition'),
        meta: { title: '外协申请列表', icon: 'table' }
      }
    ]
  },

  { // 转序管理
    path: '/retFactory',
    // name: 'retFactory',
    component: Layout,
    redirect: '/retFactory/index',
    alwaysShow: true,
    meta: { title: '转序管理', icon: 'form' },
    children: [
      {
        path: 'index',
        name: 'retFactoryList',
        component: () => import('@/views/retFactory/list'),
        meta: { title: '返厂转序单列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'addDtailList',
        hidden: true, // 隐藏
        component: () => import('@/views/retFactory/addList'),
        meta: { title: '转序单编辑', icon: 'table' }
      }
    ]
  }
]

export const asyncRoutes = [
  { // 保价信息管理
    path: '/quotation',
    component: Layout,
    redirect: '/quotation/list',
    alwaysShow: true,
    meta: {
      title: '报价信息管理',
      icon: 'quotation',
      roles: ['管理员', '供应商']
    },
    children: [
      {
        path: 'list',
        name: 'quotationList',
        component: () => import('@/views/quotationInfo/list'),
        meta: {
          title: '报价单',
          icon: 'table',
          roles: ['管理员']
        }
      },
      {
        path: 'lnquiryList',
        name: 'lnqList',
        component: () => import('@/views/quotationInfo/InquiryList'),
        meta: {
          title: '询价单',
          icon: 'table',
          roles: ['供应商']
        }
      }
    ]

  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
