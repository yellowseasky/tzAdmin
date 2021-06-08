import request from '@/utils/request'
import { getToken } from '@/utils/auth'
export function supplierOrder() {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data: {
      ctrl: 'PdmFileUpload',
      act: 'GetLastVersionByCode',
      accessToken: getToken(),
      data:
      {
        'bomList': [{
          bomCode: 'NHY022-0303-P6507'
        },
        {
          bomCode: 'NHY022-0303-P6508'
        },
        {
          bomCode: 'NHY022-0303-P6509'
        }
        ]
      }
    }
  })
}
// 外协订单
export function orderList(empId, sTime = '', eTime = '') {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'Outside',
      act: 'GetOutsideOrderList',
      accessToken: getToken(),
      data:
      {
        empId,
        outOType: '',
        sTime,
        eTime
      }
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
