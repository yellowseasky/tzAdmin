
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const hasGetUserEmpId = userInfo.empId
      const hasRoles = userInfo.empType
      if (hasGetUserEmpId) {
        const isAddRoutes = store.getters.addRoutes.length
        if (!isAddRoutes) {
          const accessRoutes = await store.dispatch('permission/generateRoutes', hasRoles)
          router.addRoutes(accessRoutes)
          next({ path: '/' })
        } else {
          next()
        }
        // next()
      } else {
        // try {
        // 刷新
        // const { username, password } = JSON.parse(localStorage.getItem('user'))
        // await store.dispatch('user/getInfo', { username, password })
        //   next()
        // } catch (error) {
        //   await store.dispatch('user/resetToken')
        //   Message.error(error || '出错,请重新登录')
        //   next(`/login?redirect=${to.path}`)
        //   NProgress.done()
        // }
        await store.dispatch('user/resetToken')
        Message.error('用户ID丢失,请重新登录')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    localStorage.removeItem('user')
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他无权访问的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
