import request from '@/utils/request'

const api_name = '/admin/acl/role'

export default {
  // 根据id列表删除多个角色
  removeRoles(ids) {
    return request({
      method: 'DELETE',
      url: `${api_name}/bathRemove`,
      data: ids
    })
  },

  // 获取角色
  getRole(id) {
    return request({
      method: 'GET',
      url: `${api_name}/get/${id}`
    })
  },

  // 删除角色
  removeRoles(id) {
    return request({
      method: 'DELETE',
      url: `${api_name}/remove/${id}`
    })
  },

  // 新增角色
  saveRoles(role) {
    return request({
      method: 'POST',
      url: `${api_name}/save`,
      data: role
    })
  },

  // 修改角色
  updateRoles(role) {
    return request({
      method: 'PUT',
      url: `${api_name}/update`,
      data: role
    })
  },

  // 获取角色分页列表 /搜索
  getPageList(page, limit, searchObj) {
    return request({
      method: 'GET',
      url: `${api_name}/${page}/${limit}`,
      params: searchObj // url查询字符串或表单键值对
    })
  }
}
