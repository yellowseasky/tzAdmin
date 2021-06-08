import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// 获取token
export function login(params) {
  return request({
    url: '/DefaultApi/GetToken?clientId=HTYW001&ClientSecret=a2xmZHNpb2dlcjtyZ2o7bF4lJF4zOTAyMyYqJV4kVEhHSkhLIA==',
    method: 'get',
    params
  })
}
// 获取用户信息
export function getInfo(EmpCode, EmpPassword) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    // data
    data: {
      ctrl: 'Employee',
      act: 'Login',
      accessToken: getToken(),
      data:
      {
        EmpCode,
        EmpPassword
      }
    }
  })
}
// 修改用户密码
export function modifyPSW(EmpCode, EmpPassword, NewPassword) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data: {
      ctrl: 'Employee',
      act: 'UpdateEmpPassword',
      accessToken: getToken(),
      data:
        {
          EmpCode,
          EmpPassword,
          NewPassword
        }
    }
  })
}
