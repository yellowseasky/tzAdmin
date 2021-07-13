import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// 外协订单
export function orderList(data) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'Outside',
      act: 'GetOutsideOrderList',
      accessToken: getToken(),
      data
    }
  })
}
// 外协订单详细
export function orderListDetail(outOId) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'Outside',
      act: 'GetOutsideOrderDetail',
      accessToken: getToken(),
      data:
      {
        outOId
      }
    }
  })
}
// 通过工件编码获取最新文件
export function getNewFile(bomCode) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'PdmFileUpload',
      act: 'GetLastVersionFileByCode',
      accessToken: getToken(),
      data:
      {
        bomList: [{
          bomCode
        }
        ]
      }
    }
  })
}
// 下载型面文件
export function getProfileFile(projectCode) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'PdmFileUpload',
      act: 'GetCADFiles',
      accessToken: getToken(),
      data:
      {
        bomList: [{
          projectCode
        }
        ]
      }
    }
  })
}
