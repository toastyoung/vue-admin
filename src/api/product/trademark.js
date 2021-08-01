import request from "@/utils/request";

// 获取品牌分页
export function reqGetTrademarkList(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "GET"
  });
}

// 添加品牌
export function reqSaveTrademark(tmName, logoUrl) {
  return request({
    url: `/admin/product/baseTrademark/save`,
    method: "POST",
    data: {
      tmName,
      logoUrl
    }
  });
}
