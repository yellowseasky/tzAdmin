import router, { resetRouter } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getId, getPsw } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasEmpId = store.getters.empId
      const hasEmpTypes = store.getters.empType
      if (hasEmpId && hasEmpTypes) {
        const accessRoutes = await store.dispatch('permission/generateRoutes', hasEmpTypes)
        resetRouter()
        router.addRoutes(accessRoutes)
        next()
      } else {
        // 刷新了
        try {
          const { empType } = await store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          const accessRoutes = await store.dispatch('permission/generateRoutes', empType)
          resetRouter()
          router.addRoutes(accessRoutes)
          // next({ ...to, replace: true })
          await store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          next()
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || '出错')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
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
