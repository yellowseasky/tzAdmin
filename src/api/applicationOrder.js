import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 外协申请订单
export function orderList(data) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'Outside',
      act: 'GetOutsideRequestList',
      accessToken: getToken(),
      data
    }
  })
}

// 外协申请订单详细
export function orderListDetail(outRId) {
  return request({
    url: '/DefaultApi/Cmd',
    method: 'post',
    data:
    {
      ctrl: 'Outside',
      act: 'GetOutsideRequestDetail',
      accessToken: getToken(),
      data:
      {
        outRId
      }
    }
  })
}

