import request from '@/utils/request'

// 添加SKU数据
export function reqSaveSkuInfo(data) {
  return request({
    method: 'POST',
    url: `/admin/product/saveSkuInfo`,
    data
  })
}

// 获取SKU列表数据
export function reqGetSkuList(page, limit) {
  return request({
    method: 'GET',
    url: `/admin/product/list/${page}/${limit}`
  })
}
