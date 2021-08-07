import request from '@/utils/request'

const api_name = 'admin/acl/user'
// 获取用户信息
export function getInfo() {
  return request({
    method: 'GET',
    url: `/admin/acl/index/info`
  })
}

// 登录
export function login({ username, password }) {
  return request({
    method: 'POST',
    url: `/admin/acl/index/login`,
    data: { username, password }
  })
}

// 登出
export function logout() {
  return request({
    method: 'POST',
    url: `/admin/acl/index/logout`
  })
}

// 获取当前用户菜单权限列表
export function getMenu() {
  return request({
    method: 'GET',
    url: `/admin/acl/index/menu`
  })
}

// 根据id列表删除管理用户  ids是包含n个id的数组
export function removeUsers(ids) {
  return request({
    method: 'DELETE',
    url: `${api_name}/batchRemove`,
    data: ids
  })
}

// 根据用户分配角色 roleId结构 数组内多个字符串
export function assignRoles(userId, roleId) {
  return request({
    method: 'POST',
    url: `${api_name}/doAssign`,
    params: {
      userId,
      roleId
    }
  })
}

// 根据ID获取管理用户
export function getUser(id) {
  return request({
    method: 'GET',
    url: `${api_name}/get/${id}`
  })
}

// 删除管理用户
export function removeUser(id) {
  return request({
    method: 'DELETE',
    url: `${api_name}/remove/${id}`
  })
}

// 新增管理用户
export function addUser(user) {
  return request({
    method: 'POST',
    url: `${api_name}/save`,
    data: user
  })
}

// 根据用户获取角色数据
export function getRoles(userId) {
  return request({
    method: 'GET',
    url: `${api_name}/toAssign/${userId}`
  })
}

// 修改管理用户
export function updateUser(user) {
  return request({
    method: 'PUT',
    url: `${api_name}/update`,
    data: user
  })
}

// 获取管理用户分页列表
export function getPageList(page, limit, searchObj) {
  return request({
    method: 'GET',
    url: `${api_name}/${page}/${limit}`,
    params: searchObj
  })
}
