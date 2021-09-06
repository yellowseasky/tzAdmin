// 转序单管理
import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取转序单
export function transferList(data) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'MaterialHandover',
      act: 'GetMaterialHandoverList',
      accessToken: getToken(),
      data
    }
  })
}

// 提交转序单
export function subTransferList(empId, ret) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'MaterialHandover',
      act: 'InsertMaterialHandover',
      accessToken: getToken(),
      data: {
        MatHandCreatEmpCode: empId,
        MaterialHandoverDetial: ret
      }
    }
  })
}

// 获取转序单明细
export function transferListDetail(matHandId) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'MaterialHandover',
      act: 'GetMaterialHandoverDetail',
      accessToken: getToken(),
      data:
      {
        matHandId
      }
    }
  })
}
