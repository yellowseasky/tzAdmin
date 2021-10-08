import { login, getInfo } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router/index'

const getDefaultState = () => {
  return {
    token: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
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
  // 获取用户信息
  getInfo({ dispatch, commit, state }, { username, password }) {
    return new Promise((resolve, reject) => {
      getInfo(username, password).then(response => {
        const { data } = response
        if (!data) {
          return reject(response.message)
        }

        const { empId, empType } = data
        const userInfo = {
          empId,
          empType
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))

        resolve(data)
      }).catch(err => {
        console.log(err)
      })
    })
  },

  // 移除token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      localStorage.removeItem('userInfo')
      removeToken() // must remove  token  first
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
