import request from "@/utils/request";

// 获取属性列表
export function reqGetSpuList({ page, limit, category3Id }) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: "GET",
    params: {
      category3Id
    }
  });
}

// 销售属性

export function reqGetBaseSaleAttrList() {
  return request({
    url: `/admin/product/baseSaleAttrList`,
    method: "GET"
  });
}
