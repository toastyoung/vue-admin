import request from '@/utils/request'

// 获取属性列表
export function reqGetSpuList({ page, limit, category3Id }) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: 'GET',
    params: {
      category3Id
    }
  })
}

// 销售列表

export function reqGetBaseSaleAttrList() {
  return request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'GET'
  })
}

// 添加SPU
export function reqSaveSpu(data) {
  return request({
    method: 'POST',
    url: '/admin/product/saveSpuInfo',
    data
  })
}

// 获取spu对应图片列表
export function reqGeSpuImageList(spuId) {
  return request({
    method: 'GET',
    url: `/admin/product/spuImageList/${spuId}`
  })
}

// 获取SPU数据

export function reqGetSpuInfo(spuId) {
  return request({
    method: 'GET',
    url: `/admin/product/getSpuById/${spuId}`
  })
}
