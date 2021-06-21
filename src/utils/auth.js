import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const IdKey = 'user'
const IdPsw = 'password'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 用户账号
export function getId() {
  return Cookies.get(IdKey)
}

export function setId(id) {
  return Cookies.set(IdKey, id)
}

export function removeId() {
  return Cookies.remove(IdKey)
}

// 用户密码
export function getPsw() {
  return Cookies.get(IdPsw)
}

export function setPsw(psw) {
  return Cookies.set(IdPsw, psw)
}

export function removePsw() {
  return Cookies.remove(IdPsw)
}
