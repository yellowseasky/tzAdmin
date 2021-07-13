
import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setId, setPsw, removeId, removePsw } from '@/utils/auth'
// import { Message } from 'element-ui'
import router, { resetRouter } from '@/router/index'

const getDefaultState = () => {
  return {
    token: getToken(),
    empId: '', // 用户ID
    empType: '' // 用户类型
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EMPID: (state, empId) => {
    state.empId = empId
  },
  SET_EMPTYPE: (state, empType) => {
    state.empType = empType
  }

}

const actions = {
  // 用户登录
  login({ commit }) {
    return new Promise((resolve, reject) => {
      login().then(response => {
        const { access_token: token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ dispatch, commit, state }, { username, password }) {
    return new Promise((resolve, reject) => {
      getInfo(username, password).then(response => {
        const { data } = response
        if (!data) {
          dispatch('resetToken')
          router.push({ path: '/login' })
          return reject(response.message)
        }
        const { empId, empType } = data
        commit('SET_EMPID', empId)
        commit('SET_EMPTYPE', empType)
        setId(username)
        setPsw(password)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeId()
      removePsw()
      commit('RESET_STATE')
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

