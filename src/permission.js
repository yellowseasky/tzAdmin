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
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      console.log('login GO')
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasEmpId = store.getters.empId
      const hasEmpTypes = store.getters.empType && store.getters.empType.length > 0
      if (hasEmpId && hasEmpTypes) {
        const roleType = store.getters.empType
        const accessRoutes = await store.dispatch('permission/generateRoutes', roleType)
        resetRouter()
        router.addRoutes(accessRoutes)
        next()
      } else {
        try {
          const { empType } = await store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          const accessRoutes = await store.dispatch('permission/generateRoutes', empType)
          resetRouter()
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
          await store.dispatch('user/getInfo', { username: getId(), password: getPsw() })
          next()
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
