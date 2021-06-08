// import { login, logout, getInfo } from '@/api/user'
import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setId, setPsw, removeId, removePsw } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: 'yellow',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMPID: (state, empId) => {
    state.empId = empId
  },
  SET_EMPTYPE: (state, empType) => {
    state.empType = empType
  }
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

const actions = {
  // user login
  login({ dispatch, commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(response => {
      login().then(response => {
        const { access_token: token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        // dispatch('getInfo', userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }, { username, password }) {
    return new Promise((resolve, reject) => {
      getInfo(username, password).then(response => {
      // getInfo({ ctrl: 'Employee', act: 'Login', accessToken: state.token, data: { EmpCode: username.trim(), EmpPassword: password }}).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
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

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeId()
      removePsw()
      commit('RESET_STATE')
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

