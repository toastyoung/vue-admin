import request from "@/utils/request";

// 添加SKU数据
export function reqSaveSkuInfo(data) {
  return request({
    method: "POST",
    url: `/admin/product/saveSkuInfo`,
    data
  });
}
