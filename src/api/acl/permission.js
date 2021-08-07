import request from '@/utils/request'

const api_name = '/admin/acl/permission'

export default {
  // 获取菜单
  getPermission() {
    return request({
      method: 'GET',
      url: `${api_name}`
    })
  },

  // 给角色分配权限
  doAssign(roleId, permissionId) {
    return request({
      method: 'POST',
      url: `${api_name}/doAssign`,
      params: { roleId, permissionId }
    })
  },

  // 递归删除菜单
  removePermission(id) {
    return request({
      method: 'DELETE',
      url: `${api_name}/remove/${id}`
    })
  },

  // 新增菜单
  addPermission(permission) {
    return request({
      method: 'POST',
      url: `${api_name}/save`,
      data: permission
    })
  },

  // 根据角色获取菜单
  getRolePermission(roleId) {
    return request({
      method: 'GET',
      url: `${api_name}/toAssign/${roleId}`
    })
  },

  // 修改菜单
  updatePermission(permission) {
    return request({
      method: 'PUT',
      url: `${api_name}/update`,
      data: permission
    })
  }
}
